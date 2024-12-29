// Import required dependencies from Redux Toolkit and types
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Communication } from "../../types";

// Define the shape of our communications state
interface CommunicationsState {
	communications: Communication[]; // Array of communication records
	loading: boolean; // Loading state for async operations
	error: string | null; // Error message if any operation fails
}

// Set up initial state values
const initialState: CommunicationsState = {
	communications: [],
	loading: false,
	error: null,
};

// Create the communications slice with reducers
const communicationsSlice = createSlice({
	name: "communications",
	initialState,
	reducers: {
		// Add a new communication record to the beginning of the array
		addCommunication: (state, action: PayloadAction<Communication>) => {
			state.communications.unshift(action.payload);
		},
		// Update an existing communication record by ID
		updateCommunication: (state, action: PayloadAction<Communication>) => {
			const index = state.communications.findIndex(
				(c) => c.id === action.payload.id
			);
			if (index !== -1) {
				state.communications[index] = action.payload;
			}
		},
		// Remove a communication record by ID
		deleteCommunication: (state, action: PayloadAction<string>) => {
			state.communications = state.communications.filter(
				(c) => c.id !== action.payload
			);
		},
		// Replace entire communications array with new data
		// Useful for initialization or reset
		setCommunications: (state, action: PayloadAction<Communication[]>) => {
			state.communications = action.payload;
		},
	},
});

// Export individual actions for use in components
export const {
	addCommunication,
	updateCommunication,
	deleteCommunication,
	setCommunications,
} = communicationsSlice.actions;

// Export the reducer for store configuration
export default communicationsSlice.reducer;
