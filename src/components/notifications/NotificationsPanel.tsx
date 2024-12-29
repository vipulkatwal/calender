// Import necessary dependencies
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { format, isToday, isBefore } from "date-fns";

/**
 * NotificationsPanel component
 * Displays notifications for overdue and due today communications
 */
export default function NotificationsPanel() {
	// Get communications and companies data from Redux store
	const communications = useSelector(
		(state: RootState) => state.communications.communications
	);
	const companies = useSelector(
		(state: RootState) => state.companies.companies
	);

	/**
	 * Calculate the next communication date for a company
	 * @param companyId - ID of the company
	 * @returns Date object of next communication or null if no communications exist
	 */
	const getNextCommunicationDate = (companyId: string) => {
		// Get company's communications sorted by date (newest first)
		const companyCommunications = communications
			.filter((c) => c.companyId === companyId)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		if (companyCommunications.length === 0) return null;

		const company = companies.find((c) => c.id === companyId);
		if (!company) return null;

		// Calculate next date based on last communication and periodicity
		const lastComm = companyCommunications[0];
		const nextDate = new Date(lastComm.date);
		nextDate.setDate(nextDate.getDate() + company.communicationPeriodicity);

		return nextDate;
	};

	// Filter companies that have overdue communications
	const overdueCompanies = companies.filter((company) => {
		const nextDate = getNextCommunicationDate(company.id);
		return nextDate && isBefore(nextDate, new Date()) && !isToday(nextDate);
	});

	// Filter companies that have communications due today
	const dueTodayCompanies = companies.filter((company) => {
		const nextDate = getNextCommunicationDate(company.id);
		return nextDate && isToday(nextDate);
	});

	return (
		<div className="bg-white shadow rounded-lg p-6 space-y-6">
			<h2 className="text-lg font-medium text-gray-900">Notifications</h2>

			<div className="space-y-6">
				{/* Overdue communications section */}
				<div>
					<h3 className="text-sm font-medium text-red-600 mb-2">
						Overdue ({overdueCompanies.length})
					</h3>
					<div className="space-y-2">
						{overdueCompanies.map((company) => {
							const nextDate = getNextCommunicationDate(company.id);
							return (
								<div
									key={company.id}
									className="bg-red-50 p-3 rounded-md text-sm text-red-700"
								>
									<p className="font-medium">{company.name}</p>
									<p className="text-xs">
										Due {format(nextDate!, "MMM d, yyyy")}
									</p>
								</div>
							);
						})}
					</div>
				</div>

				{/* Due today communications section */}
				<div>
					<h3 className="text-sm font-medium text-yellow-600 mb-2">
						Due Today ({dueTodayCompanies.length})
					</h3>
					<div className="space-y-2">
						{dueTodayCompanies.map((company) => (
							<div
								key={company.id}
								className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-700"
							>
								<p className="font-medium">{company.name}</p>
								<p className="text-xs">Communication due today</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
