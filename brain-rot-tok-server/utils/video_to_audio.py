import os
from moviepy import VideoFileClip

def extract_audio(input_video, output_audio):
    try:
        if not os.path.exists(input_video) or os.path.getsize(input_video) == 0:
            print(f"Error: Video file {input_video} is empty or does not exist.")
            return None

        video_clip = VideoFileClip(input_video)

        if video_clip.audio is None:
            print(f"Error: No audio found in {input_video}")
            return None

        video_clip.audio.write_audiofile(output_audio)
        print(f"Audio extracted: {output_audio}")

        video_clip.close()
        return output_audio
    except Exception as e:
        print(f"Error extracting audio: {e}")
        return None
