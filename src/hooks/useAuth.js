import { useState, useCallback, useEffect } from "react";
import { api } from "../api";

function readUser() {
  try { return JSON.parse(localStorage.getItem("auth_user")); } catch { return null; }
}

export function useAuth() {
  const [user, setUser] = useState(readUser);

  const isAuthenticated = !!user && !!localStorage.getItem("auth_token");

  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, []);

  const persist = useCallback((user, token) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
    setUser(user);
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { user, token } = await api.signIn(email, password);
    persist(user, token);
  }, [persist]);

  const signUp = useCallback(async (name, email, password) => {
    const { user, token } = await api.signUp(name, email, password);
    persist(user, token);
  }, [persist]);

  const signOut = useCallback(async () => {
    try { await api.signOut(); } catch { /* ignore */ }
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
  }, []);

  return { user, isAuthenticated, signIn, signUp, signOut };
}
