from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import uvicorn
from main import generate_subtitles, generate_combined_video

app = FastAPI()

# Add CORS middleware
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_methods=["*"],
	allow_headers=["*"]
)

@app.post("/generate_subtitles")
async def create_video(
	top_video: UploadFile = File(...),
	bottom_video: UploadFile = File(...),
	color: str = Form(...),
	size: int = Form(...),
	font: str = Form(...)
):
	# Save the videos
	with open("./data/top_video.mp4", "wb") as buffer:
		shutil.copyfileobj(top_video.file, buffer)
	with open("./data/bottom_video.mp4", "wb") as buffer:
		shutil.copyfileobj(bottom_video.file, buffer)

	options = {
		"top_video": "./data/top_video.mp4",
		"bottom_video": "./data/bottom_video.mp4",
		"font_color": color,
		"font_size": size,
		"font_family": font,
		"border_size": 1
	}

	generate_subtitles(options)
	generate_combined_video(options)

	return {"message": "Subtitles generated successfully!"}

if __name__ == "__main__":
	uvicorn.run("server:app", host="localhost", port=8000, reload=True)
