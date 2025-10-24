import { useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

type ForgotResponse = { ok: boolean; previewUrl?: string };

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err && "message" in err) {
    const m = (err as { message?: unknown }).message;
    return typeof m === "string" ? m : "Error";
  }
  return "Error";
}

export default function Forgot() {
  const [email, setEmail] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [mailUrl, setMailUrl] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setMsg("");
        setMailUrl(null);
        try {
          const r = (await api.forgot(email)) as ForgotResponse;
          if (!r.ok) throw new Error("No se pudo enviar el email");
          setMsg("Email enviado. Abre tu bandeja, copia el token y ve a Reset.");
          if (r.previewUrl) setMailUrl(r.previewUrl);
          if (!r.previewUrl) {
            const DEF = import.meta.env.VITE_MAIL_UI ?? "http://localhost:1080";
            setMailUrl(DEF);
          }
        } catch (err: unknown) {
          setMsg(getErrorMessage(err));
        }
      }}>
      <h2>Forgot</h2>
      <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button>Send</button>

      <div style={{ marginTop: 12 }}>{msg}</div>

      {mailUrl && (
        <div style={{ marginTop: 8 }}>
          <a href={mailUrl} target="_blank" rel="noreferrer">
            Abrir bandeja (MailDev/Ethereal)
          </a>
          {" · "}
          <Link to="/reset">Ir a Reset</Link>
        </div>
      )}
    </form>
  );
}
