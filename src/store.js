const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const STATUS = {
  posted: { label: "Pending review", color: "#64748b" },
  verified: { label: "Verified", color: "#0284c7" },
  solution_offered: { label: "Solution offered", color: "#d97706" },
  closed: { label: "Closed", color: "#16a34a" },
  rejected: { label: "Rejected", color: "#dc2626" },
};

export const CATEGORIES = {
  water: "Water",
  waste: "Waste management",
  energy: "Energy",
  ewaste: "E-waste",
  other: "Other",
};

// ---------- demo data (created only the first time) ----------
function seed() {
  if (read("users", null)) return;
  write("users", [
    { name: "Demo Student", email: "student@demo.com", password: "123456", role: "student" },
    { name: "Prof. Sharma", email: "faculty@demo.com", password: "123456", role: "faculty" },
    { name: "GreenTech Ltd", email: "industry@demo.com", password: "123456", role: "industry", sector: "all" },
    { name: "AquaPure Water Technologies", email: "water@demo.com", password: "123456", role: "industry", sector: "water" },
    { name: "EcoCycle E-Waste Recyclers", email: "ewaste@demo.com", password: "123456", role: "industry", sector: "ewaste" },
  ]);
  const by = { createdBy: "student@demo.com", createdByName: "Demo Student" };
  write("issues", [
    { id: 1, title: "Groundwater contamination near campus housing", description: "Informal battery waste disposal is polluting the borewell water.", location: "Hostel Block B", evidenceLink: "", category: "water", status: "posted", ...by },
    { id: 2, title: "Overflowing waste bins near the main gate", description: "Bins are not cleared for days, causing a health hazard.", location: "Main Gate", evidenceLink: "", category: "waste", status: "verified", ...by },
    { id: 3, title: "High electricity use in library at night", description: "Lights and AC stay on after closing hours.", location: "Central Library", evidenceLink: "", category: "energy", status: "closed", ...by },
    { id: 4, title: "No e-waste collection point on campus", description: "Old chargers and batteries go into normal dustbins.", location: "Engineering Block", evidenceLink: "", category: "ewaste", status: "verified", ...by },
    { id: 5, title: "Leaking taps in academic block washrooms", description: "Taps leak all day and waste hundreds of litres every week.", location: "Academic Block", evidenceLink: "", category: "water", status: "verified", ...by },
  ]);
  write("solutions", []);
}
seed();

// ---------- users ----------
export const getUsers = () => read("users", []);
export function addUser(user) {
  const users = getUsers();
  if (users.some((u) => u.email === user.email)) return null;
  write("users", [...users, user]);
  write("current", user);
  return user;
}
export function login(email, password) {
  const user = getUsers().find((u) => u.email === email && u.password === password);
  if (user) write("current", user);
  return user || null;
}
export const getCurrentUser = () => read("current", null);
export const logout = () => localStorage.removeItem("current");

// ---------- issues ----------
export const getIssues = () => read("issues", []);
export function addIssue(data) {
  const user = getCurrentUser();
  const issue = { id: Date.now(), status: "posted", createdBy: user.email, createdByName: user.name, ...data };
  write("issues", [issue, ...getIssues()]);
}
export function updateIssue(id, patch) {
  write("issues", getIssues().map((i) => (i.id === id ? { ...i, ...patch } : i)));
}

// ---------- solutions ----------
export const getSolutions = () => read("solutions", []);
export function addSolution(issueId, company, offer) {
  write("solutions", [...getSolutions(), { id: Date.now(), issueId, company, offer }]);
  updateIssue(issueId, { status: "solution_offered" });
}