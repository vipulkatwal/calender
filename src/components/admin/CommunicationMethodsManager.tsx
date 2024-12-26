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

export default function CommunicationMethodsManager() {
	const dispatch = useDispatch();
	const methods = useSelector(
		(state: RootState) => state.communicationMethods.methods
	);
	const [showForm, setShowForm] = useState(false);
	const [editingMethod, setEditingMethod] = useState<any>(null);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		sequence: methods.length + 1,
		isMandatory: false,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (editingMethod) {
			dispatch(updateMethod({ ...formData, id: editingMethod.id }));
			toast.success("Method updated successfully");
		} else {
			dispatch(
				addMethod({
					...formData,
					id: crypto.randomUUID(),
				})
			);
			toast.success("Method added successfully");
		}
		setShowForm(false);
		setEditingMethod(null);
		setFormData({
			name: "",
			description: "",
			sequence: methods.length + 1,
			isMandatory: false,
		});
	};

	const handleDelete = (method: any) => {
		if (confirm("Are you sure you want to delete this method?")) {
			dispatch(deleteMethod(method.id));
			toast.success("Method deleted successfully");
		}
	};

	const handleReorder = (newOrder: any[]) => {
		const updatedMethods = newOrder.map((method, index) => ({
			...method,
			sequence: index + 1,
		}));
		dispatch(reorderMethods(updatedMethods));
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-end">
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => setShowForm(true)}
					className="btn-primary"
				>
					Add Method
				</motion.button>
			</div>

			<Reorder.Group
				axis="y"
				values={methods}
				onReorder={handleReorder}
				className="space-y-4"
			>
				{methods.map((method) => (
					<Reorder.Item key={method.id} value={method} className="cursor-move">
						<motion.div
							layout
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="group relative bg-white rounded-xl shadow-soft hover:shadow-lg transition-all duration-300"
						>
							{/* Card Header with Actions */}
							<div className="absolute right-4 top-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => {
										setEditingMethod(method);
										setFormData(method);
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
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => handleDelete(method)}
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
								<div className="flex items-center mb-4">
									<div className="flex-1">
										<h3 className="text-lg font-semibold text-gray-900 mb-1">
											{method.name}
										</h3>
										<div className="flex items-center gap-3">
											<div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
												Sequence: {method.sequence}
											</div>
											{method.isMandatory && (
												<div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
													Mandatory
												</div>
											)}
										</div>
									</div>
									<div className="text-gray-400">
										<svg
											className="h-6 w-6"
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
								<p className="text-sm text-gray-600">{method.description}</p>
							</div>
						</motion.div>
					</Reorder.Item>
				))}
			</Reorder.Group>

			{/* Method Form Modal */}
			<AnimatePresence>
				{showForm && (
					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
								onClick={() => setShowForm(false)}
							/>

							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
							>
								<form onSubmit={handleSubmit} className="space-y-4">
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

									<div className="flex justify-end gap-3 pt-4">
										<motion.button
											type="button"
											onClick={() => {
												setShowForm(false);
												setEditingMethod(null);
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
