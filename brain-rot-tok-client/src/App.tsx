import { ChromePicker } from 'react-color';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { ChangeEvent } from 'react';

function App() {
	const [color, setColor] = useState("#000000");
	const [size, setSize] = useState(24);
	const [font, setFont] = useState("Arial");
	const fontFamily = ["Arial", "Times New Roman", "Verdana", "Courier New", "Impact", "Comic Sans MS", "Tahoma", "Trebuchet MS", "Arial Black", "Lucida Console"];

	const subtitleStyle = {
		color: color,
		fontSize: `${size}px`,
		fontFamily: font
	}

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>, videoId: string) => {
		const fileInput = event.target;
		console.log(fileInput.files);
		const video = document.getElementById(`video-${videoId}`) as HTMLVideoElement;

		if (fileInput.files && fileInput.files.length > 0) {
			const fileURL = URL.createObjectURL(fileInput.files[0]);
			video.src = fileURL;
			console.log(video)
			video.style.display = 'block';
		} else {
			video.src = '';
			video.style.display = 'none';
		}
	};

	return (
		<div className='container'>
			<div className='header'>
				<img className="logo" src="./src/assets/images/brain-icon.png" alt="Brain Logo" />
				<h1>Brain Rot Tok</h1>
			</div>
			<p> Choose two videos you want to combine into one. The top video is the background without subtitles and the bottom video is the foreground with subtitles. </p>
			<p> You can also choose the subtitle color, size, and font family. </p>
			<p> Press generate to get your new video. </p>
			<div className="video-section" id="container-video-top">
				<label className="video-input-label" htmlFor="topVideoInput">
					<FontAwesomeIcon icon={faUpload} className='icon' />
					<input type="file" accept="video/*" capture="user" id="topVideoInput" onChange={(e) => handleFileChange(e, 'top')} />
					<span> Choose top video </span>
				</label>
				<video id="video-top" className="video" controls />
			</div>

			<div className="video-section" id="container-video-bottom">
				<label className="video-input-label" htmlFor="bottomVideoInput">
					<FontAwesomeIcon icon={faUpload} className='icon' />
					<input type="file" accept="video/*" capture="user" id="bottomVideoInput" onChange={(e) => handleFileChange(e, 'bottom')} />
					<span> Choose bottom video </span>
				</label>
				<video id="video-bottom" className="video" controls />
			</div>

			<div className="subtitle-section">
				<div className="subtitle-options">
					<label htmlFor="color">Subtitle Color</label>
					<ChromePicker color={color} onChangeComplete={(color) => {
						const subtitle = document.querySelector(".subtitle") as HTMLElement;
						subtitle.style.color = color.hex;
						setColor(color.hex);
					}} />

					<label htmlFor="size">Subtitle Size</label>
					<input type="number" id="size" name="size" defaultValue="24" min="1" max="50" onChange={(e) => {
						const size = e.target.value;
						const subtitle = document.querySelector(".subtitle") as HTMLElement;
						subtitle.style.fontSize = `${size}px`;
						setSize(parseInt(size));
					}} />

					<label htmlFor="font">Subtitle Font</label>
					<select id="font" name="font">
						{fontFamily.map((font) => {
							return <option value={font} key={font} onClick={(e) => {
								const subtitle = document.querySelector(".subtitle") as HTMLElement;
								subtitle.style.fontFamily = font;
								setFont(font);
							}}>{font}</option>
						})}
					</select>
				</div>
				<p className="subtitle" style={subtitleStyle}> This is a sample text </p>
			</div>

			<div className="button-section">
				<button className="generate-button"> Generate </button>
			</div>
		</div>
	)
}

export default App;
