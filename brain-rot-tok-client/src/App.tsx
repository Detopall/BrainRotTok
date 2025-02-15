import { Route, Routes } from "react-router-dom";

import Header from "@/components/header";
import Nav from "@/components/nav";
import { useTheme } from "@/hooks/use-theme";
import BasicVideoType from "./pages/BasicVideoType";
import MinecraftVideoType from "./pages/MinecraftVideoType";
import RumbleVideoType from "./pages/RumbleVideoType";
import SubwayVideoType from "./pages/SubwayVideoType";

import { Switch } from "@heroui/switch";

import { MoonIcon, SunIcon } from "@/components/moonSunIcons";

function App() {
	const { theme, toggleTheme } = useTheme();

	return (
		<main className={`green-${theme} text-foreground bg-background mb-5`}>
			<div className="flex flex-col">
				<div className="flex flex-col items-end py-4">
					<Switch
						defaultSelected
						endContent={<MoonIcon />}
						startContent={<SunIcon />}
						onChange={toggleTheme}
						size="lg"
					/>
				</div>
				<Header />
				<Nav />
				<Routes>
					<Route element={<BasicVideoType />} path="/" />
					<Route
						element={<MinecraftVideoType />}
						path="/minecraft-reddit-type"
					/>
					<Route element={<SubwayVideoType />} path="/subway-surfers-type" />
					<Route element={<RumbleVideoType />} path="/rumble-video-type" />
				</Routes>
			</div>
		</main>
	);
}

export default App;
