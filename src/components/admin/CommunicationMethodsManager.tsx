import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
	addMethod,
	updateMethod,
	deleteMethod,
	reorderMethods,
} from "../../store/slices/communicationMethodsSlice";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { toast } from "react-toastify";

/**
 * CommunicationMethodsManager Component
 * Manages the communication methods with responsive design for all screen sizes
 */
export default function CommunicationMethodsManager() {
	const dispatch = useDispatch();
	// Get communication methods from Redux store
	const methods = useSelector(
		(state: RootState) => state.communicationMethods.methods
	);
	// State for controlling form visibility and editing mode
	const [showForm, setShowForm] = useState(false);
	const [editingMethod, setEditingMethod] = useState<any>(null);
	// Form data state with default values
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		sequence: methods.length + 1,
		isMandatory: false,
	});

	// Form submission handler for both adding and updating methods
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (editingMethod) {
			// Update existing method
			dispatch(updateMethod({ ...formData, id: editingMethod.id }));
			toast.success("Method updated successfully");
		} else {
			// Add new method with unique ID
			dispatch(
				addMethod({
					...formData,
					id: crypto.randomUUID(),
				})
			);
			toast.success("Method added successfully");
		}
		// Reset form state after submission
		setShowForm(false);
		setEditingMethod(null);
		setFormData({
			name: "",
			description: "",
			sequence: methods.length + 1,
			isMandatory: false,
		});
	};

	// Delete method handler with confirmation dialog
	const handleDelete = (method: any) => {
		if (confirm("Are you sure you want to delete this method?")) {
			dispatch(deleteMethod(method.id));
			toast.success("Method deleted successfully");
		}
	};

	// Handler for reordering methods with updated sequence numbers
	const handleReorder = (newOrder: any[]) => {
		const updatedMethods = newOrder.map((method, index) => ({
			...method,
			sequence: index + 1,
		}));
		dispatch(reorderMethods(updatedMethods));
	};

	return (
		// Main container with responsive padding
		<div className="space-y-6 px-4 sm:px-6 lg:px-8">
			{/* Header section with "Add Method" button */}
			<div className="flex justify-end sm:justify-end">
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => setShowForm(true)}
					className="btn-primary w-full sm:w-auto"
				>
					Add Method
				</motion.button>
			</div>

			{/* Reorderable list of communication methods */}
			<Reorder.Group
				axis="y"
				values={methods}
				onReorder={handleReorder}
				className="space-y-4 sm:space-y-6"
			>
				{methods.map((method) => (
					<Reorder.Item
						key={method.id}
						value={method}
						className="cursor-move focus:outline-none"
					>
						{/* Method card with animation */}
						<motion.div
							layout
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="group relative bg-white rounded-xl shadow-soft hover:shadow-lg transition-all duration-300"
						>
							{/* Edit and Delete buttons */}
							<div className="absolute right-2 sm:right-4 top-2 sm:top-4 flex space-x-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => {
										setEditingMethod(method);
										setFormData(method);
										setShowForm(true);
									}}
									className="p-1.5 sm:p-2 rounded-full bg-white shadow-md text-primary-600 hover:text-primary-700"
								>
									<svg
										className="h-3.5 w-3.5 sm:h-4 sm:w-4"
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
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => handleDelete(method)}
									className="p-1.5 sm:p-2 rounded-full bg-white shadow-md text-red-600 hover:text-red-700"
								>
									<svg
										className="h-3.5 w-3.5 sm:h-4 sm:w-4"
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

							{/* Method details display */}
							<div className="p-4 sm:p-6">
								<div className="flex items-center mb-3 sm:mb-4">
									<div className="flex-1 min-w-0">
										<h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">
											{method.name}
										</h3>
										{/* Method badges (sequence and mandatory status) */}
										<div className="flex flex-wrap items-center gap-2 sm:gap-3">
											<div className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
												Sequence: {method.sequence}
											</div>
											{method.isMandatory && (
												<div className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
													Mandatory
												</div>
											)}
										</div>
									</div>
									{/* Drag handle icon */}
									<div className="text-gray-400 ml-4">
										<svg
											className="h-5 w-5 sm:h-6 sm:w-6"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M4 6h16M4 12h16M4 18h16"
											/>
										</svg>
									</div>
								</div>
								<p className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-none">
									{method.description}
								</p>
							</div>
						</motion.div>
					</Reorder.Item>
				))}
			</Reorder.Group>

			{/* Modal form for adding/editing methods */}
			<AnimatePresence>
				{showForm && (
					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-end sm:items-center justify-center p-4 text-center sm:p-0">
							{/* Modal backdrop with click-away handler */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
								onClick={() => setShowForm(false)}
							/>

							{/* Modal content with animation */}
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								className="relative transform overflow-hidden rounded-lg bg-white w-full sm:max-w-lg mx-4 sm:mx-auto"
							>
								<form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
									{/* Method name input */}
									<div>
										<label className="label">Method Name</label>
										<input
											type="text"
											required
											value={formData.name}
											onChange={(e) =>
												setFormData({ ...formData, name: e.target.value })
											}
											className="input-field"
											placeholder="Enter method name"
										/>
									</div>

									{/* Method description textarea */}
									<div>
										<label className="label">Description</label>
										<textarea
											required
											value={formData.description}
											onChange={(e) =>
												setFormData({
													...formData,
													description: e.target.value,
												})
											}
											rows={3}
											className="input-field"
											placeholder="Enter method description"
										/>
									</div>

									{/* Sequence number input */}
									<div>
										<label className="label">Sequence</label>
										<input
											type="number"
											required
											min={1}
											value={formData.sequence}
											onChange={(e) =>
												setFormData({
													...formData,
													sequence: parseInt(e.target.value),
												})
											}
											className="input-field"
										/>
									</div>

									{/* Mandatory method checkbox */}
									<div className="flex items-center">
										<input
											type="checkbox"
											id="isMandatory"
											checked={formData.isMandatory}
											onChange={(e) =>
												setFormData({
													...formData,
													isMandatory: e.target.checked,
												})
											}
											className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
										/>
										<label
											htmlFor="isMandatory"
											className="ml-2 block text-sm text-gray-900"
										>
											Mandatory Method
										</label>
									</div>

									{/* Form action buttons */}
									<div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
										<motion.button
											type="button"
											onClick={() => {
												setShowForm(false);
												setEditingMethod(null);
											}}
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
											{editingMethod ? "Update" : "Add"}
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
