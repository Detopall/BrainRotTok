interface GenerateButtonProps {
	topVideo: HTMLVideoElement | null;
	bottomVideo: HTMLVideoElement | null;
}

function GenerateButton({ topVideo, bottomVideo }: GenerateButtonProps) {
	async function handleRequest() {
		try {
			if (topVideo && bottomVideo) {
				const topVideoBlob = await fetch(topVideo.src).then(response => response.blob());
				const bottomVideoBlob = await fetch(bottomVideo.src).then(response => response.blob());

				const formData = new FormData();
				formData.append('topVideo', topVideoBlob, 'topVideo.mp4');
				formData.append('bottomVideo', bottomVideoBlob, 'bottomVideo.mp4');

				const response = await fetch('TODO:ADD SERVER ENDPOINT', {
					method: 'POST',
					body: formData,
				});

				const data = await response.json();
				console.log('Success:', data);
			} else {
				console.log('No bottom video selected.');
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
