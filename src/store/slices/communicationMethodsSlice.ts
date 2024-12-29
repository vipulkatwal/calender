import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interface defining the structure of a communication method
interface CommunicationMethod {
	id: string;
	name: string; // Display name of the communication method
	description: string; // Detailed description of the method
	sequence: number; // Order in which methods should be attempted
	isMandatory: boolean; // Whether this method must be attempted
}

// State interface for the communication methods slice
interface CommunicationMethodsState {
	methods: CommunicationMethod[];
}

// Initial state with empty methods array
const initialState: CommunicationMethodsState = {
	methods: [],
};

// Create the Redux slice for managing communication methods
const communicationMethodsSlice = createSlice({
	name: "communicationMethods",
	initialState,
	reducers: {
		// Add a new communication method to the state
		addMethod: (state, action: PayloadAction<CommunicationMethod>) => {
			state.methods.push(action.payload);
		},
		// Update an existing communication method by ID
		updateMethod: (state, action: PayloadAction<CommunicationMethod>) => {
			const index = state.methods.findIndex((m) => m.id === action.payload.id);
			if (index !== -1) {
				state.methods[index] = action.payload;
			}
		},
		// Remove a communication method by ID
		deleteMethod: (state, action: PayloadAction<string>) => {
			state.methods = state.methods.filter((m) => m.id !== action.payload);
		},
		// Update the entire methods array (used for reordering)
		reorderMethods: (state, action: PayloadAction<CommunicationMethod[]>) => {
			state.methods = action.payload;
		},
	},
});

// Export actions and reducer
export const { addMethod, updateMethod, deleteMethod, reorderMethods } =
	communicationMethodsSlice.actions;
export default communicationMethodsSlice.reducer;
