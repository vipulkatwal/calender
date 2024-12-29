import { format, isToday, isBefore, addDays } from "date-fns";

// Formats a date into a readable string format (e.g. "Jan 1, 2024")
export const formatDate = (date: Date | string) => {
	return format(new Date(date), "MMM d, yyyy");
};

// Checks if a given date is overdue (before today and not today)
export const isOverdue = (date: Date | string) => {
	return isBefore(new Date(date), new Date()) && !isToday(new Date(date));
};

// Checks if a given date is today
export const isDueToday = (date: Date | string) => {
	return isToday(new Date(date));
};

// Calculates the next communication date based on the last communication date and periodicity
export const getNextCommunicationDate = (
	lastCommunicationDate: string, // The date of the last communication
	periodicity: number // Number of days between communications
) => {
	return addDays(new Date(lastCommunicationDate), periodicity);
};
