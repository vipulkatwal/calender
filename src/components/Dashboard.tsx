// Import necessary dependencies
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useCommunications } from "../hooks/useCommunications";
import CommunicationModal from "./communications/CommunicationModal";
import "react-loading-skeleton/dist/skeleton.css";

export default function Dashboard() {
	// State for managing company selections, modal visibility and highlight preferences
	const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
	const [showCommunicationModal, setShowCommunicationModal] = useState(false);
	const [highlightsDisabled, setHighlightsDisabled] = useState<string[]>([]);

	// Get communications data from Redux store
	const communications = useSelector(
		(state: RootState) => state.communications.communications
	);

	// Get communication-related utilities from custom hook
	const {
		lastFiveCommunications,
		getNextCommunicationDate,
		getCommunicationStatus,
		companies,
	} = useCommunications();

	// Memoized component for rendering communication badges
	const CommunicationBadges = useMemo(() => {
		return ({ companyId }: { companyId: string }) => (
			<div className="flex flex-wrap gap-2">
				{lastFiveCommunications(companyId).map((comm) => (
					<CommunicationBadge key={comm.id} comm={comm} />
				))}
			</div>
		);
	}, [communications, lastFiveCommunications]);

	// Determine row highlight color based on communication status
	const getRowHighlight = (companyId: string) => {
		if (highlightsDisabled.includes(companyId)) return "";

		const status = getCommunicationStatus(companyId);
		switch (status) {
			case "overdue":
				return "bg-red-100/60";
			case "due":
				return "bg-amber-100/60";
			default:
				return "";
		}
	};

	// Toggle company selection for bulk actions
	const toggleCompanySelection = (companyId: string) => {
		setSelectedCompanies((prev) =>
			prev.includes(companyId)
				? prev.filter((id) => id !== companyId)
				: [...prev, companyId]
		);
	};

	// Toggle highlight visibility for specific companies
	const toggleHighlight = (companyId: string) => {
		setHighlightsDisabled((prev) =>
			prev.includes(companyId)
				? prev.filter((id) => id !== companyId)
				: [...prev, companyId]
		);
	};

	// Define color schemes for different communication types
	function getEventColor(type: string) {
		const colors: Record<
			string,
			{ background: string; border: string; text: string }
		> = {
			"LinkedIn Post": {
				background: "rgb(59 130 246 / 0.8)",
				border: "rgb(37 99 235)",
				text: "white",
			},
			"LinkedIn Message": {
				background: "rgb(16 185 129 / 0.8)",
				border: "rgb(5 150 105)",
				text: "white",
			},
			Email: {
				background: "rgb(139 92 246 / 0.8)",
				border: "rgb(124 58 237)",
				text: "white",
			},
			"Phone Call": {
				background: "rgb(236 72 153 / 0.8)",
				border: "rgb(219 39 119)",
				text: "white",
			},
			Other: {
				background: "rgb(107 114 128 / 0.8)",
				border: "rgb(75 85 99)",
				text: "white",
			},
		};

		return colors[type as keyof typeof colors] || colors.Other;
	}

	// Component for rendering individual communication badges
	const CommunicationBadge = ({ comm }: { comm: any }) => {
		const colors = getEventColor(comm.type);
		return (
			<motion.div
				whileHover={{ scale: 1.05 }}
				className="inline-flex items-center rounded-full text-xs font-medium cursor-help"
				style={{
					backgroundColor: colors.background,
					border: `1px solid ${colors.border}`,
					color: colors.text,
					padding: "0.25rem 0.75rem",
				}}
				title={`${comm.type} - ${format(new Date(comm.date), "PPP")}\n${
					comm.notes
				}`}
			>
				{comm.type} - {format(new Date(comm.date), "MMM d")}
			</motion.div>
		);
	};

	return (
		<div className="space-y-8">
			{/* Enhanced Header with Pattern */}
			<div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-xl p-8 shadow-xl relative overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-10">
					<div className="absolute inset-0 bg-[linear-gradient(30deg,var(--primary)_12%,transparent_12.5%,transparent_87%,var(--primary)_87.5%,var(--primary)),linear-gradient(150deg,var(--primary)_12%,transparent_12.5%,transparent_87%,var(--primary)_87.5%,var(--primary)),linear-gradient(30deg,var(--primary)_12%,transparent_12.5%,transparent_87%,var(--primary)_87.5%,var(--primary)),linear-gradient(150deg,var(--primary)_12%,transparent_12.5%,transparent_87%,var(--primary)_87.5%,var(--primary)),linear-gradient(60deg,var(--primary-dark)_25%,transparent_25.5%,transparent_75%,var(--primary-dark)_75%,var(--primary-dark)),linear-gradient(60deg,var(--primary-dark)_25%,transparent_25.5%,transparent_75%,var(--primary-dark)_75%,var(--primary-dark))] bg-[length:80px_140px] opacity-10"></div>
				</div>

				{/* Header Content */}
				<div className="relative">
					<div className="sm:flex sm:items-center sm:justify-between">
						<div className="text-white">
							<h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
								Dashboard
							</h1>
							<p className="mt-2 text-blue-100">
								Track and manage your company communications
							</p>
						</div>
						<div className="mt-4 sm:mt-0">
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => setShowCommunicationModal(true)}
								disabled={selectedCompanies.length === 0}
								className="bg-white/10 text-white px-6 py-2.5 rounded-lg border border-white/20
									 hover:bg-white/20 transition-all duration-200 disabled:opacity-50
									 disabled:cursor-not-allowed flex items-center gap-2 backdrop-blur-sm"
							>
								<svg
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									/>
								</svg>
								Log Communication
								{selectedCompanies.length > 0 && (
									<span className="ml-2 bg-white/20 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
										{selectedCompanies.length}
									</span>
								)}
							</motion.button>
						</div>
					</div>
				</div>
			</div>

			{/* Stats Grid - Shows key metrics */}
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{[
					{
						title: "Overdue",
						value: companies.filter(
							(c) =>
								getCommunicationStatus(c.id) === "overdue" &&
								!highlightsDisabled.includes(c.id)
						).length,
						description: "Communications overdue",
						gradient: "from-red-500 to-red-600",
						icon: (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						),
					},
					{
						title: "Due Today",
						value: companies.filter(
							(c) =>
								getCommunicationStatus(c.id) === "due" &&
								!highlightsDisabled.includes(c.id)
						).length,
						description: "Communications due today",
						gradient: "from-amber-500 to-amber-600",
						icon: (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						),
					},
					{
						title: "Active Companies",
						value: companies.length,
						description: "Total companies tracked",
						gradient: "from-emerald-500 to-emerald-600",
						icon: (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/>
						),
					},
					{
						title: "Recent Activity",
						value: lastFiveCommunications(companies[0]?.id || "").length,
						description: "Recent communications",
						gradient: "from-blue-500 to-blue-600",
						icon: (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						),
					},
				].map((stat, index) => (
					<motion.div
						key={index}
						whileHover={{ scale: 1.02 }}
						className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-6 text-white shadow-soft relative overflow-hidden`}
					>
						<div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold">{stat.title}</h3>
							<span className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
								<svg
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									{stat.icon}
								</svg>
							</span>
						</div>
						<p className="text-3xl font-bold">{stat.value}</p>
						<p className="mt-1 text-white/80 text-sm">{stat.description}</p>
					</motion.div>
				))}
			</div>

			{/* Companies Table - Main data display */}
			<div className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-100">
				<div className="p-6 border-b border-gray-100">
					<h2 className="text-lg font-semibold text-gray-900">
						Companies Overview
					</h2>
					<p className="mt-1 text-sm text-gray-500">
						Manage and track communications for all companies
					</p>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead>
							<tr>
								<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									<input
										type="checkbox"
										checked={
											selectedCompanies.length === companies.length &&
											companies.length > 0
										}
										onChange={(e) =>
											setSelectedCompanies(
												e.target.checked ? companies.map((c) => c.id) : []
											)
										}
										className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
									/>
								</th>
								<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Company
								</th>
								<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Last Five Communications
								</th>
								<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Next Communication
								</th>
								<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{companies.map((company) => (
								<tr
									key={company.id}
									className={`${getRowHighlight(
										company.id
									)} transition-colors duration-200`}
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<input
											type="checkbox"
											checked={selectedCompanies.includes(company.id)}
											onChange={() => toggleCompanySelection(company.id)}
											className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
										/>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900">
											{company.name}
										</div>
										<div className="text-sm text-gray-500">
											{company.location}
										</div>
									</td>
									<td className="px-4 sm:px-6 py-4">
										<CommunicationBadges companyId={company.id} />
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{getNextCommunicationDate(company.id) ? (
											<div className="text-sm text-gray-900">
												{format(getNextCommunicationDate(company.id)!, "PPP")}
											</div>
										) : (
											<div className="text-sm text-gray-500">Not scheduled</div>
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<button
											onClick={() => toggleHighlight(company.id)}
											className={`text-primary-600 hover:text-primary-900 ${
												highlightsDisabled.includes(company.id)
													? "opacity-50"
													: ""
											}`}
										>
											{highlightsDisabled.includes(company.id)
												? "Enable Highlights"
												: "Disable Highlights"}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Communication Modal for logging new communications */}
			<CommunicationModal
				isOpen={showCommunicationModal}
				onClose={() => {
					setShowCommunicationModal(false);
					setSelectedCompanies([]);
				}}
				selectedCompanies={selectedCompanies}
				onCommunicationAdded={() => {
					setHighlightsDisabled([]);
				}}
			/>
		</div>
	);
}
