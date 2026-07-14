import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminUsers.css";
import "./AdminReports.css";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
const BanIcon = () => (
  <svg
    width="14px"
    height="14px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="9" stroke="#A8402F" strokeWidth="1.6" />
    <path
      d="M6.5 6.5L17.5 17.5"
      stroke="#A8402F"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const UnbanIcon = () => (
  <svg
    width="14px"
    height="14px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="9" stroke="#5B8A64" strokeWidth="1.6" />
    <path
      d="M8.5 12.2l2.3 2.3 4.7-4.9"
      stroke="#5B8A64"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [banTarget, setBanTarget] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "reports"));
      const data = snap.docs.map((d) => ({ ...d.data(), reportId: d.id }));
      setReports(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleBan = async (report) => {
    try {
      await updateDoc(doc(db, "users", report.reportedUserId), {
        banned: true,
      });
      await updateDoc(doc(db, "reports", report.reportId), {
        status: "banned",
      });
      setBanTarget(null);
      await fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDismiss = async (reportId) => {
    try {
      await updateDoc(doc(db, "reports", reportId), {
        status: "dismissed",
      });
      await fetchReports();
    } catch (err) {
      console.error(err);
    }
  };
  const handleUnban = async (report) => {
  try {
    await updateDoc(doc(db, "users", report.reportedUserId), {
      banned: false,
    });
    await updateDoc(doc(db, "reports", report.reportId), {
      status: "dismissed",
    });
    await fetchReports();
  } catch (err) {
    console.error(err);
  }
};

  const visible = reports.filter((r) => r.status === activeTab);
  const counts = {
    pending: reports.filter((r) => r.status === "pending").length,
    banned: reports.filter((r) => r.status === "banned").length,
    dismissed: reports.filter((r) => r.status === "dismissed").length,
  };

  return (
    <main className="admin-reports-main">
      <Link to="/dashboard" className="au-back-link">
        ← Back to Dashboard
      </Link>
      <h4 className="sub-intro">Admin Controller</h4>
      <h2 className="sub-title">Reports</h2>
      <p className="sub-det">
        Review reported comments and decide whether to ban users.
      </p>

      <div className="sub-tabs">
        <div className="sub-tabs-cont">
          <button
            className={`sub-tab-btn ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending <span className="sub-tab-num">{counts.pending}</span>
          </button>
          <button
            className={`sub-tab-btn ${activeTab === "banned" ? "active" : ""}`}
            onClick={() => setActiveTab("banned")}
          >
            Banned <span className="sub-tab-num">{counts.banned}</span>
          </button>
          <button
            className={`sub-tab-btn ${activeTab === "dismissed" ? "active" : ""}`}
            onClick={() => setActiveTab("dismissed")}
          >
            Dismissed <span className="sub-tab-num">{counts.dismissed}</span>
          </button>
        </div>
      </div>

      <div className="reports-grid">
        {loading ? (
          <p className="pf-empty-title">Loading...</p>
        ) : visible.length === 0 ? (
          <p className="pf-empty-title">No {activeTab} reports.</p>
        ) : (
          visible.map((report) => (
            <div key={report.reportId} className="report-card">
              <div className="report-card-header">
                <div>
                  <p className="report-card-title">
                    Reported User: <strong>{report.reportedUserName}</strong>
                  </p>
                  <p className="report-card-sub">
                    Reported by: {report.reportedByName}
                  </p>
                  <p className="report-card-sub">
                    Place:{" "}
                    <Link to={`/place/${report.placeId}`}>
                      {report.placeTitle}
                    </Link>
                  </p>
                </div>
                <span
                  className={`report-status-badge report-status-${report.status}`}
                >
                  {report.status}
                </span>
              </div>
              {report.commentText && (
                <p className="report-card-comment">"{report.commentText}"</p>
              )}
              <p className="report-card-reason">
                <strong>Reason:</strong> {report.reason}
              </p>
              {activeTab === "pending" && (
                <div className="report-card-actions">
                  <button
                    className="au-ban-btn"
                    onClick={() => setBanTarget(report)}
                  >
                    <BanIcon /> Ban User
                  </button>
                  <button
                    className="au-cancel-btn"
                    onClick={() => handleDismiss(report.reportId)}
                  >
                    Dismiss
                  </button>
                  <Link
                    to={`/profile/${report.reportedUserId}`}
                    className="report-action-view"
                  >
                    View Profile
                  </Link>
                </div>
              )}
              {activeTab === "banned" && (
                <div className="report-card-actions">
                  <button
                    className="au-ban-btn au-ban-btn-undo"
                    onClick={() => handleUnban(report)}
                  >
                    <UnbanIcon /> Unban User
                  </button>
                  <Link
                    to={`/profile/${report.reportedUserId}`}
                    className="report-action-view"
                  >
                    View Profile
                  </Link>
                </div>
              )}{" "}
            </div>
          ))
        )}
      </div>

      {/* Ban Confirmation Popup */}
      {banTarget && (
        <div
          className="au-overlay"
          onClick={(e) => e.target === e.currentTarget && setBanTarget(null)}
        >
          <div className="au-confirm">
            <div className="au-confirm-icon">⚠</div>
            <h3 className="au-confirm-title">
              Ban {banTarget.reportedUserName}?
            </h3>
            <p className="au-confirm-body">
              This user will be signed out and blocked from logging in until
              unbanned.
            </p>
            <div className="au-confirm-actions">
              <button
                className="au-cancel-btn"
                onClick={() => setBanTarget(null)}
              >
                Cancel
              </button>
              <button
                className="au-confirm-ban-btn"
                onClick={() => handleBan(banTarget)}
              >
                Yes, ban
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}