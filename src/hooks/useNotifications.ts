import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { syncNotifications } from "../store/slices/notificationsSlice";
import { format, isToday, isBefore } from "date-fns";
import { Notification } from "../types";

// Custom hook to manage notifications related to company communications
export function useNotifications() {
	const dispatch = useDispatch();
	// Get required data from Redux store
	const communications = useSelector(
		(state: RootState) => state.communications.communications
	);
	const companies = useSelector(
		(state: RootState) => state.companies.companies
	);
	const notifications = useSelector(
		(state: RootState) => state.notifications.notifications
	);

	// Calculate the next scheduled communication date for a company
	const getNextCommunicationDate = (companyId: string) => {
		// Get communications for this company, sorted by most recent first
		const companyCommunications = communications
			.filter((c) => c.companyId === companyId)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		if (companyCommunications.length === 0) return null;

		// Find the company to get its communication frequency
		const company = companies.find((c) => c.id === companyId);
		if (!company) return null;

		// Calculate next date based on last communication and periodicity
		const lastComm = companyCommunications[0];
		const nextDate = new Date(lastComm.date);
		nextDate.setDate(nextDate.getDate() + company.communicationPeriodicity);

		return nextDate;
	};

	// Effect to generate and sync notifications based on communication schedules
	useEffect(() => {
		const newNotifications: Notification[] = [];

		// Check each company's communication status
		companies.forEach((company) => {
			const nextDate = getNextCommunicationDate(company.id);
			if (!nextDate) return;

			// Check for overdue communications
			if (isBefore(nextDate, new Date()) && !isToday(nextDate)) {
				newNotifications.push({
					id: `overdue-${company.id}`,
					type: "overdue",
					title: "Overdue Communication",
					message: `Communication with ${
						company.name
					} is overdue. Last scheduled date was ${format(nextDate, "PPP")}`,
					companyId: company.id,
					isRead: false,
					createdAt: new Date().toISOString(),
				});
			}

			// Check for communications due today
			if (isToday(nextDate)) {
				newNotifications.push({
					id: `due-${company.id}`,
					type: "due",
					title: "Communication Due Today",
					message: `Communication with ${company.name} is due today`,
					companyId: company.id,
					isRead: false,
					createdAt: new Date().toISOString(),
				});
			}
		});

		// Update notifications in Redux store
		dispatch(syncNotifications(newNotifications));
	}, [companies, communications, dispatch]);

	// Calculate number of unread notifications
	const unreadCount = notifications.filter((n) => !n.isRead).length;

	// Return hook data and functions
	return {
		notifications,
		unreadCount,
		getNextCommunicationDate,
	};
}
