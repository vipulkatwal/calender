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
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
	const [showCommunicationModal, setShowCommunicationModal] = useState(false);

	const communications = useSelector(
		(state: RootState) => state.communications.communications
	);
	const companies = useSelector(
		(state: RootState) => state.companies.companies
	);

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

	// Map communications to calendar events
	const events = [
		// Regular communications
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
		// Upcoming/Due communications
		...companies
			.map((company) => {
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
					return {
						id: `upcoming-${company.id}`,
						title: `${company.name} - Due`,
						start: nextDate,
						backgroundColor: "#FEF3C7", // amber-100
						borderColor: "#F59E0B", // amber-500
						textColor: "#92400E", // amber-800
						extendedProps: {
							isUpcoming: true,
							companyId: company.id,
							type: "Due",
						},
					};
				}
				return null;
			})
			.filter(Boolean),
	];

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

	const handleDateClick = (info: { date: Date }) => {
		setSelectedDate(info.date);
		setSelectedCompanies([]);
		setShowCommunicationModal(true);
	};

	return (
		<div className="space-y-8">
			<div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-xl p-8 shadow-xl">
				<div className="sm:flex sm:items-center sm:justify-between">
					<div className="text-white">
						<h1 className="text-2xl font-semibold">Calendar</h1>
						<p className="mt-2 text-primary-100">
							View and manage communications schedule
						</p>
					</div>
					<div className="mt-4 sm:mt-0 flex items-center gap-4">
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => setShowCommunicationModal(true)}
							className="bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20
									 hover:bg-white/20 transition-all duration-200 flex items-center gap-2"
						>
							<svg
								className="h-5 w-5"
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
							Schedule Communication
						</motion.button>
					</div>
				</div>

				<div className="mt-8 flex flex-wrap gap-6">
					{[
						{ label: "LinkedIn Post", color: "bg-blue-500" },
						{ label: "LinkedIn Message", color: "bg-green-500" },
						{ label: "Email", color: "bg-purple-500" },
						{ label: "Phone Call", color: "bg-pink-500" },
						{ label: "Due", color: "bg-amber-500" },
					].map(({ label, color }) => (
						<div key={label} className="flex items-center gap-2">
							<span
								className={`w-3 h-3 rounded-md ${color} ${color.replace(
									"bg",
									"ring"
								)}/30`}
							/>
							<span className="text-sm font-medium text-white/90">{label}</span>
						</div>
					))}
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-100">
				<div className="p-6">
					<FullCalendar
						plugins={[dayGridPlugin, interactionPlugin]}
						initialView="dayGridMonth"
						events={events.filter(
							(event): event is NonNullable<typeof event> => event !== null
						)}
						headerToolbar={{
							left: "prev,next today",
							center: "title",
							right: "",
						}}
						height="800px"
						eventClick={handleEventClick}
						dateClick={handleDateClick}
						eventContent={(eventInfo) => (
							<motion.div
								className="w-full px-2 py-1 rounded-md text-xs font-medium"
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
					/>
				</div>
			</div>

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
