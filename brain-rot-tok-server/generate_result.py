import subprocess
from video_to_audio import extract_audio
from transcribe_audio import transcribe_audio
from create_subtitles import create_subtitles, hex_to_ffmpeg_color

def generate_subtitles(customization_options):
	audio_file = "./data/audio.mp3"
	subtitle_file = "./data/subtitles.srt"

	input_video = customization_options['bottom_video']

	extract_audio(input_video, audio_file)
	transcription = transcribe_audio(audio_file)
	
	create_subtitles(transcription, subtitle_file)


def generate_combined_video(customization_options):
	customization_options['font_color'] = hex_to_ffmpeg_color(customization_options['font_color'])

	top_video_path = customization_options['top_video']
	bottom_video_path = customization_options['bottom_video']
	muted_top_video_path = "./data/muted_top_video.mp4"
	trimmed_top_video_path = "./data/trimmed_top_video.mp4"
	combined_video_path = "./data/combined_video.mp4"
	subtitle_file = "./data/subtitles.srt"
	subtitle_video_path = "./data/subtitle_video.mp4"
	result_video = "./data/result.mp4"
	
	top_video_operations(top_video_path, bottom_video_path, muted_top_video_path, trimmed_top_video_path)

	bottom_video_width, bottom_video_height = bottom_video_operations(bottom_video_path)

	combination_video(trimmed_top_video_path, bottom_video_path, bottom_video_width, bottom_video_height, combined_video_path)

	add_subtitle(combined_video_path, subtitle_file, customization_options, subtitle_video_path)

	add_text_to_video(subtitle_video_path, result_video, customization_options)



def top_video_operations(top_video_path, bottom_video_path, muted_top_video_path, trimmed_top_video_path):
	mute_top_cmd = [
		"ffmpeg",
		"-i", top_video_path,
		"-af", "volume=0.0",
		"-c:v", "copy",
		"-y", muted_top_video_path
	]
	subprocess.run(mute_top_cmd)

	get_duration_cmd = [
		"ffprobe",
		"-v", "error",
		"-show_entries", "format=duration",
		"-of", "default=noprint_wrappers=1:nokey=1",
		bottom_video_path
	]
	duration = float(subprocess.check_output(get_duration_cmd, universal_newlines=True).strip())

	trim_top_cmd = [
		"ffmpeg",
		"-i", muted_top_video_path,
		"-t", str(duration),
		"-c:v", "copy",
		"-y", trimmed_top_video_path
	]
	subprocess.run(trim_top_cmd)


def bottom_video_operations(bottom_video_path):
	bottom_video_height = int(subprocess.check_output([
		"ffprobe",
		"-v", "error",
		"-select_streams", "v:0",
		"-show_entries", "stream=height",
		"-of", "csv=s=x:p=0",
		bottom_video_path
	], universal_newlines=True).strip())

	bottom_video_width = int(subprocess.check_output([
		"ffprobe",
		"-v", "error",
		"-select_streams", "v:0",
		"-show_entries", "stream=width",
		"-of", "csv=s=x:p=0",
		bottom_video_path
	], universal_newlines=True).strip())

	return bottom_video_width, bottom_video_height

def combination_video(trimmed_top_video_path, bottom_video_path, bottom_video_width, bottom_video_height, combined_video_path):
	combine_cmd = [
		"ffmpeg",
		"-i", trimmed_top_video_path,
		"-i", bottom_video_path,
		"-filter_complex", f"[0:v]scale={bottom_video_width}:{bottom_video_height},setsar=1[main];[1:v]scale={bottom_video_width}:{bottom_video_height},setsar=1[bottom_scaled];[main][bottom_scaled]vstack=inputs=2[v];[0:a][1:a]amix=inputs=2[a]",
		"-map", "[v]",
		"-map", "[a]",
		"-y", combined_video_path
	]
	subprocess.run(combine_cmd)


def add_subtitle(combined_video_path, subtitle_file, customization_options, subtitle_video_path):
	subtitle_cmd = [
		"ffmpeg",
		"-i", combined_video_path,
		"-vf", f"subtitles={subtitle_file}:force_style='Fontsize={customization_options['font_size']},Fontname={customization_options['font_family']},BorderColor=black@{customization_options['border_size']},PrimaryColour={customization_options['font_color']}'",
		"-c:a", "aac",
		"-c:v", "libx264",
		"-y", subtitle_video_path,
	]

	subprocess.run(subtitle_cmd, check=True)

def add_text_to_video(subtitle_video_path, result_video_path, customization_options):
    cmd = [
		'ffmpeg',
		'-i', subtitle_video_path,
		'-vf', f'drawtext=text=\'{customization_options["credit"]}\':fontcolor=white:fontsize={customization_options["credit_size"]}:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=(h-text_h)/2',
		'-codec:a', 'copy',
		"-y", result_video_path
	]

    subprocess.run(cmd)
