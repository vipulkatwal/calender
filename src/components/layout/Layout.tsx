// Import components for layout structure
import Footer from "./Footer";
import Navbar from "./Navbar";

/**
 * Main Layout component that handles the overall page structure and navigation
 * Includes responsive navbar, mobile menu, and main content area
 */
export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		// Container div with full height and gray background
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{/* Navigation bar fixed at top */}
			<Navbar />

			{/* Main content area with top/bottom padding */}
			<main className="flex-1 pt-24 pb-8">
				{/* Centered content container with responsive padding */}
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
			</main>

			{/* Footer component at bottom */}
			<Footer />
		</div>
	);
}
