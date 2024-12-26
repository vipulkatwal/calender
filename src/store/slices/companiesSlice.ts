import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Company } from "../../types";

interface CompaniesState {
	companies: Company[];
	loading: boolean;
	error: string | null;
}

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
			communicationPeriodicity: 14,
		},
		{
			id: "2",
			name: "Tech Solutions Inc",
			location: "San Francisco",
			linkedinProfile: "https://linkedin.com/company/tech-solutions",
			emails: ["info@techsolutions.com"],
			phoneNumbers: ["+1987654321"],
			comments: "Interested in our services",
			communicationPeriodicity: 7,
		},
	],
	loading: false,
	error: null,
};

const companiesSlice = createSlice({
	name: "companies",
	initialState,
	reducers: {
		addCompany: (state, action: PayloadAction<Company>) => {
			state.companies.push(action.payload);
		},
		updateCompany: (state, action: PayloadAction<Company>) => {
			const index = state.companies.findIndex(
				(c) => c.id === action.payload.id
			);
			if (index !== -1) {
				state.companies[index] = action.payload;
			}
		},
		deleteCompany: (state, action: PayloadAction<string>) => {
			state.companies = state.companies.filter((c) => c.id !== action.payload);
		},
		setCompanies: (state, action: PayloadAction<Company[]>) => {
			state.companies = action.payload;
		},
	},
});

export const { addCompany, updateCompany, deleteCompany, setCompanies } =
	companiesSlice.actions;
export default companiesSlice.reducer;
