import { useSelector } from "react-redux";
import { RootState } from "../store";
import { format, isToday, isBefore } from "date-fns";

export function useNotifications() {
	const communications = useSelector(
		(state: RootState) => state.communications.communications
	);
	const companies = useSelector(
		(state: RootState) => state.companies.companies
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

	const overdueCompanies = companies.filter((company) => {
		const nextDate = getNextCommunicationDate(company.id);
		return nextDate && isBefore(nextDate, new Date()) && !isToday(nextDate);
	});

	const dueTodayCompanies = companies.filter((company) => {
		const nextDate = getNextCommunicationDate(company.id);
		return nextDate && isToday(nextDate);
	});

	return {
		overdueCount: overdueCompanies.length,
		dueTodayCount: dueTodayCompanies.length,
		overdueCompanies,
		dueTodayCompanies,
		getNextCommunicationDate,
	};
}
