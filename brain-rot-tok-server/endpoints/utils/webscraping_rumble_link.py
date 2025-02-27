import base64
import httpx
import requests
from bs4 import BeautifulSoup


def calculate_hash(url: str, salt: str = "aio-dl") -> str:
	"""Generate the hash using the same method as in JavaScript."""
	encoded_url = base64.b64encode(url.encode()).decode()
	encoded_salt = base64.b64encode(salt.encode()).decode()
	return f"{encoded_url}{len(url) + 1000}{encoded_salt}"


def get_rumbledownloader_token():
	"""
	Extracts the token from the RumbleDownloader page.

	:return: str - The extracted token, or None if extraction fails.
	"""
	try:
		response = requests.get("https://rumbledownloader.com/")
		if response.status_code != 200:
			raise Exception(f"Failed to fetch RumbleDownloader page, status code: {response.status_code}")

		soup = BeautifulSoup(response.text, 'html.parser')
		token_input = soup.find("input", {"id": "token"})

		if token_input and token_input.has_attr("value"):
			return token_input["value"]
		else:
			raise ValueError("Failed to extract token from RumbleDownloader page.")

	except Exception as e:
		print(f"Error: {e}")
		return None


async def rumble_link_scraper(rumble_link):
	"""
	Scrapes the direct video link from Rumble using RumbleDownloader.

	:param rumble_link: str - The URL of the Rumble video.
	:return: str - The direct video download link.
	"""
	url = "https://rumbledownloader.com/wp-json/aio-dl/video-data/"
	headers = {
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
		"Content-Type": "application/x-www-form-urlencoded",
		"Origin": "https://rumbledownloader.com",
		"Referer": "https://rumbledownloader.com/"
	}

	# Get token dynamically from RumbleDownloader
	extracted_token = get_rumbledownloader_token()
	if not extracted_token:
		raise ValueError("Could not retrieve token from RumbleDownloader.")

	# Generate hash using calculate_hash function
	generated_hash = calculate_hash(rumble_link)

	data = {
		"url": rumble_link,
		"token": extracted_token,
		"hash": generated_hash
	}

	async with httpx.AsyncClient() as client:
		response = await client.post(url, headers=headers, data=data)

	if response.status_code == 200:
		data = response.json()
		medias = data.get("medias")
		if medias:
			return medias[-1].get("url")
