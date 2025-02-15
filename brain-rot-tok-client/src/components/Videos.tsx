import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, useState, useRef } from "react";
import { Button } from "@heroui/button";

interface VideosProps {
	setTopVideoFile: (video: HTMLVideoElement | null) => void;
	setBottomVideoFile: (video: HTMLVideoElement | null) => void;
}

function Videos({ setTopVideoFile, setBottomVideoFile }: VideosProps) {
	const [topVideoSrc, setTopVideoSrc] = useState<string>("");
	const [bottomVideoSrc, setBottomVideoSrc] = useState<string>("");

	const topFileInputRef = useRef<HTMLInputElement | null>(null);
	const bottomFileInputRef = useRef<HTMLInputElement | null>(null);

	const handleFileChange = (
		event: ChangeEvent<HTMLInputElement>,
		videoId: string
	) => {
		const fileInput = event.target;
		const video = document.getElementById(
			`video-${videoId}`
		) as HTMLVideoElement;

		if (fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0];
			const fileURL = URL.createObjectURL(file);

			if (videoId === "top") {
				setTopVideoSrc(fileURL);
				setTopVideoFile(video);
			} else if (videoId === "bottom") {
				setBottomVideoSrc(fileURL);
				setBottomVideoFile(video);
			}

			video.src = fileURL;
			video.style.display = "block";
		} else {
			if (videoId === "top") {
				setTopVideoSrc("");
			} else if (videoId === "bottom") {
				setBottomVideoSrc("");
			}

			video.src = "";
			video.style.display = "none";
		}
	};

	const handleTopButtonClick = () => {
		if (topFileInputRef.current) {
			topFileInputRef.current.click();
		}
	};

	const handleBottomButtonClick = () => {
		if (bottomFileInputRef.current) {
			bottomFileInputRef.current.click();
		}
	};

	return (
		<div className="flex flex-col items-center space-y-8">
			<div className="w-full max-w-2xl flex flex-col items-center space-y-4">
				<Button
					className="px-6 py-3 rounded-md shadow-md focus:outline-none"
					onPress={handleTopButtonClick}
					variant="ghost"
					color="primary"
				>
					<FontAwesomeIcon icon={faUpload} className="mr-2 text-xl" />
					Choose top video
				</Button>
				<input
					type="file"
					accept="video/*"
					id="topVideoInput"
					className="hidden"
					onChange={(e) => handleFileChange(e, "top")}
					ref={topFileInputRef}
				/>
				<video
					id="video-top"
					className="w-full rounded-lg shadow-md border border-gray-300"
					src={topVideoSrc}
					controls
					style={{ display: topVideoSrc ? "block" : "none" }}
				/>
			</div>

			<div className="w-full max-w-2xl flex flex-col items-center space-y-4">
				<Button
					className="px-6 py-3 rounded-md shadow-md focus:outline-none"
					onPress={handleBottomButtonClick}
					variant="ghost"
					color="primary"
				>
					<FontAwesomeIcon icon={faUpload} className="mr-2 text-xl" />
					Choose bottom video
				</Button>
				<input
					type="file"
					accept="video/*"
					id="bottomVideoInput"
					className="hidden"
					onChange={(e) => handleFileChange(e, "bottom")}
					ref={bottomFileInputRef}
				/>
				<video
					id="video-bottom"
					className="w-full rounded-lg shadow-md border border-gray-300"
					src={bottomVideoSrc}
					controls
					style={{ display: bottomVideoSrc ? "block" : "none" }}
				/>
			</div>
		</div>
	);
}

export default Videos;
