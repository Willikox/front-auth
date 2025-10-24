import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Nav() {
  const { user, logout } = useAuth();
  return (
    <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
      <Link to="/">Home</Link>
      <Link to="/register">Register</Link>
      {!user && <Link to="/login">Login</Link>}
      <Link to="/forgot">Forgot</Link>
      <Link to="/reset">Reset</Link>
      {user && (
        <>
          <Link to="/me">Me</Link>
          <Link to="/change-password">Change Password</Link>
          <Link to="/totp-setup">Setup TOTP</Link>
          <Link to="/admin">Admin</Link>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}
