import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getPlaceImages } from "../components/PicCache";
import SubDetails from "../components/Submissionsdetails";
import "../css/Submissions.css";
import useScrollToTop from "../components/UseScrollToTop";


async function loadSubmissions() {
  const snap = await getDocs(collection(db, "users"));
  const submissions = [];

  snap.forEach((userDoc) => {
    const u = userDoc.data();
    (u.contributions || []).forEach((place) => {
      submissions.push({
        ...place,
        status: place.status || "pending",
        ownerId: userDoc.id,
        ownerEmail: u.email,
        ownerName: u.name,
      });
    });
  });

  return submissions;
}

async function saveSubmissionStatus(submission, newStatus, extra = {}) {
  const userRef = doc(db, "users", submission.ownerId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  const data = userSnap.data();
  const updatedContributions = (data.contributions || []).map((place) =>
    place.id === submission.id ? { ...place, status: newStatus, ...extra } : place
  );

  await updateDoc(userRef, { contributions: updatedContributions });
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

function SubmissionCardImage({ place }) {
  return place.coverImage ? (
    <img src={place.coverImage} alt={place.title} />
  ) : (
    <div className="sub-card-img-placeholder" />
  );
}

const ClockIcon = () => (
  <svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 7V12H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#7A6040" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ReReviewIcon = () => (
  <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4V9H4.582M20 20V15H19.418M4.582 9C5.24585 7.35817 6.43568 5.98088 7.96395 5.08375C9.49221 4.18663 11.2717 3.81661 13.0247 4.03272C14.7776 4.24884 16.4166 5.03941 17.6862 6.28063C18.9557 7.52185 19.7863 9.14494 20.049 10.899M19.418 15C18.7542 16.6418 17.5643 18.0191 16.0361 18.9163C14.5078 19.8134 12.7283 20.1834 10.9753 19.9673C9.22237 19.7512 7.58339 18.9606 6.31385 17.7194C5.04431 16.4782 4.21368 14.8551 3.951 13.101" stroke="#1B4F6B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EditIcon = () => (
  <svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V13" stroke="#7A6040" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="#7A6040" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Submissions() {
   useScrollToTop();
  const [activeTab, setActiveTab] = useState("pending");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsTarget, setDetailsTarget] = useState(null);
  const [editingReasonId, setEditingReasonId] = useState(null);
  const [reasonDraft, setReasonDraft] = useState("");

  const refreshSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await loadSubmissions();
      setSubmissions(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSubmissions();
  }, [refreshSubmissions]);

  const counts = {
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
    all: submissions.length,
  };

  const visible = submissions.filter((s) => s.status === activeTab);

  const handleDecision = async (submission, newStatus, extra = {}) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submission.id && s.ownerId === submission.ownerId
          ? { ...s, status: newStatus, ...extra }
          : s
      )
    );
    try {
      await saveSubmissionStatus(submission, newStatus, extra);
    } catch (err) {
      console.error("Failed to update submission:", err);

      refreshSubmissions();
    }
  };

  const handleReReview = (place) => {
    handleDecision(place, "pending", {
      approvedAt: null,
      rejectedAt: null,
      rejectionReason: null,
    });
  };

  const startEditReason = (place) => {
    setEditingReasonId(place.id);
    setReasonDraft(place.rejectionReason || "");
  };

  const confirmEditReason = (place) => {
    if (!reasonDraft.trim()) return;
    handleDecision(place, "rejected", {
      rejectionReason: reasonDraft.trim(),
      rejectedAt: new Date().toISOString(),
    });
    setEditingReasonId(null);
  };

  return (
    <main className="Submissions">
      <Link to="/dashboard" className="au-back-link">← Back to Dashboard</Link>
      <h4 className="sub-intro">Admin Controller</h4>
      <h2 className="sub-title">Submissions</h2>
      <p className="sub-det">
        Review community contributions. Approve to publish, or reject places that don't meet platform standards.
      </p>
      <div className="pf-link">
        <div className="pf-link-cont">
          <div className="pf-linkat pf-linkat-approved">
    <div className="pf-linkat-data">
      <div className="pf-linkat-svg pf-linkat-svg-approved">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="#5B8A64" strokeWidth="1.5" />
          <path d="M8.5 12.2l2.3 2.3 4.7-4.9" stroke="#5B8A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="pf-linkat-det">
        <p className="pf-link-num">{counts.approved || 0}</p>
        <p className="pf-link-title">APPROVED PLACES</p>
      </div>
    </div>
  </div>

  <div className="pf-linkat pf-linkat-pending">
    <div className="pf-linkat-data">
      <div className="pf-linkat-svg pf-linkat-svg-pending">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3h8M8 21h8M8 3c0 4 4 5 4 8s-4 4-4 8M16 3c0 4-4 5-4 8s4 4 4 8"
            stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="pf-linkat-det">
        <p className="pf-link-num">{counts.pending || 0}</p>
        <p className="pf-link-title">PENDING REVIEW</p>
      </div>
    </div>
  </div>

  <div className="pf-linkat pf-linkat-rejected">
    <div className="pf-linkat-data">
      <div className="pf-linkat-svg pf-linkat-svg-rejected">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="#A8402F" strokeWidth="1.5" />
          <path d="M9 9l6 6M15 9l-6 6" stroke="#A8402F" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="pf-linkat-det">
        <p className="pf-link-num">{counts.rejected || 0}</p>
        <p className="pf-link-title">REJECTED PLACES</p>
      </div>
    </div>
          </div>
         <div className="pf-linkat">
          <div className="pf-linkat-data">
            <div className="pf-linkat-svg pf-linkat-svg-total">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7L12 3L20 7L12 11L4 7Z" stroke="#5B6B7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 12L12 16L20 12" stroke="#5B6B7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 17L12 21L20 17" stroke="#5B6B7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="pf-linkat-det">
              <p className="pf-link-num">{counts.all || 0}</p>
              <p className="pf-link-title">TOTAL SUBMISSIONS</p>
            </div>
          </div>
        </div>
            </div>
      </div>
     <div className="sub-tabs">
  <div className="sub-tabs-cont">
    <button
      className={`sub-tab-btn ${activeTab === "pending" ? "active" : ""}`}
      onClick={() => setActiveTab("pending")}
    >
      <svg className="sub-tab-icon sub-tab-icon-stroke" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 7V12H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#7A6040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Pending <span className="sub-tab-num">{counts.pending}</span>
    </button>

    <button
      className={`sub-tab-btn ${activeTab === "approved" ? "active" : ""}`}
      onClick={() => setActiveTab("approved")}
    >
      <svg className="sub-tab-icon sub-tab-icon-fill" fill="#7A6040" width="16px" height="16px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M16,1C7.729,1,1,7.729,1,16s6.729,15,15,15s15-6.729,15-15S24.271,1,16,1z M16,29C8.832,29,3,23.168,3,16S8.832,3,16,3 s13,5.832,13,13S23.168,29,16,29z" />
        <path d="M23.317,10.27l-10.004,9.36l-4.629-4.332c-0.403-0.377-1.035-0.356-1.413,0.047c-0.377,0.403-0.356,1.036,0.047,1.413 l5.313,4.971c0.192,0.18,0.438,0.27,0.683,0.27s0.491-0.09,0.683-0.27l10.688-10c0.403-0.377,0.424-1.01,0.047-1.413 C24.353,9.913,23.719,9.892,23.317,10.27z" />
      </svg>
      Approved <span className="sub-tab-num">{counts.approved}</span>
    </button>

    <button
      className={`sub-tab-btn ${activeTab === "rejected" ? "active" : ""}`}
      onClick={() => setActiveTab("rejected")}
    >
      <svg className="sub-tab-icon sub-tab-icon-stroke" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#7A6040" strokeWidth="1.5" />
        <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#7A6040" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      Rejected <span className="sub-tab-num">{counts.rejected}</span>
    </button>
  </div>
</div>
      <div className="sub-content">
        {loading ? (
          <div className="pf-empty-state">
            <p className="pf-empty-title">Loading submissions…</p>
          </div>
        ) : visible.length > 0 ? (
          <div className="sub-cards-grid">
            {visible.map((place) => (
              <div key={`${place.ownerId}-${place.id}`} className="sub-card" data-status={place.status}>
                <div className="sub-card-img">
                  <SubmissionCardImage place={place} />
                   <span className="sub-card-category-badge">{place.category}</span>
                </div>

                <div className="sub-card-body">
                  <h3 className="sub-card-title">{place.title || "Untitled place"}</h3>
                  <p className="sub-card-owner">
                    Submitted by {place.addedByname || place.addedByemail || place.ownerName}
                  </p>
                  {place.description && <p className="sub-card-desc">{place.description}</p>}

                  {activeTab === "approved" && (
                    <p className="sub-timestamp">
                      <ClockIcon /> Approved on {formatDate(place.approvedAt)}
                    </p>
                  )}
                  {activeTab === "rejected" && (
                    <>
                      <p className="sub-timestamp">
                        <ClockIcon /> Rejected on {formatDate(place.rejectedAt)}
                      </p>
                      {place.rejectionReason && editingReasonId !== place.id && (
                        <p className="sub-reason-preview">"{place.rejectionReason}"</p>
                      )}
                    </>
                  )}
                </div>

                <div className="sub-card-actions">
                  {activeTab === "pending" && (
                    <button className="view-sub-btn" onClick={() => setDetailsTarget(place)}>
                      <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="3.5" stroke="#1B4F6B" />
                        <path d="M20.188 10.9343C20.5762 11.4056 20.7703 11.6412 20.7703 12C20.7703 12.3588 20.5762 12.5944 20.188 13.0657C18.7679 14.7899 15.6357 18 12 18C8.36427 18 5.23206 14.7899 3.81197 13.0657C3.42381 12.5944 3.22973 12.3588 3.22973 12C3.22973 11.6412 3.42381 11.4056 3.81197 10.9343C5.23206 9.21014 8.36427 6 12 6C15.6357 6 18.7679 9.21014 20.188 10.9343Z" stroke="#1B4F6B" />
                      </svg>
                      Submission details
                    </button>
                  )}

                  {activeTab === "approved" && (
                    <button className="sub-btn sub-btn-rereview" onClick={() => handleReReview(place)}>
                      <ReReviewIcon /> Re-review
                    </button>
                  )}

                  {activeTab === "rejected" && editingReasonId !== place.id && (
                    <button className="sub-btn sub-btn-edit" onClick={() => startEditReason(place)}>
                      <EditIcon /> Edit reason
                    </button>
                  )}

                  {activeTab === "rejected" && editingReasonId === place.id && (
                    <div className="sub-reject-inline">
                      <textarea
                        className="sub-reject-textarea"
                        rows={3}
                        value={reasonDraft}
                        onChange={(e) => setReasonDraft(e.target.value)}
                        placeholder="Update the rejection reason..."
                      />
                      <div className="sub-reject-actions">
                        <button
                          className="sub-btn sub-btn-reject"
                          onClick={() => confirmEditReason(place)}
                          disabled={!reasonDraft.trim()}
                        >
                          Save
                        </button>
                        <button
                          className="sub-btn sub-btn-cancel"
                          onClick={() => setEditingReasonId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
         <div className="pf-empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 9l1.5-5h15L21 9M3 9v9a2 2 0 002 2h14a2 2 0 002-2V9M3 9h18M9 13h6"
              stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"
            />
          </svg>
          <p className="pf-empty-title">Nothing here</p>
          <p className="pf-empty-sub">
            {activeTab === "pending" && "No submissions are waiting for review."}
            {activeTab === "approved" && "No submissions have been approved yet."}
            {activeTab === "rejected" && "No submissions have been rejected."}
          </p>
        </div>
        )}
      </div>

      {detailsTarget && (
        <SubDetails
          place={detailsTarget}
          onDetClose={() => setDetailsTarget(null)}
          onhandleDecision={handleDecision}
        />
      )}
    </main>
  );
}