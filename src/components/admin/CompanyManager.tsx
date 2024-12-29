import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
	addCompany,
	updateCompany,
	deleteCompany,
} from "../../store/slices/companiesSlice";
import { Company } from "../../types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

/**
 * CompanyManager component handles the display and management of company data
 * including adding, editing, and deleting companies
 */
export default function CompanyManager() {
	const dispatch = useDispatch();
	// Get companies data from Redux store
	const companies = useSelector(
		(state: RootState) => state.companies.companies
	);

	// State for managing form visibility and data
	const [showForm, setShowForm] = useState(false);
	const [editingCompany, setEditingCompany] = useState<Company | null>(null);
	const [formData, setFormData] = useState<Omit<Company, "id">>({
		name: "",
		location: "",
		linkedinProfile: "",
		emails: [""],
		phoneNumbers: [""],
		comments: "",
		communicationPeriodicity: 14, // Default to 14 days
	});

	/**
	 * Handles form submission for both adding and updating companies
	 */
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (editingCompany) {
			// Update existing company
			dispatch(
				updateCompany({
					...formData,
					id: editingCompany.id,
				})
			);
			toast.success("Company updated successfully");
		} else {
			// Add new company
			dispatch(
				addCompany({
					...formData,
					id: crypto.randomUUID(),
				})
			);
			toast.success("Company added successfully");
		}
		// Reset form state
		setShowForm(false);
		setEditingCompany(null);
		setFormData({
			name: "",
			location: "",
			linkedinProfile: "",
			emails: [""],
			phoneNumbers: [""],
			comments: "",
			communicationPeriodicity: 14,
		});
	};

	/**
	 * Handles company deletion with confirmation
	 */
	const handleDelete = (company: Company) => {
		if (confirm("Are you sure you want to delete this company?")) {
			dispatch(deleteCompany(company.id));
			toast.success("Company deleted successfully");
		}
	};

	return (
		<div className="space-y-6">
			{/* Add Company Button */}
			<div className="flex justify-end">
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => setShowForm(true)}
					className="btn-primary"
				>
					Add Company
				</motion.button>
			</div>

			{/* Company Cards Grid */}
			<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				<AnimatePresence>
					{companies.map((company) => (
						<motion.div
							key={company.id}
							layout
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							className="group relative bg-white rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 overflow-hidden"
						>
							{/* Card Header with Actions */}
							<div className="absolute right-4 top-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
								{/* Edit Button */}
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => {
										setEditingCompany(company);
										setFormData(company);
										setShowForm(true);
									}}
									className="p-2 rounded-full bg-white shadow-md text-primary-600 hover:text-primary-700"
								>
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
											d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
										/>
									</svg>
								</motion.button>
								{/* Delete Button */}
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => handleDelete(company)}
									className="p-2 rounded-full bg-white shadow-md text-red-600 hover:text-red-700"
								>
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
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
								</motion.button>
							</div>

							{/* Card Content */}
							<div className="p-6">
								{/* Company Name and Location */}
								<div className="mb-6">
									<h3 className="text-lg font-semibold text-gray-900 mb-1">
										{company.name}
									</h3>
									<div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
										{company.location}
									</div>
								</div>

								{/* Company Details */}
								<div className="space-y-4">
									{/* LinkedIn Profile */}
									<div className="flex items-center text-sm">
										<div className="w-5 h-5 mr-3 text-primary-600">
											<svg
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
												/>
											</svg>
										</div>
										<a
											href={company.linkedinProfile}
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary-600 hover:text-primary-700 font-medium"
										>
											View LinkedIn Profile
										</a>
									</div>

									{/* Email Addresses */}
									<div className="flex items-start text-sm">
										<div className="w-5 h-5 mr-3 text-primary-600">
											<svg
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
										</div>
										<div className="flex-1">
											{company.emails.map((email) => (
												<div key={email} className="text-gray-600">
													{email}
												</div>
											))}
										</div>
									</div>

									{/* Phone Numbers */}
									<div className="flex items-start text-sm">
										<div className="w-5 h-5 mr-3 text-primary-600">
											<svg
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
										</div>
										<div className="flex-1">
											{company.phoneNumbers.map((phone) => (
												<div key={phone} className="text-gray-600">
													{phone}
												</div>
											))}
										</div>
									</div>

									{/* Communication Periodicity */}
									<div className="flex items-start text-sm">
										<div className="w-5 h-5 mr-3 text-primary-600">
											<svg
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</div>
										<div className="text-gray-600">
											Communication every {company.communicationPeriodicity}{" "}
											days
										</div>
									</div>

									{/* Comments Section */}
									{company.comments && (
										<div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
											{company.comments}
										</div>
									)}
								</div>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			{/* Company Form Modal */}
			<AnimatePresence>
				{showForm && (
					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
							{/* Modal Backdrop */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
								onClick={() => setShowForm(false)}
							/>

							{/* Modal Content */}
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
							>
								<form onSubmit={handleSubmit} className="space-y-4">
									{/* Company Name Field */}
									<div>
										<label className="label">Company Name</label>
										<input
											type="text"
											required
											value={formData.name}
											onChange={(e) =>
												setFormData({ ...formData, name: e.target.value })
											}
											className="input-field"
											placeholder="Enter company name"
										/>
									</div>

									{/* Location Field */}
									<div>
										<label className="label">Location</label>
										<input
											type="text"
											required
											value={formData.location}
											onChange={(e) =>
												setFormData({ ...formData, location: e.target.value })
											}
											className="input-field"
											placeholder="Enter company location"
										/>
									</div>

									{/* LinkedIn Profile Field */}
									<div>
										<label className="label">LinkedIn Profile</label>
										<input
											type="url"
											required
											value={formData.linkedinProfile}
											onChange={(e) =>
												setFormData({
													...formData,
													linkedinProfile: e.target.value,
												})
											}
											className="input-field"
											placeholder="https://linkedin.com/company/..."
										/>
									</div>

									{/* Email Addresses Fields */}
									<div>
										<label className="label">Email Addresses</label>
										<div className="space-y-2">
											{formData.emails.map((email, index) => (
												<div key={index} className="flex gap-2">
													<input
														type="email"
														required
														value={email}
														onChange={(e) => {
															const newEmails = [...formData.emails];
															newEmails[index] = e.target.value;
															setFormData({ ...formData, emails: newEmails });
														}}
														className="input-field"
														placeholder="Enter email address"
													/>
													<motion.button
														type="button"
														whileHover={{ scale: 1.1 }}
														whileTap={{ scale: 0.9 }}
														onClick={() => {
															if (formData.emails.length > 1) {
																const newEmails = formData.emails.filter(
																	(_, i) => i !== index
																);
																setFormData({ ...formData, emails: newEmails });
															}
														}}
														className="text-red-600 hover:text-red-700"
													>
														<svg
															className="h-5 w-5"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
															/>
														</svg>
													</motion.button>
												</div>
											))}
											<motion.button
												type="button"
												onClick={() => {
													setFormData({
														...formData,
														emails: [...formData.emails, ""],
													});
												}}
												className="btn-secondary text-sm"
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
											>
												Add Email
											</motion.button>
										</div>
									</div>

									{/* Phone Numbers Fields */}
									<div>
										<label className="label">Phone Numbers</label>
										<div className="space-y-2">
											{formData.phoneNumbers.map((phone, index) => (
												<div key={index} className="flex gap-2">
													<input
														type="tel"
														required
														value={phone}
														onChange={(e) => {
															const newPhones = [...formData.phoneNumbers];
															newPhones[index] = e.target.value;
															setFormData({
																...formData,
																phoneNumbers: newPhones,
															});
														}}
														className="input-field"
														placeholder="Enter phone number"
													/>
													<motion.button
														type="button"
														whileHover={{ scale: 1.1 }}
														whileTap={{ scale: 0.9 }}
														onClick={() => {
															if (formData.phoneNumbers.length > 1) {
																const newPhones = formData.phoneNumbers.filter(
																	(_, i) => i !== index
																);
																setFormData({
																	...formData,
																	phoneNumbers: newPhones,
																});
															}
														}}
														className="text-red-600 hover:text-red-700"
													>
														<svg
															className="h-5 w-5"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
															/>
														</svg>
													</motion.button>
												</div>
											))}
											<motion.button
												type="button"
												onClick={() => {
													setFormData({
														...formData,
														phoneNumbers: [...formData.phoneNumbers, ""],
													});
												}}
												className="btn-secondary text-sm"
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
											>
												Add Phone Number
											</motion.button>
										</div>
									</div>

									{/* Communication Periodicity Field */}
									<div>
										<label className="label">
											Communication Periodicity (days)
										</label>
										<input
											type="number"
											required
											min={1}
											value={formData.communicationPeriodicity}
											onChange={(e) =>
												setFormData({
													...formData,
													communicationPeriodicity: parseInt(e.target.value),
												})
											}
											className="input-field"
											placeholder="Enter number of days"
										/>
									</div>

									{/* Comments Field */}
									<div>
										<label className="label">Comments</label>
										<textarea
											value={formData.comments}
											onChange={(e) =>
												setFormData({ ...formData, comments: e.target.value })
											}
											rows={3}
											className="input-field"
											placeholder="Enter any additional notes..."
										/>
									</div>

									{/* Form Actions */}
									<div className="flex justify-end gap-3">
										<motion.button
											type="button"
											onClick={() => {
												setShowForm(false);
												setEditingCompany(null);
											}}
											className="btn-secondary"
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											Cancel
										</motion.button>
										<motion.button
											type="submit"
											className="btn-primary"
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											{editingCompany ? "Update" : "Add"}
										</motion.button>
									</div>
								</form>
							</motion.div>
						</div>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
}
