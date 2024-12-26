import { Company, Communication, CommunicationType } from "../types";
import { subDays, addDays } from "date-fns";

const companies: Company[] = [
	{
		id: "1",
		name: "TechCorp Solutions",
		location: "San Francisco, CA",
		linkedinProfile: "https://linkedin.com/company/techcorp",
		emails: ["contact@techcorp.com", "sales@techcorp.com"],
		phoneNumbers: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
		comments: "Key player in AI solutions",
		communicationPeriodicity: 14,
	},
	{
		id: "2",
		name: "Global Innovations Ltd",
		location: "London, UK",
		linkedinProfile: "https://linkedin.com/company/global-innovations",
		emails: ["info@globalinnovations.com"],
		phoneNumbers: ["+44 20 7123 4567"],
		comments: "Interested in blockchain technology",
		communicationPeriodicity: 30,
	},
	{
		id: "3",
		name: "DataFlow Systems",
		location: "Toronto, Canada",
		linkedinProfile: "https://linkedin.com/company/dataflow",
		emails: ["contact@dataflow.com"],
		phoneNumbers: ["+1 (416) 555-0123"],
		comments: "Potential partnership for data analytics",
		communicationPeriodicity: 7,
	},
	{
		id: "4",
		name: "Smart Solutions Inc",
		location: "New York, NY",
		linkedinProfile: "https://linkedin.com/company/smart-solutions",
		emails: ["info@smartsolutions.com", "support@smartsolutions.com"],
		phoneNumbers: ["+1 (212) 555-9876"],
		comments: "IoT solutions provider",
		communicationPeriodicity: 21,
	},
	{
		id: "5",
		name: "EcoTech Ventures",
		location: "Berlin, Germany",
		linkedinProfile: "https://linkedin.com/company/ecotech",
		emails: ["contact@ecotech.com"],
		phoneNumbers: ["+49 30 1234567"],
		comments: "Green technology focus",
		communicationPeriodicity: 14,
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
