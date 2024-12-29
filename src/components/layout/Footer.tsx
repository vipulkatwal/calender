// Import required animation library
import { motion } from "framer-motion";

/**
 * Footer component that displays the site footer with navigation links,
 * newsletter signup, and social media links
 */
export default function Footer() {
	// Get current year for copyright notice
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="py-8 sm:py-12 flex flex-col gap-8 sm:gap-12">
					{/* Main footer content grid */}
					<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
						{/* Logo and description section */}
						<div className="col-span-2 sm:col-span-2 md:col-span-1 space-y-4">
							<motion.div
								className="flex items-center gap-3"
								whileHover={{ scale: 1.02 }}
							>
								<motion.img
									src="/logo.svg"
									alt="Logo"
									className="h-8 w-8 sm:h-10 sm:w-10 drop-shadow-glow"
									whileHover={{ scale: 1.1, rotate: 5 }}
								/>
								<span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-primary-400 bg-clip-text text-transparent">
									Calendar.io
								</span>
							</motion.div>
							<p className="text-sm text-gray-400 leading-relaxed max-w-sm">
								Streamline your company communications with our intelligent
								tracking and reminder system.
							</p>
						</div>

						{/* Quick Links section */}
						<div className="space-y-4">
							<h3 className="text-base sm:text-lg font-semibold text-white">
								Quick Links
							</h3>
							<div className="space-y-2 sm:space-y-3">
								<FooterLink href="#" text="About Us" />
								<FooterLink href="#" text="Features" />
								<FooterLink href="#" text="Privacy Policy" />
								<FooterLink href="#" text="Terms of Service" />
							</div>
						</div>

						{/* Pricing section */}
						<div className="space-y-4">
							<h3 className="text-base sm:text-lg font-semibold text-white">
								Pricing
							</h3>
							<div className="space-y-2 sm:space-y-3">
								<FooterLink href="#" text="Basic Plan" />
								<FooterLink href="#" text="Pro Plan" />
								<FooterLink href="#" text="Enterprise" />
								<FooterLink href="#" text="Compare Plans" />
							</div>
						</div>

						{/* Newsletter signup section */}
						<div className="col-span-2 sm:col-span-2 md:col-span-1 space-y-4">
							<h3 className="text-base sm:text-lg font-semibold text-white">
								Stay Updated
							</h3>
							<p className="text-sm text-gray-400">
								Subscribe to our newsletter for the latest updates and features.
							</p>
							<form className="flex flex-col gap-3 w-full">
								<input
									type="email"
									placeholder="Enter your email"
									className="w-full px-4 h-11 rounded-lg bg-gray-700/50 border border-gray-600
												text-sm text-white placeholder-gray-400
												focus:outline-none focus:ring-2 focus:ring-primary-500
												focus:border-transparent transition-all duration-200"
								/>
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className="w-full h-11 rounded-lg bg-primary-500 hover:bg-primary-600
												text-white text-sm font-medium
												transition-colors duration-200"
								>
									Subscribe
								</motion.button>
							</form>
						</div>
					</div>

					{/* Divider line */}
					<div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

					{/* Footer bottom section with copyright and social links */}
					<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
						<p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
							© {currentYear} Calendar.io. All rights reserved.
						</p>

						<div className="flex items-center gap-4 sm:gap-6">
							<SocialLink href="#" icon="twitter" />
							<SocialLink href="#" icon="github" />
							<SocialLink href="#" icon="linkedin" />
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

/**
 * FooterLink component for rendering individual footer navigation links
 * @param href - The URL the link points to
 * @param text - The text to display for the link
 */
function FooterLink({ href, text }: { href: string; text: string }) {
	return (
		<motion.a
			href={href}
			className="block text-xs sm:text-sm text-gray-400 hover:text-white transition-all duration-200"
			whileHover={{ scale: 1.05, x: 2 }}
		>
			{text}
		</motion.a>
	);
}

/**
 * SocialLink component for rendering social media links with icons
 * @param href - The URL the social link points to
 * @param icon - The name of the social media icon to display
 */
function SocialLink({ href, icon }: { href: string; icon: string }) {
	// SVG path definitions for social media icons
	const iconPath = {
		twitter:
			"M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
		github:
			"M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
		linkedin:
			"M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
	}[icon];

	return (
		<motion.a
			href={href}
			className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
			whileHover={{ scale: 1.15, y: -2 }}
		>
			<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
				<path d={iconPath} />
			</svg>
		</motion.a>
	);
}
