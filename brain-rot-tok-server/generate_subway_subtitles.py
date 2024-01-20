import subprocess
from utils.video_to_audio import extract_audio
from utils.transcribe_audio import transcribe_audio
from utils.create_subtitles import create_subtitles, hex_to_ffmpeg_color
import os


def generate_subway_subtitles(customization_options):
	customization_options['font_color'] = hex_to_ffmpeg_color(customization_options['font_color'])
	audio_file = "./data/subway/audio.mp3"
	subtitle_file = "./data/subway/subtitles.srt"

	top_video_path = customization_options['top_video']
	bottom_video_path = customization_options['bottom_video']
	output_directory = "./data/subway/videos"

	extract_audio(bottom_video_path, audio_file)
	transcription = transcribe_audio(audio_file)
	create_subtitles(transcription, subtitle_file)
	
	trimmed_output_filepath = top_video_operations(top_video_path, bottom_video_path, output_directory)

	bottom_video_width, bottom_video_height = bottom_video_operations(bottom_video_path)

	combined_output_path = combination_video(trimmed_output_filepath, bottom_video_path, bottom_video_width, bottom_video_height, output_directory)

	subtitle_output_filepath = add_subtitle(combined_output_path, subtitle_file, customization_options, output_directory)

	result_video_path = add_text_to_video(subtitle_output_filepath, customization_options, output_directory)

	return result_video_path



def top_video_operations(top_video_path, bottom_video_path, output_directory):
	muted_output_filepath = os.path.join(output_directory, 'top_video_muted.mp4')

	trimmed_output_filepath = os.path.join(output_directory, 'top_video_muted_trimmed.mp4')

	mute_top_cmd = [
		"ffmpeg",
		"-i", top_video_path,
		"-af", "volume=0.0",
		"-c:v", "copy",
		"-y", muted_output_filepath
	]
	subprocess.run(mute_top_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

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
		"-i", muted_output_filepath,
		"-t", str(duration),
		"-c:v", "copy",
		"-y", trimmed_output_filepath
	]

	subprocess.run(trim_top_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

	return trimmed_output_filepath


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

def combination_video(trimmed_top_video_path, bottom_video_path, bottom_video_width, bottom_video_height, output_directory):
	combined_output_filepath = os.path.join(output_directory, 'top_video_muted_trimmed_combined.mp4')

	combine_cmd = [
		"ffmpeg",
		"-i", trimmed_top_video_path,
		"-i", bottom_video_path,
		"-filter_complex", f"[0:v]scale={bottom_video_width}:{bottom_video_height},setsar=1[main];[1:v]scale={bottom_video_width}:{bottom_video_height},setsar=1[bottom_scaled];[main][bottom_scaled]vstack=inputs=2[v];[0:a][1:a]amix=inputs=2[a]",
		"-map", "[v]",
		"-map", "[a]",
		"-y", combined_output_filepath
	]
	
	subprocess.run(combine_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

	return combined_output_filepath


def add_subtitle(combined_video_path, subtitle_file, customization_options, output_directory):
	subtitle_output_filepath = os.path.join(output_directory, 'combined_subtitle.mp4')

	subtitle_cmd = [
		"ffmpeg",
		"-i", combined_video_path,
		"-vf", f"subtitles={subtitle_file}:force_style='Fontsize={customization_options['font_size']},Fontname={customization_options['font_family']},BorderColor=black@{customization_options['border_size']},PrimaryColour={customization_options['font_color']}'",
		"-c:a", "aac",
		"-c:v", "libx264",
		"-y", subtitle_output_filepath,
	]

	subprocess.run(subtitle_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

	return subtitle_output_filepath

def add_text_to_video(subtitle_output_filepath, customization_options, output_directory):
	result_video_path = os.path.join(output_directory, 'combined_subtitle_text.mp4')

	cmd = [
		'ffmpeg',
		'-i', subtitle_output_filepath,
		'-vf', f'drawtext=text=\'{customization_options["credit"]}\':fontcolor=white:fontsize={customization_options["credit_size"]}:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=(h-text_h)/2',
		'-codec:a', 'copy',
		"-y", result_video_path
	]

	subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

	return result_video_path

