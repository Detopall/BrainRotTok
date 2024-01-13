interface GenerateButtonProps {
	topVideo: HTMLVideoElement | null;
	bottomVideo: HTMLVideoElement | null;
	color: string;
	size: number;
	font: string;
}

function GenerateButton({ topVideo, bottomVideo, color, size, font }: GenerateButtonProps) {
	async function handleRequest() {
		try {
			if (topVideo && bottomVideo) {
				const topVideoBlob = await fetch(topVideo.src).then(response => response.blob());
				const bottomVideoBlob = await fetch(bottomVideo.src).then(response => response.blob());

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

				const data = await response.json();
				console.log('Success:', data);
			} else {
				console.log('No top or bottom video selected.');
			}
		} catch (error) {
			console.error('Error uploading video:', error);
		}
	}

	return (
		<div className="button-section">
			<button className="generate-button" onClick={handleRequest}>
				Generate
			</button>
		</div>
	);
}

export default GenerateButton;
