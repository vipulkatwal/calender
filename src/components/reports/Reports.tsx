import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { CommunicationType } from "../../types";
import { showToast } from "../common/Toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement
);

export default function Reports() {
	const [selectedMonth, setSelectedMonth] = useState(
		format(new Date(), "yyyy-MM")
	);
	const [selectedCompany, setSelectedCompany] = useState<string>("all");

	const communications = useSelector(
		(state: RootState) => state.communications.communications
	);
	const companies = useSelector(
		(state: RootState) => state.companies.companies
	);

	// Filter communications based on selected month and company
	const filteredCommunications = communications.filter((comm) => {
		const commDate = new Date(comm.date);
		const [year, month] = selectedMonth.split("-").map(Number);
		const monthStart = startOfMonth(new Date(year, month - 1));
		const monthEnd = endOfMonth(new Date(year, month - 1));

		const isInDateRange = commDate >= monthStart && commDate <= monthEnd;
		const isForCompany =
			selectedCompany === "all" || comm.companyId === selectedCompany;
		return isInDateRange && isForCompany;
	});

	// Prepare data for charts
	const communicationsByType = {
		labels: Object.values(CommunicationType),
		datasets: [
			{
				data: Object.values(CommunicationType).map(
					(type) =>
						filteredCommunications.filter((comm) => comm.type === type).length
				),
				backgroundColor: [
					"rgba(59, 130, 246, 0.8)", // blue
					"rgba(16, 185, 129, 0.8)", // green
					"rgba(139, 92, 246, 0.8)", // purple
					"rgba(236, 72, 153, 0.8)", // pink
					"rgba(107, 114, 128, 0.8)", // gray
				],
				borderWidth: 0,
			},
		],
	};

	const communicationsByCompany = {
		labels: companies.map((c) => c.name),
		datasets: [
			{
				label: "Communications",
				data: companies.map(
					(company) =>
						filteredCommunications.filter(
							(comm) => comm.companyId === company.id
						).length
				),
				backgroundColor: "rgba(59, 130, 246, 0.8)",
				borderRadius: 6,
			},
		],
	};

	const downloadReport = async (reportFormat: "csv" | "pdf") => {
		try {
			if (reportFormat === "csv") {
				// Prepare CSV data with proper escaping for commas and quotes
				const csvContent = [
					["Date", "Company", "Type", "Notes"],
					...filteredCommunications.map((comm) => [
						format(new Date(comm.date), "yyyy-MM-dd"),
						companies.find((c) => c.id === comm.companyId)?.name || "",
						comm.type,
						// Escape quotes and commas in notes
						comm.notes.replace(/"/g, '""').replace(/,/g, ";"),
					]),
				]
					.map((row) => row.map((cell) => `"${cell}"`).join(","))
					.join("\n");

				// Create and trigger download
				const blob = new Blob([csvContent], {
					type: "text/csv;charset=utf-8;",
				});
				const link = document.createElement("a");
				const url = URL.createObjectURL(blob);
				link.setAttribute("href", url);
				link.setAttribute(
					"download",
					`communications-report-${selectedMonth}.csv`
				);
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);
				showToast.success("CSV report downloaded successfully");
			} else {
				const reportElement = document.getElementById("report-content");
				if (!reportElement) {
					showToast.error("Could not find report content");
					return;
				}

				const loadingToastId = showToast.loading("Generating PDF...");

				try {
					// Wait for charts to render
					await new Promise((resolve) => setTimeout(resolve, 1000));

					const canvas = await html2canvas(reportElement, {
						scale: 2,
						logging: false,
						useCORS: true,
						allowTaint: true,
						backgroundColor: "#ffffff",
						windowWidth: reportElement.scrollWidth,
						windowHeight: reportElement.scrollHeight,
					});

					const imgData = canvas.toDataURL("image/png");

					// A4 dimensions in mm
					const pdf = new jsPDF({
						orientation: "portrait",
						unit: "mm",
						format: "a4",
					});

					const pageWidth = pdf.internal.pageSize.getWidth();
					const pageHeight = pdf.internal.pageSize.getHeight();

					const imgWidth = pageWidth;
					const imgHeight = (canvas.height * imgWidth) / canvas.width;

					let heightLeft = imgHeight;
					let position = 0;

					// First page
					pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
					heightLeft -= pageHeight;

					// Additional pages if needed
					while (heightLeft >= 0) {
						position = heightLeft - imgHeight;
						pdf.addPage();
						pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
						heightLeft -= pageHeight;
					}

					pdf.save(`communications-report-${selectedMonth}.pdf`);
					toast.dismiss(loadingToastId);
					showToast.success("PDF report downloaded successfully");
				} catch (error) {
					console.error("PDF generation error:", error);
					toast.dismiss(loadingToastId);
					showToast.error("Failed to generate PDF");
				}
			}
		} catch (error) {
			console.error("Download error:", error);
			showToast.error("Failed to download report");
		}
	};

	function getTypeStyle(type: string) {
		const styles = {
			"LinkedIn Post": {
				background: "rgb(59 130 246 / 0.1)", // blue-500/10
				text: "rgb(59 130 246)", // blue-500
				border: "rgb(37 99 235)", // blue-600
			},
			"LinkedIn Message": {
				background: "rgb(16 185 129 / 0.1)", // green-500/10
				text: "rgb(16 185 129)", // green-500
				border: "rgb(5 150 105)", // green-600
			},
			Email: {
				background: "rgb(139 92 246 / 0.1)", // purple-500/10
				text: "rgb(139 92 246)", // purple-500
				border: "rgb(124 58 237)", // purple-600
			},
			"Phone Call": {
				background: "rgb(236 72 153 / 0.1)", // pink-500/10
				text: "rgb(236 72 153)", // pink-500
				border: "rgb(219 39 119)", // pink-600
			},
			default: {
				background: "rgb(107 114 128 / 0.1)", // gray-500/10
				text: "rgb(107 114 128)", // gray-500
				border: "rgb(75 85 99)", // gray-600
			},
		};

		return styles[type] || styles.default;
	}

	return (
		<div className="space-y-8">
			{/* Enhanced Header with Gradient Background */}
			<div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-soft p-8 text-white">
				<div className="sm:flex sm:items-center sm:justify-between">
					<div>
						<h1 className="text-3xl font-bold">Reports & Analytics</h1>
						<p className="mt-2 text-primary-100">
							Comprehensive insights into your communication patterns
						</p>
					</div>
					<div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-end gap-4">
						<div className="relative">
							<input
								type="month"
								value={selectedMonth}
								onChange={(e) => setSelectedMonth(e.target.value)}
								className="input-field pr-10 bg-white/10 border-white/20 text-white placeholder-white/60"
							/>
							<span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60">
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
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</span>
						</div>
						<div className="flex gap-2">
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => downloadReport("csv")}
								className="btn-secondary flex items-center gap-2"
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
										d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								CSV
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => downloadReport("pdf")}
								className="btn-primary flex items-center gap-2"
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
										d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
									/>
								</svg>
								PDF
							</motion.button>
						</div>
					</div>
				</div>

				{/* Enhanced Filter Section */}
				<div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
					<div className="flex flex-wrap items-center gap-4">
						<div className="flex-1 min-w-[200px]">
							<label className="text-sm font-medium text-white/80 mb-1 block">
								Company Filter
							</label>
							<select
								value={selectedCompany}
								onChange={(e) => setSelectedCompany(e.target.value)}
								className="input-field bg-white/10 border-white/20 text-white w-full appearance-none"
								style={{
									backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
									backgroundPosition: `right 0.5rem center`,
									backgroundRepeat: "no-repeat",
									backgroundSize: "1.5em 1.5em",
									paddingRight: "2.5rem",
								}}
							>
								<option value="all" className="bg-gray-800 text-white">
									All Companies
								</option>
								{companies.map((company) => (
									<option
										key={company.id}
										value={company.id}
										className="bg-gray-800 text-white"
									>
										{company.name}
									</option>
								))}
							</select>
						</div>
						<div className="flex items-center gap-4 text-white/80">
							<span className="text-sm">
								Showing {filteredCommunications.length} communications
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Content to be included in PDF */}
			<div
				id="report-content"
				className="space-y-8 bg-white p-8 rounded-xl"
				style={{ minHeight: "800px" }}
			>
				{/* Stats Overview */}
				<div className="grid gap-6 sm:grid-cols-3">
					<div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-soft p-6 text-white">
						<h3 className="text-lg font-semibold mb-4">Total Communications</h3>
						<p className="text-3xl font-bold">
							{filteredCommunications.length}
						</p>
						<p className="text-white/80 text-sm mt-1">
							in {format(new Date(selectedMonth), "MMMM yyyy")}
						</p>
					</div>

					<div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-soft p-6 text-white">
						<h3 className="text-lg font-semibold mb-4">Active Companies</h3>
						<p className="text-3xl font-bold">
							{new Set(filteredCommunications.map((c) => c.companyId)).size}
						</p>
						<p className="text-white/80 text-sm mt-1">
							companies communicated with
						</p>
					</div>

					<div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-soft p-6 text-white">
						<h3 className="text-lg font-semibold mb-4">Most Used Method</h3>
						<p className="text-3xl font-bold">
							{Object.entries(
								filteredCommunications.reduce((acc, curr) => {
									acc[curr.type] = (acc[curr.type] || 0) + 1;
									return acc;
								}, {} as Record<string, number>)
							).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"}
						</p>
						<p className="text-white/80 text-sm mt-1">communication method</p>
					</div>
				</div>

				{/* Charts */}
				<div className="grid gap-6 lg:grid-cols-3">
					<div className="bg-white rounded-xl shadow-soft p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-6">
							Communications by Type
						</h3>
						<Pie
							data={communicationsByType}
							options={{
								responsive: true,
								plugins: {
									legend: {
										position: "bottom",
										labels: {
											padding: 20,
											usePointStyle: true,
										},
									},
								},
							}}
						/>
					</div>

					<div className="bg-white rounded-xl shadow-soft p-6 lg:col-span-2">
						<h3 className="text-lg font-semibold text-gray-900 mb-6">
							Communications by Company
						</h3>
						<Bar
							data={communicationsByCompany}
							options={{
								responsive: true,
								plugins: {
									legend: {
										display: false,
									},
								},
								scales: {
									y: {
										beginAtZero: true,
										ticks: {
											stepSize: 1,
										},
									},
								},
							}}
						/>
					</div>
				</div>

				{/* Enhanced Activity Log */}
				<div className="bg-white rounded-xl shadow-soft overflow-hidden">
					<div className="p-6 border-b border-gray-100">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-semibold text-gray-900">
									Activity Log
								</h3>
								<p className="mt-1 text-sm text-gray-600">
									Detailed communication history
								</p>
							</div>
							<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
								{filteredCommunications.length} communications
							</span>
						</div>
					</div>

					{/* Enhanced Table */}
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead>
								<tr>
									<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Date
									</th>
									<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Company
									</th>
									<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Type
									</th>
									<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Notes
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredCommunications
									.sort(
										(a, b) =>
											new Date(b.date).getTime() - new Date(a.date).getTime()
									)
									.map((comm) => {
										const company = companies.find(
											(c) => c.id === comm.companyId
										);
										const typeStyle = getTypeStyle(comm.type);

										return (
											<motion.tr
												key={comm.id}
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												className="hover:bg-gray-50 transition-colors"
											>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{format(new Date(comm.date), "MMMM do, yyyy")}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">
														{company?.name}
													</div>
													<div className="text-sm text-gray-500">
														{company?.location}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span
														className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
														style={{
															backgroundColor: typeStyle.background,
															color: typeStyle.text,
															border: `1px solid ${typeStyle.border}`,
														}}
													>
														{comm.type}
													</span>
												</td>
												<td className="px-6 py-4 text-sm text-gray-500">
													{comm.notes}
												</td>
											</motion.tr>
										);
									})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
