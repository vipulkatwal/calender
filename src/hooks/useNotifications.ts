import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { syncNotifications } from "../store/slices/notificationsSlice";
import { format, isToday, isBefore } from "date-fns";
import { Notification } from "../types";

export function useNotifications() {
	const dispatch = useDispatch();
	const communications = useSelector(
		(state: RootState) => state.communications.communications
	);
	const companies = useSelector(
		(state: RootState) => state.companies.companies
	);
	const notifications = useSelector(
		(state: RootState) => state.notifications.notifications
	);

	const getNextCommunicationDate = (companyId: string) => {
		const companyCommunications = communications
			.filter((c) => c.companyId === companyId)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		if (companyCommunications.length === 0) return null;

		const company = companies.find((c) => c.id === companyId);
		if (!company) return null;

		const lastComm = companyCommunications[0];
		const nextDate = new Date(lastComm.date);
		nextDate.setDate(nextDate.getDate() + company.communicationPeriodicity);

		return nextDate;
	};

	useEffect(() => {
		const newNotifications: Notification[] = [];

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

		// Sync notifications with current state
		dispatch(syncNotifications(newNotifications));
	}, [companies, communications, dispatch]);

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	return {
		notifications,
		unreadCount,
		getNextCommunicationDate,
	};
}
