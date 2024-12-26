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
import { BellIcon } from "@heroicons/react/24/outline";

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

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
			>
				<BellIcon className="h-6 w-6" />
				{unreadCount > 0 && (
					<span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
						{unreadCount}
					</span>
				)}
			</button>

			<AnimatePresence>
				{isOpen && (
					<>
						<div
							className="fixed inset-0 z-30"
							onClick={() => setIsOpen(false)}
						/>
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className="absolute right-0 z-40 mt-2 w-screen sm:w-80 origin-top-right"
						>
							<div className="rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 max-h-[calc(100vh-100px)] overflow-hidden">
								<div className="p-4">
									<div className="flex items-center justify-between mb-4">
										<h2 className="text-lg font-medium text-gray-900">
											Notifications
										</h2>
										<div className="flex gap-2">
											<button
												onClick={handleMarkAllAsRead}
												className="text-sm text-primary-600 hover:text-primary-900"
											>
												Mark all as read
											</button>
											<button
												onClick={handleClearAll}
												className="text-sm text-gray-600 hover:text-gray-900"
											>
												Clear all
											</button>
										</div>
									</div>

									<div className="space-y-4 max-h-96 overflow-y-auto">
										{notifications.length === 0 ? (
											<p className="text-center text-gray-500">
												No notifications
											</p>
										) : (
											notifications.map((notification) => (
												<motion.div
													key={notification.id}
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													className={`p-3 rounded-lg ${
														notification.isRead
															? "bg-gray-50"
															: "bg-primary-50 border-l-4 border-primary-500"
													}`}
													onClick={() => dispatch(markAsRead(notification.id))}
												>
													<div className="flex justify-between items-start">
														<h3 className="text-sm font-medium text-gray-900">
															{notification.title}
														</h3>
														<span className="text-xs text-gray-500">
															{format(
																new Date(notification.createdAt),
																"MMM d, HH:mm"
															)}
														</span>
													</div>
													<p className="mt-1 text-sm text-gray-600">
														{notification.message}
													</p>
												</motion.div>
											))
										)}
									</div>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
