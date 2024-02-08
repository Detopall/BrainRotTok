import json
import shutil
import subprocess
from typing import List
from fastapi import UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi import APIRouter, BackgroundTasks
import os

router = APIRouter()

@router.post("/cut")
async def cut_videos(
	videos: List[UploadFile] = File(...),
	timestamps: str = Form(...),
	background_tasks: BackgroundTasks = BackgroundTasks()
):
	timestamps_dict = json.loads(timestamps)
	temp_dir = "./data/video_editor/videos"
	if not os.path.exists(temp_dir):
		os.makedirs(temp_dir)

	save_and_cut(videos, temp_dir, timestamps_dict)

	clean_temp_dir = remove_temp_files(temp_dir)

	zip_filename = shutil.make_archive(f"{clean_temp_dir}", 'zip', "./data/video_editor/")

	background_tasks.add_task(remove_zip_folder, zip_filename)

	return FileResponse(zip_filename)


def save_and_cut(videos, temp_dir, timestamps_dict):
	for index, video in enumerate(videos):
		temp_video_path = f"{temp_dir}/{video.filename}-{index}.mp4"
		with open(temp_video_path, "wb") as f:
			shutil.copyfileobj(video.file, f)

		cut_start = timestamps_dict[str(index)]["start"]
		cut_end = timestamps_dict[str(index)]["end"]

		# Remove the "-index" from the filename by removing everything after the last "-"
		filename_without_extension = os.path.splitext(temp_video_path)[0]
		filename_without_index = filename_without_extension.rsplit("-", 1)[0]
		output_video_path = f"{filename_without_index}_cut.mp4"

		subprocess.run([
			"ffmpeg",
			"-i", temp_video_path,
			"-ss", cut_start,
			"-t", cut_end,
			"-y", output_video_path
		])

		# Remove the temporary video file
		os.remove(temp_video_path)

def remove_temp_files(temp_dir):
	for filename in os.listdir(temp_dir):
		if "cut" not in filename:
			os.remove(f"{temp_dir}/{filename}")
		if "cut" in filename:
			os.rename(f"{temp_dir}/{filename}", f"{temp_dir}/{filename.replace('_cut.mp4', '')}")
	return temp_dir

def remove_zip_folder(zip_filename):
	if os.path.exists(zip_filename):
		shutil.rmtree(zip_filename[:-4])
		os.remove(zip_filename)
