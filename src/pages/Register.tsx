import { useState } from "react";
import { api } from "../api";

type RegisterResponse = { id: string; email: string };

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    const m = (err as { message?: unknown }).message;
    return typeof m === "string" ? m : "Error";
  }
  return "Error";
}

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setMsg("");
        try {
          const r = (await api.register(email, password)) as RegisterResponse;
          setMsg(`User created: ${r.email}`);
        } catch (err: unknown) {
          setMsg(getErrorMessage(err));
        }
      }}>
      <h2>Register</h2>
      <input placeholder="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
      <button>Register</button>
      <div>{msg}</div>
    </form>
  );
}
