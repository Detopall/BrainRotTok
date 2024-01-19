import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { ChangeEvent, useState } from 'react';
import Subtitle from './components/Subtitle';
import GenerateBasicButton from './components/GenerateBasicButton';


function BasicVideoType() {
	const [color, setColor] = useState("#000000");
	const [size, setSize] = useState(24);
	const [font, setFont] = useState("Arial");
	const fontFamily = ["Arial", "Times New Roman", "Verdana", "Courier New", "Impact", "Comic Sans MS", "Tahoma", "Trebuchet MS", "Arial Black", "Lucida Console"];
	const [videoSrc, setVideoSrc] = useState<string>("");
	const [video, setVideo] = useState<HTMLVideoElement | null>(null);

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

	return (
		<>
			<h1> Basic Video Type </h1>
			<p> Choose one video, modify the subtitles, and generate your new video with subtitles. </p>
			<p> You can choose the subtitle color, size, and font family. </p>
			<p> Press generate to get your new video. </p>

			<div className="video-section-container">
				<label className="video-input-label" htmlFor="videoInput">
					<FontAwesomeIcon icon={faUpload} className='icon' />
					<input type="file" accept="video/*" capture="user" id="videoInput" onChange={(e) => handleFileChange(e)} />
					<span> Choose video </span>
				</label>
				<video id="video" className="video" src={videoSrc} controls />
			</div>

			<div className="subtitle-section-container">
				<Subtitle color={color}
					setColor={setColor}
					size={size}
					setSize={setSize}
					font={font}
					setFont={setFont}
					fontFamily={fontFamily}
				/>
			</div>

			<div className="video-creation-container">
				<GenerateBasicButton video={video} color={color} size={size} font={font} />
			</div>
		</>
	)
}

export default BasicVideoType;
