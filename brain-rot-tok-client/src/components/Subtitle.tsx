import { ChromePicker } from "react-color";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

interface SubtitleProps {
	color: string;
	setColor: React.Dispatch<React.SetStateAction<string>>;
	size: number;
	setSize: React.Dispatch<React.SetStateAction<number>>;
	font: string;
	setFont: React.Dispatch<React.SetStateAction<string>>;
	fontFamily: string[];
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
	fontFamily,
	credit,
	setCredit,
	creditSize,
	setCreditSize,
}: SubtitleProps) {
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
						<Select value={font} onChange={(e) => setFont(e.target.value)}>
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
				<div className="flex justify-center flex-col gap-5 w-full max-w-lg text-center p-6 shadow-lg rounded-2xl">
					<p
						className="subtitle font-bold"
						style={{
							color,
							fontSize: `${size}px`,
							fontFamily: font,
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
