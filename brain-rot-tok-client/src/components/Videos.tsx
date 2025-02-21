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
	const topVideoRef = useRef<HTMLVideoElement | null>(null);
	const bottomVideoRef = useRef<HTMLVideoElement | null>(null);

	const handleFileChange = (
		event: ChangeEvent<HTMLInputElement>,
		videoType: "top" | "bottom"
	) => {
		const fileInput = event.target;
		if (fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0];
			const fileURL = URL.createObjectURL(file);

			if (videoType === "top") {
				setTopVideoSrc(fileURL);
				if (topVideoRef.current) {
					topVideoRef.current.src = fileURL;
					topVideoRef.current.style.display = "block";
					setTopVideoFile(topVideoRef.current); // Pass the actual video element
				}
			} else {
				setBottomVideoSrc(fileURL);
				if (bottomVideoRef.current) {
					bottomVideoRef.current.src = fileURL;
					bottomVideoRef.current.style.display = "block";
					setBottomVideoFile(bottomVideoRef.current); // Pass the actual video element
				}
			}
		} else {
			if (videoType === "top") {
				setTopVideoSrc("");
				setTopVideoFile(null);
			} else {
				setBottomVideoSrc("");
				setBottomVideoFile(null);
			}
		}
	};

	const handleTopButtonClick = () => topFileInputRef.current?.click();
	const handleBottomButtonClick = () => bottomFileInputRef.current?.click();

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
					className="hidden"
					onChange={(e) => handleFileChange(e, "top")}
					ref={topFileInputRef}
				/>
				<video
					ref={topVideoRef}
					className="w-full rounded-lg shadow-md border border-gray-300"
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
					className="hidden"
					onChange={(e) => handleFileChange(e, "bottom")}
					ref={bottomFileInputRef}
				/>
				<video
					ref={bottomVideoRef}
					className="w-full rounded-lg shadow-md border border-gray-300"
					controls
					style={{ display: bottomVideoSrc ? "block" : "none" }}
				/>
			</div>
		</div>
	);
}

export default Videos;
