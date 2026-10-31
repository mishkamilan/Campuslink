import { useState } from "react";
import Navbar from "../components/Navbar";
import IssueCard from "../components/IssueCard";
import { addIssue, getCurrentUser, getIssues, CATEGORIES } from "../store";

const EMPTY = {
  title: "", description: "", location: "", evidenceLink: "", category: "water",
  evidenceName: "", evidenceType: "", evidenceData: "",
};

const MAX_FILE_SIZE = 1024 * 1024; // 1 MB for non-image files

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// shrink big photos so they fit in browser storage
async function compressImage(file) {
  const src = await readAsDataURL(file);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const max = 1000;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = reject;
    img.src = src;
  });
}

export default function StudentDashboard() {
  const user = getCurrentUser();
  const [form, setForm] = useState(EMPTY);
  const [fileKey, setFileKey] = useState(0);
  const [issues, setIssues] = useState(getIssues().filter((i) => i.createdBy === user.email));

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const count = (s) => issues.filter((i) => i.status === s).length;

  async function pickFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (file.type.startsWith("image/")) {
        const data = await compressImage(file);
        setForm((f) => ({ ...f, evidenceName: file.name, evidenceType: "image/jpeg", evidenceData: data }));
      } else {
        if (file.size > MAX_FILE_SIZE) {
          alert("This file is larger than 1 MB. Please choose a smaller file.");
          setFileKey((k) => k + 1);
          return;
        }
        const data = await readAsDataURL(file);
        setForm((f) => ({ ...f, evidenceName: file.name, evidenceType: file.type || "application/octet-stream", evidenceData: data }));
      }
    } catch {
      alert("Could not read this file. Please try another one.");
      setFileKey((k) => k + 1);
    }
  }

  function removeFile() {
    setForm((f) => ({ ...f, evidenceName: "", evidenceType: "", evidenceData: "" }));
    setFileKey((k) => k + 1);
  }

  function submit(e) {
    e.preventDefault();
    if (!form.title || !form.description) return alert("Please add a title and description.");
    const saved = addIssue(form);
    if (!saved) {
      return alert("Browser storage is full. Try a smaller file, or remove the attachment.");
    }
    setIssues(getIssues().filter((i) => i.createdBy === user.email));
    setForm(EMPTY);
    setFileKey((k) => k + 1);
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

          <label className="upload-label">Evidence (photo, PDF or any file)</label>
          <input key={fileKey} className="input" type="file" onChange={pickFile} />

          {form.evidenceData && (
            <div className="file-preview">
              {form.evidenceType.startsWith("image/")
                ? <img src={form.evidenceData} alt="preview" />
                : <span className="file-icon">📎</span>}
              <span className="file-name">{form.evidenceName}</span>
              <button type="button" className="btn ghost" onClick={removeFile}>Remove</button>
            </div>
          )}

          <input className="input" placeholder="Or paste an evidence link (optional)" value={form.evidenceLink} onChange={set("evidenceLink")} />
          <button className="btn" type="submit">Post problem</button>
        </form>

        <h3>My problems</h3>
        {issues.length === 0 && <div className="card empty">You have not posted anything yet.</div>}
        {issues.map((i) => <IssueCard key={i.id} issue={i} />)}
      </main>
    </>
  );
}