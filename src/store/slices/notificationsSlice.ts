// Import required dependencies from Redux Toolkit
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure of a notification object
export interface Notification {
	id: string;
	type: "overdue" | "due" | "info"; // Type of notification to display
	title: string; // Title/header of the notification
	message: string; // Main notification message content
	companyId: string; // Reference to associated company
	isRead: boolean; // Track if notification has been viewed
	createdAt: string; // Timestamp of notification creation
}

// Define the shape of our notifications state
interface NotificationsState {
	notifications: Notification[]; // Array to store all notifications
}

// Set up initial state with empty notifications array
const initialState: NotificationsState = {
	notifications: [],
};

// Create the notifications slice with reducers for state management
const notificationsSlice = createSlice({
	name: "notifications",
	initialState,
	reducers: {
		// Replace entire notifications array with new data
		// Useful for syncing with backend or resetting state
		syncNotifications: (state, action: PayloadAction<Notification[]>) => {
			state.notifications = action.payload;
		},
		// Mark a single notification as read by its ID
		markAsRead: (state, action: PayloadAction<string>) => {
			const notification = state.notifications.find(
				(n) => n.id === action.payload
			);
			if (notification) {
				notification.isRead = true;
			}
		},
		// Mark all notifications as read
		markAllAsRead: (state) => {
			state.notifications.forEach((n) => (n.isRead = true));
		},
		// Remove all notifications from the state
		clearNotifications: (state) => {
			state.notifications = [];
		},
	},
});

// Export individual actions for use in components
export const {
	syncNotifications,
	markAsRead,
	markAllAsRead,
	clearNotifications,
} = notificationsSlice.actions;
// Export the reducer for store configuration
export default notificationsSlice.reducer;
