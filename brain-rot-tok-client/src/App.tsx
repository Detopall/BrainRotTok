import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import SubwayVideoType from "./SubwayVideoType";
import MinecraftVideoType from "./MinecraftVideoType";
import Header from "./components/Header";
import BasicVideoType from "./BasicVideoType";

function App() {

	return (
		<div className="container">
			<Nav />
			<Header />
			<Routes>
				<Route path="/" element={<BasicVideoType />} />
				<Route path="subway-surfers-type" element={<SubwayVideoType />} />
				<Route path="minecraft-reddit-type" element={<MinecraftVideoType />} />
			</Routes>
		</div>
	)
}

export default App;
