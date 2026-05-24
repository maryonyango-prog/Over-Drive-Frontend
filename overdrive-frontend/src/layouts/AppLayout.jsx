import Sidebar from "../components/navigation/Sidebar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#0a0f1c",
      color: "white",
    }}>
      <Sidebar />

      <main style={{
        flex: 1,
        marginLeft: "260px",
        padding: "40px",
        minHeight: "100vh",
        backgroundColor: "#0a0f1c",
      }}>
        <Outlet />
      </main>
    </div>
  );
}