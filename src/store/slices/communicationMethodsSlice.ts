import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommunicationMethod {
	id: string;
	name: string;
	description: string;
	sequence: number;
	isMandatory: boolean;
}

interface CommunicationMethodsState {
	methods: CommunicationMethod[];
}

const initialState: CommunicationMethodsState = {
	methods: [],
};

const communicationMethodsSlice = createSlice({
	name: "communicationMethods",
	initialState,
	reducers: {
		addMethod: (state, action: PayloadAction<CommunicationMethod>) => {
			state.methods.push(action.payload);
		},
		updateMethod: (state, action: PayloadAction<CommunicationMethod>) => {
			const index = state.methods.findIndex((m) => m.id === action.payload.id);
			if (index !== -1) {
				state.methods[index] = action.payload;
			}
		},
		deleteMethod: (state, action: PayloadAction<string>) => {
			state.methods = state.methods.filter((m) => m.id !== action.payload);
		},
		reorderMethods: (state, action: PayloadAction<CommunicationMethod[]>) => {
			state.methods = action.payload;
		},
	},
});

export const { addMethod, updateMethod, deleteMethod, reorderMethods } =
	communicationMethodsSlice.actions;
export default communicationMethodsSlice.reducer;
