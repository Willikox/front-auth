import { useEffect, useState } from "react";
import { api } from "../api";

function getMsg(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err && "message" in err) {
    const m = (err as { message?: unknown }).message;
    return typeof m === "string" ? m : "Error";
  }
  return "Error";
}

export default function TotpSetup() {
  const [qr, setQr] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        setMsg("Generando QR...");
        const data = await api.totpSetup();
        setQr(data.qrDataUrl);
        setSecret(data.secretBase32);
        setMsg("Escanea el QR con tu app y pon el código de 6 dígitos.");
      } catch (e) {
        setMsg(getMsg(e));
      }
    })();
  }, []);

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await api.totpVerifySelf(code.trim());
      if (res.enabled) {
        setMsg("✅ TOTP habilitado");
      } else {
        setMsg("No se pudo habilitar TOTP");
      }
    } catch (e) {
      setMsg(getMsg(e));
    }
  };

  const onDisable = async () => {
    setMsg("");
    try {
      const res = await api.totpDisable();
      if (res.enabled === false) {
        setMsg("TOTP deshabilitado");
      } else {
        setMsg("No se pudo deshabilitar");
      }
    } catch (e) {
      setMsg(getMsg(e));
    }
  };

  return (
    <div>
      <h2>Configurar TOTP</h2>

      {qr ? (
        <>
          <img src={qr} alt="QR" style={{ width: 220, height: 220, border: "1px solid #ccc" }} />
          <div style={{ marginTop: 8 }}>
            <small>
              Secret (por si necesitas ingresar manualmente): <code>{secret}</code>
            </small>
          </div>

          <form onSubmit={onVerify} style={{ marginTop: 12 }}>
            <input placeholder="Código 6 dígitos" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
            <button type="submit">Verificar y habilitar</button>
          </form>

          <button onClick={onDisable} style={{ marginTop: 8 }}>
            Deshabilitar TOTP
          </button>
        </>
      ) : (
        <p>Cargando QR…</p>
      )}

      <div style={{ marginTop: 10 }}>{msg}</div>
    </div>
  );
}
