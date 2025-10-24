import { createContext } from "react";

export type User = { userId: string; email: string } | null;

export type AuthCtx = {
  user: User;
  setUser: (u: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthCtx | undefined>(undefined);
