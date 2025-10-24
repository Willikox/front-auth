import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../hooks/useAuth";
import { finishLogin } from "../auth-utils";

type LoginSuccess = {
  accessToken: string;
  refreshToken: string;
  requiresTOTP?: false;
};

type LoginNeedsTotp = {
  requiresTOTP: true;
  ticket: string;
};

type LoginResponse = LoginSuccess | LoginNeedsTotp;

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    return typeof msg === "string" ? msg : "Login error";
  }
  return "Login error";
}

export default function Login() {
  const nav = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setMsg("");

        try {
          const res = (await api.login(email, password)) as LoginResponse;

          if ("requiresTOTP" in res && res.requiresTOTP && res.ticket) {
            sessionStorage.setItem("totpTicket", res.ticket);
            setMsg("Introduce el código TOTP…");
            setTimeout(() => nav("/totp"), 200);
            return;
          }

          if ("accessToken" in res && "refreshToken" in res) {
            setMsg("Login exitoso. Redirigiendo…");
            await finishLogin(res.accessToken, res.refreshToken, setUser);
            setTimeout(() => nav("/me"), 300);
            return;
          }

          setMsg("Respuesta inesperada del servidor");
        } catch (err: unknown) {
          setMsg(getErrorMessage(err));
        }
      }}>
      <h2>Login</h2>
      <input placeholder="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
      <button>Login</button>
      <div>{msg}</div>
    </form>
  );
}
