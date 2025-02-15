from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from endpoints import subway_router, minecraft_router, basic_router, rumble_router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(subway_router, prefix="/subway")
app.include_router(minecraft_router, prefix="/minecraft")
app.include_router(basic_router, prefix="/basic")
app.include_router(rumble_router, prefix="/rumble")

if __name__ == "__main__":
	uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
