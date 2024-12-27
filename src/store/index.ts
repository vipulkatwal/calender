import { configureStore } from "@reduxjs/toolkit";
import companiesReducer from "./slices/companiesSlice";
import communicationsReducer from "./slices/communicationsSlice";
import communicationMethodsReducer from "./slices/communicationMethodsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import userReducer from "./slices/userSlice";
import { dummyData } from "../utils/dummyData";

export const store = configureStore({
	reducer: {
		companies: companiesReducer,
		communications: communicationsReducer,
		communicationMethods: communicationMethodsReducer,
		notifications: notificationsReducer,
		user: userReducer,
	},
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
