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
		addNotification: (
			state,
			action: PayloadAction<Omit<Notification, "id" | "isRead" | "createdAt">>
		) => {
			state.notifications.push({
				...action.payload,
				id: crypto.randomUUID(),
				isRead: false,
				createdAt: new Date().toISOString(),
			});
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
	addNotification,
	markAsRead,
	markAllAsRead,
	clearNotifications,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
