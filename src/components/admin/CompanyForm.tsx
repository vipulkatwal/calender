import { useState } from "react";
import { Company } from "../../types";
import { motion } from "framer-motion";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface CompanyFormProps {
	initialData?: Partial<Company>;
	onSubmit: (data: Partial<Company>) => void;
	onCancel: () => void;
}

export default function CompanyForm({
	initialData,
	onSubmit,
	onCancel,
}: CompanyFormProps) {
	const [formData, setFormData] = useState<Partial<Company>>(
		initialData || {
			name: "",
			location: "",
			linkedinProfile: "",
			emails: [],
			phoneNumbers: [],
			comments: "",
			communicationPeriodicity: 14,
		}
	);

	const [newEmail, setNewEmail] = useState("");
	const [newPhone, setNewPhone] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	const addEmail = () => {
		if (newEmail && !formData.emails?.includes(newEmail)) {
			setFormData({
				...formData,
				emails: [...(formData.emails || []), newEmail],
			});
			setNewEmail("");
		}
	};

	const removeEmail = (email: string) => {
		setFormData({
			...formData,
			emails: formData.emails?.filter((e) => e !== email) || [],
		});
	};

	const addPhone = () => {
		if (newPhone && !formData.phoneNumbers?.includes(newPhone)) {
			setFormData({
				...formData,
				phoneNumbers: [...(formData.phoneNumbers || []), newPhone],
			});
			setNewPhone("");
		}
	};

	const removePhone = (phone: string) => {
		setFormData({
			...formData,
			phoneNumbers: formData.phoneNumbers?.filter((p) => p !== phone) || [],
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="bg-gradient-to-r from-primary-600 to-primary-700 -m-6 p-6 pb-8">
				<h2 className="text-xl font-semibold text-white">
					{initialData ? "Edit Company" : "Add New Company"}
				</h2>
				<p className="mt-1 text-sm text-primary-100">
					Fill in the details below to {initialData ? "update" : "add"} a
					company
				</p>
			</div>

			<div className="px-1 space-y-6">
				{/* Company Basic Info */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Company Name
						</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							className="input-field"
							placeholder="Enter company name"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Location
						</label>
						<input
							type="text"
							value={formData.location}
							onChange={(e) =>
								setFormData({ ...formData, location: e.target.value })
							}
							className="input-field"
							placeholder="City, Country"
							required
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						LinkedIn Profile
					</label>
					<input
						type="url"
						value={formData.linkedinProfile}
						onChange={(e) =>
							setFormData({ ...formData, linkedinProfile: e.target.value })
						}
						className="input-field"
						placeholder="https://linkedin.com/company/..."
						required
					/>
				</div>

				{/* Email Section */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Email Addresses
					</label>
					<div className="flex gap-2">
						<input
							type="email"
							value={newEmail}
							onChange={(e) => setNewEmail(e.target.value)}
							className="input-field flex-1"
							placeholder="Add email address"
						/>
						<motion.button
							type="button"
							onClick={addEmail}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="btn-primary px-4"
						>
							<PlusIcon className="h-5 w-5" />
						</motion.button>
					</div>
					<div className="mt-3 flex flex-wrap gap-2">
						{formData.emails?.map((email) => (
							<motion.span
								key={email}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary-50 text-primary-700"
							>
								{email}
								<button
									type="button"
									onClick={() => removeEmail(email)}
									className="text-primary-600 hover:text-primary-700"
								>
									<XMarkIcon className="h-4 w-4" />
								</button>
							</motion.span>
						))}
					</div>
				</div>

				{/* Phone Section */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Phone Numbers
					</label>
					<div className="flex gap-2">
						<input
							type="tel"
							value={newPhone}
							onChange={(e) => setNewPhone(e.target.value)}
							className="input-field flex-1"
							placeholder="Add phone number"
						/>
						<motion.button
							type="button"
							onClick={addPhone}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="btn-primary px-4"
						>
							<PlusIcon className="h-5 w-5" />
						</motion.button>
					</div>
					<div className="mt-3 flex flex-wrap gap-2">
						{formData.phoneNumbers?.map((phone) => (
							<motion.span
								key={phone}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary-50 text-primary-700"
							>
								{phone}
								<button
									type="button"
									onClick={() => removePhone(phone)}
									className="text-primary-600 hover:text-primary-700"
								>
									<XMarkIcon className="h-4 w-4" />
								</button>
							</motion.span>
						))}
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Comments
					</label>
					<textarea
						value={formData.comments}
						onChange={(e) =>
							setFormData({ ...formData, comments: e.target.value })
						}
						rows={3}
						className="input-field"
						placeholder="Add any additional notes..."
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Communication Frequency (days)
					</label>
					<input
						type="number"
						min="1"
						value={formData.communicationPeriodicity}
						onChange={(e) =>
							setFormData({
								...formData,
								communicationPeriodicity: parseInt(e.target.value),
							})
						}
						className="input-field w-full sm:w-32"
						required
					/>
				</div>
			</div>

			<div className="flex justify-end gap-3 pt-6 mt-8 border-t">
				<motion.button
					type="button"
					onClick={onCancel}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="btn-secondary"
				>
					Cancel
				</motion.button>
				<motion.button
					type="submit"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="btn-primary"
				>
					{initialData ? "Update Company" : "Add Company"}
				</motion.button>
			</div>
		</form>
	);
}
