from fastapi import UploadFile, File, Form, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi import APIRouter
from generate_subway_subtitles import generate_subway_subtitles
from endpoints.utils.remove_content_from_dir import remove_content_from_dir
import os
import shutil

router = APIRouter()

@router.post("/generate-subtitles")
async def create_subway_video(
	top_video: UploadFile = File(...),
	bottom_video: UploadFile = File(...),
	color: str = Form(...),
	size: int = Form(...),
	font: str = Form(...),
	background_tasks: BackgroundTasks = BackgroundTasks()
):
	top_video_path = "./data/subway/videos/top_video.mp4"
	bottom_video_path = "./data/subway/videos/bottom_video.mp4"
	# Save the videos
	with open(top_video_path, "wb") as buffer:
		shutil.copyfileobj(top_video.file, buffer)
	with open(bottom_video_path, "wb") as buffer:
		shutil.copyfileobj(bottom_video.file, buffer)

	options = {
		"top_video": top_video_path,
		"bottom_video": bottom_video_path,
		"font_color": color,
		"font_size": size,
		"font_family": font,
		"border_size": 1,
		"credit": "Made with BrainRotTok",
		"credit_size": 15,
	}

	result_video_path = generate_subway_subtitles(options)

	if not os.path.exists(result_video_path):
		return {"message": "Error generating subtitles!"}
	
	background_tasks.add_task(remove_content_from_dir, "./data/subway/videos")

	return FileResponse(result_video_path, media_type="video/mp4", filename="result.mp4")