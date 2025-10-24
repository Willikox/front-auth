import { useState } from "react";
import { api } from "../api";

type BlockResp = { blocked: boolean };

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    const m = (err as { message?: unknown }).message;
    return typeof m === "string" ? m : "Error";
  }
  return "Error";
}

export default function AdminUsers() {
  const [id, setId] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  const handleBlock = async (action: "block" | "unblock") => {
    setMsg("");
    if (!id.trim()) {
      setMsg("Provide a user id");
      return;
    }
    try {
      const r: BlockResp = action === "block" ? await api.blockUser(id) : await api.unblockUser(id);
      setMsg(JSON.stringify(r));
    } catch (err: unknown) {
      setMsg(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h2>Admin: Block/Unblock</h2>
      <input placeholder="user id" value={id} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setId(e.target.value)} />
      <button onClick={() => handleBlock("block")}>Block</button>
      <button onClick={() => handleBlock("unblock")}>Unblock</button>
      <div>{msg}</div>
    </div>
  );
}
