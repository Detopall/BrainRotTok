from fastapi import UploadFile, File, Form, BackgroundTasks, Body, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from fastapi import APIRouter
from generate_rumble_clips import generate_rumble_clips
from endpoints.utils.remove_content_from_dir import remove_content_from_dir
import os
import shutil
import io
import zipfile

router = APIRouter()

@router.post("/generate-subtitles")
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