// Import required dependencies from Redux Toolkit and types
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Company } from "../../types";

// Define the shape of our companies state
interface CompaniesState {
	companies: Company[]; // Array of company records
	loading: boolean; // Loading state for async operations
	error: string | null; // Error message if any operation fails
}

// Set up initial state with sample company data
const initialState: CompaniesState = {
	companies: [
		{
			id: "1",
			name: "Example Corp",
			location: "New York",
			linkedinProfile: "https://linkedin.com/company/example-corp",
			emails: ["contact@example.com"],
			phoneNumbers: ["+1234567890"],
			comments: "Initial contact made",
			communicationPeriodicity: 14, // Communication frequency in days
		},
		{
			id: "2",
			name: "Tech Solutions Inc",
			location: "San Francisco",
			linkedinProfile: "https://linkedin.com/company/tech-solutions",
			emails: ["info@techsolutions.com"],
			phoneNumbers: ["+1987654321"],
			comments: "Interested in our services",
			communicationPeriodicity: 7, // Weekly communication schedule
		},
	],
	loading: false,
	error: null,
};

// Create the companies slice with reducers for state management
const companiesSlice = createSlice({
	name: "companies",
	initialState,
	reducers: {
		// Add a new company to the companies array
		addCompany: (state, action: PayloadAction<Company>) => {
			state.companies.push(action.payload);
		},
		// Update an existing company's information by ID
		updateCompany: (state, action: PayloadAction<Company>) => {
			const index = state.companies.findIndex(
				(c) => c.id === action.payload.id
			);
			if (index !== -1) {
				state.companies[index] = action.payload;
			}
		},
		// Remove a company from the array by ID
		deleteCompany: (state, action: PayloadAction<string>) => {
			state.companies = state.companies.filter((c) => c.id !== action.payload);
		},
		// Replace entire companies array with new data
		// Useful for initialization or reset
		setCompanies: (state, action: PayloadAction<Company[]>) => {
			state.companies = action.payload;
		},
	},
});

// Export individual actions for use in components
export const { addCompany, updateCompany, deleteCompany, setCompanies } =
	companiesSlice.actions;
// Export the reducer for store configuration
export default companiesSlice.reducer;
