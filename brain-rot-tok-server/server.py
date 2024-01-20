from fastapi import FastAPI, File, UploadFile, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.exceptions import HTTPException
import shutil
import uvicorn
from generate_result import generate_subtitles, generate_combined_video
from generate_minecraft_subtitles import generate_minecraft_subtitles
from generate_basic_subtitles import generate_basic_subtitles
from generate_rumble_clips import generate_rumble_clips, remove_clips_dir
import os
import io
import zipfile

app = FastAPI()

# Add CORS middleware
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_methods=["*"],
	allow_headers=["*"]
)

@app.post("/subway-generate-subtitles")
async def create_subway_video(
	top_video: UploadFile = File(...),
	bottom_video: UploadFile = File(...),
	color: str = Form(...),
	size: int = Form(...),
	font: str = Form(...)
):
	# Save the videos
	with open("./data/subway/top_video.mp4", "wb") as buffer:
		shutil.copyfileobj(top_video.file, buffer)
	with open("./data/subway/bottom_video.mp4", "wb") as buffer:
		shutil.copyfileobj(bottom_video.file, buffer)

	options = {
		"top_video": "./data/subway/top_video.mp4",
		"bottom_video": "./data/subway/bottom_video.mp4",
		"font_color": color,
		"font_size": size,
		"font_family": font,
		"border_size": 1,
		"credit": "Made with BrainRotTok",
		"credit_size": 15,
	}

	generate_subtitles(options)
	generate_combined_video(options)

	result_path = "./data/subway/result.mp4"

	if not os.path.exists(result_path):
		return {"message": "Error generating subtitles!"}

	return FileResponse(result_path, media_type="video/mp4", filename="result.mp4")


@app.post("/minecraft-generate-subtitles")
async def create_minecraft_video(
	video: UploadFile = File(...),
	subtitles: str = Form(...),
	color: str = Form(...),
	size: int = Form(...),
	font: str = Form(...)
):
	# Save the videos
	with open("./data/minecraft/background_video.mp4", "wb") as buffer:
		shutil.copyfileobj(video.file, buffer)

	options = {
		"background_video": "./data/minecraft/background_video.mp4",
		"font_color": color,
		"font_size": size,
		"font_family": font,
		"border_size": 1,
		"credit": "Made with BrainRotTok",
		"credit_size": 15,
	}

	generate_minecraft_subtitles(options, subtitles)

	result_path = "./data/minecraft/result.mp4"


	if not os.path.exists(result_path):
		return {"message": "Error generating subtitles!"}

	return FileResponse(result_path, media_type="video/mp4", filename="result.mp4")


@app.post("/basic-generate-subtitles")
async def create_basic_video(
	video: UploadFile = File(...),
	color: str = Form(...),
	size: int = Form(...),
	font: str = Form(...)
):
	# Save the videos
	with open("./data/basic/video.mp4", "wb") as buffer:
		shutil.copyfileobj(video.file, buffer)

	options = {
		"video": "./data/basic/video.mp4",
		"font_color": color,
		"font_size": size,
		"font_family": font,
		"border_size": 1,
		"credit": "Made with BrainRotTok",
		"credit_size": 15,
	}

	generate_basic_subtitles(options)

	result_path = "./data/basic/result.mp4"


	if not os.path.exists(result_path):
		return {"message": "Error generating subtitles!"}

	return FileResponse(result_path, media_type="video/mp4", filename="result.mp4")


@app.post("/rumble-generate-subtitles")
async def create_rumble_video(request_data: dict = Body(...)):

	# Extract values from the request_data dictionary
	video_url = request_data.get("video_url", "")
	color = request_data.get("color", "")
	size = request_data.get("size", 0)
	font = request_data.get("font", "")
	clips = request_data.get("clips", [])

	options = {
		"video_url": video_url,
		"clips": clips,
		"font_color": color,
		"font_size": size,
		"font_family": font,
		"border_size": 1,
		"credit": "Made with BrainRotTok",
		"credit_size": 15,
	}

	try:
		clips = generate_rumble_clips(options)
		
		# Create a zip archive in memory
		zip_buffer = io.BytesIO()
		with zipfile.ZipFile(zip_buffer, "w") as zip_file:
			for clip in clips:
				clip_name = clip["name"]
				clip_link = clip["clip_link"]
				zip_file.write(clip_link, arcname=f"clips/{clip_name}.mp4")

		# Reset the buffer position to the beginning
		zip_buffer.seek(0)		

		# remove the clips directory content
		remove_clips_dir()

		# Return the zip archive as a StreamingResponse
		return StreamingResponse(io.BytesIO(zip_buffer.read()), media_type="application/zip", headers={
			'Content-Disposition': 'attachment; filename="clips.zip"'
		})
	except Exception as e:
		# Handle exceptions appropriately
		raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
	uvicorn.run("server:app", host="localhost", port=8000, reload=True)
