import { useState } from "react";
import Navbar from "../components/Navbar";
import IssueCard from "../components/IssueCard";
import { addSolution, getCurrentUser, getIssues } from "../store";

export default function IndustryDashboard() {
  const user = getCurrentUser();
  const [issues, setIssues] = useState(getIssues());
  const [offers, setOffers] = useState({});

  const visible = issues.filter((i) => i.status === "verified" || i.status === "solution_offered");

  function submitOffer(id) {
    const text = (offers[id] || "").trim();
    if (!text) return alert("Please write your solution or offer.");
    addSolution(id, user.name, text);
    setIssues(getIssues());
    setOffers({ ...offers, [id]: "" });
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <h1>Industry Dashboard</h1>
        <p className="sub">Welcome, {user.name}. Browse faculty-verified problems and offer a solution.</p>

        <div className="stats">
          <div className="stat"><b>{issues.filter((i) => i.status === "verified").length}</b><span>Open for solutions</span></div>
          <div className="stat"><b>{issues.filter((i) => i.status === "solution_offered").length}</b><span>Solutions offered</span></div>
          <div className="stat"><b>{issues.filter((i) => i.status === "closed").length}</b><span>Resolved</span></div>
          <div className="stat"><b>{visible.length}</b><span>Visible to you</span></div>
        </div>

        {visible.length === 0 && <div className="card empty">No verified problems yet.</div>}
        {visible.map((i) => (
          <IssueCard key={i.id} issue={i}>
            <textarea
              className="input" style={{ marginTop: 14 }}
              placeholder="Describe your solution, sponsorship or technical offer"
              value={offers[i.id] || ""}
              onChange={(e) => setOffers({ ...offers, [i.id]: e.target.value })}
            />
            <button className="btn" onClick={() => submitOffer(i.id)}>Offer solution</button>
          </IssueCard>
        ))}
      </main>
    </>
  );
}