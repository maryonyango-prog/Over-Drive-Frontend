import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

/**
 * Wraps any route that requires authentication.
 * Redirects unauthenticated users to /login, preserving
 * the page they tried to visit so we can redirect back after login.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // While checking persisted auth (e.g. token validation), show nothing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
