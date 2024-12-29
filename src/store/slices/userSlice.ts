// Import required dependencies from Redux Toolkit
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure of a user object
interface User {
	id: string;
	name: string;
	email: string;
	role: "admin" | "user"; // User can have either admin or regular user role
}

// Define the shape of our user state
interface UserState {
	currentUser: User | null; // Stores the currently logged in user or null if logged out
}

// Get initial state from localStorage to persist user session
const initialState: UserState = {
	currentUser: localStorage.getItem("user")
		? JSON.parse(localStorage.getItem("user")!)
		: null,
};

// Create the user slice with reducers for state management
const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		// Set the current user and persist to localStorage
		setUser: (state, action: PayloadAction<User>) => {
			state.currentUser = action.payload;
			// Save user data to localStorage for persistence
			localStorage.setItem("user", JSON.stringify(action.payload));
		},
		// Clear the current user and remove from localStorage
		clearUser: (state) => {
			state.currentUser = null;
			// Remove user data from localStorage on logout
			localStorage.removeItem("user");
		},
	},
});

// Export individual actions for use in components
export const { setUser, clearUser } = userSlice.actions;
// Export the reducer for store configuration
export default userSlice.reducer;
