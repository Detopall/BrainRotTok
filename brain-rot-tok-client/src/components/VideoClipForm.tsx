export interface VideoClip {
	start: string;
	end: string;
	name: string;
}

interface VideoClipsFormProps {
	clips: VideoClip[];
	setClips: React.Dispatch<React.SetStateAction<VideoClip[]>>;
}

function VideoClipsForm({ clips, setClips }: VideoClipsFormProps) {

	const handleAddClip = () => {
		setClips([...clips, { start: '00:00:00', end: '00:00:00', name: 'new clip' }]);
	};

	const handleClipChange = (
		index: number,
		field: keyof VideoClip,
		value: string
	) => {
		const updatedClips = [...clips];
		updatedClips[index][field] = value;
		setClips(updatedClips);
	};

	const handleRemoveClip = (index: number) => {
		const updatedClips = [...clips];
		updatedClips.splice(index, 1);
		setClips(updatedClips);
	};

	return (
		<div className="video-clips-container">
			<h2>Video Clips</h2>
			<p> Make sure to insert the time in the format <b>HH:MM:SS</b> </p>
			{clips.map((clip, index) => (
				<div key={index} className="clip-item">
					<label>Start:</label>
					<input
						type="text"
						value={clip.start}
						onChange={(e) => handleClipChange(index, 'start', e.target.value)}
					/>
					<label>End:</label>
					<input
						type="text"
						value={clip.end}
						onChange={(e) => handleClipChange(index, 'end', e.target.value)}
					/>
					<label>Name:</label>
					<input
						type="text"
						value={clip.name}
						onChange={(e) => handleClipChange(index, 'name', e.target.value)}
					/>
					<button className="generate-button" onClick={() => handleRemoveClip(index)}>Remove</button>
				</div>
			))}
			<button onClick={handleAddClip} className="add-clip-button generate-button">
				Add Clip
			</button>
			<div>
				<h3>Clips List:</h3>
				<ul className="clips-list">
					{clips.map((clip, index) => (
						<li key={index}>
							{`${clip.name}: ${clip.start} - ${clip.end}`}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default VideoClipsForm;