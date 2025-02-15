import Layout from "@/layouts/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, useState, useRef } from "react";
import Subtitle from "@/components/Subtitle";
import GenerateMinecraftButton from "@/components/GenerateMinecraftButton";
import { Constants } from "@/components/constants";
import { Button } from "@heroui/button";

function MinecraftVideoType() {
	const [color, setColor] = useState(Constants.fontColor);
	const [size, setSize] = useState(Constants.fontSize);
	const [font, setFont] = useState(Constants.fontFamily[0]);
	const [creditSize, setCreditSize] = useState(Constants.fontSize);
	const fontFamily = Constants.fontFamily;
	const [credit, setCredit] = useState("Made by BrainRotTok");
	const fileInputRef = useRef<HTMLInputElement | null>(null);
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
			video.style.display = "block";
		}
	};

	function handleSubtitles(e: ChangeEvent<HTMLTextAreaElement>) {
		setSubtitles(e.target.value);
	}

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<Layout
			title="Minecraft-Reddit Video Type"
			description="Generate a video with subtitles for Minecraft-Reddit. Choose one background video you want to add subtitles to. The subtitles will be placed on the bottom of the screen."
		>
			<div className="flex flex-col space-y-4 items-center">
				<div className="flex flex-col items-center space-y-4">
					<Button
						className="px-4 py-2 border rounded-md shadow-md"
						variant="ghost"
						onPress={handleButtonClick}
						color="primary"
					>
						<FontAwesomeIcon icon={faUpload} className="mr-2 text-xl" />
						Choose Video
					</Button>

					<input
						type="file"
						accept="video/*"
						className="hidden"
						onChange={handleFileChange}
						ref={fileInputRef}
					/>
				</div>
			</div>

			{videoSrc && (
				<video
					className="w-full max-w-3xl rounded-lg border-2 border-gray-300 mt-4"
					id="video"
					src={videoSrc}
					controls
				/>
			)}

			<div className="w-full max-w-2xl mx-auto p-4">
				<textarea
					id="text-input"
					placeholder="Enter text here"
					onChange={handleSubtitles}
					className="w-full h-20 p-4 border-2 border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 resize-none"
				/>
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

			<GenerateMinecraftButton
				video={video}
				subtitles={subtitles}
				color={color}
				size={size}
				font={font}
				credit={credit}
				creditSize={creditSize}
			/>
		</Layout>
	);
}

export default MinecraftVideoType;
