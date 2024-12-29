// Import necessary dependencies
import { motion } from "framer-motion";
import { getEventColor } from "../../utils/communicationStyles";
import { CommunicationType } from "../../types";

// Props interface for the CommunicationBadge component
interface CommunicationBadgeProps {
	type: CommunicationType; // Type of communication (e.g. email, phone, meeting)
	showTooltip?: boolean; // Whether to show tooltip on hover
	tooltipContent?: string; // Content to display in tooltip
}

/**
 * Badge component that displays the type of communication
 * with appropriate styling and optional tooltip
 */
export default function CommunicationBadge({
	type,
	showTooltip = false,
	tooltipContent,
}: CommunicationBadgeProps) {
	// Get color scheme based on communication type
	const colors = getEventColor(type);

	return (
		<motion.div
			// Add hover animation only if tooltip is enabled
			whileHover={{ scale: showTooltip ? 1.05 : 1 }}
			className={`inline-flex items-center rounded-full text-xs font-medium ${
				showTooltip ? "cursor-help" : ""
			}`}
			// Apply color scheme from utils
			style={{
				backgroundColor: colors.background,
				borderColor: colors.border,
				color: colors.text,
				padding: "0.25rem 0.75rem",
			}}
			title={tooltipContent} // Native HTML tooltip
		>
			{type}
		</motion.div>
	);
}
