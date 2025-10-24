import { useState } from "react";
import { api } from "../api";

type ChangePasswordResponse = { changed: boolean };

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    const m = (err as { message?: unknown }).message;
    return typeof m === "string" ? m : "Error";
  }
  return "Error";
}

export default function ChangePassword() {
  const [currentPassword, setCurrent] = useState<string>("");
  const [newPassword, setNew] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setMsg("");
        try {
          const r = (await api.changePassword(currentPassword, newPassword)) as ChangePasswordResponse;
          setMsg(r.changed ? "Password changed" : "No change");
        } catch (err: unknown) {
          setMsg(getErrorMessage(err));
        }
      }}>
      <h2>Change password</h2>
      <input placeholder="current" type="password" value={currentPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrent(e.target.value)} />
      <input placeholder="new" type="password" value={newPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNew(e.target.value)} />
      <button>Save</button>
      <div>{msg}</div>
    </form>
  );
}
