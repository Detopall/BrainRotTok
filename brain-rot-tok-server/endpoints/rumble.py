from fastapi import Body, HTTPException
from fastapi.responses import StreamingResponse
from fastapi import APIRouter
from generate_rumble_clips import generate_rumble_clips
from endpoints.utils.remove_content_from_dir import remove_content_from_dir
from endpoints.utils.webscraping_rumble_link import rumble_link_scraper
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
	credit = request_data.get("credit", "")
	credit_size = request_data.get("credit_size", 0)
	clips = request_data.get("clips", [])

	options = {
		"video_url": video_url,
		"clips": clips,
		"font_color": color,
		"font_size": size,
		"font_family": font,
		"border_size": 1,
		"credit": credit,
		"credit_size": credit_size,
	}

	try:
		# scrape the web for the rumble link
		options["video_url"] = await rumble_link_scraper(video_url)

		# Generate the clips
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