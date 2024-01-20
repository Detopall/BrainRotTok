def create_subtitles(transcription, subtitle_file_path):
	def convert_to_srt_time(time):
		milliseconds = int((time - int(time)) * 1000)
		minutes, seconds = divmod(int(time), 60)
		hours, minutes = divmod(minutes, 60)
		return f"{hours:02d}:{minutes:02d}:{seconds:02d},{milliseconds:03d}"


	with open(subtitle_file_path, "w") as subtitle_file:
		for i, segments in enumerate(transcription['segments'], start=1):
			for j, words in enumerate(segments['words'], start=1):
				start_time = convert_to_srt_time(words['start'])
				end_time = convert_to_srt_time(words['end'])

				subtitle_line = f"{i}.{j}\n{start_time} --> {end_time}\n{words['text']}\n\n"

				subtitle_file.write(subtitle_line)

def hex_to_ffmpeg_color(hex_color):
	# Remove '#' if present
	hex_color = hex_color.lstrip('#')

	# Convert hex to FFmpeg color format
	ffmpeg_color = int(hex_color, 16)
	return f'0x{ffmpeg_color:06x}'
