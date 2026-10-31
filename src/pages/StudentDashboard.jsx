import { useState } from "react";
import Navbar from "../components/Navbar";
import IssueCard from "../components/IssueCard";
import { addIssue, getCurrentUser, getIssues, CATEGORIES } from "../store";

const EMPTY = { title: "", description: "", location: "", evidenceLink: "", category: "water" };

export default function StudentDashboard() {
  const user = getCurrentUser();
  const [form, setForm] = useState(EMPTY);
  const [issues, setIssues] = useState(getIssues().filter((i) => i.createdBy === user.email));

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const count = (s) => issues.filter((i) => i.status === s).length;

  function submit(e) {
    e.preventDefault();
    if (!form.title || !form.description) return alert("Please add a title and description.");
    addIssue(form);
    setIssues(getIssues().filter((i) => i.createdBy === user.email));
    setForm(EMPTY);
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <h1>Welcome, {user.name}</h1>
        <p className="sub">Post a problem you noticed and track it until it is solved.</p>

        <div className="stats">
          <div className="stat"><b>{issues.length}</b><span>Problems posted</span></div>
          <div className="stat"><b>{count("posted")}</b><span>Pending review</span></div>
          <div className="stat"><b>{count("verified") + count("solution_offered")}</b><span>In progress</span></div>
          <div className="stat"><b>{count("closed")}</b><span>Closed</span></div>
        </div>

        <form className="card" onSubmit={submit}>
          <h3>Post a societal problem</h3>
          <input className="input" placeholder="Problem title" value={form.title} onChange={set("title")} />
          <select className="input" value={form.category} onChange={set("category")}>
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <textarea className="input" placeholder="Describe the problem" value={form.description} onChange={set("description")} />
          <input className="input" placeholder="Location (e.g. Hostel Block B)" value={form.location} onChange={set("location")} />
          <input className="input" placeholder="Evidence link (photo or document URL)" value={form.evidenceLink} onChange={set("evidenceLink")} />
          <button className="btn" type="submit">Post problem</button>
        </form>

        <h3>My problems</h3>
        {issues.length === 0 && <div className="card empty">You have not posted anything yet.</div>}
        {issues.map((i) => <IssueCard key={i.id} issue={i} />)}
      </main>
    </>
  );
}