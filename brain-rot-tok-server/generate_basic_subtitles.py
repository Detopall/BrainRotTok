from create_subtitles import hex_to_ffmpeg_color, create_subtitles
from transcribe_audio import transcribe_audio
from video_to_audio import extract_audio
import subprocess

def generate_basic_subtitles(customization_options):
	customization_options['font_color'] = hex_to_ffmpeg_color(customization_options['font_color'])

	video_path = customization_options['video']
	audio_file_path = "./data/basic/audio.mp3"
	subtitle_file = "./data/basic/subtitles.srt"
	subtitle_video_path = "./data/basic/subtitle_video.mp4"
	result_video = "./data/basic/result.mp4"

	extract_audio(video_path, audio_file_path)
	transcription = transcribe_audio(audio_file_path)
	
	create_subtitles(transcription, subtitle_file)

	add_subtitle(video_path, subtitle_file, customization_options, subtitle_video_path)
	add_text_to_video(subtitle_video_path, result_video, customization_options)


def add_subtitle(video_path, subtitle_file, customization_options, subtitle_video_path):
	# Add the subtitle to the video
	subtitle_cmd = [
		"ffmpeg",
		"-i", video_path,
		"-vf", f"subtitles={subtitle_file}:force_style='Fontsize={customization_options['font_size']},PrimaryColour={customization_options['font_color']},Fontname={customization_options['font_family']},MarginV=50'",
		"-c:a", "copy",
		"-y", subtitle_video_path
	]

	subprocess.run(subtitle_cmd, check=True)


def add_text_to_video(video_path, result_video, customization_options):
	# Add the text to the video
	text_cmd = [
		"ffmpeg",
		"-i", video_path,
		"-vf", f"drawtext=fontfile={customization_options['font_family']}:text='{customization_options['credit']}':fontcolor=white:fontsize={customization_options['credit_size']}:x=(w-text_w)/2:y=(h-text_h)-20",
		"-c:a", "copy",
		"-y", result_video
	]

	subprocess.run(text_cmd, check=True)
