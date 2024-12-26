import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { RootState } from "../../store";
import { addCommunication } from "../../store/slices/communicationsSlice";
import { addNotification } from "../../store/slices/notificationsSlice";
import { toast } from "react-toastify";

interface CommunicationModalProps {
	isOpen: boolean;
	onClose: () => void;
	selectedCompanies: string[];
	initialDate?: string;
}

export default function CommunicationModal({
	isOpen,
	onClose,
	selectedCompanies,
	initialDate,
}: CommunicationModalProps) {
	const dispatch = useDispatch();
	const companies = useSelector(
		(state: RootState) => state.companies.companies
	);
	const methods = useSelector(
		(state: RootState) => state.communicationMethods.methods
	);

	const [formData, setFormData] = useState({
		type: methods[0]?.id || "",
		date: initialDate || format(new Date(), "yyyy-MM-dd"),
		notes: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		selectedCompanies.forEach((companyId) => {
			const company = companies.find((c) => c.id === companyId);
			if (!company) return;

			// Add communication
			dispatch(
				addCommunication({
					id: crypto.randomUUID(),
					companyId,
					type: methods.find((m) => m.id === formData.type)?.name || "",
					date: new Date(formData.date).toISOString(),
					notes: formData.notes,
				})
			);

			// Add notification
			dispatch(
				addNotification({
					type: "info",
					title: "Communication Logged",
					message: `Communication with ${company.name} has been recorded`,
					companyId,
				})
			);
		});

		toast.success(
			`Communication${
				selectedCompanies.length > 1 ? "s" : ""
			} logged successfully`
		);
		onClose();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
					>
						<div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
							<div className="px-4 py-5 sm:p-6">
								<h2 className="text-lg sm:text-xl font-medium mb-4">
									Log Communication
								</h2>
								<form onSubmit={handleSubmit} className="space-y-4">
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
											{methods.map((method) => (
												<option key={method.id} value={method.id}>
													{method.name}
												</option>
											))}
										</select>
									</div>

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
										/>
									</div>

									<div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-2 mt-6">
										<motion.button
											type="button"
											onClick={onClose}
											className="btn-secondary w-full sm:w-auto order-2 sm:order-1"
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											Cancel
										</motion.button>
										<motion.button
											type="submit"
											className="btn-primary w-full sm:w-auto order-1 sm:order-2"
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											Log Communication
										</motion.button>
									</div>
								</form>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
