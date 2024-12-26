import { format, isToday, isBefore, addDays } from "date-fns";

export const formatDate = (date: Date | string) => {
	return format(new Date(date), "MMM d, yyyy");
};

export const isOverdue = (date: Date | string) => {
	return isBefore(new Date(date), new Date()) && !isToday(new Date(date));
};

export const isDueToday = (date: Date | string) => {
	return isToday(new Date(date));
};

export const getNextCommunicationDate = (
	lastCommunicationDate: string,
	periodicity: number
) => {
	return addDays(new Date(lastCommunicationDate), periodicity);
};
