console.log("API_URL =", import.meta.env.VITE_API_URL);

const RAW = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const API_URL = RAW.replace(/\/+$/, "");

export type Tokens = { accessToken: string; refreshToken: string };

let accessToken: string | null = null;
let refreshToken: string | null = null;

export function loadTokensFromStorage() {
  accessToken = localStorage.getItem("accessToken");
  refreshToken = localStorage.getItem("refreshToken");
}
export function saveTokens(t: Tokens) {
  accessToken = t.accessToken;
  refreshToken = t.refreshToken;
  localStorage.setItem("accessToken", t.accessToken);
  localStorage.setItem("refreshToken", t.refreshToken);
}
export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

async function baseFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (res.status === 401 && refreshToken) {
    const rr = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (rr.ok) {
      const data = await rr.json();
      saveTokens(data);
      headers.set("Authorization", `Bearer ${data.accessToken}`);
      return fetch(`${API_URL}${path}`, { ...init, headers });
    } else {
      clearTokens();
    }
  }
  return res;
}

export const api = {
  async register(email: string, password: string) {
    const r = await baseFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) throw await r.json();
    return r.json();
  },

  async login(email: string, password: string) {
    const r = await baseFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await r.json();
    if (!r.ok) throw data;
    return data;
  },

  async verifyTotp(ticket: string, code: string) {
    const r = await baseFetch("/auth/totp/verify", {
      method: "POST",
      body: JSON.stringify({ ticket, code }),
    });
    const data = await r.json();
    if (!r.ok) throw data;
    return data as Tokens;
  },

  async me() {
    const r = await baseFetch("/me");
    if (!r.ok) throw await r.json();
    return r.json();
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const r = await baseFetch("/me/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!r.ok) throw await r.json();
    return r.json();
  },

  async forgot(email: string) {
    const r = await baseFetch("/auth/forgot", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    if (!r.ok) throw await r.json();
    return r.json();
  },

  async reset(token: string, newPassword: string) {
    const r = await baseFetch("/auth/reset", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    });
    if (!r.ok) throw await r.json();
    return r.json();
  },

  async blockUser(id: string) {
    const r = await baseFetch(`/admin/users/${id}/block`, { method: "PATCH" });
    if (!r.ok) throw await r.json();
    return r.json();
  },

  async unblockUser(id: string) {
    const r = await baseFetch(`/admin/users/${id}/unblock`, {
      method: "PATCH",
    });
    if (!r.ok) throw await r.json();
    return r.json();
  },

  async totpSetup() {
    const r = await baseFetch("/me/totp/setup", { method: "POST" });
    const data = await r.json();
    if (!r.ok) throw data;
    return data as { otpauthUrl: string; qrDataUrl: string; secretBase32: string };
  },

  async totpVerifySelf(code: string) {
    const r = await baseFetch("/me/totp/verify", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    const data = await r.json();
    if (!r.ok) throw data;
    return data as { enabled: boolean };
  },

  async totpDisable() {
    const r = await baseFetch("/me/totp/disable", { method: "POST" });
    const data = await r.json();
    if (!r.ok) throw data;
    return data as { enabled: boolean };
  },
};

loadTokensFromStorage();
