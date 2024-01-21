from fastapi import FastAPI, File, UploadFile, Form, Body, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.exceptions import HTTPException
import uvicorn
from endpoints import subway_router, minecraft_router, basic_router, rumble_router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_methods=["*"],
	allow_headers=["*"]
)

app.include_router(subway_router, prefix="/subway")
app.include_router(minecraft_router, prefix="/minecraft")
app.include_router(basic_router, prefix="/basic")
app.include_router(rumble_router, prefix="/rumble")

if __name__ == "__main__":
	uvicorn.run("server:app", host="localhost", port=8000, reload=True)
