from fastapi import FastAPI, File, UploadFile, Form, Body, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.exceptions import HTTPException
import shutil
import uvicorn
from generate_subway_subtitles import generate_subway_subtitles
from generate_minecraft_subtitles import generate_minecraft_subtitles
from generate_basic_subtitles import generate_basic_subtitles
from generate_rumble_clips import generate_rumble_clips
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


@app.post("/minecraft-generate-subtitles")
async def create_minecraft_video(
	video: UploadFile = File(...),
	subtitles: str = Form(...),
	color: str = Form(...),
	size: int = Form(...),
	font: str = Form(...),
	background_tasks: BackgroundTasks = BackgroundTasks()
):
	
	background_video_path = "./data/minecraft/videos/background_video.mp4"
	# Save the videos
	with open(background_video_path, "wb") as buffer:
		shutil.copyfileobj(video.file, buffer)

	options = {
		"background_video": background_video_path,
		"font_color": color,
		"font_size": size,
		"font_family": font,
		"border_size": 1,
		"credit": "Made with BrainRotTok",
		"credit_size": 15,
	}

	result_video_path = generate_minecraft_subtitles(options, subtitles)

	if not os.path.exists(result_video_path):
		return {"message": "Error generating subtitles!"}

	background_tasks.add_task(remove_content_from_dir, "./data/minecraft/videos")

	return FileResponse(result_video_path, media_type="video/mp4", filename="result.mp4")


@app.post("/basic-generate-subtitles")
async def create_basic_video(
	video: UploadFile = File(...),
	color: str = Form(...),
	size: int = Form(...),
	font: str = Form(...),
	background_tasks: BackgroundTasks = BackgroundTasks()
):
	# Save the videos
	basic_video_path = "./data/basic/videos/video.mp4"
	with open(basic_video_path, "wb") as buffer:
		shutil.copyfileobj(video.file, buffer)

	options = {
		"video": basic_video_path,
		"font_color": color,
		"font_size": size,
		"font_family": font,
		"border_size": 1,
		"credit": "Made with BrainRotTok",
		"credit_size": 15,
	}

	result_video_path = generate_basic_subtitles(options)


	if not os.path.exists(result_video_path):
		return {"message": "Error generating subtitles!"}
	
	background_tasks.add_task(remove_content_from_dir, "./data/basic/videos")

	return FileResponse(result_video_path, media_type="video/mp4", filename="result.mp4")


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
		remove_content_from_dir("./data/rumble/clips")

		# Return the zip archive as a StreamingResponse
		return StreamingResponse(io.BytesIO(zip_buffer.read()), media_type="application/zip", headers={
			'Content-Disposition': 'attachment; filename="clips.zip"'
		})
	except Exception as e:
		# Handle exceptions appropriately
		raise HTTPException(status_code=500, detail=str(e))


def remove_content_from_dir(folder):
	for filename in os.listdir(folder):
		file_path = os.path.join(folder, filename)
		try:
			if os.path.isfile(file_path) or os.path.islink(file_path):
				os.unlink(file_path)
			elif os.path.isdir(file_path):
				shutil.rmtree(file_path)
		except Exception as e:
			print('Failed to delete %s. Reason: %s' % (file_path, e))
	


if __name__ == "__main__":
	uvicorn.run("server:app", host="localhost", port=8000, reload=True)
