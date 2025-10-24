import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api";

type ResetResponse = { changed: boolean };

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    const m = (err as { message?: unknown }).message;
    return typeof m === "string" ? m : "Error";
  }
  return "Error";
}

export default function Reset() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [newPwd, setNewPwd] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    const t = params.get("token");
    if (t) setToken(t);
  }, [params]);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setMsg("");
        try {
          const r = (await api.reset(token, newPwd)) as ResetResponse;
          if (r.changed) {
            setMsg("Password actualizado. Redirigiendo a Login…");
            setTimeout(() => navigate("/login"), 1500);
          } else {
            setMsg("Error");
          }
        } catch (err: unknown) {
          setMsg(getErrorMessage(err));
        }
      }}>
      <h2>Reset password</h2>
      <input placeholder="token" value={token} onChange={(e) => setToken(e.target.value)} />
      <input placeholder="new password" type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
      <button>Reset</button>
      {msg && (
        <div role="alert" style={{ marginTop: 8 }}>
          {msg}
        </div>
      )}
    </form>
  );
}
