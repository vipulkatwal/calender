// Import necessary dependencies for routing and notifications
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import authentication related components
import LoginForm from "./components/auth/LoginForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Import layout and page components
import Layout from "./components/layout/Layout";
import Dashboard from "./components/Dashboard";
import Calendar from "./components/calendar/Calendar";
import AdminPanel from "./components/admin/AdminPanel";
import Reports from "./components/reports/Reports";

export default function App() {
	return (
		<Router>
			{/* Global toast notification container */}
			<ToastContainer
				position="bottom-right"
				autoClose={4000}
				limit={4}
				newestOnTop
				closeOnClick
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			<Routes>
				{/* Public route */}
				<Route path="/login" element={<LoginForm />} />

				{/* Protected routes - require authentication */}
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Layout>
								<Dashboard />
							</Layout>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/calendar"
					element={
						<ProtectedRoute>
							<Layout>
								<Calendar />
							</Layout>
						</ProtectedRoute>
					}
				/>

				{/* Admin-only routes */}
				<Route
					path="/admin"
					element={
						<ProtectedRoute allowedRoles={["admin"]}>
							<Layout>
								<AdminPanel />
							</Layout>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/reports"
					element={
						<ProtectedRoute allowedRoles={["admin"]}>
							<Layout>
								<Reports />
							</Layout>
						</ProtectedRoute>
					}
				/>
			</Routes>
		</Router>
	);
}
