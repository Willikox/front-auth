import { useEffect, useState } from "react";
import { api } from "../api";

type MeResponse = { userId: string; email: string };

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err && "message" in err) {
    const m = (err as { message?: unknown }).message;
    return typeof m === "string" ? m : "Error";
  }
  return "Error";
}

export default function Me() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    api
      .me()
      .then((data: MeResponse) => setMe(data))
      .catch((e: unknown) => setErr(getErrorMessage(e)));
  }, []);

  if (err) return <div>Error: {err}</div>;
  if (!me) return <div>Loading...</div>;

  return (
    <div>
      <h2>Me</h2>
      <pre>{JSON.stringify(me, null, 2)}</pre>
    </div>
  );
}
