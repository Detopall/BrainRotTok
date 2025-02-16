import { Card } from "@heroui/card";
import brainIcon from "@/assets/images/brain-icon.png";

function Header() {
	return (
		<Card className="w-full max-w-lg mx-auto mt-6 flex items-center justify-between p-4 shadow-lg rounded-xl">
			<img className="w-12 h-12" src={brainIcon} alt="Brain Logo" />
			<h1 className="text-xl font-bold">BrainRotTok</h1>
		</Card>
	);
}
export default Header;
