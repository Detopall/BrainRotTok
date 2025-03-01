import { useState } from "react";
import { ChromePicker } from "react-color";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Constants } from "./constants";

interface SubtitleProps {
	color: string;
	setColor: React.Dispatch<React.SetStateAction<string>>;
	size: number;
	setSize: React.Dispatch<React.SetStateAction<number>>;
	font: string;
	setFont: React.Dispatch<React.SetStateAction<string>>;
	credit: string;
	setCredit: React.Dispatch<React.SetStateAction<string>>;
	creditSize: number;
	setCreditSize: React.Dispatch<React.SetStateAction<number>>;
}

function Subtitle({
	color,
	setColor,
	size,
	setSize,
	font,
	setFont,
	credit,
	setCredit,
	creditSize,
	setCreditSize,
}: SubtitleProps) {
	const [fontFamily, setFontFamily] = useState<string[]>(Constants.fontFamily);
	const [isFontsFetched, setIsFontsFetched] = useState(false);

	const handleFontDropdownOpen = async () => {
		if (!isFontsFetched) {
			try {
				const response = await fetch("http://localhost:8000/fonts");
				if (!response.ok) {
					throw new Error("Failed to fetch fonts from server");
				}
				const data = await response.json();
				if (data.fonts && Array.isArray(data.fonts)) {
					setFontFamily(data.fonts);
				} else {
					throw new Error("Invalid fonts data from server");
				}
			} catch (error) {
				console.error("Error fetching fonts from server:", error);
				setFontFamily(Constants.fontFamily);
			} finally {
				setIsFontsFetched(true);
			}
		}
	};

	return (
		<div className="flex flex-col items-center justify-center gap-6 p-6 w-full">
			<Card className="w-full max-w-lg shadow-lg rounded-2xl p-6">
				<CardHeader className="text-center">
					<h2 className="text-2xl font-semibold flex-auto">
						Subtitle Settings
					</h2>
				</CardHeader>
				<CardBody className="space-y-4">
					<div className="flex flex-col items-center">
						<label className="block text-sm font-medium mb-2">
							Subtitle Color
						</label>
						<ChromePicker
							color={color}
							onChangeComplete={(c: any) => setColor(c.hex)}
						/>
					</div>

					<div className="flex flex-col items-center">
						<label className="block text-sm font-medium mb-2">
							Subtitle Size
						</label>
						<Input
							type="number"
							className="text-center"
							value={size.toString()}
							min={1}
							max={50}
							onChange={(e) => setSize(parseInt(e.target.value))}
						/>
					</div>

					<div className="flex flex-col items-center">
						<label className="block text-sm font-medium mb-2">
							Subtitle Font
						</label>
						<Select
							value={font}
							onChange={(e) => setFont(e.target.value)}
							onOpenChange={handleFontDropdownOpen}
						>
							{fontFamily.map((f) => (
								<SelectItem
									key={f}
									value={f}
									style={{ fontFamily: f }}
									className="text-center"
								>
									{f}
								</SelectItem>
							))}
						</Select>
					</div>

					<div className="flex flex-col items-center">
						<label className="block text-sm font-medium mb-2">
							Credit Name
						</label>
						<Input
							type="text"
							className="text-center"
							value={credit}
							onChange={(e) => setCredit(e.target.value)}
						/>
					</div>

					<div className="flex flex-col items-center">
						<label className="block text-sm font-medium mb-2">
							Credit Size
						</label>
						<Input
							type="number"
							className="text-center"
							value={creditSize.toString()}
							min={1}
							max={50}
							onChange={(e) => setCreditSize(parseInt(e.target.value))}
						/>
					</div>
				</CardBody>

				<div className="flex justify-center flex-col gap-5 w-full max-w-lg text-center p-6">
					<p
						className="subtitle font-bold"
						style={{
							color: color || Constants.fontColor,
							fontSize: `${size}px`,
							fontFamily: font || Constants.fontFamily[0],
							textShadow:
								"-0.1px -0.1px 0 #000, 0.1px -0.1px 0 #000, -0.1px 0.1px 0 #000, 0.1px 0.1px 0 #000",
						}}
					>
						Sample Subtitle: This is the sample subtitle
					</p>
					<p
						className="credit text-sm mt-2"
						style={{
							fontSize: `${creditSize}px`,
						}}
					>
						Credit: {credit}
					</p>
				</div>
			</Card>
		</div>
	);
}

export default Subtitle;
