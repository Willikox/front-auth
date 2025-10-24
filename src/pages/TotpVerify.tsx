import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../hooks/useAuth";
import { finishLogin } from "../auth-utils";

type Tokens = { accessToken: string; refreshToken: string };

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err && "message" in err) {
    const m = (err as { message?: unknown }).message;
    return typeof m === "string" ? m : "Invalid code";
  }
  return "Invalid code";
}

export default function TotpVerify() {
  const nav = useNavigate();
  const { setUser } = useAuth();
  const [code, setCode] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  const ticket = sessionStorage.getItem("totpTicket") ?? "";

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setMsg("");

        if (!ticket) {
          setMsg("Missing TOTP ticket. Please login again.");
          return;
        }
        if (code.trim().length !== 6) {
          setMsg("Enter the 6-digit code.");
          return;
        }

        try {
          const tokens = (await api.verifyTotp(ticket, code)) as Tokens;
          await finishLogin(tokens.accessToken, tokens.refreshToken, setUser);
          sessionStorage.removeItem("totpTicket");
          nav("/me", { state: { flash: "Inicio de sesión seguro completado con 2FA ✅" } });
        } catch (err: unknown) {
          setMsg(getErrorMessage(err));
        }
      }}>
      <h2>Verify TOTP</h2>
      <input placeholder="6-digit code" inputMode="numeric" maxLength={6} value={code} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value.replace(/\D/g, ""))} />
      <button type="submit">Verify</button>
      <div>{msg}</div>
    </form>
  );
}
