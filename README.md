# BrainRotTok

<div style="text-align: center; margin-bottom: 20px;">
    <img src="./brain-rot-tok-client/public/favicon.ico" alt="brain-rot-tok" style="max-width: 150px; height: auto; border-radius: 8px;">

<h1 style="text-align: center; font-size: 2em;">Brain Rot Tok</h1>

<p style="text-align: center; font-size: 1.2em;">
    A TikTok video generator that creates those iconic TikTok videos with subtitles.
</p>
</div>

## Table of Contents

- [What is BrainRotTok?](#what-is-brainrottok)
- [What is brain rot?](#what-is-brain-rot)
- [Why did I make this?](#why-did-i-make-this)
- [What can you do with this?](#what-can-you-do-with-this)
- [What technologies are used?](#what-technologies-are-used)
- [How to run this?](#how-to-run-this)
  - [Docker](#docker)
    - [Run](#run)
    - [Stop](#stop)
    - [Remove Container](#remove-container)
    - [Remove Image](#remove-image)
    - [Help](#help)
  - [Server](#server)
  - [Client](#client)
- [Examples](#examples)
- [License](#license)

## What is BrainRotTok?

BrainRotTok allows you to create those iconic TikTok videos with subtitles. There are different types of videos you can create, you can find the list of them below in the "What can you do with this?" section.

## What is brain rot?

Brain rot is a term used to describe the feeling of your brain rotting away after watching those highly addictive, short videos on TikTok. It is also used to describe the content that causes this feeling. Brain rot content is usually low effort, low quality, and highly addictive.

[Urban Dictionary](https://www.urbandictionary.com/define.php?term=Brainrot%20Content)

## Why did I make this?

I kept seeing these videos on TikTok and I thought it would be fun to make a website that allows you to create these videos. I also wanted to use FFmpeg and OpenAI's Whisper API, so I thought this would be a good project to do that.

## What can you do with this?

- **Basic**: a video with subtitles underneath
- **Subway Surfers**: a top and bottom video with subtitles for the bottom video and the top video is muted
- **Minecraft Reddit**: a background video with subtitles (provided by you) in the middle and the subtitles are spoken by a text-to-speech voice
- **Rumble Video**: a Rumble video link is provided and you can choose between different clips from the video. The subtitles are automatically generated and a zip folder is returned with the video and the subtitles.

## What technologies are used?

- React (with TypeScript)
- HeroUI (with Tailwindcss)
- Python
- FastAPI
- Whisper (OpenAI)
- FFmpeg
- ImageMagick

## How to run this?

### Docker

Execute the following command:

Make sure the bash script has the right permission by running chmod +x run.sh

#### Run

```bash
./run.sh
```

- Build the Docker image (if not already built)
- Run the container (if it isn't already running)
- Open the app in your default web browser at `http://localhost:5173/`

#### Stop

```bash
./run.sh --stop
```

- Stop the running container

#### Remove Container

```bash
./run.sh --remove-container
```

- Stops the running container (if not already stopped)
- Remove the container

#### Remove Image

```bash
./run.sh --remove-all
```

- Stops the running container (if not already stopped)
- Remove the container
- Remove the Docker image

#### Help

```bash
./run.sh --help
```

- Print the help message containing info about the available options

To run it yourself using Docker, you can run the following commands:

```bash
# Build the Docker image
docker build -t brain-rot-tok .

# Run the Docker container in detached mode and expose necessary ports
docker run -it -d -p 8000:8000 -p 5173:5173 --name brain-rot-tok-container brain-rot-tok
```

You can also individually run the server and client in the next two sections.

### Server

Execute the following commands:

```bash
cd ./brain-rot-tok-server
pip install -r requirements.txt
python server.py
```

### Client

Execute the following commands:

```bash
cd ./brain-rot-tok-client
npm install
npm run dev
```

Then just open the link that is printed in the console. This should be `http://127.0.0.1:5173/`

After the server is running, you can go to the client and start using the website.

## Examples

You can find how the site works and looks like in the [readme-assets](/readme-assets/) folder (both in light/dark mode).

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

```plaintext
MIT License

Copyright (c) [2025] [Denis Topallaj]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
