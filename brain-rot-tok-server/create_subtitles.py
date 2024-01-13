def create_subtitles(segments, subtitle_file_path):
	def convert_to_srt_time(time):
		minutes, seconds = divmod(time, 60)
		hours, minutes = divmod(minutes, 60)
		return f"{int(hours):02d}:{int(minutes):02d}:{int(seconds):02d},000"

	with open(subtitle_file_path, "w") as subtitle_file:
		for i, segment in enumerate(segments, start=1):
			start_time = segment['start']
			end_time = segment['end']
			text = segment['text']

			# Construct subtitle line with customization options
			subtitle_line = (
				f"{i}\n{convert_to_srt_time(start_time)} --> {convert_to_srt_time(end_time)}\n{text}\n\n"
			)

			subtitle_file.write(subtitle_line)

def hex_to_ffmpeg_color(hex_color):
	hex_color = hex_color[1:]

	# Split the hex color code into RGB color code
	rgb_color = [hex_color[i:i+2] for i in range(0, len(hex_color), 2)]

	# Convert the RGB color code to ffmpeg color code
	ffmpeg_color = f"&H{rgb_color[0]}{rgb_color[1]}{rgb_color[2]}"

	return ffmpeg_color