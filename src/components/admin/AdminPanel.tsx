import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CompanyManager from "./CompanyManager";
import CommunicationMethodsManager from "./CommunicationMethodsManager";
import {
	BuildingOfficeIcon,
	ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

/**
 * AdminPanel component that provides an interface for managing companies and communication methods
 * Features animated tab switching and responsive design
 */
export default function AdminPanel() {
	// Track which tab is currently active
	const [activeTab, setActiveTab] = useState<"companies" | "methods">(
		"companies"
	);

	// Define tab configuration including icons, labels and descriptions
	const tabs = [
		{
			key: "companies",
			label: "Companies",
			icon: BuildingOfficeIcon,
			description: "Manage company profiles and communication settings",
		},
		{
			key: "methods",
			label: "Communication Methods",
			icon: ChatBubbleLeftRightIcon,
			description: "Configure and organize communication channels",
		},
	];

	return (
		<div className="space-y-8">
			{/* Header section with gradient background */}
			<div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-soft p-8 text-white">
				<h1 className="text-3xl font-bold">Admin Panel</h1>
				<p className="mt-2 text-primary-100">
					Configure and manage system settings
				</p>

				{/* Tab navigation buttons */}
				<div className="mt-8 flex flex-col sm:flex-row gap-4">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						const isActive = activeTab === tab.key;
						return (
							<motion.button
								key={tab.key}
								onClick={() => setActiveTab(tab.key as "companies" | "methods")}
								className={`relative flex-1 rounded-xl p-4 text-left transition-all duration-200 ${
									isActive
										? "bg-white text-gray-900"
										: "bg-white/10 text-white hover:bg-white/20"
								}`}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<div className="flex items-center gap-3">
									{/* Tab icon with conditional styling */}
									<div
										className={`p-2 rounded-lg ${
											isActive ? "bg-primary-100" : "bg-white/10"
										}`}
									>
										<Icon
											className={`h-5 w-5 ${
												isActive ? "text-primary-600" : "text-white"
											}`}
										/>
									</div>
									{/* Tab content */}
									<div>
										<h3
											className={`font-semibold ${
												isActive ? "text-gray-900" : "text-white"
											}`}
										>
											{tab.label}
										</h3>
										<p
											className={`text-sm mt-1 ${
												isActive ? "text-gray-500" : "text-white/70"
											}`}
										>
											{tab.description}
										</p>
									</div>
								</div>
							</motion.button>
						);
					})}
				</div>
			</div>

			{/* Content area with animated transitions between tabs */}
			<AnimatePresence mode="wait">
				<motion.div
					key={activeTab}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.2 }}
					className="bg-white rounded-xl shadow-soft p-6"
				>
					{activeTab === "companies" ? (
						<CompanyManager />
					) : (
						<CommunicationMethodsManager />
					)}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
