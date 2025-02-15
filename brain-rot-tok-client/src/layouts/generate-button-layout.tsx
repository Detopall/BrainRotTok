import { Button } from "@heroui/button";
import { useRef } from "react";
import VideoPlayer from "@/components/VideoPlayer";

interface GenerateButtonLayoutProps {
	loading: boolean;
	resultVideoUrl?: string;
	videoUrl?: string;
	handleRequest: () => void;
	getFormattedDateTime: () => string;
}

function GenerateButtonLayout({
	loading,
	resultVideoUrl,
	videoUrl,
	handleRequest,
	getFormattedDateTime,
}: GenerateButtonLayoutProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const videoUrlToUse = resultVideoUrl || videoUrl || "";

	return (
		<div className="flex flex-col items-center justify-center space-y-4">
			{loading ? (
				<div className="flex justify-center items-center space-x-2">
					<div className="animate-spin rounded-full border-4 border-t-4 border-gray-400 w-8 h-8"></div>
					<span>Loading...</span>
				</div>
			) : (
				<div className="space-y-4 text-center">
					<Button
						className="px-6 py-3 rounded-md"
						onPress={handleRequest}
						isLoading={loading}
						variant="ghost"
						color="primary"
					>
						Generate
					</Button>
					{videoUrlToUse && (
						<>
							<VideoPlayer videoUrl={videoUrlToUse} />
							<Button className="mt-4 px-4 py-2 rounded-md" variant="ghost" color="primary">
								<a
									href={videoUrlToUse}
									download={`BrainRotTok-${getFormattedDateTime()}.mp4`}
								>
									Download
								</a>
							</Button>
						</>
					)}
				</div>
			)}
			<dialog ref={dialogRef} className="p-4 border rounded-md">
				<div className="flex flex-col items-center space-y-2">
					<p className="text-center">Please select the necessary video(s).</p>
					<button
						onClick={() => dialogRef.current?.close()}
						className="mt-2 px-4 py-2 rounded-md"
					>
						Close
					</button>
				</div>
			</dialog>
		</div>
	);
}

export default GenerateButtonLayout;
