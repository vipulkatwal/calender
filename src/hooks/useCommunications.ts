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

	const getNextCommunicationDate = (companyId: string) => {
		const companyCommunications = communications
			.filter((comm) => comm.companyId === companyId)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		if (companyCommunications.length === 0) return null;

		const company = companies.find((c) => c.id === companyId);
		if (!company) return null;

		const lastComm = companyCommunications[0];
		return addDays(new Date(lastComm.date), company.communicationPeriodicity);
	};

	const getCommunicationStatus = (companyId: string) => {
		const nextDate = getNextCommunicationDate(companyId);
		if (!nextDate) return "none";

		if (isBefore(nextDate, new Date()) && !isToday(nextDate)) {
			return "overdue";
		}
		if (isToday(nextDate)) {
			return "due";
		}
		return "upcoming";
	};

	const lastFiveCommunications = (companyId: string) => {
		return communications
			.filter((comm) => comm.companyId === companyId)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 5);
	};

	return {
		lastFiveCommunications,
		getNextCommunicationDate,
		getCommunicationStatus,
		communications,
		companies,
	};
}
