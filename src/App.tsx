import { Routes, Route, Link } from "react-router-dom";
import Nav from "./components/Nav";
import Register from "./pages/Register";
import Login from "./pages/Login";
import TotpVerify from "./pages/TotpVerify";
import Me from "./pages/Me";
import ChangePassword from "./pages/ChangePassword";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import AdminUsers from "./pages/AdminUsers";
import TotpSetup from "./pages/TotpSetup";
import Flash from "./components/Flash";

export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>SecureAuth Demo</h1>
      <Nav />
      <Flash />
      <Routes>
        <Route path="/" element={<div>Home — prueba los formularios</div>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/totp" element={<TotpVerify />} />
        <Route path="/me" element={<Me />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/admin" element={<AdminUsers />} />
        <Route path="/totp-setup" element={<TotpSetup />} />
        <Route
          path="*"
          element={
            <div>
              404 <Link to="/">Volver</Link>
            </div>
          }
        />
      </Routes>
    </div>
  );
}
