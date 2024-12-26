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

	const navigation = [
		{ name: "Dashboard", href: "/", icon: HomeIcon },
		{ name: "Calendar", href: "/calendar", icon: CalendarIcon },
		...(user?.role === "admin"
			? [
					{ name: "Admin", href: "/admin", icon: Cog8ToothIcon },
					{ name: "Reports", href: "/reports", icon: ChartBarIcon },
			  ]
			: []),
	];

	const handleLogout = () => {
		dispatch(clearUser());
		toast.success("Logged out successfully");
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<nav
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					isScrolled
						? "bg-gradient-to-r from-primary-600/90 to-primary-700/90 backdrop-blur-lg shadow-lg"
						: "bg-gradient-to-r from-primary-600 to-primary-700 shadow"
				}`}
			>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 justify-between">
						<div className="flex">
							<div className="flex flex-shrink-0 items-center">
								<img
									className="h-8 w-auto brightness-0 invert"
									src="/logo.svg"
									alt="Company logo"
								/>
							</div>
							<div className="hidden sm:ml-8 sm:flex sm:space-x-8">
								{navigation.map((item) => {
									const Icon = item.icon;
									return (
										<Link
											key={item.name}
											to={item.href}
											className={`inline-flex items-center space-x-2 border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
												location.pathname === item.href
													? "border-white text-white"
													: "border-transparent text-white/70 hover:border-white/30 hover:text-white"
											}`}
										>
											<Icon className="h-5 w-5" />
											<span>{item.name}</span>
										</Link>
									);
								})}
							</div>
						</div>
						<div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
							<div className="text-white">
								<NotificationsMenu />
							</div>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={handleLogout}
								className="group flex items-center space-x-2 rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/20 hover:bg-white/20 transition-all duration-200"
							>
								<ArrowRightOnRectangleIcon className="h-5 w-5 text-white/70 group-hover:text-white" />
								<span>Logout</span>
							</motion.button>
						</div>
						<div className="-mr-2 flex items-center sm:hidden">
							<button
								type="button"
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
								className="inline-flex items-center justify-center rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white focus:outline-none"
							>
								<span className="sr-only">Open main menu</span>
								<svg
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>

				{/* Mobile menu */}
				<AnimatePresence>
					{isMobileMenuOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className="sm:hidden bg-primary-800/50 backdrop-blur-lg"
						>
							<div className="space-y-1 pb-3 pt-2">
								{navigation.map((item) => {
									const Icon = item.icon;
									return (
										<Link
											key={item.name}
											to={item.href}
											className={`flex items-center space-x-2 border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
												location.pathname === item.href
													? "border-white bg-white/10 text-white"
													: "border-transparent text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white"
											}`}
											onClick={() => setIsMobileMenuOpen(false)}
										>
											<Icon className="h-5 w-5" />
											<span>{item.name}</span>
										</Link>
									);
								})}
								<button
									type="button"
									onClick={handleLogout}
									className="flex w-full items-center space-x-2 border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white"
								>
									<ArrowRightOnRectangleIcon className="h-5 w-5" />
									<span>Logout</span>
								</button>
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
