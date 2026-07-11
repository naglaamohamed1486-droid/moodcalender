import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../css/AdminUser.css"

async function loadAdminUsers() {
  const snap = await getDocs(collection(db, "users"));
  const users = [];
  snap.forEach((d) => {
    const data = d.data();
    if (data.role === "admin") return; 
    users.push({
      id: d.id,
      name: data.name || "Unnamed",
      email: data.email || "—",
      role: data.role || "user",
      banned: !!data.banned,
      createdAt: data.createdAt || null,
      contributionCount: (data.contributions || []).length,
      favoriteCount: (data.favorites || []).length,
      tripCount: (data.savedTrips || []).length,
    });
  });
  return users;
}

function formatDate(value) {
  if (!value) return "—";
  const d = typeof value === "number" ? new Date(value) : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const BanIcon = () => (
  <svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#A8402F" strokeWidth="1.6" />
    <path d="M6.5 6.5L17.5 17.5" stroke="#A8402F" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const UnbanIcon = () => (
  <svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#5B8A64" strokeWidth="1.6" />
    <path d="M8.5 12.2l2.3 2.3 4.7-4.9" stroke="#5B8A64" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlacesIcon = () => (
  <svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21s7-6.5 7-11.5A7 7 0 1 0 5 9.5C5 14.5 12 21 12 21z" stroke="#7A6040" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="9.5" r="2.3" stroke="#7A6040" strokeWidth="1.5" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 7V12H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#7A6040" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function AdminUser() {
  const { user: currentAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [banTarget, setBanTarget] = useState(null); 
  const [actionError, setActionError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await loadAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
      setActionError("Couldn't load users. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const counts = {
    all:users.filter((u) => u.role !== "admin").length,
    banned: users.filter((u) => u.banned).length,
  };

   const visible = useMemo(() => {
    let list = users;
    if (activeTab === "banned") list = list.filter((u) => u.banned);

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    return list;
   }, [users, activeTab, query]);
  
  const toggleBan = async (targetUser) => {
    setActionError("");
    const nextBanned = !targetUser.banned;

   
    setUsers((prev) =>
      prev.map((u) => (u.id === targetUser.id ? { ...u, banned: nextBanned } : u))
    );

    try {
      await updateDoc(doc(db, "users", targetUser.id), { banned: nextBanned });
    } catch (err) {
      console.error("Failed to update ban status:", err);
      setActionError(`Couldn't ${nextBanned ? "ban" : "unban"} ${targetUser.name}. Try again.`);
      // roll back
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, banned: targetUser.banned } : u))
      );
    } finally {
      setBanTarget(null);
    }
  };

  return (
    <main className="usersmain">
      <Link to="/dashboard" className="au-back-link">← Back to Dashboard</Link>
      <h4 className="sub-intro">Admin Controller</h4>
      <h2 className="sub-title">User Administration</h2>
      <p className="sub-det">
        Oversee explorers, manage accounts, and ensure a safe and high-quality community experience.
      </p>

     {/* STAT CARDS */}
      <div className="au-stats">
        <div className="au-stat-card">
          <p className="au-stat-num">{counts.all}</p>
          <p className="au-stat-title">TOTAL EXPLORERS</p>
        </div>
        <div className="au-stat-card au-stat-card-warn">
          <p className="au-stat-num">{counts.banned}</p>
          <p className="au-stat-title">BANNED</p>
        </div>
      </div>

      {/* TABS + SEARCH */}
      <div className="au-toolbar">
        <div className="au-tabs">
          <button
            className={`au-tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All <span className="au-tab-num">{counts.all}</span>
          </button>
          <button
            className={`au-tab-btn ${activeTab === "banned" ? "active" : ""}`}
            onClick={() => setActiveTab("banned")}
          >
            Banned <span className="au-tab-num">{counts.banned}</span>
          </button>
        </div>

        <input
          className="au-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email..."
        />
      </div>
      {actionError && <p className="au-action-error">{actionError}</p>}

      {/* USER LIST */}
      <div className="user-body">
        {loading ? (
          <div className="au-empty-state">
            <p className="au-empty-title">Loading users…</p>
          </div>
        ) : visible.length > 0 ? (
          <div className="user-cont">
            {visible.map((u) => (
              <div key={u.id} className="au-card" data-banned={u.banned}>
                <div className="au-card-avatar">
                  {u.name.charAt(0).toUpperCase()}
                </div>

                <div className="au-card-info">
                  <div className="au-card-heading">
                    <Link to={`/profile/${u.id}`} className="userName">
                      {u.name}
                    </Link>
                    {u.banned && <span className="au-badge au-badge-banned">Banned</span>}
                  </div>
                  <p className="userEmail">{u.email}</p>

                  <div className="au-card-meta">
                    <span className="au-meta-item">
                      <ClockIcon /> Joined {formatDate(u.createdAt)}
                    </span>
                    <span className="au-meta-item">
                      <PlacesIcon /> {u.contributionCount} place{u.contributionCount !== 1 ? "s" : ""} added
                    </span>
                    <span className="au-meta-item">{u.favoriteCount} favorites</span>
                    <span className="au-meta-item">{u.tripCount} trips</span>
                  </div>
                </div>

                <div className="au-card-actions">
                  <Link to={`/profile/${u.id}`} className="viewProfile">
                    Review Profile
                  </Link>
                  <button
                    className={`au-ban-btn ${u.banned ? "au-ban-btn-undo" : ""}`}
                    disabled={u.id === currentAdmin?.uid}
                    onClick={() => setBanTarget(u)}
                    title={u.id === currentAdmin?.uid ? "You can't ban yourself" : ""}
                  >
                    {u.banned ? <UnbanIcon /> : <BanIcon />}
                    {u.banned ? "Unban user" : "Ban user"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="au-empty-state">
            <p className="au-empty-title">No users found</p>
            <p className="au-empty-sub">
              {query.trim() ? "Try a different search." : "Nothing to show in this tab."}
            </p>
          </div>
        )}
      </div>

      {/* BAN CONFIRM */}
      {banTarget && (
        <div className="au-overlay" onClick={(e) => e.target === e.currentTarget && setBanTarget(null)}>
          <div className="au-confirm">
            <div className="au-confirm-icon">{banTarget.banned ? "✓" : "⚠"}</div>
            <h3 className="au-confirm-title">
              {banTarget.banned ? `Unban ${banTarget.name}?` : `Ban ${banTarget.name}?`}
            </h3>
            <p className="au-confirm-body">
              {banTarget.banned
                ? "They'll regain full access to their account and be able to log in again."
                : "They'll be signed out and blocked from logging in until unbanned."}
            </p>
            <div className="au-confirm-actions">
              <button className="au-cancel-btn" onClick={() => setBanTarget(null)}>
                Cancel
              </button>
              <button
                className={banTarget.banned ? "au-confirm-unban-btn" : "au-confirm-ban-btn"}
                onClick={() => toggleBan(banTarget)}
              >
                {banTarget.banned ? "Yes, unban" : "Yes, ban"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}