import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { ChangeEvent, useState } from 'react';
import Subtitle from './components/Subtitle';
import GenerateMinecraftButton from './components/GenerateMinecraftButton';
import { Constants } from './constants';

function MinecraftVideoType() {
	const [color, setColor] = useState(Constants.fontColor);
	const [size, setSize] = useState(Constants.fontSize);
	const [font, setFont] = useState(Constants.fontFamily[0]);
	const [creditSize, setCreditSize] = useState(Constants.fontSize);
	const fontFamily = Constants.fontFamily;
	const [credit, setCredit] = useState("");
	const [videoSrc, setVideoSrc] = useState<string>("");
	const [video, setVideo] = useState<HTMLVideoElement | null>(null);
	const [subtitles, setSubtitles] = useState<string>("");

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const fileInput = event.target;
		const video = document.getElementById(`video`) as HTMLVideoElement;

		if (fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0];
			const fileURL = URL.createObjectURL(file);

			setVideoSrc(fileURL);
			setVideo(video);

			video.src = fileURL;
			video.style.display = 'block';
		}
	}

	function handleSubtitles(e: ChangeEvent<HTMLTextAreaElement>) {
		setSubtitles(e.target.value);
	}

	return (
		<>
			<h1> Minecraft-Reddit Video Type </h1>
			<p> Choose one background video and insert the text you would want to be read out. <b>The background video </b> will have the subtitles placed on the bottom of the screen.</p>
			<p> You can also choose the subtitle color, size, and font family. </p>
			<p> Press generate to get your new video. </p>

			<div className="video-section-container">
				<label className="video-input-label" htmlFor="videoInput">
					<FontAwesomeIcon icon={faUpload} className='icon' />
					<input type="file" accept="video/*" capture="user" id="videoInput" onChange={(e) => handleFileChange(e)} />
					<span> Choose background video </span>
				</label>
				<video id="video" className="video" src={videoSrc} controls />
			</div>

			<div className="subtitle-text-section-container">
				<textarea id="text-input" placeholder="Enter text here" onChange={handleSubtitles}/>
			</div>

			<div className="subtitle-section-container">
				<Subtitle color={color}
					setColor={setColor}
					size={size}
					setSize={setSize}
					font={font}
					setFont={setFont}
					fontFamily={fontFamily}
					credit={credit}
					setCredit={setCredit}
					creditSize={creditSize}
					setCreditSize={setCreditSize}
				/>
			</div>

			<div className="video-creation-container">
				<GenerateMinecraftButton video={video} subtitles={subtitles} color={color} size={size} font={font} credit={credit} creditSize={creditSize} />
			</div>
		</>
	)
}

export default MinecraftVideoType;