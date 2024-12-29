import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { format, isToday } from "date-fns";
import CommunicationModal from "../communications/CommunicationModal";
import CommunicationHistory from "./CommunicationHistory";
import { Company } from "../../types";

export default function CompanyList() {
	const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
	const [showCommunicationModal, setShowCommunicationModal] = useState(false);

	const companies = useSelector(
		(state: RootState) => state.companies.companies
	);
	const communications = useSelector(
		(state: RootState) => state.communications.communications
	);

	const getNextCommunicationDate = (company: Company) => {
		const lastComm = communications
			.filter((c) => c.companyId === company.id)
			.sort(
				(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
			)[0];

		if (!lastComm) return null;

		const nextDate = new Date(lastComm.date);
		nextDate.setDate(nextDate.getDate() + company.communicationPeriodicity);

		return {
			date: nextDate,
			isOverdue: nextDate < new Date() && !isToday(nextDate),
			isDueToday: isToday(nextDate),
		};
	};

	const toggleCompanySelection = (companyId: string) => {
		setSelectedCompanies((prev) =>
			prev.includes(companyId)
				? prev.filter((id) => id !== companyId)
				: [...prev, companyId]
		);
	};

	return (
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="sm:flex sm:items-center sm:justify-between">
				<div className="sm:flex-auto">
					<h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
				</div>
				<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
					<button
						type="button"
						onClick={() => setShowCommunicationModal(true)}
						disabled={selectedCompanies.length === 0}
						className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
					>
						Log Communication
					</button>
				</div>
			</div>

			<div className="mt-8 flow-root">
				<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle">
						<table className="min-w-full divide-y divide-gray-300">
							<thead>
								<tr>
									<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										<input
											type="checkbox"
											checked={selectedCompanies.length === companies.length}
											onChange={(e) =>
												setSelectedCompanies(
													e.target.checked ? companies.map((c) => c.id) : []
												)
											}
											className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
										/>
									</th>
									<th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
										Company Name
									</th>
									<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										Last Communications
									</th>
									<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										Next Communication
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{companies.map((company) => {
									const nextComm = getNextCommunicationDate(company);
									const isOverdue = nextComm?.isOverdue;
									const isDueToday = nextComm?.isDueToday;

									return (
										<tr
											key={company.id}
											className={
												isOverdue
													? "bg-red-50"
													: isDueToday
													? "bg-yellow-50"
													: undefined
											}
										>
											<td className="whitespace-nowrap px-3 py-4 text-sm">
												<input
													type="checkbox"
													checked={selectedCompanies.includes(company.id)}
													onChange={() => toggleCompanySelection(company.id)}
													className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
												/>
											</td>
											<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
												{company.name}
											</td>
											<td className="px-3 py-4 text-sm text-gray-500">
												<CommunicationHistory companyId={company.id} />
											</td>
											<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
												{nextComm && (
													<span
														className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
															isOverdue
																? "bg-red-50 text-red-700 ring-red-700/10"
																: isDueToday
																? "bg-yellow-50 text-yellow-700 ring-yellow-700/10"
																: "bg-green-50 text-green-700 ring-green-700/10"
														}`}
													>
														{format(nextComm.date, "MMM d, yyyy")}
													</span>
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<CommunicationModal
				isOpen={showCommunicationModal}
				onClose={() => setShowCommunicationModal(false)}
				selectedCompanies={selectedCompanies}
			/>
		</div>
	);
}
