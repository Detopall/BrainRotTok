import Layout from "@/layouts/layout";
import { useState } from "react";
import Subtitle from "@/components/Subtitle";
import GenerateRumbleButton from "@/components/GenerateRumbleButton";
import VideoClipsForm from "@/components/VideoClipForm";
import { Constants } from "@/components/constants";

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
		},
	]);

	return (
		<Layout
			title="Rumble Video Type"
			description="Insert the Rumble video link you want to add subtitles to. Choose the subtitle color, size, and font family. Press generate to get your new video."
		>
			<div className="w-full max-w-2xl mx-auto p-6 space-y-4">
				<label
					className="block text-lg font-semibold"
					htmlFor="video-link-input"
				>
					Insert Rumble video link
				</label>

				<input
					type="text"
					id="video-link-input"
					placeholder="https://rumble.com/v477gef-live-iowa-caucus-results-2024.html"
					onChange={(e) => setVideoUrl(e.target.value)}
					className="w-full p-4 border-2 border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2"
				/>

				{videoUrl && (
					<video
						id="video"
						className="w-full rounded-lg shadow-md border-2 border-gray-300 mt-4"
						src={videoUrl}
						controls
					/>
				)}
			</div>

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

			<VideoClipsForm clips={clips} setClips={setClips} />

			<GenerateRumbleButton
				videoUrl={videoUrl}
				clips={clips}
				color={color}
				size={size}
				font={font}
				credit={credit}
				creditSize={creditSize}
			/>
		</Layout>
	);
}

export default RumbleVideoType;
