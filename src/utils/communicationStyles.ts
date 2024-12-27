import { CommunicationType } from "../types";

export function getEventColor(type: CommunicationType) {
	const colors: Record<
		CommunicationType | "default",
		{ background: string; border: string; text: string }
	> = {
		"LinkedIn Post": {
			background: "rgba(59, 130, 246, 0.8)",
			border: "rgb(37, 99, 235)",
			text: "white",
		},
		"LinkedIn Message": {
			background: "rgba(16, 185, 129, 0.8)",
			border: "rgb(5, 150, 105)",
			text: "white",
		},
		Email: {
			background: "rgba(139, 92, 246, 0.8)",
			border: "rgb(124, 58, 237)",
			text: "white",
		},
		"Phone Call": {
			background: "rgba(236, 72, 153, 0.8)",
			border: "rgb(219, 39, 119)",
			text: "white",
		},
		Other: {
			background: "rgba(107, 114, 128, 0.8)",
			border: "rgb(75, 85, 99)",
			text: "white",
		},
		default: {
			background: "rgba(107, 114, 128, 0.8)",
			border: "rgb(75, 85, 99)",
			text: "white",
		},
	};

	return colors[type] || colors.default;
}
