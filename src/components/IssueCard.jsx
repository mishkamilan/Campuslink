import { STATUS, getSolutions } from "../store";
import Tracker from "./Tracker";

export default function IssueCard({ issue, children }) {
  const s = STATUS[issue.status];
  const solutions = getSolutions().filter((x) => x.issueId === issue.id);

  return (
    <div className="card">
      <div className="row">
        <h3>{issue.title}</h3>
        <span className="badge" style={{ background: s.color }}>{s.label}</span>
      </div>
      <p>{issue.description}</p>
      <p className="meta">
        📍 {issue.location || "Location not given"} &nbsp;·&nbsp; 👤 {issue.createdByName}
        {issue.evidenceLink && <> &nbsp;·&nbsp; <a href={issue.evidenceLink} target="_blank" rel="noreferrer">Evidence</a></>}
      </p>
      <Tracker status={issue.status} />
      {solutions.map((x) => (
        <div key={x.id} className="solution"><b>{x.company}:</b> {x.offer}</div>
      ))}
      {children}
    </div>
  );
}