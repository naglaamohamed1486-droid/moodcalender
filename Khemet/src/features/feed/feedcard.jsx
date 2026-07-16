import { Link } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthContext";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { db } from "../../firebase";
import logo from "../../assets/logo.png"; 
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import "./feedcard.css";

export default function FeedCard({ place }) {
  const { user, toggleFavorite, isFavorite } = useAuth();
  const saved = isFavorite(place.id);

  const [avgRating, setAvgRating] = useState(place.rating || 0);
  const [totalReviews, setTotalReviews] = useState(place.reviews || 0);
  const [latestComment, setLatestComment] = useState(null);
  const [latestRating, setLatestRating] = useState(null);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "comments"),
          where("placeId", "==", String(place.id)),
          orderBy("createdAt", "desc"),
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({
          commentId: doc.id,
          ...doc.data(),
        }));

        setReviewsCount(data.length);
        setLatestComment(data.find((item) => item.text?.trim()) || null);
        setLatestRating(data.find((item) => item.rating != null) || null);

        const firebaseRatings = data
          .map((d) => d.rating)
          .filter((r) => r != null);

        const jsonRating = place.rating || 0;
        const jsonReviews = place.reviews || 0;

        if (firebaseRatings.length === 0) {
          setAvgRating(jsonRating);
          setTotalReviews(jsonReviews);
        } else {
          const allRatings = [...firebaseRatings, jsonRating];
          setAvgRating(
            allRatings.reduce((a, b) => a + b, 0) / allRatings.length,
          );
          setTotalReviews(jsonReviews + firebaseRatings.length);
        }
      } catch (err) {
        setAvgRating(place.rating || 0);
        setTotalReviews(place.reviews || 0);
      }
    };
    fetchData();
  }, [place.id]);

  const review = latestComment || latestRating;
  const date = review?.createdAt?.toDate?.()?.toLocaleDateString() || "";

  const renderStars = (rating = 0) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
  };

  const handleSubmitReport = async () => {
    if (!reportReason.trim()) return;
    setSubmittingReport(true);
    try {
      await addDoc(collection(db, "reports"), {
        commentId: reportTarget.commentId,
        commentText: reportTarget.text || null,
        reportedUserId: reportTarget.userId,
        reportedUserName: reportTarget.userName,
        reportedBy: user.uid,
        reportedByName: user.name,
        placeId: String(place.id),
        placeTitle: place.title,
        reason: reportReason.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setReportTarget(null);
      setReportReason("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <>
      <div className="feed-card">
        {}
        <div className="feed-card-image">
          <img src={place.coverImage} alt={place.title} />
          <span className="feed-card-category">
            {(place.category || place.tags?.[0] || "explore").toUpperCase()}
          </span>

          {user?.role === "user" && (
            <button
              className={`feed-card-save ${saved ? "active" : ""}`}
              onClick={() => toggleFavorite(place)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
        </div>

        {}
        <div className="feed-card-body">
          <div className="feed-card-info">
            <h3 className="feed-card-title">{place.title}</h3>
            <Link
              to={
                place.addedByname && place.addedByUid
                  ? `/profile/${place.addedByUid}`
                  : "/"
              }
              className="feed-card-addedby-inline"
            >
              {place.addedByPic ? (
                <img
                  src={place.addedByPic}
                  alt={place.addedByname}
                  className="feed-card-addedby-avatar"
                />
              ) : place.addedByname === "Khemet" || !place.addedByname ? (
                <img
                  src={logo}
                  alt="Khemet"
                  className="feed-card-addedby-avatar"
                />
              ) : (
                <span className="feed-card-addedby-avatar feed-card-addedby-initial">
                  {place.addedByname.charAt(0).toUpperCase()}
                </span>
              )}
              <span>
                Added by <strong>{place.addedByname || "Khemet"}</strong>
              </span>
            </Link>
            <p className="feed-card-city">📍 {place.city}</p>
            <p className="feed-card-desc">{place.description}</p>

            <div className="feed-card-tags">
              {place.tags?.slice(0, 4).map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>

            {}
            <div className="feed-card-footer">
              <span className="feed-card-rating">
                <span className="stars">★</span> {avgRating.toFixed(1)}
                <span className="reviews"> ({totalReviews} reviews)</span>
              </span>
              <Link to={`/place/${place.id}`} className="card-btn">
                View details →
              </Link>
            </div>
          </div>

          {}
          {review && (
            <div className="feed-card-review">
              <p className="feed-card-review-title">LATEST REVIEW</p>
              <div className="feed-card-review-content">
                <div className="feed-card-review-left">
                  <div className="feed-card-avatar">
                    <Link
                      to={`/profile/${review.userId}`}
                      className="feed-card-user-link"
                    >
                      {review.userPic ? (
                        <img src={review.userPic} alt={review.userName} />
                      ) : (
                        <span>{review.userName?.charAt(0).toUpperCase()}</span>
                      )}
                    </Link>
                  </div>

                  <div className="feed-card-review-info">
                    <div className="feed-card-review-meta">
                      <Link
                        to={`/profile/${review.userId}`}
                        className="feed-card-user-link"
                      >
                        <strong>{review.userName}</strong>
                      </Link>
                      {latestRating && (
                        <span className="feed-card-stars">
                          {renderStars(latestRating.rating)}{" "}
                          {latestRating.rating?.toFixed(1)}
                        </span>
                      )}
                      <span className="feed-card-review-date">{date}</span>
                    </div>
                    {latestComment?.text && (
                      <p className="feed-card-review-text">
                        {latestComment.text}
                      </p>
                    )}
                    <button
                      className="feed-card-review-link"
                      onClick={() =>
                        (window.location.href = `/place/${place.id}`)
                      }
                    >
                      See all {reviewsCount} reviews →
                    </button>
                  </div>
                </div>
                {user &&
                  user.uid !== review.userId &&
                  user.role !== "admin" && (
                    <button
                      className="report-btn"
                      onClick={() => setReportTarget(review)}
                    >
                      ⚑ Report
                    </button>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>

      {}
      {reportTarget &&
        createPortal(
          <div
            className="report-overlay"
            onClick={(e) =>
              e.target === e.currentTarget && setReportTarget(null)
            }
          >
            <div className="report-modal">
              <div className="report-modal-header">
                <h3>Report Comment</h3>
                <button
                  className="report-close"
                  onClick={() => setReportTarget(null)}
                >
                  ×
                </button>
              </div>
              <div className="report-modal-body">
                <p className="report-modal-sub">
                  Reporting comment by <strong>{reportTarget.userName}</strong>
                </p>
                {reportTarget.text && (
                  <p className="report-comment-preview">
                    "{reportTarget.text}"
                  </p>
                )}
                <label className="report-label">Reason</label>
                <textarea
                  className="report-textarea"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Why are you reporting this comment?"
                />
              </div>
              <div className="report-modal-footer">
                <button
                  className="report-cancel-btn"
                  onClick={() => setReportTarget(null)}
                >
                  Cancel
                </button>
                <button
                  className="report-submit-btn"
                  onClick={handleSubmitReport}
                  disabled={submittingReport || !reportReason.trim()}
                >
                  {submittingReport ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}