import { useState, useEffect } from "react";
import "../css/Submissions.css";

function loadSubmissions() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const submissions = [];

  users.forEach((u) => {
    (u.contributions || []).forEach((place, i) => {
      submissions.push({
        ...place,
        id: place.id || `${u.email}-${i}`,
        status: place.status || "pending",
        ownerEmail: u.email,
        ownerName: u.name,
      });
    });
  });

  return submissions;
}

function saveSubmissionStatus(submission, newStatus) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const updated = users.map((u) => {
    if (u.email !== submission.ownerEmail) return u;
    return {
      ...u,
      contributions: (u.contributions || []).map((place, i) => {
        const placeId = place.id || `${u.email}-${i}`;
        if (placeId !== submission.id) return place;
        return { ...place, status: newStatus };
      }),
    };
  });

  localStorage.setItem("users", JSON.stringify(updated));
}

export default function Submissions() {
  const [activeTab, setActiveTab] = useState("pending");
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    setSubmissions(loadSubmissions());
  }, []);

  const counts = {
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  const visible = submissions.filter((s) => s.status === activeTab);

  const handleDecision = (submission, newStatus) => {
    saveSubmissionStatus(submission, newStatus);
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submission.id && s.ownerEmail === submission.ownerEmail
          ? { ...s, status: newStatus }
          : s
      )
    );
  };

  return (
    <main className="Submissions">
      <h4 className="sub-intro">Admin Controller</h4>
      <h2 className="sub-title">Submissions</h2>
      <p className="sub-det">
        Review community contributions. Approve to publish, or reject places that don't meet platform standards.   
      </p>

      <div className="pf-btn-sec">
        <div className="pf-btn-cont">
          <button
            className={`pf-btn ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            <svg
              className="pnd pf-btn-svg"
              width="18px"
              height="18px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 7V12H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="#7A6040"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Pending <span className="pf-btn-num">{counts.pending}</span>
          </button>

          <button
            className={`pf-btn ${activeTab === "approved" ? "active" : ""}`}
            onClick={() => setActiveTab("approved")}
          >
            <svg
              className="pf-btn-svg"
              fill="#7A6040"
              width="16px"
              height="16px"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16,1C7.729,1,1,7.729,1,16s6.729,15,15,15s15-6.729,15-15S24.271,1,16,1z M16,29C8.832,29,3,23.168,3,16S8.832,3,16,3 s13,5.832,13,13S23.168,29,16,29z" />
              <path d="M23.317,10.27l-10.004,9.36l-4.629-4.332c-0.403-0.377-1.035-0.356-1.413,0.047c-0.377,0.403-0.356,1.036,0.047,1.413 l5.313,4.971c0.192,0.18,0.438,0.27,0.683,0.27s0.491-0.09,0.683-0.27l10.688-10c0.403-0.377,0.424-1.01,0.047-1.413 C24.353,9.913,23.719,9.892,23.317,10.27z" />
            </svg>
            Approved <span className="pf-btn-num">{counts.approved}</span>
          </button>

          <button
            className={`pf-btn ${activeTab === "rejected" ? "active" : ""}`}
            onClick={() => setActiveTab("rejected")}
          >
            <svg
              className="pf-btn-svg"
              width="18px"
              height="18px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="#7A6040" strokeWidth="1.5" />
              <path
                d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
                stroke="#7A6040"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Rejected <span className="pf-btn-num">{counts.rejected}</span>
          </button>
        </div>
      </div>

      <div className="sub-content">
        {visible.length > 0 ? (
          <div className="sub-cards-grid">
            {visible.map((place) => (
              <div key={`${place.ownerEmail}-${place.id}`} className="sub-card">
                <div className="sub-card-img">
                  {place.coverImage || place.image ? (
                    <img src={place.coverImage || place.image} alt={place.title} />
                  ) : (
                    <div className="sub-card-img-placeholder" />
                  )}
                </div>

                <div className="sub-card-body">
                  <h3 className="sub-card-title">{place.title || "Untitled place"}</h3>
                  <p className="sub-card-owner">Submitted by {place.ownerName || place.ownerEmail}</p>
                  {place.description && (
                    <p className="sub-card-desc">{place.description}</p>
                  )}
                </div>

                <div className="sub-card-actions">
                  {activeTab !== "approved" && (
                    <button
                      className="sub-btn sub-btn-approve"
                      onClick={() => handleDecision(place, "approved")}
                    >
                      Approve
                    </button>
                  )}
                  {activeTab !== "rejected" && (
                    <button
                      className="sub-btn sub-btn-reject"
                      onClick={() => handleDecision(place, "rejected")}
                    >
                      Reject
                    </button>
                  )}
                  {activeTab !== "pending" && (
                    <button
                      className="sub-btn sub-btn-pending"
                      onClick={() => handleDecision(place, "pending")}
                    >
                      Move to pending
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="pf-empty-state">
            <p className="pf-empty-title">Nothing here</p>
            <p className="pf-empty-sub">
              {activeTab === "pending" && "No submissions are waiting for review."}
              {activeTab === "approved" && "No submissions have been approved yet."}
              {activeTab === "rejected" && "No submissions have been rejected."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}