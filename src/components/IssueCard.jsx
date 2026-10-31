import { STATUS, CATEGORIES, getSolutions } from "../store";
import Tracker from "./Tracker";

export default function IssueCard({ issue, children }) {
  const s = STATUS[issue.status];
  const solutions = getSolutions().filter((x) => x.issueId === issue.id);
  const isImage = issue.evidenceType && issue.evidenceType.startsWith("image/");

  return (
    <div className="card">
      <div className="row">
        <h3>{issue.title}</h3>
        <span className="badge" style={{ background: s.color }}>{s.label}</span>
      </div>
      <p>{issue.description}</p>
      <p className="meta">
        🏷️ {CATEGORIES[issue.category] || "Other"} &nbsp;·&nbsp; 📍 {issue.location || "Location not given"} &nbsp;·&nbsp; 👤 {issue.createdByName}
        {issue.evidenceLink && <> &nbsp;·&nbsp; <a href={issue.evidenceLink} target="_blank" rel="noreferrer">Evidence link</a></>}
      </p>

      {issue.evidenceData && (
        <div className="evidence">
          {isImage ? (
            <a href={issue.evidenceData} download={issue.evidenceName} title="Click to download">
              <img src={issue.evidenceData} alt={issue.evidenceName} />
            </a>
          ) : (
            <a className="file-chip" href={issue.evidenceData} download={issue.evidenceName}>
              📎 {issue.evidenceName} (download)
            </a>
          )}
        </div>
      )}

      <Tracker status={issue.status} />
      {solutions.map((x) => (
        <div key={x.id} className="solution"><b>{x.company}:</b> {x.offer}</div>
      ))}
      {children}
    </div>
  );
}