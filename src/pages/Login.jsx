import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    const user = login(email.trim(), password);
    if (!user) return setError("Wrong email or password.");
    navigate("/" + user.role);
  }

  return (
    <div className="auth">
      <form className="card auth-card" onSubmit={submit}>
        <h2>Campus<span style={{ color: "#0284c7" }}>Link</span></h2>
        <p className="sub">Sign in to continue</p>

        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="error">{error}</div>}

        <button className="btn full" type="submit">Login</button>
        <p style={{ marginTop: 14 }}>New here? <Link to="/signup">Create an account</Link></p>

        <div className="demo">
          <b>Demo accounts</b> (password 123456)<br />
          student@demo.com · faculty@demo.com · industry@demo.com
        </div>
      </form>
    </div>
  );
}