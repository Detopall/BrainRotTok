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

export default VideoPlayer;