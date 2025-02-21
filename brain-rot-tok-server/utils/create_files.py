"""
This file will create all the files needed for each type when necessary
"""

import os

def create_files_when_necessary(type: str):
	"""
	Args:
		type (str): The type of the video:
		- Options: "subway", "minecraft", "basic", "rumble"
	"""
	folder = "videos"
	files = ["audio.mp3", "subtitles.srt"]
	specific_dir = f"./data/{type}"
	if type == "rumble":
		folder = "clips"

	# create main 'data' folder (if it doesn't exist)
	if not os.path.exists("data"):
		os.makedirs("data")

	# create the specific dir (if it doesn't exist)
	if not os.path.exists(specific_dir):
		os.makedirs(specific_dir)

	# create each file (if it doesn't exist)
	for file in files:
		file_path = f"{specific_dir}/{file}"
		if not os.path.exists(file_path):
			os.makedirs(os.path.dirname(file_path), exist_ok=True)
			with open(file_path, "w") as f:
				f.write("")

	# create the folder (if it doesn't exist)
	if not os.path.exists(f"{specific_dir}/{folder}"):
		os.makedirs(f"{specific_dir}/{folder}")
