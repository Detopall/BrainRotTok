# BrainRotTok

## What is BrainRotTok?

BrainRotTok allows you to create those iconic TikTok videos where one half of the screen is a random subway surfers video and the other half is another random video with subtitles. The other version is those Mincecraft parkour videos with Reddit subtitles. You can also just upload a basic video and create subtitles for it.

## What is brain rot?

Brain rot is a term used to describe the feeling of your brain rotting away after watching those highly addictive, short videos on TikTok. It is also used to describe the content that causes this feeling. Brain rot content is usually low effort, low quality, and highly addictive.

[Urban Dictionary](https://www.urbandictionary.com/define.php?term=Brainrot%20Content)

## Why did I make this?

I kept seeing these videos on TikTok and I thought it would be fun to make a website that allows you to create these videos. I also wanted to use FFmpeg and OpenAI's Whisper API, so I thought this would be a good project to do that.

## What can you do with this?

You can upload you own videos and the application will automatically generate the subtitles for you. You can customize the subtitles (color, font, size, etc.) and the position of the video. You can also choose to upload your own subtitles.

## What technologies are used?

- React (with TypeScript)
- Python
- FastAPI
- Whisper (OpenAI)
- FFmpeg
- ImageMagick

## How to run this?

### Client

Execute the following commands:

```bash
cd ./brain-rot-tok-client
npm install
npm run dev
```

### Server

Execute the following commands:

```bash
cd ./brain-rot-tok-server
pipenv install
pipenv shell
python server.py
```

## Examples

![Basic Example](./readme-assets/basic-example.png)

![Subway Surfers Example](./readme-assets/subway-surfers-example.png)

![Minecraft Reddit Example](./readme-assets/minecraft-reddit-example.png)

## Example video

**Basic Example**


**Subway Surfers Example**

https://github.com/Detopall/BrainRotTok/assets/90131569/4239972d-19d8-444d-af16-8b81e8c76c03

**Minecraft Reddit Example**

https://github.com/Detopall/BrainRotTok/assets/90131569/d84bbdfe-868d-4b7d-b5c7-c4a42c14d8da
