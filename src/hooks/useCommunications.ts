import { useSelector } from "react-redux";
import { RootState } from "../store";
import { addDays, isBefore, isToday } from "date-fns";

// Custom hook to manage communication-related functionality
export function useCommunications() {
	// Get communications and companies data from Redux store
	const communications = useSelector(
		(state: RootState) => state.communications.communications
	);
	const companies = useSelector(
		(state: RootState) => state.companies.companies
	);

	// Calculate the next scheduled communication date for a company
	const getNextCommunicationDate = (companyId: string) => {
		// Get communications for this company, sorted by most recent first
		const companyCommunications = communications
			.filter((comm) => comm.companyId === companyId)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		if (companyCommunications.length === 0) return null;

		// Find the company to get its communication frequency
		const company = companies.find((c) => c.id === companyId);
		if (!company) return null;

		// Calculate next date based on last communication and periodicity
		const lastComm = companyCommunications[0];
		return addDays(new Date(lastComm.date), company.communicationPeriodicity);
	};

	// Determine the status of communications with a company
	const getCommunicationStatus = (companyId: string) => {
		const nextDate = getNextCommunicationDate(companyId);
		if (!nextDate) return "none";

		// Check if communication is overdue (past due date and not today)
		if (isBefore(nextDate, new Date()) && !isToday(nextDate)) {
			return "overdue";
		}
		// Check if communication is due today
		if (isToday(nextDate)) {
			return "due";
		}
		// Communication is scheduled for a future date
		return "upcoming";
	};

	// Get the 5 most recent communications for a company
	const lastFiveCommunications = (companyId: string) => {
		return communications
			.filter((comm) => comm.companyId === companyId)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 5);
	};

	// Return all functions and data needed by components
	return {
		lastFiveCommunications,
		getNextCommunicationDate,
		getCommunicationStatus,
		communications,
		companies,
	};
}
