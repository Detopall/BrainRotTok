import json
import shutil
import subprocess
from typing import List
from fastapi import UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi import APIRouter
import os

router = APIRouter()

@router.post("/cut")
async def cut_videos(
	videos: List[UploadFile] = File(...),
	timestamps: str = Form(...)
):
	timestamps_dict = json.loads(timestamps)
	temp_dir = "../data/video_editor/temp"
	if not os.path.exists(temp_dir):
		os.makedirs(temp_dir)

	save_and_cut(videos, temp_dir, timestamps_dict)
	
	clean_temp_dir = remove_temp_files_and_rename(temp_dir)

	# Zip all the cut videos
	zip_filename = f"{clean_temp_dir}/cut_videos.zip"
	shutil.make_archive(f"{clean_temp_dir}/cut_videos", 'zip', clean_temp_dir)

	# Send the zip file to the client
	return FileResponse(zip_filename)


def save_and_cut(videos, temp_dir, timestamps_dict):
	for index, video in enumerate(videos):
		temp_video_path = f"{temp_dir}/video{index}.mp4"
		with open(temp_video_path, "wb") as f:
			shutil.copyfileobj(video.file, f)

		cut_start = timestamps_dict[str(index)]["start"]
		cut_end = timestamps_dict[str(index)]["end"]

		subprocess.run([
			"ffmpeg",
			"-i", temp_video_path,
			"-ss", cut_start,
			"-to", cut_end,
			"-c", "copy",
			f"{temp_video_path[:-4]}_cut.mp4"
		])

def remove_temp_files_and_rename(temp_dir):
	for filename in os.listdir(temp_dir):
		if filename.endswith(".mp4") and "cut" not in filename:
			os.remove(os.path.join(temp_dir, filename))

	for filename in os.listdir(temp_dir):
		if filename.endswith("_cut.mp4"):
			os.rename(
				os.path.join(temp_dir, filename),
				os.path.join(temp_dir, filename.replace("_cut", ""))
			)
	
	return temp_dir