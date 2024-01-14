import { useRef, useState } from 'react';

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

interface VideoGeneratorProps {
	topVideo: HTMLVideoElement | null;
	bottomVideo: HTMLVideoElement | null;
	color: string;
	size: number;
	font: string;
}

function VideoGenerator({
	topVideo,
	bottomVideo,
	color,
	size,
	font,
}: VideoGeneratorProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [loading, setLoading] = useState(false);
	const [videoUrl, setVideoUrl] = useState<string | null>(null);

	async function handleRequest() {
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
				formData.append('top_video', topVideoBlob, 'top_video.mp4');
				formData.append('bottom_video', bottomVideoBlob, 'bottom_video.mp4');
				formData.append('color', color);
				formData.append('size', size.toString());
				formData.append('font', font);

				const response = await fetch('http://localhost:8000/generate_subtitles', {
					method: 'POST',
					body: formData,
				});

				if (!response.ok) {
					throw new Error(`Failed to generate subtitles: ${response.statusText}`);
				}

				const videoBlob = await response.blob();
				const videoObjectURL = URL.createObjectURL(videoBlob);
				setVideoUrl(videoObjectURL);
			} else {
				// Show the dialog if either topVideo or bottomVideo is missing
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
					{videoUrl && (
						<>
							<VideoPlayer videoUrl={videoUrl} />
							<button className="download-button">
								<a href={videoUrl} download="generated_video.mp4">
									Download
								</a>
							</button>
						</>
					)}
				</div>
			)}

			<dialog ref={dialogRef}>
				<div>
					<p>Please select a top and a bottom video.</p>
					<button onClick={() => dialogRef.current?.close()}>Close</button>
				</div>
			</dialog>
		</div>
	);
}

export default VideoGenerator;
