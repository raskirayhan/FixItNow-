import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Guard against React state batching race conditions on immediate post-login navigation
  const storedToken = typeof window !== "undefined" ? localStorage.getItem("fixitnow_token") : null;
  const storedUserRaw = typeof window !== "undefined" ? localStorage.getItem("fixitnow_user") : null;
  let storedUser: any = null;
  if (storedUserRaw) {
    try {
      const parsed = JSON.parse(storedUserRaw);
      storedUser = parsed?.data ? parsed.data : parsed;
    } catch {
      storedUser = null;
    }
  }

  const effectiveUser = user || storedUser;
  const isEffectivelyAuthenticated = isAuthenticated || (!!storedToken && !!effectiveUser);

  if (loading && !effectiveUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!isEffectivelyAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && effectiveUser && !allowedRoles.includes(effectiveUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
