import { CommunicationType } from "../types";

/**
 * Returns color styles for different communication event types
 * Used for visual differentiation in calendar and timeline views
 * @param type - The type of communication event
 * @returns Object containing background, border and text colors
 */
export function getEventColor(type: CommunicationType) {
	// Define color schemes for each communication type
	// Using rgba for background to allow transparency
	// Using solid rgb for borders
	const colors: Record<
		CommunicationType | "default",
		{ background: string; border: string; text: string }
	> = {
		// Blue theme for LinkedIn posts
		"LinkedIn Post": {
			background: "rgba(59, 130, 246, 0.8)", // Blue with opacity
			border: "rgb(37, 99, 235)",
			text: "white",
		},
		// Green theme for LinkedIn messages
		"LinkedIn Message": {
			background: "rgba(16, 185, 129, 0.8)", // Green with opacity
			border: "rgb(5, 150, 105)",
			text: "white",
		},
		// Purple theme for emails
		Email: {
			background: "rgba(139, 92, 246, 0.8)", // Purple with opacity
			border: "rgb(124, 58, 237)",
			text: "white",
		},
		// Pink theme for phone calls
		"Phone Call": {
			background: "rgba(236, 72, 153, 0.8)", // Pink with opacity
			border: "rgb(219, 39, 119)",
			text: "white",
		},
		// Gray theme for other communication types
		Other: {
			background: "rgba(107, 114, 128, 0.8)", // Gray with opacity
			border: "rgb(75, 85, 99)",
			text: "white",
		},
		// Default fallback theme
		default: {
			background: "rgba(107, 114, 128, 0.8)", // Gray with opacity
			border: "rgb(75, 85, 99)",
			text: "white",
		},
	};

	// Return the color scheme for the specified type, or default if type not found
	return colors[type] || colors.default;
}
