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
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	CalendarDaysIcon,
} from "@heroicons/react/24/outline";

export default function Calendar() {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
	const [showCommunicationModal, setShowCommunicationModal] = useState(false);
	const [currentDate, setCurrentDate] = useState(new Date());

	const communications = useSelector(
		(state: RootState) => state.communications.communications
	);
	const companies = useSelector(
		(state: RootState) => state.companies.companies
	);

	function getEventColor(type: string) {
		const colors = {
			"LinkedIn Post": {
				background: "rgb(59 130 246 / 0.8)", // blue-500
				border: "rgb(37 99 235)", // blue-600
			},
			"LinkedIn Message": {
				background: "rgb(16 185 129 / 0.8)", // green-500
				border: "rgb(5 150 105)", // green-600
			},
			Email: {
				background: "rgb(139 92 246 / 0.8)", // purple-500
				border: "rgb(124 58 237)", // purple-600
			},
			"Phone Call": {
				background: "rgb(236 72 153 / 0.8)", // pink-500
				border: "rgb(219 39 119)", // pink-600
			},
			Due: {
				background: "#FEF3C7", // amber-100
				border: "#F59E0B", // amber-500
				text: "#92400E", // amber-800
			},
			default: {
				background: "rgb(107 114 128 / 0.8)", // gray-500
				border: "rgb(75 85 99)", // gray-600
			},
		};

		return colors[type] || colors.default;
	}

	// Map communications to calendar events
	const events = [
		// Regular communications
		...communications.map((comm) => {
			const company = companies.find((c) => c.id === comm.companyId);
			const colors = getEventColor(comm.type);
			return {
				id: comm.id,
				title: `${company?.name} - ${comm.type}`,
				start: new Date(comm.date),
				backgroundColor: colors.background,
				borderColor: colors.border,
				textColor: colors.text || "#FFFFFF",
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

	const customHeaderContent = {
		left: "title",
		center: "",
		right: "prev,today,next",
	};

	const headerToolbar = {
		start: "",
		center: "",
		end: "",
	};

	return (
		<div className="space-y-6">
			{/* Custom Calendar Header */}
			<div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-4">
				<div className="flex items-center gap-3">
					<CalendarDaysIcon className="h-8 w-8 text-primary-600" />
					<div>
						<h2 className="text-2xl font-bold text-gray-900">
							{format(currentDate, "MMMM yyyy")}
						</h2>
						<p className="text-sm text-gray-500">
							View and manage communications schedule
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<div className="flex items-center bg-gray-100 rounded-lg p-1">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200"
							onClick={() => {
								const calendarApi = document.querySelector(".fc")?.getApi();
								calendarApi?.prev();
								setCurrentDate(calendarApi?.getDate() || new Date());
							}}
						>
							<ChevronLeftIcon className="h-5 w-5 text-gray-600" />
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="px-3 py-1.5 rounded-md text-sm font-medium hover:bg-white hover:shadow-sm transition-all duration-200"
							onClick={() => {
								const calendarApi = document.querySelector(".fc")?.getApi();
								calendarApi?.today();
								setCurrentDate(calendarApi?.getDate() || new Date());
							}}
						>
							Today
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200"
							onClick={() => {
								const calendarApi = document.querySelector(".fc")?.getApi();
								calendarApi?.next();
								setCurrentDate(calendarApi?.getDate() || new Date());
							}}
						>
							<ChevronRightIcon className="h-5 w-5 text-gray-600" />
						</motion.button>
					</div>
				</div>
			</div>

			{/* Calendar Component */}
			<div className="bg-white rounded-xl shadow-sm p-4">
				<FullCalendar
					plugins={[dayGridPlugin, interactionPlugin]}
					initialView="dayGridMonth"
					headerToolbar={headerToolbar}
					customButtons={{
						prev: {
							text: "",
						},
						next: {
							text: "",
						},
						today: {
							text: "",
						},
					}}
					dayMaxEvents={3}
					events={events}
					eventClick={handleEventClick}
					dateClick={(info) => {
						setSelectedDate(new Date(info.dateStr));
						setSelectedCompanies([]);
						setShowCommunicationModal(true);
					}}
					eventContent={(eventInfo) => (
						<motion.div
							whileHover={{ scale: 1.02 }}
							className="w-full h-full"
							style={{
								backgroundColor: eventInfo.backgroundColor,
								borderColor: eventInfo.borderColor,
								color: eventInfo.textColor,
								padding: "0.25rem 0.5rem",
								borderRadius: "0.375rem",
								boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
							}}
							title={eventInfo.event.extendedProps.notes || "Click to schedule"}
						>
							<div className="text-xs font-medium truncate">
								{eventInfo.event.title}
							</div>
						</motion.div>
					)}
					eventClassNames="!border-0 !bg-transparent !p-1"
				/>
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
