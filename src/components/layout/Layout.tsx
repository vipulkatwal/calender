import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { clearUser } from "../../store/slices/userSlice";
import { toast } from "react-toastify";
import NotificationsMenu from "../notifications/NotificationsMenu";
import { motion, AnimatePresence } from "framer-motion";
import {
	HomeIcon,
	CalendarIcon,
	ChartBarIcon,
	Cog8ToothIcon,
	ArrowRightOnRectangleIcon,
	Bars3Icon,
	XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Layout({ children }: { children: React.ReactNode }) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const user = useSelector((state: RootState) => state.user.currentUser);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 0);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Close mobile menu when route changes
	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [location.pathname]);

	const handleLogout = () => {
		dispatch(clearUser());
		toast.success("Logged out successfully");
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<nav
				className={`fixed top-0 left-0 right-0 z-10 transition-all duration-200 ${
					isScrolled
						? "bg-blue-300/80 backdrop-blur-md shadow-md"
						: "bg-blue-300/40 backdrop-blur-sm shadow-md"
				}`}
			>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 justify-between items-center">
						<motion.div
							className="flex-shrink-0"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3 }}
						>
							<Link to="/" className="flex items-center">
								<img
									src="/logo.svg"
									className="h-9 w-9 drop-shadow-lg"
									alt="Logo"
								/>
								<span
									className={`ml-2 text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent transition-all duration-200 ${
										isScrolled ? "opacity-100" : "opacity-90"
									}`}
								>
									Calendar.io
								</span>
							</Link>
						</motion.div>

						<div className="hidden md:flex flex-1 justify-center">
							<motion.div
								className="flex space-x-1 bg-gray-100/80 backdrop-blur-sm rounded-full p-1.5"
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: 0.1 }}
							>
								<NavLink to="/" icon={<HomeIcon className="h-5 w-5" />}>
									Dashboard
								</NavLink>
								<NavLink
									to="/calendar"
									icon={<CalendarIcon className="h-5 w-5" />}
								>
									Calendar
								</NavLink>
								{user?.role === "admin" && (
									<>
										<NavLink
											to="/admin"
											icon={<Cog8ToothIcon className="h-5 w-5" />}
										>
											Admin
										</NavLink>
										<NavLink
											to="/reports"
											icon={<ChartBarIcon className="h-5 w-5" />}
										>
											Reports
										</NavLink>
									</>
								)}
							</motion.div>
						</div>

						<motion.div
							className="hidden md:flex items-center space-x-4"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3, delay: 0.2 }}
						>
							<NotificationsMenu />
							<button
								onClick={handleLogout}
								className="flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-all duration-200"
							>
								<ArrowRightOnRectangleIcon className="h-5 w-5" />
								<span>Logout</span>
							</button>
						</motion.div>

						<div className="flex md:hidden">
							<button
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
								className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
							>
								<span className="sr-only">Open main menu</span>
								{isMobileMenuOpen ? (
									<XMarkIcon className="block h-6 w-6" />
								) : (
									<Bars3Icon className="block h-6 w-6" />
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Mobile menu */}
				<AnimatePresence>
					{isMobileMenuOpen && (
						<motion.div
							className="md:hidden"
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.2 }}
						>
							<div className="px-2 pt-2 pb-3 space-y-1 bg-white/80 backdrop-blur-md shadow-lg">
								<MobileNavLink to="/" icon={<HomeIcon className="h-5 w-5" />}>
									Dashboard
								</MobileNavLink>
								<MobileNavLink
									to="/calendar"
									icon={<CalendarIcon className="h-5 w-5" />}
								>
									Calendar
								</MobileNavLink>
								{user?.role === "admin" && (
									<>
										<MobileNavLink
											to="/admin"
											icon={<Cog8ToothIcon className="h-5 w-5" />}
										>
											Admin
										</MobileNavLink>
										<MobileNavLink
											to="/reports"
											icon={<ChartBarIcon className="h-5 w-5" />}
										>
											Reports
										</MobileNavLink>
									</>
								)}
								<div className="pt-4 flex items-center justify-between px-3">
									<NotificationsMenu />
									<button
										onClick={handleLogout}
										className="flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
									>
										<ArrowRightOnRectangleIcon className="h-5 w-5" />
										<span>Logout</span>
									</button>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</nav>

			<main className="mx-auto max-w-7xl pt-24 pb-6 sm:px-6 lg:px-8">
				{children}
			</main>
		</div>
	);
}

function NavLink({
	to,
	icon,
	children,
}: {
	to: string;
	icon: React.ReactNode;
	children: React.ReactNode;
}) {
	const location = useLocation();
	const isActive = location.pathname === to;

	return (
		<Link
			to={to}
			className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
				isActive
					? "bg-white text-primary-600 shadow-sm"
					: "text-gray-600 hover:bg-white hover:text-primary-600 hover:shadow-sm"
			}`}
		>
			{icon}
			<span>{children}</span>
		</Link>
	);
}

function MobileNavLink({
	to,
	icon,
	children,
}: {
	to: string;
	icon: React.ReactNode;
	children: React.ReactNode;
}) {
	const location = useLocation();
	const isActive = location.pathname === to;

	return (
		<Link
			to={to}
			className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
				isActive
					? "bg-primary-50 text-primary-600"
					: "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
			}`}
		>
			{icon}
			<span>{children}</span>
		</Link>
	);
}
