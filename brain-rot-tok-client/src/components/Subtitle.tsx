import { ChromePicker } from 'react-color';

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


function Subtitle({ color, setColor, size, setSize, font, setFont, fontFamily, credit, setCredit, creditSize, setCreditSize }: SubtitleProps) {

	const subtitleStyle = {
		color: color,
		fontSize: `${size}px`,
		fontFamily: font,
		textShadow: "-0.1px -0.1px 0 #000, 0.1px -0.1px 0 #000, -0.1px 0.1px 0 #000, 0.1px 0.1px 0 #000",
	}

	const creditStyle = {
		fontSize: `${creditSize}px`
	}

	return (
		<>
			<div className="subtitle-section">
				<div className="subtitle-options">
					<label htmlFor="color">Subtitle Color</label>
					<ChromePicker color={color} onChangeComplete={(color) => {
						const subtitle = document.querySelector(".subtitle") as HTMLElement;
						subtitle.style.color = color.hex;
						setColor(color.hex);
					}} />

					<label htmlFor="size">Subtitle Size</label>
					<input type="number" id="size" name="size" defaultValue="24" min="1" max="50" className="input-size" onChange={(e) => {
						const size = e.target.value;
						const subtitle = document.querySelector(".subtitle") as HTMLElement;
						subtitle.style.fontSize = `${size}px`;
						setSize(parseInt(size));
					}} />

					<label htmlFor="font">Subtitle Font</label>
					<select id="font" name="font">
						{fontFamily.map((font) => {
							return <option value={font} key={font} style={{ fontFamily: font }} onClick={(e) => {
								const subtitle = document.querySelector(".subtitle") as HTMLElement;
								subtitle.style.fontFamily = font;
								setFont(font);
							}}>{font}</option>
						})}
					</select>

					<label htmlFor='credit-size'>Credit Size</label>
					<input type="number" id="credit-size" name="credit-size" defaultValue="24" min="1" max="50" className="input-size" onChange={(e) => {
						const size = e.target.value;
						const credit = document.querySelector(".credit") as HTMLElement;
						credit.style.fontSize = `${size}px`;
						setCreditSize(parseInt(size));
					}} />

					<label htmlFor='credit-name'>Credit Name</label>
					<input type="text" id="credit-name" name="credit-name" defaultValue="Made by BrainRotTok" onChange={(e) => {
						const name = e.target.value;
						const creditTag = document.querySelector(".credit") as HTMLElement;
						creditTag.innerHTML = `Credit: ${name}`;
						setCredit(name);
					}} />
				</div>

				<div className="subtitle-preview">
					<p className="subtitle" style={subtitleStyle}>Sample Subtitle: This is a sample text </p>
					<p className="credit" style={creditStyle}>Sample Credit: Made by BrainRotTok</p>
				</div>
			</div>
		</>
	)
}

export default Subtitle;
