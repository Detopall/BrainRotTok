import { useNavigate, useLocation } from "react-router-dom";
import basicIcon from "@/assets/svg/basic.svg";
import subwaySurfersIcon from "@/assets/svg/subway_surfers.svg";
import rumbleIcon from "@/assets/svg/rumble.svg";
import minecraftIcon from "@/assets/svg/minecraft.svg";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import { ChangeEvent } from "react";

const navLinks = [
	{ path: "/", text: "Basic Video Type", icon: basicIcon },
	{
		path: "/subway-surfers-type",
		text: "Subway Surfers Type",
		icon: subwaySurfersIcon,
	},
	{
		path: "/minecraft-reddit-type",
		text: "Minecraft-Reddit Type",
		icon: minecraftIcon,
	},
	{ path: "/rumble-video-type", text: "Rumble Video Type", icon: rumbleIcon },
];

function Nav() {
	const navigate = useNavigate();
	const location = useLocation();

	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const newValue = event.target.value;
		navigate(newValue);
	};

	return (
		<Card className="w-full max-w-md mx-auto mt-6 p-4 shadow-lg rounded-xl">
			<CardHeader>
				<h2 className="text-lg font-bold text-center">Navigation</h2>
			</CardHeader>
			<CardBody>
				<Select
					value={location.pathname}
					onChange={handleChange}
					className="w-full"
					defaultSelectedKeys={["/"]}
					startContent={
						<img
							src={
								navLinks.find((link) => link.path === location.pathname)?.icon
							}
							alt={
								navLinks.find((link) => link.path === location.pathname)?.text
							}
							className="w-8 h-8"
						/>
					}
				>
					<SelectSection>
						{navLinks.map((link) => (
							<SelectItem key={link.path} value={link.path}>
								{link.text}
							</SelectItem>
						))}
					</SelectSection>
				</Select>
			</CardBody>
		</Card>
	);
}

export default Nav;
