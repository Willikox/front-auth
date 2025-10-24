import { api, saveTokens } from "./api";

type User = { userId: string; email: string } | null;

export async function finishLogin(accessToken: string, refreshToken: string, setUser: (u: User) => void) {
  saveTokens({ accessToken, refreshToken });
  const u = await api.me();
  setUser(u);
}
