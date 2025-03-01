import matplotlib.font_manager as fm
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/")
async def get_fonts():
	try:
		font_paths = fm.findSystemFonts()
		font_names = []

		for fp in font_paths:
			try:
				font_name = fm.FontProperties(fname=fp).get_name()
				font_names.append(font_name)
			except Exception as inner_e:
				continue

		font_names = sorted(set(font_names))

		return {"fonts": font_names}
	except Exception as e:
		return JSONResponse(content={"error": str(e)}, status_code=500)
