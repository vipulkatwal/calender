import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Communication } from "../../types";
import { CommunicationType } from "../../types";
import { format, subDays } from "date-fns";

interface CommunicationsState {
	communications: Communication[];
	loading: boolean;
	error: string | null;
}

// Generate some sample communications for the demo
const generateSampleCommunications = (): Communication[] => {
	const today = new Date();
	return [
		{
			id: "1",
			companyId: "1",
			type: CommunicationType.LINKEDIN_POST,
			date: format(subDays(today, 14), "yyyy-MM-dd"),
			notes: "Posted company update",
		},
		{
			id: "2",
			companyId: "1",
			type: CommunicationType.EMAIL,
			date: format(subDays(today, 7), "yyyy-MM-dd"),
			notes: "Followed up on previous discussion",
		},
		{
			id: "3",
			companyId: "2",
			type: CommunicationType.LINKEDIN_MESSAGE,
			date: format(subDays(today, 5), "yyyy-MM-dd"),
			notes: "Sent connection request",
		},
		{
			id: "4",
			companyId: "2",
			type: CommunicationType.PHONE_CALL,
			date: format(subDays(today, 2), "yyyy-MM-dd"),
			notes: "Discussed potential collaboration",
		},
	];
};

const initialState: CommunicationsState = {
	communications: generateSampleCommunications(),
	loading: false,
	error: null,
};

const communicationsSlice = createSlice({
	name: "communications",
	initialState,
	reducers: {
		addCommunication: (state, action: PayloadAction<Communication>) => {
			state.communications.push(action.payload);
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
