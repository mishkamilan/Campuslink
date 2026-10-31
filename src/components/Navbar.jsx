import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../store";

export default function Navbar() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="nav">
      <div className="brand">Campus<span>Link</span></div>
      <div className="who">
        <span>{user?.name}</span>
        <span className="role-tag">{user?.role}</span>
        <button className="btn ghost" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}