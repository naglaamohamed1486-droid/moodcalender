import { useAuth } from "../../app/providers/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import "../../places.json";
import "../../assets/logo.png";
import "./Dashboard.css";

async function loadDashboardStats() {
  const snap = await getDocs(collection(db, "users"));
  const users = [];
  snap.forEach((d) => users.push(d.data()));

  let pending = 0;
  let approved = 0;
  let totalTrips = 0;

  const favoriteCounts = {};
  const tripPlaceCounts = {};
  const recentSubmissions = [];

  const placeById = {};
  placesData.forEach((p) => {
    placeById[p.id] = p;
  });
  users.forEach((u) => {
    (u.contributions || []).forEach((place) => {
      placeById[place.id] = place;
    });
  });

  users.forEach((u) => {
    (u.contributions || []).forEach((place, i) => {
      const status = place.status || "pending";
      if (status === "pending") pending++;
      if (status === "approved") approved++;

      recentSubmissions.push({
        id: place.id || `${u.email}-${i}`,
        title: place.title || "Untitled place",
        status,
        ownerName: u.name,
        ownerEmail: u.email,
        createdAt:
          place.createdAt || place.approvedAt || place.rejectedAt || null,
      });
    });

    (u.favorites || []).forEach((place) => {
      const placeId = place?.id ?? place;
      if (placeId == null) return;
      favoriteCounts[placeId] = (favoriteCounts[placeId] || 0) + 1;
    });

    (u.savedTrips || []).forEach((trip) => {
      (trip.places || []).forEach((place) => {
        const placeId = place?.id ?? place;
        if (placeId == null) return;
        tripPlaceCounts[placeId] = (tripPlaceCounts[placeId] || 0) + 1;
      });
    });

    totalTrips += (u.savedTrips || []).length;
  });

  const topFavorites = Object.entries(favoriteCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([placeId, count]) => ({
      id: placeId,
      title: placeById[placeId]?.title || "Unknown place",
      count,
    }));

  const topTripPlaces = Object.entries(tripPlaceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([placeId, count]) => ({
      id: placeId,
      title: placeById[placeId]?.title || "Unknown place",
      count,
    }));

  const recentActivity = recentSubmissions
    .filter((s) => s.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(-6);

  return {
    totalUsers: users.length,
    approvedPlaces: placesData.length + approved,
    totalTrips,
    pendingSubmissions: pending,
    topFavorites,
    topTripPlaces,
    recentActivity,
  };
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ClockIcon = () => (
  <svg
    width="14px"
    height="14px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 7V12H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      stroke="#7A6040"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    approvedPlaces: 0,
    totalTrips: 0,
    pendingSubmissions: 0,
    topFavorites: [],
    topTripPlaces: [],
    recentActivity: [],
  });

  useEffect(() => {
    let cancelled = false;
    loadDashboardStats()
      .then((s) => {
        if (!cancelled) setStats(s);
      })
      .catch((err) => console.error("Failed to load dashboard stats:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="dashboard-main">
      <div className="dash-hero">
        <div className="dash-hero-cont">
          <div className="dash-hero-data">
            <div className="dash-pic-wrapper">
              <img className="admin-pic" src={logo} alt="profile" />
            </div>
            <div className="dash-hero-personal">
              <p className="dash-hero-type">Administrator</p>
              <p className="dash-hero-name">Khemet</p>
              <p className="dash-hero-email">
                <svg
                  className="hero-email-svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7"
                    stroke="#F5EDD7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="#F5EDD7"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                {user.email}
              </p>
            </div>
          </div>
          <div className="dash-hero-btns">
            <Link className="dash-hero-btns-sub" to="/submissions">
              Submissions
            </Link>
            <Link className="dash-hero-btns-repo" to="/adminReports">
              Manage reports
            </Link>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="dash-stats">
        <div className="dash-stats-cont">
          <div className="dash-stat-card">
            <div className="dash-stat-data">
              <div className="dash-stat-icon" />
              <div className="dash-stat-det">
                <p className="dash-stat-num">{stats.totalUsers}</p>
                <p className="dash-stat-title">Users</p>
              </div>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-data">
              <div className="dash-stat-icon" />
              <div className="dash-stat-det">
                <p className="dash-stat-num">{stats.approvedPlaces}</p>
                <p className="dash-stat-title">APPROVED PLACES</p>
              </div>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-data">
              <div className="dash-stat-icon" />
              <div className="dash-stat-det">
                <p className="dash-stat-num">{stats.totalTrips}</p>
                <p className="dash-stat-title">TOTAL TRIPS</p>
              </div>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-data">
              <div className="dash-stat-icon" />
              <div className="dash-stat-det">
                <p className="dash-stat-num">{stats.pendingSubmissions}</p>
                <p className="dash-stat-title">PENDING SUBMISSIONS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="dash-quick-actions">
        <h3 className="dash-section-title">Quick actions</h3>
        <div className="dash-quick-actions-grid">
          <button
            className="dash-action-btn"
            onClick={() => navigate("/submissions")}
          >
            Review Submissions →
          </button>
          <button
            className="dash-action-btn"
            onClick={() => navigate("/adminUsers")}
          >
            Manage Users →
          </button>
          <button className="dash-action-btn" onClick={() => navigate("/feed")}>
            View All Places →
          </button>
          <button
            className="dash-action-btn"
            onClick={() => navigate("/adminReports")}
          >
            Manage Reports →
          </button>
        </div>
      </div>

      <div className="dash-lower-grid">
        <div className="dash-analytics-block">
          <p className="dash-analytics-label">Most saved places</p>
          {loading ? (
            <p className="dash-analytics-empty">Loading…</p>
          ) : stats.topFavorites.length > 0 ? (
            <ul className="dash-analytics-list">
              {stats.topFavorites.map((p) => (
                <li key={p.id} className="dash-analytics-row">
                  <span className="dash-analytics-name">{p.title}</span>
                  <span className="dash-analytics-count">{p.count}</span>
                  <Link to={`/place/${p.id}`} className="dash-analytics-link">
                    View details →
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dash-analytics-empty">No saved places data yet.</p>
          )}
        </div>

        <div className="dash-analytics-block">
          <p className="dash-analytics-label">Most added to trips</p>
          {loading ? (
            <p className="dash-analytics-empty">Loading…</p>
          ) : stats.topTripPlaces.length > 0 ? (
            <ul className="dash-analytics-list">
              {stats.topTripPlaces.map((p) => (
                <li key={p.id} className="dash-analytics-row">
                  <span className="dash-analytics-name">{p.title}</span>
                  <span className="dash-analytics-count">{p.count}</span>
                  <Link to={`/place/${p.id}`} className="dash-analytics-link">
                    View details →
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dash-analytics-empty">No trip data yet.</p>
          )}
        </div>

        {/* RECENT ACTIVITY */}
        <div className="dash-activity">
          <h3 className="dash-section-title">Recent activity</h3>
          {loading ? (
            <p className="dash-analytics-empty">Loading…</p>
          ) : stats.recentActivity.length > 0 ? (
            <ul className="dash-activity-list">
              {stats.recentActivity.map((item) => (
                <li
                  key={item.id}
                  className="dash-activity-row"
                  data-status={item.status}
                >
                  <div className="dash-activity-main">
                    <p className="dash-activity-title">{item.title}</p>
                    <p className="dash-activity-sub">
                      by {item.ownerName || item.ownerEmail} · {item.status}
                    </p>
                  </div>
                  <p className="dash-activity-time">
                    <ClockIcon /> {formatDate(item.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dash-analytics-empty">No recent submissions yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
