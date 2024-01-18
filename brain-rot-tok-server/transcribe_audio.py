import whisper_timestamped as whisper

def transcribe_audio(audio_file):
    audio = whisper.load_audio(audio_file)
    model = whisper.load_model("base")
    result = whisper.transcribe(model, audio)
    return result
