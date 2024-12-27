import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Communication } from "../../types";

interface CommunicationsState {
	communications: Communication[];
	loading: boolean;
	error: string | null;
}

const initialState: CommunicationsState = {
	communications: [],
	loading: false,
	error: null,
};

const communicationsSlice = createSlice({
	name: "communications",
	initialState,
	reducers: {
		addCommunication: (state, action: PayloadAction<Communication>) => {
			state.communications.unshift(action.payload);
		},
		updateCommunication: (state, action: PayloadAction<Communication>) => {
			const index = state.communications.findIndex(
				(c) => c.id === action.payload.id
			);
			if (index !== -1) {
				state.communications[index] = action.payload;
			}
		},
		deleteCommunication: (state, action: PayloadAction<string>) => {
			state.communications = state.communications.filter(
				(c) => c.id !== action.payload
			);
		},
		setCommunications: (state, action: PayloadAction<Communication[]>) => {
			state.communications = action.payload;
		},
	},
});

export const {
	addCommunication,
	updateCommunication,
	deleteCommunication,
	setCommunications,
} = communicationsSlice.actions;

export default communicationsSlice.reducer;
