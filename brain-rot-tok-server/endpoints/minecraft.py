from fastapi import UploadFile, File, Form, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi import APIRouter
from generate_minecraft_subtitles import generate_minecraft_subtitles
from endpoints.utils.remove_content_from_dir import remove_content_from_dir
from utils.create_files import create_files_when_necessary
import os
import shutil

router = APIRouter()

@router.post("/generate-subtitles")
async def create_minecraft_video(
	video: UploadFile = File(...),
	subtitles: str = Form(...),
	color: str = Form(...),
	size: int = Form(...),
	font: str = Form(...),
	credit: str = Form(...),
	credit_size: int = Form(...),
	background_tasks: BackgroundTasks = BackgroundTasks()
):

	create_files_when_necessary("minecraft")

	# Save the videos
	background_video_path = "./data/minecraft/videos/background_video.mp4"
	with open(background_video_path, "wb") as buffer:
		shutil.copyfileobj(video.file, buffer)

	options = {
		"background_video": background_video_path,
		"font_color": color,
		"font_size": size,
		"font_family": font,
		"border_size": 1,
		"credit": credit,
		"credit_size": credit_size,
	}

	result_video_path = generate_minecraft_subtitles(options, subtitles)

	if not os.path.exists(result_video_path):
		return {"message": "Error generating subtitles!"}

	background_tasks.add_task(remove_content_from_dir, "./data/minecraft/videos")

	return FileResponse(result_video_path, media_type="video/mp4", filename="result.mp4")
