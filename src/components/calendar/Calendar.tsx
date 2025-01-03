// Import necessary dependencies
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format, addDays } from "date-fns";
import CommunicationModal from "../communications/CommunicationModal";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
// import { EventInput } from "@fullcalendar/core";

export default function Calendar() {
	// State for managing selected date, companies and modal visibility
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
	const [showCommunicationModal, setShowCommunicationModal] = useState(false);

	// Get communications and companies data from Redux store
	const communications = useSelector(
		(state: RootState) => state.communications.communications
	);
	const companies = useSelector(
		(state: RootState) => state.companies.companies
	);

	/**
	 * Returns color scheme for different types of communications
	 * @param type - The type of communication
	 * @returns Object containing background, border and optional text colors
	 */
	function getEventColor(type: string) {
		const colors: Record<
			string,
			{ background: string; border: string; text?: string }
		> = {
			"LinkedIn Post": {
				background: "rgb(59 130 246 / 0.8)",
				border: "rgb(37 99 235)",
			},
			"LinkedIn Message": {
				background: "rgb(16 185 129 / 0.8)",
				border: "rgb(5 150 105)",
			},
			Email: {
				background: "rgb(139 92 246 / 0.8)",
				border: "rgb(124 58 237)",
			},
			"Phone Call": {
				background: "rgb(236 72 153 / 0.8)",
				border: "rgb(219 39 119)",
			},
			Due: {
				background: "#FEF3C7",
				border: "#F59E0B",
				text: "#92400E",
			},
			default: {
				background: "rgb(107 114 128 / 0.8)",
				border: "rgb(75 85 99)",
			},
		};

		return colors[type] || colors.default;
	}

	// Combine regular communications and upcoming due dates into calendar events
	const events = [
		// Map existing communications to calendar events
		...communications.map((comm) => {
			const company = companies.find((c) => c.id === comm.companyId);
			const colors = getEventColor(
				comm.type as
					| "LinkedIn Post"
					| "LinkedIn Message"
					| "Email"
					| "Phone Call"
					| "Due"
			);
			return {
				id: comm.id,
				title: `${company?.name} - ${comm.type}`,
				start: new Date(comm.date),
				backgroundColor: colors.background,
				borderColor: colors.border,
				textColor: "text" in colors ? colors.text : "#FFFFFF",
				extendedProps: {
					type: comm.type,
					notes: comm.notes,
					companyId: comm.companyId,
					isUpcoming: false,
				},
			};
		}),
		// Generate upcoming due communications based on company periodicity
		...companies
			.map((company) => {
				// Find the most recent communication for this company
				const lastComm = communications
					.filter((c) => c.companyId === company.id)
					.sort(
						(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
					)[0];

				if (lastComm) {
					const nextDate = addDays(
						new Date(lastComm.date),
						company.communicationPeriodicity
					);

					// Check if the communication is due today
					const isDueToday = format(nextDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

					return {
						id: `upcoming-${company.id}`,
						title: `${company.name} - ${isDueToday ? 'Due' : lastComm.type}`,
						start: nextDate,
						backgroundColor: isDueToday ? "#FEF3C7" : getEventColor(lastComm.type).background,
						borderColor: isDueToday ? "#F59E0B" : getEventColor(lastComm.type).border,
						textColor: isDueToday ? "#92400E" : "#FFFFFF",
						extendedProps: {
							isUpcoming: true,
							companyId: company.id,
							type: isDueToday ? 'Due' : lastComm.type,
						},
					};
				}
				return null;
			})
			.filter(Boolean),
	];

	/**
	 * Handle click events on calendar events
	 * Shows communication modal for upcoming events
	 * Shows toast notification for past events
	 */
	const handleEventClick = (info: any) => {
		const { event } = info;
		if (event.extendedProps.isUpcoming) {
			setSelectedDate(event.start);
			setSelectedCompanies([event.extendedProps.companyId]);
			setShowCommunicationModal(true);
		} else {
			toast.info(
				<div>
					<p className="font-medium">{event.title}</p>
					<p className="text-sm mt-1">{event.extendedProps.notes}</p>
					<p className="text-xs text-gray-500 mt-1">
						{format(event.start, "PPP")}
					</p>
				</div>,
				{ autoClose: 5000 }
			);
		}
	};

	/**
	 * Handle clicks on calendar dates
	 * Opens communication modal for the selected date
	 */
	const handleDateClick = (info: { date: Date }) => {
		setSelectedDate(info.date);
		setSelectedCompanies([]);
		setShowCommunicationModal(true);
	};

	return (
		<div className="space-y-8">
			{/* Header section with title and add button */}
			<div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-xl p-4 sm:p-8 shadow-2xl backdrop-blur-sm border border-white/10">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className="text-white">
						<h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
							Calendar
						</h1>
						<p className="mt-2 text-sm sm:text-base text-primary-100/90">
							View and manage communications schedule
						</p>
					</div>
					<div className="flex items-center gap-2">
						<motion.button
							whileHover={{
								scale: 1.02,
								backgroundColor: "rgba(255, 255, 255, 0.15)",
							}}
							whileTap={{ scale: 0.98 }}
							onClick={() => setShowCommunicationModal(true)}
							className="w-full sm:w-auto bg-white/10 text-white px-3 sm:px-4 py-2 rounded-lg
									 border border-white/20 backdrop-blur-sm shadow-lg
									 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
						>
							<svg
								className="h-4 w-4 sm:h-5 sm:w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
							<span className="hidden sm:inline">Schedule Communication</span>
							<span className="sm:hidden">Schedule</span>
						</motion.button>
					</div>
				</div>

				{/* Legend for event types */}
				<div className="mt-4 sm:mt-8 grid grid-cols-2 sm:flex flex-wrap gap-3 sm:gap-6">
					{[
						{ label: "LinkedIn Post", color: "bg-blue-500" },
						{ label: "LinkedIn Message", color: "bg-green-500" },
						{ label: "Email", color: "bg-purple-500" },
						{ label: "Phone Call", color: "bg-pink-500" },
						{ label: "Due", color: "bg-amber-500" },
					].map(({ label, color }) => (
						<div key={label} className="flex items-center gap-2">
							<span
								className={`w-2 h-2 sm:w-3 sm:h-3 rounded-md ${color} shadow-lg ${color.replace(
									"bg",
									"ring"
								)}/30 ring-2`}
							/>
							<span className="text-xs sm:text-sm font-medium text-white/90">
								{label}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Calendar container */}
			<div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100/50 backdrop-blur-sm">
				<div className="p-2 sm:p-6">
					<div className="premium-calendar">
						<FullCalendar
							plugins={[dayGridPlugin, interactionPlugin]}
							initialView="dayGridMonth"
							events={events.filter(
								(event): event is NonNullable<typeof event> => event !== null
							)}
							headerToolbar={{
								left: "title",
								right: "prev,next today",
							}}
							height="auto"
							contentHeight="auto"
							aspectRatio={1.35}
							eventClick={handleEventClick}
							dateClick={handleDateClick}
							eventContent={(eventInfo) => (
								<motion.div
									whileHover={{ scale: 1.02 }}
									className="w-full px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs
											 font-medium truncate shadow-sm border border-black/5"
									style={{
										backgroundColor: eventInfo.backgroundColor,
										color: eventInfo.textColor,
									}}
								>
									{eventInfo.event.title}
								</motion.div>
							)}
							slotEventOverlap={false}
							eventDisplay="list-item"
							views={{
								dayGridMonth: {
									titleFormat: { month: "long", year: "numeric" },
									dayHeaderFormat: { weekday: "short" },
								},
							}}
							themeSystem="standard"
							dayMaxEvents={3}
							moreLinkContent={(args) => (
								<div className="text-xs text-blue-600 font-medium">
									+{args.num} more
								</div>
							)}
						/>
					</div>
				</div>
			</div>

			{/* Communication modal */}
			<CommunicationModal
				isOpen={showCommunicationModal}
				onClose={() => {
					setShowCommunicationModal(false);
					setSelectedDate(null);
					setSelectedCompanies([]);
				}}
				selectedCompanies={selectedCompanies}
				initialDate={
					selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined
				}
			/>
		</div>
	);
}
