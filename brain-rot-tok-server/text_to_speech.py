import pyttsx3

def text_to_speech(text, audio_file_path):
	engine = pyttsx3.init()
	engine.save_to_file(text, audio_file_path)
	engine.runAndWait()
