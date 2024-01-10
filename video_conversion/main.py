import subprocess
from video_to_audio import extract_audio
from transcribe_audio import transcribe_audio
from create_subtitles import create_subtitles, hex_to_ffmpeg_color

input_video = "./data/video.mp4"
output_video = "./data/output_video.mp4"
audio_file = "./data/audio.mp3"
subtitle_file = "./data/subtitles.srt"

extract_audio(input_video, audio_file)
result = transcribe_audio(audio_file)

customization_options = {
	'font_size': 30,
	'font_family': 'Times New Roman',
	'font_color': hex_to_ffmpeg_color('#00FF00'),
	'border_size': 1,
}

create_subtitles(segments=result['segments'], subtitle_file_path=subtitle_file)

ffmpeg_cmd = [
	"ffmpeg",
	"-i", input_video,
	"-vf", f"subtitles={subtitle_file}:force_style='Fontsize={customization_options['font_size']},Fontname={customization_options['font_family']},BorderColor=black@{customization_options['border_size']},PrimaryColour={customization_options['font_color']}'",
	"-c:a", "aac",
	"-c:v", "libx264",
	"-y", output_video,
]

subprocess.run(ffmpeg_cmd, check=True)
