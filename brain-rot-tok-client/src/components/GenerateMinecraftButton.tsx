import { useRef, useState } from "react";
import GenerateButtonLayout from "@/layouts/generate-button-layout";

interface GenerateMinecraftVideo {
	video: React.RefObject<HTMLVideoElement>;
	subtitles: string;
	color: string;
	voice: string;
	size: number;
	font: string;
	credit: string;
	creditSize: number;
}

function GenerateMinecraftVideo({
	video,
	subtitles,
	color,
	voice,
	size,
	font,
	credit,
	creditSize,
}: GenerateMinecraftVideo) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [loading, setLoading] = useState(false);
	const [resultVideoUrl, setResultVideoUrl] = useState<string | null>(null);

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

	async function handleRequest() {
		console.log(video.current);

		try {
			if (video.current && !loading) {
				setLoading(true);

				const videoBlob = await fetch(video.current.src).then((response) =>
					response.blob()
				);

				const formData = new FormData();
				formData.append("video", videoBlob, "video.mp4");
				formData.append("subtitles", subtitles);
				formData.append("color", color);
				formData.append("voice", voice);
				formData.append("size", size.toString());
				formData.append("font", font);
				formData.append("credit", credit);
				formData.append("credit_size", creditSize.toString());

				const response = await fetch(
					"http://localhost:8000/minecraft/generate-subtitles",
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

				const resultVideoBlob = await response.blob();
				const resultVideoObjectURL = URL.createObjectURL(resultVideoBlob);
				setResultVideoUrl(resultVideoObjectURL);
			} else {
				dialogRef.current?.showModal();
			}
		} catch (error) {
			console.error("Error uploading video:", error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<GenerateButtonLayout
			loading={loading}
			resultVideoUrl={resultVideoUrl || ""}
			handleRequest={handleRequest}
			getFormattedDateTime={getFormattedDateTime}
		/>
	);
}

export default GenerateMinecraftVideo;
