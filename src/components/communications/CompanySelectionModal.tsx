import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { Company } from "../../types";

interface CompanySelectionModalProps {
	isOpen: boolean;
	onClose: () => void;
	companies: Company[];
	selectedCompanyIds: string[];
	onCompanySelect: (companyIds: string[]) => void;
	onNext: () => void;
}

export function CompanySelectionModal({
	isOpen,
	onClose,
	companies,
	selectedCompanyIds,
	onCompanySelect,
	onNext,
}: CompanySelectionModalProps) {
	return (
		<Dialog open={isOpen} onClose={onClose} className="relative z-50">
			<div
				className="fixed inset-0 bg-black/30 backdrop-blur-sm"
				aria-hidden="true"
			/>

			<div className="fixed inset-0 flex items-center justify-center p-4">
				<Dialog.Panel className="w-full max-w-lg bg-white rounded-xl shadow-xl">
					{/* Header */}
					<div className="p-6 border-b border-gray-100">
						<Dialog.Title className="text-lg font-semibold text-gray-900">
							Select Company
						</Dialog.Title>
						<Dialog.Description className="mt-1 text-sm text-gray-500">
							Choose the companies you want to communicate with
						</Dialog.Description>
					</div>

					{/* Company List */}
					<div className="p-6">
						<div className="space-y-3">
							{companies.map((company) => (
								<motion.label
									key={company.id}
									className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
										selectedCompanyIds.includes(company.id)
											? "border-primary-500 bg-primary-50/50"
											: "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
									}`}
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.99 }}
								>
									<input
										type="checkbox"
										checked={selectedCompanyIds.includes(company.id)}
										onChange={(e) => {
											onCompanySelect(
												e.target.checked
													? [...selectedCompanyIds, company.id]
													: selectedCompanyIds.filter((id) => id !== company.id)
											);
										}}
										className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
									/>
									<div className="ml-4 flex-1">
										<div className="flex items-center justify-between">
											<div className="text-sm font-medium text-gray-900">
												{company.name}
											</div>
											<div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
												{company.location}
											</div>
										</div>
										<div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
											<div className="flex items-center gap-1">
												<svg
													className="h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
													/>
												</svg>
												{company.emails.length} email
												{company.emails.length !== 1 ? "s" : ""}
											</div>
											<div className="flex items-center gap-1">
												<svg
													className="h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
													/>
												</svg>
												{company.phoneNumbers.length} phone
												{company.phoneNumbers.length !== 1 ? "s" : ""}
											</div>
										</div>
									</div>
								</motion.label>
							))}
						</div>
					</div>

					{/* Footer */}
					<div className="p-6 border-t border-gray-100 bg-gray-50/50">
						<div className="flex justify-end gap-3">
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={onClose}
								className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
							>
								Cancel
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={onNext}
								disabled={selectedCompanyIds.length === 0}
								className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Next
							</motion.button>
						</div>
					</div>
				</Dialog.Panel>
			</div>
		</Dialog>
	);
}
