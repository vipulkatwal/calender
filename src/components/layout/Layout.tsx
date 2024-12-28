// import { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../store";
// import { clearUser } from "../../store/slices/userSlice";
// import { toast } from "react-toastify";
// import NotificationsMenu from "../notifications/NotificationsMenu";
// import { motion, AnimatePresence } from "framer-motion";
// import {
// 	HomeIcon,
// 	CalendarIcon,
// 	ChartBarIcon,
// 	Cog8ToothIcon,
// 	ArrowRightOnRectangleIcon,
// 	Bars3Icon,
// 	XMarkIcon,
// } from "@heroicons/react/24/outline";
import Footer from "./Footer";
import Navbar from "./Navbar";

/**
 * Main Layout component that handles the overall page structure and navigation
 * Includes responsive navbar, mobile menu, and main content area
 */
export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Navbar />
			<main className="flex-1 pt-24 pb-8">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
			</main>
			<Footer />
		</div>
	);
}
