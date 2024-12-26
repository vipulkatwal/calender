import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
	id: string;
	name: string;
	email: string;
	role: "admin" | "user";
}

interface UserState {
	currentUser: User | null;
}

// Get initial state from localStorage
const initialState: UserState = {
	currentUser: localStorage.getItem("user")
		? JSON.parse(localStorage.getItem("user")!)
		: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<User>) => {
			state.currentUser = action.payload;
			// Save to localStorage
			localStorage.setItem("user", JSON.stringify(action.payload));
		},
		clearUser: (state) => {
			state.currentUser = null;
			// Clear from localStorage
			localStorage.removeItem("user");
		},
	},
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
