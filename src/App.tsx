import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "./components/auth/LoginForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/Dashboard";
import Calendar from "./components/calendar/Calendar";
import AdminPanel from "./components/admin/AdminPanel";
import Reports from "./components/reports/Reports";

export default function App() {
	return (
		<Router>
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
				<Route path="/login" element={<LoginForm />} />
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
