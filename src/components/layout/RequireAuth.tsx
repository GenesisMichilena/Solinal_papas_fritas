import { Navigate, Outlet } from "react-router-dom";
import { useAppState } from "@/context/AppStateContext";

/** Gates every app route behind login — unauthenticated visits (including
 * direct URL access) redirect to /login. See Login.tsx. */
export function RequireAuth() {
  const { state } = useAppState();
  if (!state.session.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
