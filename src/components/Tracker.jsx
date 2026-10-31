const STEPS = ["Posted", "Verified", "Solution", "Closed"];
const ORDER = ["posted", "verified", "solution_offered", "closed"];

export default function Tracker({ status }) {
  if (status === "rejected") return null;
  const current = ORDER.indexOf(status);
  return (
    <div className="tracker">
      {STEPS.map((s, i) => (
        <div key={s} className={"step" + (i <= current ? " done" : "")}>{s}</div>
      ))}
    </div>
  );
}