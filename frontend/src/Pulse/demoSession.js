import { clearAccessToken, setAccessToken } from "../auth/apiClient";

const DEMO_ACTIVE_KEY = "equityiq_pulse_demo_active";
const PRE_DEMO_USER_KEY = "equityiq_pre_demo_user";
const PRE_DEMO_TOKEN_KEY = "equityiq_pre_demo_token";

const buildDemoUserPayload = () => ({
  user: {
    id: "demo-user",
    name: "Demo User",
    email: "demo@equityiq.local",
    role: "user",
    isDemo: true,
    accountBalance: 100000,
  },
  expiresAt: Date.now() + 24 * 60 * 60 * 1000,
});

const isDemoUserPayload = (rawUser) => {
  if (!rawUser) return false;
  try {
    const parsed = JSON.parse(rawUser);
    const user = parsed?.user || parsed;
    return (
      Boolean(user?.isDemo) ||
      user?.id === "demo-user" ||
      user?.email === "demo@equityiq.local"
    );
  } catch {
    return false;
  }
};

export const startPulseDemoSession = () => {
  const isAlreadyActive = sessionStorage.getItem(DEMO_ACTIVE_KEY) === "1";

  if (!isAlreadyActive) {
    const previousUser = localStorage.getItem("equityiq_user");
    const previousToken = localStorage.getItem("equityiq_access_token");

    if (previousUser !== null) {
      sessionStorage.setItem(PRE_DEMO_USER_KEY, previousUser);
    } else {
      sessionStorage.removeItem(PRE_DEMO_USER_KEY);
    }

    if (previousToken !== null) {
      sessionStorage.setItem(PRE_DEMO_TOKEN_KEY, previousToken);
    } else {
      sessionStorage.removeItem(PRE_DEMO_TOKEN_KEY);
    }
  }

  sessionStorage.setItem(DEMO_ACTIVE_KEY, "1");
  localStorage.setItem("equityiq_user", JSON.stringify(buildDemoUserPayload()));
  localStorage.removeItem("equityiq_access_token");
  clearAccessToken();
  window.dispatchEvent(new Event("equityiq_user_updated"));
};

export const cleanupPulseDemoSession = () => {
  const isActive = sessionStorage.getItem(DEMO_ACTIVE_KEY) === "1";
  if (!isActive) return false;

  const rawCurrentUser = localStorage.getItem("equityiq_user");
  const wasDemoUser = isDemoUserPayload(rawCurrentUser);

  if (wasDemoUser) {
    const previousUser = sessionStorage.getItem(PRE_DEMO_USER_KEY);
    const previousToken = sessionStorage.getItem(PRE_DEMO_TOKEN_KEY);

    if (previousUser !== null) {
      localStorage.setItem("equityiq_user", previousUser);
    } else {
      localStorage.removeItem("equityiq_user");
    }

    if (previousToken !== null) {
      localStorage.setItem("equityiq_access_token", previousToken);
      setAccessToken(previousToken);
    } else {
      localStorage.removeItem("equityiq_access_token");
      clearAccessToken();
    }

    window.dispatchEvent(new Event("equityiq_user_updated"));
  }

  sessionStorage.removeItem(DEMO_ACTIVE_KEY);
  sessionStorage.removeItem(PRE_DEMO_USER_KEY);
  sessionStorage.removeItem(PRE_DEMO_TOKEN_KEY);
  return true;
};
