import { Company, Communication, CommunicationType } from "../types";
import { subDays, addDays } from "date-fns";

export interface Notification {
	id: string;
	type: "overdue" | "due";
	title: string;
	message: string;
	companyId: string;
	isRead: boolean;
	createdAt: string;
}

const companies: Company[] = [
	{
		id: "1",
		name: "Accenture Global Solutions",
		location: "Dublin, Ireland",
		linkedinProfile: "https://linkedin.com/company/accenture",
		emails: ["contact@accenture.com", "sales@accenture.com"],
		phoneNumbers: ["+353 1 646 2000", "+353 1 646 2100"],
		comments: "Global professional services company",
		communicationPeriodicity: 14,
		lastCommunication: subDays(new Date(), 20),
	},
	{
		id: "2",
		name: "Deloitte Digital",
		location: "New York, NY",
		linkedinProfile: "https://linkedin.com/company/deloitte",
		emails: ["info@deloitte.com"],
		phoneNumbers: ["+1 212 492 4000"],
		comments: "Digital transformation services",
		communicationPeriodicity: 30,
		lastCommunication: subDays(new Date(), 15),
	},
	{
		id: "3",
		name: "McKinsey & Company",
		location: "Chicago, IL",
		linkedinProfile: "https://linkedin.com/company/mckinsey",
		emails: ["contact@mckinsey.com"],
		phoneNumbers: ["+1 312 551 3000"],
		comments: "Management consulting partnership",
		communicationPeriodicity: 7,
		lastCommunication: subDays(new Date(), 10),
	},
	{
		id: "4",
		name: "Boston Consulting Group",
		location: "Boston, MA",
		linkedinProfile: "https://linkedin.com/company/bcg",
		emails: ["info@bcg.com", "support@bcg.com"],
		phoneNumbers: ["+1 617 973 1200"],
		comments: "Strategy consulting firm",
		communicationPeriodicity: 21,
	},
	{
		id: "5",
		name: "PwC Technology",
		location: "London, UK",
		linkedinProfile: "https://linkedin.com/company/pwc",
		emails: ["contact@pwc.com"],
		phoneNumbers: ["+44 20 7583 5000"],
		comments: "Professional services network",
		communicationPeriodicity: 14,
	},
	{
		id: "6",
		name: "Palantir Technologies",
		location: "Denver, CO",
		linkedinProfile: "https://linkedin.com/company/palantir",
		emails: ["info@palantir.com", "support@palantir.com"],
		phoneNumbers: ["+1 303 555 0123"],
		comments: "Data analytics and software",
		communicationPeriodicity: 14,
	},
	{
		id: "7",
		name: "Snowflake Inc.",
		location: "Bozeman, MT",
		linkedinProfile: "https://linkedin.com/company/snowflake",
		emails: ["contact@snowflake.com"],
		phoneNumbers: ["+1 406 555 0123"],
		comments: "Cloud data platform",
		communicationPeriodicity: 21,
	},
	{
		id: "8",
		name: "Databricks",
		location: "San Francisco, CA",
		linkedinProfile: "https://linkedin.com/company/databricks",
		emails: ["info@databricks.com"],
		phoneNumbers: ["+1 415 555 0123"],
		comments: "Data and AI company",
		communicationPeriodicity: 30,
	},
	{
		id: "9",
		name: "MongoDB Inc.",
		location: "New York, NY",
		linkedinProfile: "https://linkedin.com/company/mongodb",
		emails: ["contact@mongodb.com", "sales@mongodb.com"],
		phoneNumbers: ["+1 212 555 0123"],
		comments: "Database platform provider",
		communicationPeriodicity: 7,
		lastCommunication: subDays(new Date(), 8),
	},
];

const communicationMethods = [
	{
		id: "1",
		name: "LinkedIn Post",
		description: "Share updates on company LinkedIn page",
		sequence: 1,
		isMandatory: true,
	},
	{
		id: "2",
		name: "LinkedIn Message",
		description: "Direct message to company representatives",
		sequence: 2,
		isMandatory: true,
	},
	{
		id: "3",
		name: "Email",
		description: "Email communication",
		sequence: 3,
		isMandatory: true,
	},
	{
		id: "4",
		name: "Phone Call",
		description: "Direct phone communication",
		sequence: 4,
		isMandatory: false,
	},
	{
		id: "5",
		name: "Other",
		description: "Other forms of communication",
		sequence: 5,
		isMandatory: false,
	},
];

const generateCommunications = (): Communication[] => {
	const communications: Communication[] = [];
	const now = new Date();

	companies.forEach((company) => {
		// Generate past communications
		for (let i = 1; i <= 10; i++) {
			communications.push({
				id: crypto.randomUUID(),
				companyId: company.id,
				type: Object.values(CommunicationType)[
					Math.floor(Math.random() * Object.values(CommunicationType).length)
				],
				date: subDays(now, i * company.communicationPeriodicity).toISOString(),
				notes: `Regular check-in #${i} with ${company.name}`,
			});
		}

		// Add some overdue communications
		if (Math.random() > 0.5) {
			communications.push({
				id: crypto.randomUUID(),
				companyId: company.id,
				type: CommunicationType.EMAIL,
				date: subDays(now, 45).toISOString(),
				notes: "Follow-up needed",
			});
		}

		// Add some due today communications
		if (Math.random() > 0.7) {
			communications.push({
				id: crypto.randomUUID(),
				companyId: company.id,
				type: CommunicationType.LINKEDIN_POST,
				date: now.toISOString(),
				notes: "Scheduled for today",
			});
		}

		// Add some future communications
		if (Math.random() > 0.6) {
			communications.push({
				id: crypto.randomUUID(),
				companyId: company.id,
				type: CommunicationType.PHONE_CALL,
				date: addDays(now, 7).toISOString(),
				notes: "Scheduled follow-up",
			});
		}
	});

	return communications;
};

const generateNotifications = (): Notification[] => {
	const notifications: Notification[] = [];
	const now = new Date();

	companies.forEach((company) => {
		if (Math.random() > 0.7) {
			notifications.push({
				id: crypto.randomUUID(),
				type: "overdue",
				title: "Overdue Communication",
				message: `Communication with ${company.name} is overdue`,
				companyId: company.id,
				isRead: false,
				createdAt: subDays(now, 1).toISOString(),
			});
		}

		if (Math.random() > 0.8) {
			notifications.push({
				id: crypto.randomUUID(),
				type: "due",
				title: "Communication Due Today",
				message: `Scheduled communication with ${company.name} is due today`,
				companyId: company.id,
				isRead: false,
				createdAt: now.toISOString(),
			});
		}
	});

	return notifications;
};

export const dummyData = {
	companies,
	communications: generateCommunications(),
	communicationMethods,
	notifications: generateNotifications(),
};
