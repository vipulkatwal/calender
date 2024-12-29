// Import Redux Toolkit and reducers
import { configureStore } from "@reduxjs/toolkit";
import companiesReducer from "./slices/companiesSlice";
import communicationsReducer from "./slices/communicationsSlice";
import communicationMethodsReducer from "./slices/communicationMethodsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import userReducer from "./slices/userSlice";
// Import dummy data for development
import { dummyData } from "../utils/dummyData";

// Configure and create the Redux store
export const store = configureStore({
	// Combine all reducers
	reducer: {
		companies: companiesReducer,
		communications: communicationsReducer,
		communicationMethods: communicationMethodsReducer,
		notifications: notificationsReducer,
		user: userReducer,
	},
	// Initialize store with dummy data for development
	preloadedState: {
		companies: {
			companies: dummyData.companies,
			loading: false,
			error: null,
		},
		communications: {
			communications: dummyData.communications,
			loading: false,
			error: null,
		},
		communicationMethods: {
			methods: dummyData.communicationMethods,
		},
		notifications: {
			notifications: dummyData.notifications,
		},
	},
});

// Export types for TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
