import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { ChangeEvent } from 'react';

const handleFileChange = (event: ChangeEvent<HTMLInputElement>, videoId: string) => {
	const fileInput = event.target;
	console.log(fileInput.files);
	const video = document.getElementById(`video-${videoId}`) as HTMLVideoElement;

	if (fileInput.files && fileInput.files.length > 0) {
		const fileURL = URL.createObjectURL(fileInput.files[0]);
		video.src = fileURL;
		console.log(video)
		video.style.display = 'block';
	} else {
		video.src = '';
		video.style.display = 'none';
	}
};

function Videos() {
	return (
		<>
			<div className="video-section" id="container-video-top">
				<label className="video-input-label" htmlFor="topVideoInput">
					<FontAwesomeIcon icon={faUpload} className='icon' />
					<input type="file" accept="video/*" capture="user" id="topVideoInput" onChange={(e) => handleFileChange(e, 'top')} />
					<span> Choose top video </span>
				</label>
				<video id="video-top" className="video" controls />
			</div>

			<div className="video-section" id="container-video-bottom">
				<label className="video-input-label" htmlFor="bottomVideoInput">
					<FontAwesomeIcon icon={faUpload} className='icon' />
					<input type="file" accept="video/*" capture="user" id="bottomVideoInput" onChange={(e) => handleFileChange(e, 'bottom')} />
					<span> Choose bottom video </span>
				</label>
				<video id="video-bottom" className="video" controls />
			</div>
		</>
	)
}

export default Videos;
