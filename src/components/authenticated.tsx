import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth-store";

export function Authenticated({ children }: { children: React.ReactNode }) {
  const authenticated = useAuthStore((state) => state.authenticated);
  if (!authenticated) return <Navigate to="/auto/admin/entrar" />;
  return children;
}

export default Authenticated;
