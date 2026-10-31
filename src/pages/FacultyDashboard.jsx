import { useState } from "react";
import Navbar from "../components/Navbar";
import IssueCard from "../components/IssueCard";
import { getCurrentUser, getIssues, updateIssue } from "../store";

export default function FacultyDashboard() {
  const user = getCurrentUser();
  const [issues, setIssues] = useState(getIssues());

  function change(id, status) {
    updateIssue(id, { status });
    setIssues(getIssues());
  }

  const pending = issues.filter((i) => i.status === "posted");
  const others = issues.filter((i) => i.status !== "posted");
  const count = (s) => issues.filter((i) => i.status === s).length;

  return (
    <>
      <Navbar />
      <main className="page">
        <h1>Faculty Verification Panel</h1>
        <p className="sub">Welcome, {user.name}. Check that each problem is genuine before industry sees it.</p>

        <div className="stats">
          <div className="stat"><b>{pending.length}</b><span>Awaiting review</span></div>
          <div className="stat"><b>{count("verified")}</b><span>Verified</span></div>
          <div className="stat"><b>{count("solution_offered")}</b><span>Solutions offered</span></div>
          <div className="stat"><b>{count("closed")}</b><span>Closed</span></div>
        </div>

        <h3>Awaiting verification</h3>
        {pending.length === 0 && <div className="card empty">All caught up. No pending problems.</div>}
        {pending.map((i) => (
          <IssueCard key={i.id} issue={i}>
            <div className="actions">
              <button className="btn green" onClick={() => change(i.id, "verified")}>Approve</button>
              <button className="btn red" onClick={() => change(i.id, "rejected")}>Reject</button>
            </div>
          </IssueCard>
        ))}

        <h3>All other problems</h3>
        {others.map((i) => (
          <IssueCard key={i.id} issue={i}>
            {i.status === "solution_offered" && (
              <div className="actions">
                <button className="btn green" onClick={() => change(i.id, "closed")}>Mark as closed</button>
              </div>
            )}
          </IssueCard>
        ))}
      </main>
    </>
  );
}