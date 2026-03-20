from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import traceback
import uvicorn
from endpoints import (
    subway_router,
    minecraft_router,
    basic_router,
    rumble_router,
    fonts_router,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.exception_handler(Exception)
async def global_exception_handler(_: Request, exc: Exception):
    traceback.print_exc()
    return JSONResponse(status_code=500, content={"detail": str(exc)})


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException):
    traceback.print_exc()
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


app.include_router(subway_router, prefix="/subway")
app.include_router(minecraft_router, prefix="/minecraft")
app.include_router(basic_router, prefix="/basic")
app.include_router(rumble_router, prefix="/rumble")
app.include_router(fonts_router, prefix="/fonts")

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
