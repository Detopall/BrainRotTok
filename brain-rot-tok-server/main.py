import subprocess
from video_to_audio import extract_audio
from transcribe_audio import transcribe_audio
from create_subtitles import create_subtitles, hex_to_ffmpeg_color

def generate_subtitles(customization_options):
	audio_file = "./data/audio.mp3"
	subtitle_file = "./data/subtitles.srt"

	input_video = customization_options['bottom_video']

	extract_audio(input_video, audio_file)
	result = transcribe_audio(audio_file)
	create_subtitles(segments=result['segments'], subtitle_file_path=subtitle_file)

def generate_combined_video(customization_options):
	top_video_path = customization_options['top_video']
	bottom_video_path = customization_options['bottom_video']
	customization_options['font_color'] = hex_to_ffmpeg_color(customization_options['font_color'])

	subtitle_file = "./data/subtitles.srt"
	result_video = "./data/result.mp4"

	# 1. Mute the top video
	mute_top_cmd = [
		"ffmpeg",
		"-i", top_video_path,
		"-af", "volume=0.0",
		"-c:v", "copy",
		"-y", "./data/muted_top_video.mp4"
	]
	subprocess.run(mute_top_cmd)

	# 2. Trim the top video to be the same length as the bottom video
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
		"-i", "./data/muted_top_video.mp4",
		"-t", str(duration),
		"-c:v", "copy",
		"-y", "./data/trimmed_top_video.mp4"
	]
	subprocess.run(trim_top_cmd)

	# 3. If the bottom video is shorter than the top video, stop the video when the bottom video is done.
	# (Assuming the top video is longer and we trim it to match the duration of the bottom video)

	# 4. Combine the top and bottom videos into one.

	# get height and width of bottom video to scale the top video to match
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

	combine_cmd = [
		"ffmpeg",
		"-i", "./data/trimmed_top_video.mp4",
		"-i", bottom_video_path,
		"-filter_complex", f"[0:v]scale={bottom_video_width}:{bottom_video_height},setsar=1[main];[1:v]scale={bottom_video_width}:{bottom_video_height},setsar=1[bottom_scaled];[main][bottom_scaled]vstack=inputs=2[v];[0:a][1:a]amix=inputs=2[a]",
		"-map", "[v]",
		"-map", "[a]",
		"-y", "./data/combined_video.mp4"
	]
	subprocess.run(combine_cmd)

	subtitle_cmd = [
		"ffmpeg",
		"-i", "./data/combined_video.mp4",
		"-vf", f"subtitles={subtitle_file}:force_style='Fontsize={customization_options['font_size']},Fontname={customization_options['font_family']},BorderColor=black@{customization_options['border_size']},PrimaryColour={customization_options['font_color']}'",
		"-c:a", "aac",
		"-c:v", "libx264",
		"-y", result_video,
	]

	subprocess.run(subtitle_cmd, check=True)
