import { useRef, useState } from "react";
import GenerateButtonLayout from "@/layouts/generate-button-layout";

interface VideoGeneratorProps {
	topVideo: HTMLVideoElement | null;
	bottomVideo: HTMLVideoElement | null;
	color: string;
	size: number;
	font: string;
	credit: string;
	creditSize: number;
}

function VideoGenerator({
	topVideo,
	bottomVideo,
	color,
	size,
	font,
	credit,
	creditSize,
}: VideoGeneratorProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [loading, setLoading] = useState(false);
	const [videoUrl, setVideoUrl] = useState<string | null>(null);

	async function handleRequest() {
		console.log("topVideo", topVideo);
		console.log("bottomVideo", bottomVideo);
		try {
			if (topVideo && bottomVideo && !loading) {
				setLoading(true);

				const topVideoBlob = await fetch(topVideo.src).then((response) =>
					response.blob()
				);
				const bottomVideoBlob = await fetch(bottomVideo.src).then((response) =>
					response.blob()
				);

				const formData = new FormData();
				formData.append("top_video", topVideoBlob, "top_video.mp4");
				formData.append("bottom_video", bottomVideoBlob, "bottom_video.mp4");
				formData.append("color", color);
				formData.append("size", size.toString());
				formData.append("font", font);
				formData.append("credit", credit);
				formData.append("credit_size", creditSize.toString());

				const response = await fetch(
					"http://localhost:8000/subway/generate-subtitles",
					{
						method: "POST",
						body: formData,
					}
				);

				if (!response.ok) {
					throw new Error(
						`Failed to generate subtitles: ${response.statusText}`
					);
				}

				const videoBlob = await response.blob();
				const videoObjectURL = URL.createObjectURL(videoBlob);
				setVideoUrl(videoObjectURL);
			} else {
				// Show the dialog if either topVideo or bottomVideo is missing
				dialogRef.current?.showModal();
			}
		} catch (error) {
			console.error("Error uploading video:", error);
		} finally {
			setLoading(false);
		}
	}

	function getFormattedDateTime() {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, "0");
		const day = String(now.getDate()).padStart(2, "0");
		const hours = String(now.getHours()).padStart(2, "0");
		const minutes = String(now.getMinutes()).padStart(2, "0");
		const seconds = String(now.getSeconds()).padStart(2, "0");

		return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
	}

	return (
		<GenerateButtonLayout
			loading={loading}
			resultVideoUrl={videoUrl || ""}
			handleRequest={handleRequest}
			getFormattedDateTime={getFormattedDateTime}
		/>
	);
}

export default VideoGenerator;
