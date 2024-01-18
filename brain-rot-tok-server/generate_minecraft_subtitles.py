from create_subtitles import hex_to_ffmpeg_color, create_subtitles
from transcribe_audio import transcribe_audio
import subprocess
import text_to_speech

def generate_minecraft_subtitles(customization_options, subtitles):
	customization_options['font_color'] = hex_to_ffmpeg_color(customization_options['font_color'])

	background_video_path = customization_options['background_video']
	muted_background_video_path = "./data/minecraft/muted_background_video.mp4"
	trimmed_background_video_path = "./data/minecraft/trimmed_background_video.mp4"
	audio_file_path = "./data/minecraft/audio.mp3"
	audio_background_video_path = "./data/minecraft/audio_background_video.mp4"

	subtitle_file = "./data/minecraft/subtitles.srt"
	subtitle_video_path = "./data/minecraft/subtitle_video.mp4"
	result_video = "./data/minecraft/result.mp4"
	
	text_to_speech.text_to_speech(subtitles, audio_file_path)
	transcription = transcribe_audio(audio_file_path)
	create_subtitles(transcription, subtitle_file)

	background_video_operations(background_video_path, muted_background_video_path, trimmed_background_video_path, audio_file_path, audio_background_video_path)
	add_subtitle(audio_background_video_path, subtitle_file, customization_options, subtitle_video_path)
	add_text_to_video(subtitle_video_path, result_video, customization_options)



def background_video_operations(background_video_path, muted_background_video_path, trimmed_background_video_path, audio_file_path, audio_background_video_path):
	# Mute the background video
	mute_background_cmd = [
		"ffmpeg",
		"-i", background_video_path,
		"-af", "volume=0.0",
		"-c:v", "copy",
		"-y", muted_background_video_path
	]

	subprocess.run(mute_background_cmd)

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
		'-i', muted_background_video_path,
		'-t', str(audio_duration),
		'-c', 'copy',
		"-y", trimmed_background_video_path
	]
	subprocess.run(trim_video_cmd, check=True)

	# Place the audio over the video
	add_audio_cmd = [
		'ffmpeg',
		'-i', trimmed_background_video_path,
		'-i', audio_file_path,
		'-c:v', 'copy',
		'-c:a', 'aac',
		'-map', '0:v:0',
		'-map', '1:a:0',
		'-shortest',
		'-y', audio_background_video_path
	]

	subprocess.run(add_audio_cmd, check=True)


def add_subtitle(video_path, subtitle_file, customization_options, subtitle_video_path):
	subtitle_cmd = [
		"ffmpeg",
		"-i", video_path,
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