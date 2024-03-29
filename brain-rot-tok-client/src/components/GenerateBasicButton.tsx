import { useRef, useState } from 'react';

interface GenerateBasicVideo {
	video: HTMLVideoElement | null;
	color: string;
	size: number;
	font: string;
	credit: string;
	creditSize: number;
}

interface VideoPlayerProps {
	videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
	return (
		<div>
			<video controls width="600" height="400">
				<source src={videoUrl} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>
	);
};

function BasicVideoType({ video, color, size, font, credit, creditSize }: GenerateBasicVideo) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [loading, setLoading] = useState(false);
	const [resultVideoUrl, setResultVideoUrl] = useState<string | null>(null);

	function getFormattedDateTime() {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');

		return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
	}


	async function handleRequest() {
		try {
			if (video && !loading) {
				setLoading(true);

				const formData = new FormData();

				const videoBlob = await fetch(video.src).then((r) => r.blob());

				formData.append('video', videoBlob, 'video.mp4');
				formData.append('color', color);
				formData.append('size', size.toString());
				formData.append('font', font);
				formData.append('credit', credit);
				formData.append('credit_size', creditSize.toString());

				const response = await fetch('http://localhost:8000/basic/generate-subtitles', {
					method: 'POST',
					body: formData,
				});

				if (!response.ok) {
					throw new Error(`Failed to generate subtitles: ${response.statusText}`);
				}

				const resultVideoBlob = await response.blob();
				const resultVideoObjectURL = URL.createObjectURL(resultVideoBlob);
				setResultVideoUrl(resultVideoObjectURL);
			} else {
				dialogRef.current?.showModal();
			}
		} catch (error) {
			console.error('Error uploading video:', error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="button-section">
			{loading ? (
				<div className="loading-spinner">
					{/* Add your loading spinner content here */}
				</div>
			) : (
				<div className="button-video-container">
					<button className="generate-button" onClick={handleRequest}>
						Generate
					</button>
					{resultVideoUrl && (
						<>
							<VideoPlayer videoUrl={resultVideoUrl} />
							<button className="download-button">
								<a href={resultVideoUrl} download={`BrainRotTok-Basic-${getFormattedDateTime()}.mp4`}>
									Download
								</a>
							</button>
						</>
					)}
				</div>
			)}
			<dialog ref={dialogRef}>
				<div>
					<p>Please select a background video.</p>
					<button onClick={() => dialogRef.current?.close()}>Close</button>
				</div>
			</dialog>
		</div>
	)
}

export default BasicVideoType;