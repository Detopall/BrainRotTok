import {  useState } from 'react';
import Subtitle from './components/Subtitle';
import GenerateRumbleButton from './components/GenerateRumbleButton';
import VideoClipsForm from './components/VideoClipForm';
import { Constants } from './constants';

function RumbleVideoType() {
	const [color, setColor] = useState(Constants.fontColor);
	const [size, setSize] = useState(Constants.fontSize);
	const [font, setFont] = useState(Constants.fontFamily[0]);
	const [creditSize, setCreditSize] = useState(Constants.fontSize);
	const fontFamily = Constants.fontFamily;
	const [credit, setCredit] = useState("");
	const [videoUrl, setVideoUrl] = useState<string>("");
	const [clips, setClips] = useState([
		{
			start: "00:00:00",
			end: "00:00:00",
			name: "First clip",
		}
	]);

	return (
		<>
			<h1> Rumble Video Type </h1>
			<p> Insert the Rumble video link you want to add subtitles to. </p>
			<p> Choose the subtitle color, size, and font family. </p>
			<p> Press generate to get your new video. </p>

			<div className="video-section-container">
				<label className="video-link-label" htmlFor="video-link-input">Insert Rumble video link</label>
				<input type="text" id="video-link-input" placeholder='https://rumble.com/v477gef-live-iowa-caucus-results-2024.html' onChange={(e) => {
					setVideoUrl(e.target.value);
				}}/>
				<video id="video" className="video" src={videoUrl} controls />
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

			<VideoClipsForm clips={clips} setClips={setClips} />

			<div className="video-creation-container">
				<GenerateRumbleButton videoUrl={videoUrl} clips={clips} color={color} size={size} font={font} credit={credit} creditSize={creditSize} />
			</div>
		</>
	)
}

export default RumbleVideoType;
