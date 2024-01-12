import { useState } from 'react';
import Videos from './components/Videos';
import Subtitle from './components/Subtitle';
import GenerateButton from './components/GenerateButton';

function App() {
	const [color, setColor] = useState("#000000");
	const [size, setSize] = useState(24);
	const [font, setFont] = useState("Arial");
	const fontFamily = ["Arial", "Times New Roman", "Verdana", "Courier New", "Impact", "Comic Sans MS", "Tahoma", "Trebuchet MS", "Arial Black", "Lucida Console"];
	const [topVideo, setTopVideo] = useState<HTMLVideoElement | null>(null);
	const [bottomVideo, setBottomVideo] = useState<HTMLVideoElement | null>(null);

	const setTopVideoFile = (video: HTMLVideoElement  | null) => {
		setTopVideo(video);
	};

	const setBottomVideoFile = (video: HTMLVideoElement  | null) => {
		setBottomVideo(video);
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


			<Videos setTopVideoFile={setTopVideoFile} setBottomVideoFile={setBottomVideoFile} />
			<Subtitle color={color}
				setColor={setColor}
				size={size}
				setSize={setSize}
				font={font}
				setFont={setFont}
				fontFamily={fontFamily}
			/>

			<GenerateButton bottomVideo={bottomVideo} topVideo={topVideo} />
		</div>
	)
}

export default App;
