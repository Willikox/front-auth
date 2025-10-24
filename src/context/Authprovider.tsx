import { useEffect, useState } from "react";
import { api, clearTokens } from "../api";
import { AuthContext, type User } from "../auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    api.me().then(
      (u) => setUser(u),
      () => setUser(null)
    );
  }, []);

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
}
