import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useToast } from "../../Context/ToastContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    logout();
    showToast("You have been signed out successfully.", "success");

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 100);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div
      style={{
        width: "260px",
        backgroundColor: "#1e2937",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        overflowY: "auto",
      }}
    >
      <div style={{ marginBottom: "40px" }}>
        <h2
          style={{
            color: "#00b4d8",
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          OverDrive
        </h2>
      </div>

      <nav style={{ flex: 1 }}>
        <Link
          to="/dashboard"
          style={{
            display: "block",
            padding: "12px 16px",
            borderRadius: "8px",
            backgroundColor: isActive("/dashboard") ? "#334155" : "transparent",
            marginBottom: "8px",
            color: isActive("/dashboard") ? "white" : "#cbd5e1",
            textDecoration: "none",
          }}
        >
          Dashboard
        </Link>

        <Link
          to="/new-valuation"
          style={{
            display: "block",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "8px",
            backgroundColor: isActive("/new-valuation") ? "#334155" : "transparent",
            color: isActive("/new-valuation") ? "white" : "#cbd5e1",
            textDecoration: "none",
          }}
        >
          New Valuation
        </Link>

        <Link
          to="/history"
          style={{
            display: "block",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "8px",
            backgroundColor: isActive("/history") ? "#334155" : "transparent",
            color: isActive("/history") ? "white" : "#cbd5e1",
            textDecoration: "none",
          }}
        >
          History
        </Link>
      </nav>

      <div style={{ marginTop: "auto" }}>
        <div
          style={{
            padding: "12px",
            backgroundColor: "#334155",
            borderRadius: "12px",
            marginBottom: "16px",
          }}
        >
          <p style={{ fontWeight: "600" }}>
            {user?.full_name || user?.name || "User"}
          </p>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            {user?.email}
          </p>
        </div>

        <button
          onClick={handleSignOut}
          style={{
            color: "#ef4444",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "15px",
            padding: "8px 0",
            width: "100%",
            textAlign: "left",
            fontWeight: "500",
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}