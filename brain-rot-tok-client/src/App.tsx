import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import SubwayVideoType from "./SubwayVideoType";
import MinecraftVideoType from "./MinecraftVideoType";
import Header from "./components/Header";
import BasicVideoType from "./BasicVideoType";
import RumbleVideoType from "./RumbleVideoType";
import VideoCutterType from "./VideoCutterType";

function App() {

	return (
		<div className="container">
			<Nav />
			<Header />
			<Routes>
				<Route path="/" element={<BasicVideoType />} />
				<Route path="subway-surfers-type" element={<SubwayVideoType />} />
				<Route path="minecraft-reddit-type" element={<MinecraftVideoType />} />
				<Route path="/rumble-video-type" element={<RumbleVideoType />} />
				<Route path="/video-cutter" element={<VideoCutterType />} /> 
			</Routes>
		</div>
	)
}

export default App;
