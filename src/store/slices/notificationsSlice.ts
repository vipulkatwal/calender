import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
	id: string;
	type: "overdue" | "due" | "info";
	title: string;
	message: string;
	companyId: string;
	isRead: boolean;
	createdAt: string;
}

interface NotificationsState {
	notifications: Notification[];
}

const initialState: NotificationsState = {
	notifications: [],
};

const notificationsSlice = createSlice({
	name: "notifications",
	initialState,
	reducers: {
		syncNotifications: (state, action: PayloadAction<Notification[]>) => {
			// Replace all notifications with new ones
			state.notifications = action.payload;
		},
		markAsRead: (state, action: PayloadAction<string>) => {
			const notification = state.notifications.find(
				(n) => n.id === action.payload
			);
			if (notification) {
				notification.isRead = true;
			}
		},
		markAllAsRead: (state) => {
			state.notifications.forEach((n) => (n.isRead = true));
		},
		clearNotifications: (state) => {
			state.notifications = [];
		},
	},
});

export const {
	syncNotifications,
	markAsRead,
	markAllAsRead,
	clearNotifications,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
