from gtts import gTTS

def text_to_speech(text, audio_file_path):
	tts = gTTS(text=text, lang='en')
	tts.save(audio_file_path)
