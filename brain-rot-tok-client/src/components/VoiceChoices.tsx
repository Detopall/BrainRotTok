import { Select, SelectItem } from "@heroui/select";

interface VoiceChoicesProps {
	voice: string;
	setVoice: React.Dispatch<React.SetStateAction<string>>;
}

function VoiceChoices({ voice, setVoice }: VoiceChoicesProps) {
	const voices = [
		"af_heart",
		"af_alloy",
		"af_aoede",
		"af_bella",
		"af_jessica",
		"af_kore",
		"af_nicole",
		"af_nova",
		"af_river",
		"af_sarah",
		"af_sky",
		"am_adam",
		"am_echo",
		"am_eric",
		"am_fenrir",
		"am_liam",
		"am_michael",
		"am_onyx",
		"am_puck",
		"am_santa",
	];

	function getVoiceName(voice: string) {
		// Input: "af_heart" Output: "Female: Heart"

		return `${voice.startsWith("am") ? "Male" : "Female"}: ${voice.split("_")[1].charAt(0).toUpperCase() + voice.split("_")[1].slice(1)}`;
	}

	function getVoiceGender(voice: string) {
		return voice.split("_")[0] === "am" ? "👨" : "👩";
	}

	return (
		<div className="flex flex-col items-center justify-center space-y-4 p-6 mb-5 max-w-lg mx-auto">
			<h2 className="text-2xl font-semibold flex-auto">Select Voice</h2>
			<Select
				className="max-w-xs"
				label="Select Voice"
				defaultSelectedKeys={voices[0]}
				startContent={getVoiceGender(voice)}
				color={voice.startsWith("am") ? "primary" : "danger"}
				isRequired
			>
				{voices.map((voice) => (
					<SelectItem key={voice} value={voice} onPress={() => setVoice(voice)}>
						{getVoiceName(voice)}
					</SelectItem>
				))}
			</Select>
		</div>
	);
}

export default VoiceChoices;
