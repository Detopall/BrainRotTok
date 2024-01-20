from utils.create_subtitles import hex_to_ffmpeg_color, create_subtitles
from utils.transcribe_audio import transcribe_audio
from utils.video_to_audio import extract_audio
import subprocess
import os

def generate_basic_subtitles(customization_options):
	customization_options['font_color'] = hex_to_ffmpeg_color(customization_options['font_color'])

	video_path = customization_options['video']
	audio_file_path = "./data/basic/audio.mp3"
	subtitle_file = "./data/basic/subtitles.srt"
	output_directory = "./data/basic/videos"
	
	extract_audio(video_path, audio_file_path)
	transcription = transcribe_audio(audio_file_path)
	create_subtitles(transcription, subtitle_file)

	subtitle_output_path = add_subtitle(video_path, subtitle_file, customization_options, output_directory)
	result_output_path = add_text_to_video(subtitle_output_path, customization_options, output_directory)

	return result_output_path


def add_subtitle(video_path, subtitle_file, customization_options, output_directory):
	subtitle_video_path = os.path.join(output_directory, 'subtitle_video.mp4')
	
	# Add the subtitle to the video
	subtitle_cmd = [
		"ffmpeg",
		"-i", video_path,
		"-vf", f"subtitles={subtitle_file}:force_style='Fontsize={customization_options['font_size']},PrimaryColour={customization_options['font_color']},Fontname={customization_options['font_family']},MarginV=50'",
		"-c:a", "copy",
		"-y", subtitle_video_path
	]

	subprocess.run(subtitle_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

	return subtitle_video_path


def add_text_to_video(subtitle_output_path, customization_options, output_directory):
	result_video = os.path.join(output_directory, 'result.mp4')
	
	# Add the text to the video
	text_cmd = [
		"ffmpeg",
		"-i", subtitle_output_path,
		"-vf", f"drawtext=fontfile={customization_options['font_family']}:text='{customization_options['credit']}':fontcolor=white:fontsize={customization_options['credit_size']}:x=(w-text_w)/2:y=(h-text_h)-20",
		"-c:a", "copy",
		"-y", result_video
	]

	subprocess.run(text_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

	return result_video
