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
					<div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center shadow-sm">
						<ExclamationCircleIcon className="h-6 w-6 text-red-500" />
					</div>
				);
			case "due":
				return (
					<div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shadow-sm">
						<ClockIcon className="h-6 w-6 text-amber-500" />
					</div>
				);
			default:
				return (
					<div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-sm">
						<BellIcon className="h-6 w-6 text-blue-500" />
					</div>
				);
		}
	};

	return (
		<div className="relative">
			{/* Bell button with new animation */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="relative rounded-full p-2.5 text-gray-700 hover:bg-gray-100/80 hover:text-primary-600 transition-all duration-200"
			>
				<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
					{unreadCount > 0 ? (
						<BellAlertIcon className="h-6 w-6" />
					) : (
						<BellIcon className="h-6 w-6" />
					)}
				</motion.div>
				{unreadCount > 0 && (
					<motion.span
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full ring-2 ring-white"
					>
						{unreadCount}
					</motion.span>
				)}
			</button>

			<AnimatePresence>
				{isOpen && (
					<>
						<div
							className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
							onClick={() => setIsOpen(false)}
						/>

						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: -20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: -20 }}
							transition={{ duration: 0.2 }}
							className="fixed sm:absolute right-2 left-2 sm:left-auto sm:right-0 top-20 sm:top-auto sm:mt-3 sm:w-[420px] origin-top z-[70]"
						>
							<div className="rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
								{/* Modern header design */}
								<div className="relative px-4 py-5 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 bg-[size:200%] animate-gradient">
									<div className="flex items-center justify-between">
										<div>
											<h2 className="text-xl font-semibold text-white">
												Notifications
											</h2>
											<p className="text-sm text-primary-100 mt-0.5">
												{notifications.length} notification
												{notifications.length !== 1 ? "s" : ""}
											</p>
										</div>
										<div className="flex items-center gap-3">
											<button
												onClick={handleMarkAllAsRead}
												className="text-sm px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
											>
												Mark all read
											</button>
											<button
												onClick={handleClearAll}
												className="text-sm px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
											>
												Clear all
											</button>
										</div>
									</div>
								</div>

								{/* Enhanced notifications list */}
								<div className="divide-y divide-gray-100 max-h-[calc(100vh-10rem)] overflow-y-auto">
									{notifications.length === 0 ? (
										<div className="p-12 text-center">
											<div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
												<BellIcon className="h-8 w-8 text-gray-400" />
											</div>
											<p className="text-gray-500 font-medium">
												No notifications yet
											</p>
											<p className="text-sm text-gray-400 mt-1">
												We'll notify you when something arrives
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
												className={`p-4 hover:bg-gray-50/80 transition-all duration-200 ${
													!notification.isRead ? "bg-blue-50/50" : ""
												}`}
											>
												<div className="flex gap-4">
													{getNotificationIcon(notification.type)}
													<div className="flex-1 min-w-0">
														<div className="flex items-start justify-between gap-4">
															<p
																className={`font-medium ${
																	!notification.isRead
																		? "text-gray-900"
																		: "text-gray-600"
																}`}
															>
																{notification.title}
															</p>
															<span className="text-xs text-gray-400 whitespace-nowrap">
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
																className="mt-2 flex items-center text-xs font-medium text-primary-600 hover:text-primary-700"
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
