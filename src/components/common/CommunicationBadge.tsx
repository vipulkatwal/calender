import { motion } from "framer-motion";
import { getEventColor } from "../../utils/communicationStyles";

interface CommunicationBadgeProps {
	type: string;
	showTooltip?: boolean;
	tooltipContent?: string;
}

export default function CommunicationBadge({
	type,
	showTooltip = false,
	tooltipContent,
}: CommunicationBadgeProps) {
	const colors = getEventColor(type);

	return (
		<motion.div
			whileHover={{ scale: showTooltip ? 1.05 : 1 }}
			className={`inline-flex items-center rounded-full text-xs font-medium ${
				showTooltip ? "cursor-help" : ""
			}`}
			style={{
				backgroundColor: colors.background,
				borderColor: colors.border,
				color: colors.text,
				padding: "0.25rem 0.75rem",
			}}
			title={tooltipContent}
		>
			{type}
		</motion.div>
	);
}
