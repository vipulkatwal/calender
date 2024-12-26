export interface User {
	id: string;
	name: string;
	email: string;
	role: "admin" | "user";
}

export interface Company {
	id: string;
	name: string;
	location: string;
	linkedinProfile: string;
	emails: string[];
	phoneNumbers: string[];
	comments: string;
	communicationPeriodicity: number;
}

export enum CommunicationType {
	LINKEDIN_POST = "LinkedIn Post",
	LINKEDIN_MESSAGE = "LinkedIn Message",
	EMAIL = "Email",
	PHONE_CALL = "Phone Call",
	OTHER = "Other",
}

export interface Communication {
	id: string;
	companyId: string;
	type: CommunicationType;
	date: string;
	notes: string;
}
