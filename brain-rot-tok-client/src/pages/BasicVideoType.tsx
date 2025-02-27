import Layout from "@/layouts/layout";
import { useState, ChangeEvent, useRef, useEffect } from "react";
import Subtitle from "@/components/Subtitle";
import GenerateBasicButton from "@/components/GenerateBasicButton";
import { Constants } from "@/components/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@heroui/button";

function BasicVideoType() {
	const [color, setColor] = useState(Constants.fontColor);
	const [size, setSize] = useState(Constants.fontSize);
	const [font, setFont] = useState(Constants.fontFamily[0]);
	const [creditSize, setCreditSize] = useState(Constants.fontSize);
	const fontFamily = Constants.fontFamily;
	const [credit, setCredit] = useState("");
	const [videoSrc, setVideoSrc] = useState<string>("");
	const [_, setVideo] = useState<HTMLVideoElement | null>(null);

	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const videoRef = useRef<HTMLVideoElement | null>(null);

	useEffect(() => {
		if (videoSrc && videoRef.current) {
			videoRef.current.src = videoSrc;
			setVideo(videoRef.current);
		}
	}, [videoSrc]);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const fileInput = event.target;

		if (fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0];
			const fileURL = URL.createObjectURL(file);

			setVideoSrc(fileURL);
		}
	};

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<Layout
			title="Basic Video Type"
			description="Choose a video, modify the subtitles, and generate your new video with subtitles."
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

				{videoSrc && (
					<video
						className="w-full max-w-3xl rounded-lg border-2 border-gray-300 mt-4"
						ref={videoRef}
						controls
					/>
				)}

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

				<GenerateBasicButton
					video={videoRef}
					color={color}
					size={size}
					font={font}
					credit={credit}
					creditSize={creditSize}
				/>
			</div>
		</Layout>
	);
}

export default BasicVideoType;
