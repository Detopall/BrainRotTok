import Layout from "@/layouts/layout";
import Videos from "@/components/Videos";
import Subtitle from "@/components/Subtitle";
import GenerateSubwayButton from "@/components/GenerateSubwayButton";
import { useState } from "react";
import { Constants } from "@/components/constants";

function SubwayVideoType() {
	const [color, setColor] = useState(Constants.fontColor);
	const [size, setSize] = useState(Constants.fontSize);
	const [font, setFont] = useState(Constants.fontFamily[0]);
	const [creditSize, setCreditSize] = useState(Constants.fontSize);
	const fontFamily = Constants.fontFamily;
	const [credit, setCredit] = useState("");
	const [topVideo, setTopVideo] = useState<HTMLVideoElement | null>(null);
	const [bottomVideo, setBottomVideo] = useState<HTMLVideoElement | null>(null);

	const setTopVideoFile = (video: HTMLVideoElement | null) => {
		setTopVideo(video);
	};

	const setBottomVideoFile = (video: HTMLVideoElement | null) => {
		setBottomVideo(video);
	};

	return (
		<Layout
			title="Subway Surfers Video Type"
			description="Generate a video with subtitles for Subway Surfers. Choose two videos you want to combine into one. The top video is the background without subtitles and the bottom video is the foreground with subtitles."
		>
			<Videos
				setTopVideoFile={setTopVideoFile}
				setBottomVideoFile={setBottomVideoFile}
			/>

			<Subtitle
				color={color}
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

			<GenerateSubwayButton
				bottomVideo={bottomVideo}
				topVideo={topVideo}
				color={color}
				size={size}
				font={font}
				credit={credit}
				creditSize={creditSize}
			/>
		</Layout>
	);
}

export default SubwayVideoType;
