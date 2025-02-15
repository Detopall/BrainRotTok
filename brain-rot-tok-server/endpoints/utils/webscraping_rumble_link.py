import httpx
from bs4 import BeautifulSoup

async def rumble_link_scraper(rumble_link):
	url = "https://imgpanda.com/wp-admin/admin-ajax.php"
	downloader_type = "Rumble"
	server_name = "Server2"

	headers = {
		"Content-Type": "application/x-www-form-urlencoded",
	}

	data = {
		"action": "ajax_call_custom",
		"SocialDownUrl": rumble_link,
		"downloaderType": downloader_type,
		"serverName": server_name,
	}

	async with httpx.AsyncClient() as client:
		response = await client.post(url, headers=headers, data=data)

	if response.status_code == 200:
		soup = BeautifulSoup(response.text, 'html.parser')
		inner_html_string = ' '.join(response.text.split(' ')[1:-1])
		inner_soup = BeautifulSoup(inner_html_string, 'html.parser')
		
		# all a-tags within the class "social-download-result"
		a_tags = inner_soup.select('a')
		last_a_tag = a_tags[-1]

		if last_a_tag:
			return last_a_tag.get('href').replace('\\', '').replace('"', '')
		else:
			print('No matching <a> tag found within the class "social-download-result"')
	else:
		print(f"Error: {response.status_code}")
