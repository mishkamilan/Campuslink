import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import IndustryDashboard from "./pages/IndustryDashboard";
import { getCurrentUser } from "./store";

function Protected({ role, children }) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== role) return <Navigate to={"/" + user.role} replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student" element={<Protected role="student"><StudentDashboard /></Protected>} />
        <Route path="/faculty" element={<Protected role="faculty"><FacultyDashboard /></Protected>} />
        <Route path="/industry" element={<Protected role="industry"><IndustryDashboard /></Protected>} />
      </Routes>
    </BrowserRouter>
  );
}