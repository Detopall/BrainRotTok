import React, { useState, useRef } from 'react';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

function VideoCut() {
	const [videos, setVideos] = useState<Video[]>([]);
	const [timestamps, setTimestamps] = useState<{ [key: number]: { start: string; end: string } }>({});
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [loading, setLoading] = useState(false);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const selectedFiles = Array.from(event.target.files);
			const initialVideos = selectedFiles.map((file) => ({ file }));
			setVideos(initialVideos);
		}
	};

	const handleTimestampChange = (index: number, field: 'start' | 'end', value: string) => {
		setTimestamps((prevState) => ({
			...prevState,
			[index]: {
				...prevState[index],
				[field]: value,
			},
		}));
	};

	const handleCut = async () => {
		setLoading(true); // Start loading spinner
		const formData = new FormData();
		videos.forEach((video, index) => {
			formData.append(`videos`, video.file);
		});
		formData.append('timestamps', JSON.stringify(timestamps));

		try {
			const response = await fetch('http://localhost:8000/video-editor/cut', {
				method: 'POST',
				body: formData,
			});
			const blob = await response.blob();
			saveAs(blob, 'cut-videos.zip');
		} catch (error) {
			console.error('Error processing video:', error);
		} finally {
			setLoading(false); // Stop loading spinner
		}
	};

	return (
		<>
			<div className="video-section-container">
				<label className="video-input-label" htmlFor="videoInput">
					<FontAwesomeIcon icon={faUpload} className="icon" />
					<input
						type="file"
						accept="video/*"
						capture="user"
						id="videoInput"
						multiple
						onChange={(e) => handleFileChange(e)}
					/>
					<span>Choose videos</span>
				</label>
				{videos.map((video, index) => (
					<div className="clip-item" key={index}>
						<video controls className="video-preview">
							<source src={URL.createObjectURL(video.file)} type="video/mp4" />
							Your browser does not support the video tag.
						</video>
						<div className="timestamp-input">
							<label>Start Time (HH:MM:SS):</label>
							<input
								type="text"
								className="time-input"
								value={(timestamps[index] && timestamps[index].start) || '00:00:00'}
								onChange={(e) => handleTimestampChange(index, 'start', e.target.value)}
							/>
							<label>End Time (HH:MM:SS):</label>
							<input
								type="text"
								className="time-input"
								value={(timestamps[index] && timestamps[index].end) || '00:00:00'}
								onChange={(e) => handleTimestampChange(index, 'end', e.target.value)}
							/>
						</div>
					</div>
				))}
			</div>
			<div className="video-creation-container">
				{loading ? (
					<div className="loading-spinner">
						{/* Add your loading spinner content here */}
					</div>
				) : (
					<button className="generate-button" onClick={handleCut} disabled={loading}>
						Cut Videos
					</button>
				)}
			</div>

			<dialog ref={dialogRef}>
				<div>
					<p>Please select a background video.</p>
					<button onClick={() => dialogRef.current?.close()}>Close</button>
				</div>
			</dialog>
		</>
	);
}

export default VideoCut;
