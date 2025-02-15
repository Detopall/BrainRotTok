from moviepy import VideoFileClip

def extract_audio(input_video, output_audio):
    try:
        video_clip = VideoFileClip(input_video)
        audio_clip = video_clip.audio

        if audio_clip:
            audio_clip.write_audiofile(output_audio)

        video_clip.close()
        audio_clip.close()
    except Exception as e:
        print(f"Error extracting audio: {e}")
