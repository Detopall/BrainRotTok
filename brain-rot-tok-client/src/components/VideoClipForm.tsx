import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";

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
		setClips([
			...clips,
			{ start: "00:00:00", end: "00:00:00", name: "new clip" },
		]);
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
		<div className="w-full max-w-2xl mx-auto p-6 space-y-6 flex flex-col align-middle justify-center">
			<h2 className="text-2xl font-semibold text-center">Video Clips</h2>
			<p className="text-center">
				Make sure to insert the time in the format <b>HH:MM:SS</b>
			</p>

			{clips.map((clip, index) => (
				<Card
					key={index}
					className="p-4 space-y-4 border border-gray-300 rounded-lg shadow-md"
				>
					<div className="space-y-2">
						<div className="flex flex-col space-y-2">
							<label className="">Start:</label>
							<Input
								type="text"
								value={clip.start}
								onChange={(e) =>
									handleClipChange(index, "start", e.target.value)
								}
								className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2"
							/>
						</div>

						<div className="flex flex-col space-y-2">
							<label className="">End:</label>
							<Input
								type="text"
								value={clip.end}
								onChange={(e) => handleClipChange(index, "end", e.target.value)}
								className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2"
							/>
						</div>

						<div className="flex flex-col space-y-2">
							<label className="">Name:</label>
							<Input
								type="text"
								value={clip.name}
								onChange={(e: any) =>
									handleClipChange(index, "name", e.target.value)
								}
								className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2"
							/>
						</div>
					</div>
					<div className="flex justify-end">
						<Button
							variant="ghost"
							onPress={() => handleRemoveClip(index)}
							className="px-4 py-2 rounded-md shadow-sm"
							color="primary"
						>
							Remove
						</Button>
					</div>
				</Card>
			))}

			<div className="text-center">
				<Button
					variant="ghost"
					onPress={handleAddClip}
					className="px-6 py-3 rounded-md shadow-md"
					color="primary"
				>
					Add Clip
				</Button>
			</div>

			<div className="space-y-4 flex flex-col">
				<h3 className="text-xl font-semibold">Clips List:</h3>
				<ul className="space-y-2 ">
					{clips.map((clip, index) => (
						<li key={index} className="flex justify-between items-center">
							<span>{`${clip.name}: ${clip.start} - ${clip.end}`}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default VideoClipsForm;
