import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../store/slices/userSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // For animations

// Component for handling user authentication
export default function LoginForm() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	// State to store form input values
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	// Handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Check for demo admin credentials
		if (
			formData.email === "admin@example.com" &&
			formData.password === "admin"
		) {
			dispatch(
				setUser({
					id: "1",
					name: "Admin User",
					email: formData.email,
					role: "admin",
				})
			);
			navigate("/");
		}
		// Check for demo user credentials
		else if (
			formData.email === "user@example.com" &&
			formData.password === "user"
		) {
			dispatch(
				setUser({
					id: "2",
					name: "Regular User",
					email: formData.email,
					role: "user",
				})
			);
			navigate("/");
		} else {
			toast.error("Invalid credentials");
		}
	};

	return (
		// Main container with gradient background
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 py-12 px-4 sm:px-6 lg:px-8">
			{/* Animated container for the login form */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-md w-full"
			>
				<div className="card space-y-8">
					<div>
						{/* Animated logo */}
						<motion.img
							initial={{ scale: 0.5 }}
							animate={{ scale: 1 }}
							transition={{
								type: "spring",
								stiffness: 260,
								damping: 20,
							}}
							className="mx-auto h-20 w-auto"
							src="/logo.png"
							alt="Logo"
						/>
						{/* Animated heading */}
						<motion.h2
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className="mt-6 text-center text-3xl font-extrabold text-gray-900"
						>
							Sign in to your account
						</motion.h2>
					</div>
					<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
						<div className="space-y-4">
							{/* Email input field */}
							<div>
								<label htmlFor="email-address" className="label">
									Email address
								</label>
								<input
									id="email-address"
									name="email"
									type="email"
									autoComplete="email"
									required
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									className="input-field"
									placeholder="Enter your email"
								/>
							</div>
							{/* Password input field */}
							<div>
								<label htmlFor="password" className="label">
									Password
								</label>
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
									className="input-field"
									placeholder="Enter your password"
								/>
							</div>
						</div>

						{/* Animated submit button */}
						<motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
							<button type="submit" className="btn-primary w-full">
								Sign in
							</button>
						</motion.div>

						{/* Demo credentials information */}
						<div className="text-center text-sm text-gray-600">
							<p>Demo Credentials:</p>
							<p>Admin: admin@example.com / admin</p>
							<p>User: user@example.com / user</p>
						</div>
					</form>
				</div>
			</motion.div>
		</div>
	);
}
