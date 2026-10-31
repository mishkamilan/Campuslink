import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addUser, CATEGORIES } from "../store";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", sector: "all" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return setError("Please fill all fields.");
    const data = { ...form, email: form.email.trim() };
    if (data.role !== "industry") delete data.sector;
    const user = addUser(data);
    if (!user) return setError("This email is already registered.");
    navigate("/" + user.role);
  }

  return (
    <div className="auth">
      <form className="card auth-card" onSubmit={submit}>
        <h2>Create account</h2>
        <p className="sub">Join CampusLink</p>

        <input className="input" placeholder="Full name / Organisation" value={form.name} onChange={set("name")} />
        <input className="input" placeholder="Email" value={form.email} onChange={set("email")} />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={set("password")} />
        <select className="input" value={form.role} onChange={set("role")}>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="industry">Industry / Expert</option>
        </select>

        {form.role === "industry" && (
          <select className="input" value={form.sector} onChange={set("sector")}>
            <option value="all">All sectors (see every problem)</option>
            {Object.entries(CATEGORIES).filter(([k]) => k !== "other").map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        )}
        {error && <div className="error">{error}</div>}

        <button className="btn full" type="submit">Sign up</button>
        <p style={{ marginTop: 14 }}>Already registered? <Link to="/">Login</Link></p>
      </form>
    </div>
  );
}