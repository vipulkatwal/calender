// Import necessary dependencies
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { addCommunication } from "../../store/slices/communicationsSlice";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { showToast } from "../common/Toast";
import { CommunicationType } from "../../types";

// Props interface for CommunicationModal component
interface CommunicationModalProps {
	isOpen: boolean;
	onClose: () => void;
	selectedCompanies?: string[];
	initialDate?: string;
	onCommunicationAdded?: () => void;
}

/**
 * Modal component for logging communications with companies
 * Handles both single and bulk communication logging
 */
export default function CommunicationModal({
	isOpen,
	onClose,
	selectedCompanies = [],
	initialDate,
	onCommunicationAdded,
}: CommunicationModalProps) {
	const dispatch = useDispatch();
	// State for controlling modal steps (company selection vs details entry)
	const [step, setStep] = useState<"company" | "details">("company");
	const [selectedCompanyIds, setSelectedCompanyIds] =
		useState<string[]>(selectedCompanies);

	// Get communication methods and companies from Redux store
	const methods = useSelector(
		(state: RootState) => state.communicationMethods.methods
	);
	const companies = useSelector(
		(state: RootState) => state.companies.companies
	);

	// Update selected companies when prop changes
	useEffect(() => {
		setSelectedCompanyIds(selectedCompanies);
	}, [selectedCompanies]);

	// Form data state for communication details
	const [formData, setFormData] = useState({
		type: "",
		notes: "",
		date: initialDate || format(new Date(), "yyyy-MM-dd"),
	});

	/**
	 * Handles form submission and creates new communication records
	 */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Create communication records for each selected company
		const newCommunications = selectedCompanyIds.map((companyId) => ({
			id: crypto.randomUUID(),
			companyId,
			type:
				(methods.find((m) => m.id === formData.type)
					?.name as CommunicationType) || "",
			date: new Date(formData.date).toISOString(),
			notes: formData.notes,
		}));

		// Dispatch actions to add communications
		newCommunications.forEach((comm) => {
			dispatch(addCommunication(comm));
		});

		// Show success message
		showToast.success(
			`Communication${
				selectedCompanyIds.length > 1 ? "s" : ""
			} logged successfully`
		);

		if (onCommunicationAdded) {
			onCommunicationAdded();
		}

		handleClose();
	};

	/**
	 * Resets modal state and closes it
	 */
	const handleClose = () => {
		setStep("company");
		setSelectedCompanyIds([]);
		setFormData({
			type: "",
			notes: "",
			date: initialDate || format(new Date(), "yyyy-MM-dd"),
		});
		onClose();
	};

	return (
		<Dialog open={isOpen} onClose={handleClose} className="relative z-50">
			{/* Modal backdrop */}
			<div className="fixed inset-0 bg-black/30" aria-hidden="true" />

			{/* Modal container */}
			<div className="fixed inset-0 flex items-center justify-center p-4">
				<Dialog.Panel className="mx-auto max-w-lg w-full rounded-xl bg-white shadow-xl">
					{/* Modal header */}
					<div className="p-6 border-b border-gray-100">
						<Dialog.Title className="text-lg font-semibold text-gray-900">
							{step === "company" ? "Select Company" : "Log Communication"}
						</Dialog.Title>
						<Dialog.Description className="mt-1 text-sm text-gray-500">
							{step === "company"
								? "Choose the company you want to communicate with"
								: "Record details of your communication"}
						</Dialog.Description>
					</div>

					{/* Modal content with animation */}
					<AnimatePresence mode="wait">
						{step === "company" ? (
							// Company selection step
							<motion.div
								key="company-selection"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="p-6"
							>
								<div className="company-select-list relative">
									{companies.map((company) => (
										<label
											key={company.id}
											className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
										>
											<input
												type="checkbox"
												checked={selectedCompanyIds.includes(company.id)}
												onChange={(e) => {
													setSelectedCompanyIds(
														e.target.checked
															? [...selectedCompanyIds, company.id]
															: selectedCompanyIds.filter(
																	(id) => id !== company.id
															  )
													);
												}}
												className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
											/>
											<div className="ml-3">
												<div className="font-medium text-gray-900">
													{company.name}
												</div>
												<div className="text-sm text-gray-500">
													{company.location}
												</div>
											</div>
										</label>
									))}
								</div>

								{/* Navigation buttons */}
								<div className="mt-6 flex justify-end gap-3">
									<button onClick={handleClose} className="btn-secondary">
										Cancel
									</button>
									<button
										onClick={() => setStep("details")}
										disabled={selectedCompanyIds.length === 0}
										className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Next
									</button>
								</div>
							</motion.div>
						) : (
							// Communication details form step
							<motion.form
								key="communication-details"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								onSubmit={handleSubmit}
								className="p-6 space-y-6"
							>
								{/* Communication type selection */}
								<div>
									<label className="label">Communication Type</label>
									<select
										value={formData.type}
										onChange={(e) =>
											setFormData({ ...formData, type: e.target.value })
										}
										className="input-field"
										required
									>
										<option value="">Select a type...</option>
										{methods.map((method) => (
											<option key={method.id} value={method.id}>
												{method.name}
											</option>
										))}
									</select>
								</div>

								{/* Date selection */}
								<div>
									<label className="label">Date</label>
									<input
										type="date"
										value={formData.date}
										onChange={(e) =>
											setFormData({ ...formData, date: e.target.value })
										}
										className="input-field"
										required
									/>
								</div>

								{/* Notes input */}
								<div>
									<label className="label">Notes</label>
									<textarea
										value={formData.notes}
										onChange={(e) =>
											setFormData({ ...formData, notes: e.target.value })
										}
										className="input-field"
										rows={3}
										required
										placeholder="Enter communication details..."
									/>
								</div>

								{/* Form submission buttons */}
								<div className="flex justify-end gap-3">
									<button
										type="button"
										onClick={() => setStep("company")}
										className="btn-secondary"
									>
										Back
									</button>
									<button type="submit" className="btn-primary">
										Log Communication
									</button>
								</div>
							</motion.form>
						)}
					</AnimatePresence>
				</Dialog.Panel>
			</div>
		</Dialog>
	);
}
