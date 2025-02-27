import os
import subprocess

from utils.create_subtitles import hex_to_ffmpeg_color, create_subtitles
from utils.transcribe_audio import transcribe_audio
from utils.video_to_audio import extract_audio


def generate_rumble_clips(customization_options, output_directory="./data/rumble/clips"):
	print(customization_options['video_url'])
	customization_options['font_color'] = hex_to_ffmpeg_color(customization_options['font_color'])
	audio_file_path = "./data/rumble/audio.mp3"
	subtitle_file = "./data/rumble/subtitles.srt"

	clips = []

	for idx, clip in enumerate(customization_options['clips']):
		# Generate the clip
		video_clip_path = cut_video(customization_options['video_url'], clip['start'], clip['end'], output_directory, idx)
		clip['clip_link'] = video_clip_path
		clips.append(clip)

		# Generate the subtitles
		extract_audio(video_clip_path, audio_file_path)
		transcription = transcribe_audio(audio_file_path)
		create_subtitles(transcription, subtitle_file)

		# Add the subtitle to the video
		subtitle_video_clip = add_subtitle(video_clip_path, subtitle_file, customization_options)

		# Add the text to the video
		video_with_text = add_text_to_video(subtitle_video_clip, customization_options)

		# video_sped_up = speed_up_video(video_with_text)
		clip["clip_link"] = video_with_text

	return clips


def cut_video(input_url, start_time, end_time, output_directory, idx):
	output_filepath = os.path.join(output_directory, f'output_clip_{idx}.mp4')

	command = [
		'ffmpeg',
		'-i', input_url,
		'-ss', start_time,
		'-to', end_time,
		'-y', output_filepath
	]

	subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

	return output_filepath


def add_subtitle(video_path, subtitle_file, customization_options):
	output_filepath = video_path.replace('.mp4', '_with_subtitle.mp4')

	subtitle_cmd = [
		"ffmpeg",
		"-i", video_path,
		"-vf", f"subtitles={subtitle_file}:force_style='Fontsize={customization_options['font_size']},PrimaryColour={customization_options['font_color']},Fontname={customization_options['font_family']},MarginV=50'",
		"-c:a", "copy",
		'-y', output_filepath
	]

	subprocess.run(subtitle_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

	return output_filepath


def add_text_to_video(video_path, customization_options):
	output_filepath = video_path.replace('.mp4', '_with_text.mp4')

	text_cmd = [
		"ffmpeg",
		"-i", video_path,
		'-vf', f'drawtext=text=\'{customization_options["credit"]}\':fontcolor=white:fontsize={customization_options["credit_size"]}:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=h-text_h-10',
		"-c:a", "copy",
		'-y', output_filepath
	]

	subprocess.run(text_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

	return output_filepath


def speed_up_video(video_path):
    output_filepath = video_path.replace('.mp4', '_sped_up.mp4')

    speed_up_cmd = [
        "ffmpeg",
        "-i", video_path,
        "-filter:v", "setpts=0.66*PTS",  # Speed up by 1.5x (1/1.5 = 0.6666)
        "-filter:a", "atempo=1.5",  # Speed up audio as well
        "-c:v", "libx264", "-c:a", "aac",
        "-strict", "experimental",
        "-y", output_filepath
    ]

    subprocess.run(speed_up_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    return output_filepath
