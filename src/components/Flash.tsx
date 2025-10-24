import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Flash() {
  const location = useLocation() as { state?: { flash?: string } };
  const nav = useNavigate();
  const [msg, setMsg] = useState(location.state?.flash ?? "");

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => {
      nav(".", { replace: true, state: {} });
      setMsg("");
    }, 2200);
    return () => clearTimeout(t);
  }, [msg, nav]);

  if (!msg) return null;

  return (
    <div
      style={{
        background: "#e7f7ec",
        border: "1px solid #87d2a7",
        color: "#065f46",
        padding: "8px 12px",
        borderRadius: 6,
        marginBottom: 12,
        maxWidth: 520,
      }}>
      {msg}
    </div>
  );
}
