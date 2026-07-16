import "./LatestReview.css";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthContext";

export default function LatestReview({ placeId }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [latestComment, setLatestComment] = useState(null);
  const [latestRating, setLatestRating] = useState(null);

  const [reportTarget, setReportTarget] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    async function loadReviews() {
      try {
        const q = query(
          collection(db, "comments"),
          where("placeId", "==", String(placeId)),
          orderBy("createdAt", "desc")
        );

        const snap = await getDocs(q);

        const data = snap.docs.map((doc) => ({
          commentId: doc.id,
          ...doc.data(),
        }));

        setReviews(data);

        setLatestComment(
          data.find(
            (item) =>
              item.text &&
              item.text.trim() !== ""
          ) || null
        );

        setLatestRating(
          data.find(
            (item) =>
              item.rating !== null &&
              item.rating !== undefined
          ) || null
        );
      } catch (err) {
        console.error(err);
      }
    }

    loadReviews();
  }, [placeId]);

  if (reviews.length === 0) return null;

  const review = latestComment || latestRating;

  const date =
    review?.createdAt
      ?.toDate?.()
      ?.toLocaleDateString() || "";

  const reviewsCount = reviews.length;

  const renderStars = (rating = 0) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <>
        {"★".repeat(full)}
        {half && "☆"}
        {"✩".repeat(empty)}
      </>
    );
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

        placeId: String(placeId),

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
      <div className="latest-review">

        <div className="latest-review-title">
          LATEST REVIEWS
        </div>

        <div className="latest-review-card">

          <div className="latest-review-left">

            <div className="latest-review-avatar">
              {review?.userName?.charAt(0).toUpperCase()}
            </div>

            <div className="latest-review-info">

              <h4>{review?.userName}</h4>

              <div className="latest-review-meta">

                {latestRating && (
                  <span className="latest-review-stars">
                    {renderStars(latestRating.rating)}
                    {" "}
                    {latestRating.rating.toFixed(1)}
                  </span>
                )}

                <span>{date}</span>

              </div>

              <p className="latest-review-text">
                {latestComment?.text || "No comment yet."}
              </p>

              <button
                className="latest-review-link"
                onClick={() =>
                  navigate(`/place/${placeId}`)
                }
              >
                See all {reviewsCount} reviews →
              </button>

            </div>

          </div>
            {user &&
            user.uid !== review?.userId &&
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

{reportTarget &&
  createPortal(
    <div
      className="report-overlay"
      onClick={(e) =>
        e.target === e.currentTarget &&
        setReportTarget(null)
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

          <label className="report-label">
            Reason
          </label>

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
            disabled={
              submittingReport ||
              !reportReason.trim()
            }
          >
            {submittingReport ? "Submitting..." : "Submit Report"}
          </button>

        </div>

      </div>
    </div>,
    document.body
  )}
    </>
  );
}