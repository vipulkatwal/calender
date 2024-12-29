import { useState } from "react";
import { Company } from "../../types";

// Props interface for the CompanyForm component
interface CompanyFormProps {
	initialData?: Partial<Company>;
	onSubmit: (data: Partial<Company>) => void;
	onCancel: () => void;
}

/**
 * CompanyForm component for creating and editing company information
 * Handles form state and submission for company data
 */
export default function CompanyForm({
	initialData,
	onSubmit,
	onCancel,
}: CompanyFormProps) {
	// Initialize form data with initial values or defaults
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

	// State for managing new email and phone number inputs
	const [newEmail, setNewEmail] = useState("");
	const [newPhone, setNewPhone] = useState("");

	// Handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	// Add new email to the emails array if it doesn't already exist
	const addEmail = () => {
		if (newEmail && !formData.emails?.includes(newEmail)) {
			setFormData({
				...formData,
				emails: [...(formData.emails || []), newEmail],
			});
			setNewEmail("");
		}
	};

	// Remove specified email from the emails array
	const removeEmail = (email: string) => {
		setFormData({
			...formData,
			emails: formData.emails?.filter((e) => e !== email) || [],
		});
	};

	// Add new phone number to the phoneNumbers array if it doesn't already exist
	const addPhone = () => {
		if (newPhone && !formData.phoneNumbers?.includes(newPhone)) {
			setFormData({
				...formData,
				phoneNumbers: [...(formData.phoneNumbers || []), newPhone],
			});
			setNewPhone("");
		}
	};

	// Remove specified phone number from the phoneNumbers array
	const removePhone = (phone: string) => {
		setFormData({
			...formData,
			phoneNumbers: formData.phoneNumbers?.filter((p) => p !== phone) || [],
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{/* Company name input field */}
			<div>
				<label className="block text-sm font-medium text-gray-700">Name</label>
				<input
					type="text"
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					required
				/>
			</div>

			{/* Company location input field */}
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Location
				</label>
				<input
					type="text"
					value={formData.location}
					onChange={(e) =>
						setFormData({ ...formData, location: e.target.value })
					}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					required
				/>
			</div>

			{/* LinkedIn profile URL input field */}
			<div>
				<label className="block text-sm font-medium text-gray-700">
					LinkedIn Profile
				</label>
				<input
					type="url"
					value={formData.linkedinProfile}
					onChange={(e) =>
						setFormData({ ...formData, linkedinProfile: e.target.value })
					}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					required
				/>
			</div>

			{/* Email management section */}
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Emails
				</label>
				<div className="mt-1 flex gap-2">
					<input
						type="email"
						value={newEmail}
						onChange={(e) => setNewEmail(e.target.value)}
						className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
					<button
						type="button"
						onClick={addEmail}
						className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
					>
						Add
					</button>
				</div>
				{/* Display list of added emails */}
				<div className="mt-2 flex flex-wrap gap-2">
					{formData.emails?.map((email) => (
						<span
							key={email}
							className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
						>
							{email}
							<button
								type="button"
								onClick={() => removeEmail(email)}
								className="text-indigo-600 hover:text-indigo-500"
							>
								×
							</button>
						</span>
					))}
				</div>
			</div>

			{/* Phone numbers management section */}
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Phone Numbers
				</label>
				<div className="mt-1 flex gap-2">
					<input
						type="tel"
						value={newPhone}
						onChange={(e) => setNewPhone(e.target.value)}
						className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
					<button
						type="button"
						onClick={addPhone}
						className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
					>
						Add
					</button>
				</div>
				{/* Display list of added phone numbers */}
				<div className="mt-2 flex flex-wrap gap-2">
					{formData.phoneNumbers?.map((phone) => (
						<span
							key={phone}
							className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
						>
							{phone}
							<button
								type="button"
								onClick={() => removePhone(phone)}
								className="text-indigo-600 hover:text-indigo-500"
							>
								×
							</button>
						</span>
					))}
				</div>
			</div>

			{/* Comments textarea field */}
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Comments
				</label>
				<textarea
					value={formData.comments}
					onChange={(e) =>
						setFormData({ ...formData, comments: e.target.value })
					}
					rows={3}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				/>
			</div>

			{/* Communication periodicity input field */}
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Communication Periodicity (days)
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
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					required
				/>
			</div>

			{/* Form action buttons */}
			<div className="flex justify-end gap-3">
				<button
					type="button"
					onClick={onCancel}
					className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
				>
					Cancel
				</button>
				<button
					type="submit"
					className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
				>
					{initialData ? "Update" : "Add"}
				</button>
			</div>
		</form>
	);
}
