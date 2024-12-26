import { CommunicationStyle, CommunicationType } from "../types";

export const communicationStyles: CommunicationStyle = {
	[CommunicationType["LinkedIn Post"]]: {
		background: "rgb(59 130 246 / 0.8)", // blue-500
		border: "rgb(37 99 235)", // blue-600
		text: "white",
	},
	[CommunicationType["LinkedIn Message"]]: {
		background: "rgb(16 185 129 / 0.8)", // green-500
		border: "rgb(5 150 105)", // green-600
		text: "white",
	},
	[CommunicationType.Email]: {
		background: "rgb(139 92 246 / 0.8)", // purple-500
		border: "rgb(124 58 237)", // purple-600
		text: "white",
	},
	[CommunicationType["Phone Call"]]: {
		background: "rgb(236 72 153 / 0.8)", // pink-500
		border: "rgb(219 39 119)", // pink-600
		text: "white",
	},
	[CommunicationType.Other]: {
		background: "rgb(107 114 128 / 0.8)", // gray-500
		border: "rgb(75 85 99)", // gray-600
		text: "white",
	},
	Due: {
		background: "#FEF3C7", // amber-100
		border: "#F59E0B", // amber-500
		text: "#92400E", // amber-800
	},
};

export const getEventColor = (type: string): CommunicationColors => {
	return (
		communicationStyles[type] || communicationStyles[CommunicationType.Other]
	);
};
