import Videos from './components/Videos';
import Subtitle from './components/Subtitle';
import GenerateSubwayButton from './components/GenerateSubwayButton';
import { useState } from 'react';

function SubwayVideoType() {
	const [color, setColor] = useState("#000000");
	const [size, setSize] = useState(24);
	const [font, setFont] = useState("Arial");
	const fontFamily = ["Arial", "Times New Roman", "Verdana", "Courier New", "Impact", "Comic Sans MS", "Tahoma", "Trebuchet MS", "Arial Black", "Lucida Console"];
	const [credit, setCredit] = useState("");
	const [creditSize, setCreditSize] = useState(24);
	const [topVideo, setTopVideo] = useState<HTMLVideoElement | null>(null);
	const [bottomVideo, setBottomVideo] = useState<HTMLVideoElement | null>(null);

	const setTopVideoFile = (video: HTMLVideoElement | null) => {
		setTopVideo(video);
	};

	const setBottomVideoFile = (video: HTMLVideoElement | null) => {
		setBottomVideo(video);
	};

	return (
		<>
			<h1> Subway Surfers Video Type </h1>
			<p> Choose two videos you want to combine into one. <b>The top video </b>  is the background without subtitles and <b> the bottom video </b> is the foreground with subtitles.</p>
			<p> You can also choose the subtitle color, size, and font family. </p>
			<p> Press generate to get your new video. </p>

			<div className="video-section-container">
				<Videos setTopVideoFile={setTopVideoFile} setBottomVideoFile={setBottomVideoFile} />
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
				<GenerateSubwayButton bottomVideo={bottomVideo} topVideo={topVideo} color={color} size={size} font={font} credit={credit} creditSize={creditSize} />
			</div>
		</>
	)
}

export default SubwayVideoType;