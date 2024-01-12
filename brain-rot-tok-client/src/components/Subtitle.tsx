import { ChromePicker } from 'react-color';

interface SubtitleProps {
	color: string;
	setColor: React.Dispatch<React.SetStateAction<string>>;
	size: number;
	setSize: React.Dispatch<React.SetStateAction<number>>;
	font: string;
	setFont: React.Dispatch<React.SetStateAction<string>>;
	fontFamily: string[];
}


function Subtitle({ color, setColor, size, setSize, font, setFont, fontFamily }: SubtitleProps) {

	const subtitleStyle = {
		color: color,
		fontSize: `${size}px`,
		fontFamily: font
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
					<input type="number" id="size" name="size" defaultValue="24" min="1" max="50" onChange={(e) => {
						const size = e.target.value;
						const subtitle = document.querySelector(".subtitle") as HTMLElement;
						subtitle.style.fontSize = `${size}px`;
						setSize(parseInt(size));
					}} />

					<label htmlFor="font">Subtitle Font</label>
					<select id="font" name="font">
						{fontFamily.map((font) => {
							return <option value={font} key={font} onClick={(e) => {
								const subtitle = document.querySelector(".subtitle") as HTMLElement;
								subtitle.style.fontFamily = font;
								setFont(font);
							}}>{font}</option>
						})}
					</select>
				</div>
				<p className="subtitle" style={subtitleStyle}> This is a sample text </p>
			</div>
		</>
	)
}

export default Subtitle;
