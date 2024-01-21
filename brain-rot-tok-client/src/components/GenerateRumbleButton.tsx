import { useRef, useState } from 'react';
import { VideoClip } from './VideoClipForm';

interface GenerateRubmleVideo {
	videoUrl: string;
	clips: VideoClip[];
	color: string;
	size: number;
	font: string;
}


function GenerateRubmleVideo({ videoUrl, clips, color, size, font }: GenerateRubmleVideo) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [loading, setLoading] = useState(false);

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
			if (videoUrl && !loading) {
				setLoading(true);

				const jsonBody = {
					video_url: videoUrl,
					clips: clips,
					color: color,
					size: size,
					font: font,
				}

				const response = await fetch('http://localhost:8000/rumble/generate-subtitles', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(jsonBody),
				});

				if (!response.ok) {
					throw new Error(`Failed to generate subtitles: ${response.statusText}`);
				}

				response.blob().then((blob) => {
					const url = window.URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = `clips-${getFormattedDateTime()}.zip`;
					a.click();
					window.URL.revokeObjectURL(url);
				});

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
				</div>
			)}
			<dialog ref={dialogRef}>
				<div>
					<p>Please insert a video link.</p>
					<button onClick={() => dialogRef.current?.close()}>Close</button>
				</div>
			</dialog>
		</div>
	)
}

export default GenerateRubmleVideo;
