import { useAuth } from "../auth/AuthProvider";

// Helper to get Authorization header
export default function useAuthHeader() {
  const { accessToken } = useAuth();
  if (!accessToken) return {};
  return { Authorization: `Bearer ${accessToken}` };
}
