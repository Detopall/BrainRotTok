from kokoro import KPipeline
import soundfile as sf

pipeline = KPipeline(lang_code='a')

voices = [
    "af_heart",
    "af_alloy",
    "af_aoede",
    "af_bella",
    "af_jessica",
    "af_kore",
    "af_nicole",
    "af_nova",
    "af_river",
    "af_sarah",
    "af_sky",
    "am_adam",
    "am_echo",
    "am_eric",
    "am_fenrir",
    "am_liam",
    "am_michael",
    "am_onyx",
    "am_puck",
    "am_santa"
]

def text_to_speech(text:str, audio_file_path:str, voice:str):
	if voice not in voices:
		voice = voices[0]

	generator = pipeline(
		text, voice=voice,
		speed=1, split_pattern=r'\n+'
	)

	for i, (gs, ps, audio) in enumerate(generator):
		sf.write(audio_file_path, audio, 24000)
