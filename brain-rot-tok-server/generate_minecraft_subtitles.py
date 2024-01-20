from create_subtitles import hex_to_ffmpeg_color, create_subtitles
from transcribe_audio import transcribe_audio
import subprocess
import text_to_speech
import os

def generate_minecraft_subtitles(customization_options, subtitles):
	customization_options['font_color'] = hex_to_ffmpeg_color(customization_options['font_color'])

	audio_file_path = "./data/minecraft/audio.mp3"
	subtitle_file = "./data/minecraft/subtitles.srt"

	background_video_path = customization_options['background_video']
	output_directory = "./data/minecraft/videos"
	
	text_to_speech.text_to_speech(subtitles, audio_file_path)
	transcription = transcribe_audio(audio_file_path)
	create_subtitles(transcription, subtitle_file)

	audio_output_video_path = background_video_operations(background_video_path, audio_file_path, output_directory)
	subtitle_output_path = add_subtitle(audio_output_video_path, subtitle_file, customization_options, output_directory)
	result_output_path = add_text_to_video(subtitle_output_path, customization_options, output_directory)

	return result_output_path



def background_video_operations(background_video_path, audio_file_path, output_directory):
	muted_output_filepath = os.path.join(output_directory, 'video_muted.mp4')
	trimmed_output_filepath = os.path.join(output_directory, 'video_muted_trimmed.mp4')
	audio_output_video_path = os.path.join(output_directory, 'audio_background_video.mp4')

	# Mute the background video
	mute_background_cmd = [
		"ffmpeg",
		"-i", background_video_path,
		"-af", "volume=0.0",
		"-c:v", "copy",
		"-y", muted_output_filepath
	]

	subprocess.run(mute_background_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)


	# Audio duration
	audio_duration_cmd = [
		'ffprobe',
		'-i', audio_file_path,
		'-show_entries',
		'format=duration',
		'-v', 'quiet',
		'-of', 'csv=p=0'
	]
	audio_duration = float(subprocess.check_output(audio_duration_cmd).decode('utf-8').strip())

	# Trim the video to match the duration of the audio
	trim_video_cmd = [
		'ffmpeg',
		'-i', muted_output_filepath,
		'-t', str(audio_duration),
		'-c', 'copy',
		"-y", trimmed_output_filepath
	]
	subprocess.run(trim_video_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

	# Place the audio over the video
	add_audio_cmd = [
		'ffmpeg',
		'-i', trimmed_output_filepath,
		'-i', audio_file_path,
		'-c:v', 'copy',
		'-c:a', 'aac',
		'-map', '0:v:0',
		'-map', '1:a:0',
		'-shortest',
		'-y', audio_output_video_path
	]

	subprocess.run(add_audio_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

	return audio_output_video_path


def add_subtitle(audio_output_video_path, subtitle_file, customization_options, output_directory):
	subtitle_video_path = os.path.join(output_directory, 'subtitle_video.mp4')

	subtitle_cmd = [
		"ffmpeg",
		"-i", audio_output_video_path,
		"-vf", f"subtitles={subtitle_file}:force_style='Fontsize={customization_options['font_size']},Fontname={customization_options['font_family']},BorderColor=black@{customization_options['border_size']},PrimaryColour={customization_options['font_color']}'",
		"-c:a", "aac",
		"-c:v", "libx264",
		"-y", subtitle_video_path,
	]

	subprocess.run(subtitle_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

	return subtitle_video_path


def add_text_to_video(subtitle_output_path, customization_options, output_directory):
	result_video_path = os.path.join(output_directory, 'result.mp4')
	cmd = [
		'ffmpeg',
		'-i', subtitle_output_path,
		'-vf', f'drawtext=text=\'{customization_options["credit"]}\':fontcolor=white:fontsize={customization_options["credit_size"]}:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=(h-text_h)/2',
		'-codec:a', 'copy',
		"-y", result_video_path
	]

	subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

	return result_video_path