// Import necessary dependencies from react-toastify and heroicons
import { toast, ToastOptions } from "react-toastify";
import {
	CheckCircleIcon,
	XCircleIcon,
	InformationCircleIcon,
} from "@heroicons/react/24/outline";

// Default styling options for all toast notifications
const defaultToastStyle: ToastOptions = {
	position: "bottom-right",
	autoClose: 4000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	className: "!bg-white !rounded-xl !shadow-soft",
	bodyClassName: "!text-sm !font-medium !text-gray-700",
	progressClassName: "!bg-primary-500",
	// Custom close button component
	closeButton: ({ closeToast }) => (
		<button
			onClick={closeToast}
			className="!p-1 !rounded-full !transition-colors hover:!bg-gray-100"
		>
			<XCircleIcon className="h-5 w-5 text-gray-400" />
		</button>
	),
};

// Export object containing different toast notification methods
export const showToast = {
	// Success toast with green styling
	success: (message: string, options?: ToastOptions) => {
		toast.success(
			<div className="flex items-center gap-3">
				<CheckCircleIcon className="h-5 w-5 text-green-500 shrink-0" />
				<span>{message}</span>
			</div>,
			{
				...defaultToastStyle,
				progressClassName: "!bg-green-500",
				...options,
			}
		);
	},

	// Error toast with red styling
	error: (message: string, options?: ToastOptions) => {
		toast.error(
			<div className="flex items-center gap-3">
				<XCircleIcon className="h-5 w-5 text-red-500 shrink-0" />
				<span>{message}</span>
			</div>,
			{
				...defaultToastStyle,
				progressClassName: "!bg-red-500",
				...options,
			}
		);
	},

	// Info toast with primary color styling
	info: (message: string, options?: ToastOptions) => {
		toast.info(
			<div className="flex items-center gap-3">
				<InformationCircleIcon className="h-5 w-5 text-primary-500 shrink-0" />
				<span>{message}</span>
			</div>,
			{
				...defaultToastStyle,
				...options,
			}
		);
	},

	// Loading toast with spinner animation
	// Returns toast ID for updating/dismissing later
	loading: (message: string) => {
		return toast.loading(
			<div className="flex items-center gap-3">
				<div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-500 border-t-transparent shrink-0" />
				<span>{message}</span>
			</div>,
			{
				...defaultToastStyle,
				autoClose: false, // Loading toasts don't auto-close
				closeButton: false, // Remove close button for loading state
			}
		);
	},
};
