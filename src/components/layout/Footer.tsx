import { motion } from "framer-motion";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="py-8 flex flex-col gap-8">
					<div className="flex flex-col sm:flex-row justify-between items-center gap-6">
						<div className="flex items-center gap-3">
							<motion.img
								src="/logo.svg"
								alt="Logo"
								className="h-8 w-8"
								whileHover={{ scale: 1.05 }}
							/>
							<span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
								Calendar.io
							</span>
						</div>

						<div className="flex flex-wrap justify-center gap-6 sm:gap-8">
							<a
								href="#"
								className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
							>
								About Us
							</a>
							<a
								href="#"
								className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
							>
								Features
							</a>
							<a
								href="#"
								className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
							>
								Privacy Policy
							</a>
							<a
								href="#"
								className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
							>
								Terms of Service
							</a>
						</div>
					</div>

					<div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

					<div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
						<p className="text-sm text-gray-500">
							© {currentYear} Calendar.io. All rights reserved.
						</p>

						<div className="flex items-center gap-4">
							<motion.a
								href="#"
								className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
								whileHover={{ scale: 1.1 }}
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
								</svg>
							</motion.a>
							<motion.a
								href="#"
								className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
								whileHover={{ scale: 1.1 }}
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										fillRule="evenodd"
										d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
										clipRule="evenodd"
									/>
								</svg>
							</motion.a>
							<motion.a
								href="#"
								className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
								whileHover={{ scale: 1.1 }}
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										fillRule="evenodd"
										d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 8c0-1.105.896-2 2-2s2 .895 2 2c0 1.104-.896 2-2 2s-2-.896-2-2zm-2.5 6c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5zm9 0c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5z"
										clipRule="evenodd"
									/>
								</svg>
							</motion.a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
