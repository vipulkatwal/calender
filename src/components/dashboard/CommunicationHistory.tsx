import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { format } from "date-fns";

interface CommunicationHistoryProps {
	companyId: string;
}

export default function CommunicationHistory({
	companyId,
}: CommunicationHistoryProps) {
	const communications = useSelector(
		(state: RootState) => state.communications.communications
	);

	const lastFiveCommunications = communications
		.filter((comm) => comm.companyId === companyId)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.slice(0, 5);

	return (
		<div className="space-y-1">
			{lastFiveCommunications.map((comm) => (
				<div
					key={comm.id}
					className="group relative flex items-center gap-x-2"
					title={comm.notes}
				>
					<span className="text-xs font-medium text-gray-900">{comm.type}</span>
					<span className="text-xs text-gray-500">
						{format(new Date(comm.date), "MMM d")}
					</span>
					{comm.notes && (
						<div className="absolute left-0 top-6 z-10 hidden w-48 rounded-md bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
							{comm.notes}
						</div>
					)}
				</div>
			))}
		</div>
	);
}
