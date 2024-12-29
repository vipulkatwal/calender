// Import necessary dependencies
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../store";

// Props interface for the ProtectedRoute component
interface ProtectedRouteProps {
	children: React.ReactNode; // Child components to render if authorized
	allowedRoles?: string[]; // Optional array of roles that can access this route
}

/**
 * Component that protects routes by checking user authentication and authorization
 * Redirects to login page if user is not authenticated
 * Redirects to home page if user's role is not authorized
 */
export default function ProtectedRoute({
	children,
	allowedRoles,
}: ProtectedRouteProps) {
	// Get current user from Redux store
	const user = useSelector((state: RootState) => state.user.currentUser);

	// Redirect to login if no user is authenticated
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	// Redirect to home if user's role is not in allowedRoles
	if (allowedRoles && !allowedRoles.includes(user.role)) {
		return <Navigate to="/" replace />;
	}

	// Render children if user is authenticated and authorized
	return <>{children}</>;
}
