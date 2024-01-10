from moviepy.editor import VideoFileClip

def extract_audio(input_video, output_audio):
	video_clip = VideoFileClip(input_video)

	audio_clip = video_clip.audio
	audio_clip.write_audiofile(output_audio)

	video_clip.close()
	audio_clip.close()
