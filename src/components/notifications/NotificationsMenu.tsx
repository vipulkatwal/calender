import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import {
	markAsRead,
	markAllAsRead,
	clearNotifications,
} from "../../store/slices/notificationsSlice";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
	BellIcon,
	BellAlertIcon,
	CheckCircleIcon,
	XMarkIcon,
	ExclamationCircleIcon,
	ClockIcon,
} from "@heroicons/react/24/outline";

/**
 * NotificationsMenu component
 * Displays notifications in a dropdown panel with responsive design
 */
export default function NotificationsMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch();
	const notifications = useSelector(
		(state: RootState) => state.notifications.notifications
	);
	const unreadCount = notifications.filter((n) => !n.isRead).length;

	const handleMarkAllAsRead = () => {
		dispatch(markAllAsRead());
	};

	const handleClearAll = () => {
		dispatch(clearNotifications());
	};

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case "overdue":
				return (
					<div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
						<ExclamationCircleIcon className="h-5 w-5 text-red-600" />
					</div>
				);
			case "due":
				return (
					<div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
						<ClockIcon className="h-5 w-5 text-amber-600" />
					</div>
				);
			default:
				return (
					<div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
						<BellIcon className="h-5 w-5 text-blue-600" />
					</div>
				);
		}
	};

	return (
		<div className="relative">
			{/* Notification bell button - responsive sizing */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="relative rounded-full p-2 text-gray-700 hover:bg-gray-200 transition-all duration-200"
			>
				{unreadCount > 0 ? (
					<BellAlertIcon className="h-6 w-6" />
				) : (
					<BellIcon className="h-6 w-6" />
				)}
				{unreadCount > 0 && (
					<motion.span
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"
					>
						{unreadCount}
					</motion.span>
				)}
			</button>

			<AnimatePresence>
				{isOpen && (
					<>
						{/* Backdrop - covers entire screen */}
						<div
							className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
							onClick={() => setIsOpen(false)}
						/>

						{/* Notifications panel - responsive width and positioning */}
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: -20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: -20 }}
							transition={{ duration: 0.2 }}
							className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-96 origin-top-right z-50"
						>
							<div className="rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden">
								{/* Header section with responsive padding */}
								<div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-blue-600">
									<div className="flex items-center justify-between">
										<h2 className="text-lg font-semibold text-white">
											Notifications
										</h2>
										<div className="flex items-center space-x-2">
											<button
												onClick={handleMarkAllAsRead}
												className="text-sm text-blue-100 hover:text-white transition-colors"
											>
												Mark all as read
											</button>
											<button
												onClick={handleClearAll}
												className="text-sm text-blue-100 hover:text-white transition-colors"
											>
												Clear all
											</button>
										</div>
									</div>
								</div>

								{/* Notifications list with responsive height and padding */}
								<div className="divide-y divide-gray-100 max-h-[60vh] sm:max-h-[calc(100vh-200px)] overflow-y-auto">
									{notifications.length === 0 ? (
										<div className="p-8 text-center">
											<BellIcon className="mx-auto h-12 w-12 text-gray-400" />
											<p className="mt-2 text-sm text-gray-500">
												No notifications yet
											</p>
										</div>
									) : (
										notifications.map((notification) => (
											<motion.div
												key={notification.id}
												layout
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												className={`p-4 hover:bg-gray-50 transition-colors ${
													!notification.isRead ? "bg-blue-50/50" : ""
												}`}
											>
												<div className="flex items-start space-x-4">
													{getNotificationIcon(notification.type)}
													<div className="flex-1 min-w-0">
														<div className="flex items-center justify-between">
															<p
																className={`text-sm font-medium ${
																	!notification.isRead
																		? "text-gray-900"
																		: "text-gray-600"
																}`}
															>
																{notification.title}
															</p>
															<span className="text-xs text-gray-500">
																{format(
																	new Date(notification.createdAt),
																	"MMM d, HH:mm"
																)}
															</span>
														</div>
														<p className="mt-1 text-sm text-gray-600 line-clamp-2">
															{notification.message}
														</p>
														{!notification.isRead && (
															<button
																onClick={() =>
																	dispatch(markAsRead(notification.id))
																}
																className="mt-2 flex items-center text-xs text-blue-600 hover:text-blue-700"
															>
																<CheckCircleIcon className="h-4 w-4 mr-1" />
																Mark as read
															</button>
														)}
													</div>
												</div>
											</motion.div>
										))
									)}
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
