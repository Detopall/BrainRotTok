import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { ChangeEvent, useState } from 'react';

interface VideosProps {
	setTopVideoFile: (video: HTMLVideoElement | null) => void;
	setBottomVideoFile: (video: HTMLVideoElement | null) => void;
}

function Videos({ setTopVideoFile, setBottomVideoFile }: VideosProps) {
	const [topVideoSrc, setTopVideoSrc] = useState<string>('');
	const [bottomVideoSrc, setBottomVideoSrc] = useState<string>('');

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>, videoId: string) => {
		const fileInput = event.target;
		const video = document.getElementById(`video-${videoId}`) as HTMLVideoElement;

		if (fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0];
			const fileURL = URL.createObjectURL(file);

			// Update state based on videoId
			if (videoId === 'top') {
				setTopVideoSrc(fileURL);
				setTopVideoFile(video);
			} else if (videoId === 'bottom') {
				setBottomVideoSrc(fileURL);
				setBottomVideoFile(video);
			}

			video.src = fileURL;
			video.style.display = 'block';
		} else {
			// Update state to empty when no file is selected
			if (videoId === 'top') {
				setTopVideoSrc('');
			} else if (videoId === 'bottom') {
				setBottomVideoSrc('');
			}

			video.src = '';
			video.style.display = 'none';
		}
	};

	return (
		<>
			<div className="video-section" id="container-video-top">
				<label className="video-input-label" htmlFor="topVideoInput">
					<FontAwesomeIcon icon={faUpload} className='icon' />
					<input type="file" accept="video/*" capture="user" id="topVideoInput" onChange={(e) => handleFileChange(e, 'top')} />
					<span> Choose top video </span>
				</label>
				<video id="video-top" className="video" src={topVideoSrc} controls />
			</div>

			<div className="video-section" id="container-video-bottom">
				<label className="video-input-label" htmlFor="bottomVideoInput">
					<FontAwesomeIcon icon={faUpload} className='icon' />
					<input type="file" accept="video/*" capture="user" id="bottomVideoInput" onChange={(e) => handleFileChange(e, 'bottom')} />
					<span> Choose bottom video </span>
				</label>
				<video id="video-bottom" className="video" src={bottomVideoSrc} controls />
			</div>
		</>
	);
}

export default Videos;
