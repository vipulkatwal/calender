import { useSelector } from "react-redux";
import { RootState } from "../store";
import { addDays, isBefore, isToday } from "date-fns";

export function useCommunications() {
	const communications = useSelector(
		(state: RootState) => state.communications.communications
	);
	const companies = useSelector(
		(state: RootState) => state.companies.companies
	);

	const lastFiveCommunications = (companyId: string) => {
		return communications
			.filter((comm) => comm.companyId === companyId)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 5);
	};

	const getNextCommunicationDate = (companyId: string) => {
		const lastComm = communications
			.filter((comm) => comm.companyId === companyId)
			.sort(
				(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
			)[0];

		if (!lastComm) return null;

		const company = companies.find((c) => c.id === companyId);
		if (!company) return null;

		return addDays(new Date(lastComm.date), company.communicationPeriodicity);
	};

	const getCommunicationStatus = (companyId: string) => {
		const nextDate = getNextCommunicationDate(companyId);
		if (!nextDate) return "none";

		if (isBefore(nextDate, new Date())) return "overdue";
		if (isToday(nextDate)) return "due";
		return "upcoming";
	};

	return {
		lastFiveCommunications,
		getNextCommunicationDate,
		getCommunicationStatus,
		communications,
		companies,
	};
}
