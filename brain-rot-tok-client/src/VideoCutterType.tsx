import GenerateVideoCutter from './components/GenerateVideoCutter'

function VideoCutterType() {
	return (
		<>
			<h1> Video Cutter </h1>
			<p> Select one or multiple videos of which you want to cut the length. </p>
			<p> Insert the start and end time of the video you want to cut. </p>
			<p> Press "Cut Videos" to get a zip of your cut videos. </p>

			<GenerateVideoCutter />
		</>
	)
}

export default VideoCutterType;