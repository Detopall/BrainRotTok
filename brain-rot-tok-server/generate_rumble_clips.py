import os
from utils.create_subtitles import hex_to_ffmpeg_color, create_subtitles
from utils.transcribe_audio import transcribe_audio
from utils.video_to_audio import extract_audio
import subprocess


def generate_rumble_clips(customization_options, output_directory="./data/rumble/clips"):
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
		clip['clip_link'] = add_text_to_video(subtitle_video_clip, customization_options)
	
	return clips


def cut_video(input_url, start_time, end_time, output_directory, idx):
	output_filepath = os.path.join(output_directory, f'output_clip_{idx}.mp4')

	command = [
		'ffmpeg',
		'-i', input_url,
		'-ss', start_time,
		'-to', end_time,
		'-c', 'copy',
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
		"-vf", f"drawtext=fontfile={customization_options['font_family']}:text='{customization_options['credit']}':fontcolor=white:fontsize={customization_options['credit_size']}:x=(w-text_w)/2:y=(h-text_h)-20",
		"-c:a", "copy",
		'-y', output_filepath
	]

	subprocess.run(text_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

	return output_filepath
