import os
import sys
import json
import subprocess

from utils.create_subtitles import hex_to_ffmpeg_color, create_subtitles
from utils.transcribe_audio import transcribe_audio
from utils.video_to_audio import extract_audio

YT_DLP = os.path.join(os.path.dirname(sys.executable), "yt-dlp")


def generate_rumble_clips(
    customization_options, output_directory="./data/rumble/clips"
):
    customization_options["font_color"] = hex_to_ffmpeg_color(
        customization_options["font_color"]
    )
    audio_file_path = "./data/rumble/audio.mp3"
    subtitle_file = "./data/rumble/subtitles.srt"

    clips = []

    for idx, clip in enumerate(customization_options["clips"]):
        # Download the clip directly from Rumble via our custom snippet
        video_clip_path = download_clip(
            customization_options["video_url"],
            clip["start"],
            clip["end"],
            output_directory,
            idx,
        )
        clip["clip_link"] = video_clip_path

        # Generate the subtitles
        extract_audio(video_clip_path, audio_file_path)
        transcription = transcribe_audio(audio_file_path)
        create_subtitles(transcription, subtitle_file)

        # Add the subtitle to the video
        subtitle_video_clip = add_subtitle(
            video_clip_path, subtitle_file, customization_options
        )

        # Add the credit text to the video
        video_with_text = add_text_to_video(subtitle_video_clip, customization_options)

        clip["clip_link"] = video_with_text
        clips.append(clip)

    return clips


def get_best_quality_format(video_url: str) -> str:
    """Fetch available formats via yt-dlp and return the best HLS video format ID."""
    result = subprocess.run(
        [
            YT_DLP,
            "-J",
            "--no-playlist",
            "--impersonate=chrome",
            video_url,
        ],
        capture_output=True,
        text=True,
    )

    print(f"yt-dlp stdout (first 500 chars): {result.stdout[:500]}", flush=True)
    print(f"yt-dlp stderr (first 500 chars): {result.stderr[:500]}", flush=True)
    print(f"yt-dlp return code: {result.returncode}", flush=True)

    if not result.stdout.strip():
        raise ValueError(f"yt-dlp returned no output:\n{result.stderr}")

    info = json.loads(result.stdout)
    if info is None:
        raise ValueError(f"Failed to parse yt-dlp output as JSON:\n{result.stdout}")

    formats = info.get("formats", [])

    if not formats:
        raise ValueError("No formats found for the given URL.")

    # Rumble HLS video formats have format_id starting with "hls-"
    # and video_ext="mp4". Audio-only has audio_ext set and video_ext="none".
    video_formats = [
        f
        for f in formats
        if f.get("format_id", "").startswith("hls-")
        and f.get("video_ext") == "mp4"
        and f.get("audio_ext") == "none"
    ]

    if not video_formats:
        # Fallback: any format with a positive height
        video_formats = [f for f in formats if (f.get("height") or 0) > 0]

    if not video_formats:
        raise ValueError(
            f"No video formats found. Available format IDs: "
            f"{[f.get('format_id') for f in formats]}"
        )

    best_format = max(
        video_formats,
        key=lambda f: (
            f.get("height") or 0,
            f.get("tbr") or 0,
        ),
    )

    return best_format["format_id"]


def time_to_seconds(t_str: str) -> float:
    parts = str(t_str).split(":")
    return sum(float(x) * 60 ** i for i, x in enumerate(reversed(parts)))


def download_clip(
    video_url: str, start_time: str, end_time: str, output_directory: str, idx: int
) -> str:
    """Download a specific section from Rumble stream using curl_cffi and ffmpeg concat."""
    from curl_cffi import requests
    import urllib.parse
    
    output_filepath = os.path.join(output_directory, f"output_clip_{idx}.mp4")
    if os.path.exists(output_filepath):
        try: os.remove(output_filepath)
        except: pass
        
    cmd = [
        YT_DLP,
        "-g",
        "-f",
        "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best",
        "--impersonate=chrome",
        "--no-playlist",
        video_url,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0 or not result.stdout.strip():
        best_format = get_best_quality_format(video_url)
        cmd = [YT_DLP, "-f", best_format, "--impersonate=chrome", "-g", "--no-playlist", video_url]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(f"yt-dlp failed to get stream URL:\n{result.stderr}")
            
    m3u8_url = result.stdout.strip().split("\n")[0]
    
    r = requests.get(m3u8_url, impersonate="chrome120")
    r.raise_for_status()
    
    lines = r.text.splitlines()
    start_sec = time_to_seconds(start_time)
    end_sec = time_to_seconds(end_time)
    
    current_time = 0.0
    segments = []
    first_segment_start_time = None
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if line.startswith("#EXTINF:"):
            duration = float(line.split(":")[1].split(",")[0])
            i += 1
            segment_url = lines[i].strip()
            if not segment_url.startswith("http"):
                segment_url = urllib.parse.urljoin(m3u8_url, segment_url)
                
            segment_end = current_time + duration
            if segment_end >= start_sec and current_time <= end_sec:
                segments.append(segment_url)
                if first_segment_start_time is None:
                    first_segment_start_time = current_time
            current_time += duration
        i += 1
        
    if not segments:
        raise ValueError("Could not find segments overlapping the requested time range.")
        
    combined_ts = os.path.join(output_directory, f"combined_{idx}.ts")
    with open(combined_ts, "wb") as combined_out:
        for seg_idx, url in enumerate(segments):
            seg_data = requests.get(url, impersonate="chrome120").content
            combined_out.write(seg_data)
            
    trim_start = max(0, start_sec - first_segment_start_time)
    trim_duration = end_sec - start_sec
    
    trim_cmd = [
        "ffmpeg", "-y",
        "-i", combined_ts,
        "-ss", str(trim_start),
        "-t", str(trim_duration),
        "-c:v", "copy",
        "-c:a", "copy",
        output_filepath
    ]
    subprocess.run(trim_cmd, capture_output=True, text=True)
    
    try: os.remove(combined_ts)
    except: pass
        
    return output_filepath


def add_subtitle(video_path, subtitle_file, customization_options):
    output_filepath = video_path.replace(".mp4", "_with_subtitle.mp4")

    subtitle_cmd = [
        "ffmpeg",
        "-i",
        video_path,
        "-vf",
        (
            f"subtitles={subtitle_file}:force_style='"
            f"Fontsize={customization_options['font_size']},"
            f"PrimaryColour={customization_options['font_color']},"
            f"Fontname={customization_options['font_family']},"
            f"MarginV=50'"
        ),
        "-c:a",
        "copy",
        "-y",
        output_filepath,
    ]

    subprocess.run(subtitle_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    return output_filepath


def add_text_to_video(video_path, customization_options):
    output_filepath = video_path.replace(".mp4", "_with_text.mp4")

    text_cmd = [
        "ffmpeg",
        "-i",
        video_path,
        "-vf",
        (
            f"drawtext=text='{customization_options['credit']}':"
            f"fontcolor=white:"
            f"fontsize={customization_options['credit_size']}:"
            f"box=1:boxcolor=black@0.5:boxborderw=5:"
            f"x=(w-text_w)/2:y=h-text_h-10"
        ),
        "-c:a",
        "copy",
        "-y",
        output_filepath,
    ]

    subprocess.run(text_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    return output_filepath


def speed_up_video(video_path):
    output_filepath = video_path.replace(".mp4", "_sped_up.mp4")

    speed_up_cmd = [
        "ffmpeg",
        "-i",
        video_path,
        "-filter:v",
        "setpts=0.66*PTS",
        "-filter:a",
        "atempo=1.5",
        "-c:v",
        "libx264",
        "-c:a",
        "aac",
        "-strict",
        "experimental",
        "-y",
        output_filepath,
    ]

    subprocess.run(speed_up_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    return output_filepath
