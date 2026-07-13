import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import placesData from "../../places.json";
import Card from "../../shared/components/Card";
import Toast from "../../shared/components/Toast";
import "./PlaceDetails.css";
import { useAuth } from "../../app/providers/AuthContext";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit,
  startAfter,
} from "firebase/firestore";

function PlaceDetails() {
  const { id } = useParams();
  const { user, toggleFavorite, isFavorite } = useAuth();

  const [place, setPlace] = useState(null);
  const [relatedPlaces, setRelatedPlaces] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [toast, setToast] = useState({
    visible: false,
    type: "success",
    message: "",
  });
  const toastTimeout = useRef(null);
  const COMMENTS_PER_PAGE = 3;

  const saved = place ? isFavorite(place.id) : false;
  const [showAllComments, setShowAllComments] = useState(false);

  const toggleComments = () => {
    setShowAllComments(!showAllComments);
  };

  const showToast = (type, message) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ visible: true, type, message });
    toastTimeout.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 3000);
  };

  const fetchComments = async () => {
    if (loadingComments) return;
    setLoadingComments(true);

    try {
      const q = query(
        collection(db, "comments"),
        where("placeId", "==", String(id)),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      const newComments = snap.docs.map((doc) => ({
        commentId: doc.id,
        ...doc.data(),
      }));

      setComments(newComments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  const fetchAvgRating = async () => {
    try {
      const jsonRating = place?.rating || 0;
      const jsonReviews = place?.reviews || 0;

      const q = query(
        collection(db, "comments"),
        where("placeId", "==", String(id))
      );
      const snap = await getDocs(q);
      const firebaseRatings = snap.docs
        .map((doc) => doc.data().rating)
        .filter((r) => r !== null && r !== undefined);

      const allRatings = [jsonRating, ...firebaseRatings];

      if (allRatings.length > 0) {
        const sum = allRatings.reduce((a, b) => a + b, 0);
        const avg = sum / allRatings.length;
        setAvgRating(avg);
        const total = jsonReviews + firebaseRatings.length;
        setTotalRatings(total);
      } else {
        setAvgRating(0);
        setTotalRatings(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    const fetchPlace = async () => {
      try {
        const snapshot = await getDocs(collection(db, "places"));
        const firestorePlaces = snapshot.docs.map((doc) => ({
          ...doc.data(),
          firestoreId: doc.id,
        }));

        const allPlaces = [...placesData, ...firestorePlaces];
        const found = allPlaces.find((p) => String(p.id) === String(id));
        setPlace(found);

        if (found) {
          const similar = allPlaces.filter((p) => {
            if (String(p.id) === String(found.id)) return false;
            const sameCity = p.city === found.city;
            const commonTags = p.tags?.some((tag) => found.tags?.includes(tag));
            return sameCity || commonTags;
          });

          similar.sort((a, b) => {
            const aScore = a.city === found.city ? 2 : 0;
            const bScore = b.city === found.city ? 2 : 0;
            return bScore - aScore;
          });

          setRelatedPlaces(similar.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching place:", err);
      }
    };

    fetchPlace();
  }, [id]);

  useEffect(() => {
    if (place) {
      fetchComments();
      fetchAvgRating();
    }
  }, [place]);

  const renderStars = (rating) => {
    const safeRating = Math.max(0, Math.min(5, rating));
    const fullStars = Math.floor(safeRating);
    const halfStar = safeRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return "★".repeat(fullStars) + (halfStar ? "½" : "") + "☆".repeat(emptyStars);
  };

  const handleSubmitRating = async () => {
    const rating = parseFloat(commentRating);
    if (isNaN(rating) || rating < 0 || rating > 5) {
      showToast("error", "Please enter a rating between 0 and 5");
      return;
    }

    setSubmittingComment(true);
    try {
      await addDoc(collection(db, "comments"), {
        placeId: String(id),
        text: null,
        rating: rating,
        userId: user.uid,
        userName: user.name,
        userPic: user.profilePic || null,
        createdAt: serverTimestamp(),
      });
      setCommentRating("");
      await fetchComments();
      await fetchAvgRating();
      showToast("success", "Rating submitted successfully!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      showToast("error", "Failed to submit rating. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      showToast("error", "Please enter a comment");
      return;
    }

    setSubmittingComment(true);
    try {
      await addDoc(collection(db, "comments"), {
        placeId: String(id),
        text: commentText.trim(),
        rating: null,
        userId: user.uid,
        userName: user.name,
        userPic: user.profilePic || null,
        createdAt: serverTimestamp(),
      });
      setCommentText("");
      await fetchComments();
      showToast("success", "Comment posted successfully!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      showToast("error", "Failed to post comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (!place) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }

  const uniqueImages = [
    ...new Set([place.coverImage, ...(place.gallery || [])]),
  ];

  return (
    <div className="details-page">
      <Toast
        message={toast.message}
        visible={toast.visible}
        type={toast.type}
      />
      <div className="hero-wrap">
        <img src={place.coverImage} alt={place.title} />
        <div className="hero-overlay">
          <Link to="/map" className="back">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to map
          </Link>
          <div className="hero-text">
            <h1>{place.title}</h1>
            <p>{place.city}</p>
          </div>
        </div>
      </div>
      <div className="content-wrap">
        <div className="details-grid">
          <div className="left-col">
            <div className="block">
              <h2>About this place</h2>
              <p>{place.longdescription || place.description}</p>
              <div className="tags">
                {place.tags?.map((tag, i) => (
                  <span key={i} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {uniqueImages.length > 0 && (
              <div className="block">
                <h2>Gallery</h2>
                <div className="gallery-thumbs">
                  {uniqueImages.map((img, i) => (
                    <div key={i} className="thumb">
                      <img src={img} alt={`${place.title}-${i}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="right-col">
            <div className="location-block">
              {user && user?.role !== "admin" && (
                <div className="actions">
                  <button className="btn-primary">+ Add to trip</button>
                  <button
                    className={`btn-secondary ${saved ? "btn-secondary--saved" : ""}`}
                    onClick={() => toggleFavorite(place)}
                  >
                    {saved ? "♥ Saved" : "♡ Save"}
                  </button>
                </div>
              )}
              <br />
              <h3>LOCATION</h3>
              <p className="location-name">{place.city}</p>
              <div className="location-map">
                <iframe
                  title="map"
                  width="100%"
                  height="300"
                  frameBorder="0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    place.lng - 0.015
                  },${place.lat - 0.015},${place.lng + 0.015},${place.lat + 0.015}&marker=${
                    place.lat
                  },${place.lng}`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="comments-section">
          <h2>Reviews & Comments</h2>

          {totalRatings > 0 && (
            <div className="rating-summary">
              <h3>Average Rating</h3>
              <div className="rating-display">
                <span className="rating-number">{avgRating.toFixed(1)}</span>
                <span className="rating-stars">{renderStars(avgRating)}</span>
                <span className="rating-count">({totalRatings} reviews)</span>
              </div>
            </div>
          )}

          {user && user.role !== "admin" && (
            <div className="comment-form">
              <div className="rating-form">
                <h3 className="rating-form-title">Rate this place</h3>
                <div className="rating-input-row">
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="0 - 5"
                    value={commentRating}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (val >= 0 && val <= 5) {
                        setCommentRating(e.target.value);
                      } else if (e.target.value === "") {
                        setCommentRating("");
                      }
                    }}
                    className="comment-rating-input"
                  />
                  <button
                    className="comment-submit-btn"
                    onClick={handleSubmitRating}
                    disabled={submittingComment || !commentRating}
                  >
                    Submit Rating
                  </button>
                </div>
              </div>

              <div className="form-divider" />

              <div className="comment-form-section">
                <h3 className="rating-form-title">Leave a comment</h3>
                <textarea
                  className="comment-textarea"
                  placeholder="Share your experience..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                />
                <button
                  className="comment-submit-btn"
                  onClick={handleSubmitComment}
                  disabled={submittingComment || !commentText.trim()}
                >
                  Post Comment
                </button>
              </div>
            </div>
          )}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first!</p>
            ) : (
              <>
                {(showAllComments
                  ? comments
                  : comments.slice(0, COMMENTS_PER_PAGE)
                ).map((comment) => (
                  <div key={comment.commentId} className="comment-item">
                    <div className="comment-header">
                      <div className="comment-user">
                        <Link
                          to={`/profile/${comment.userId}`}
                          className="comment-avatar-link"
                        >
                          {comment.userPic ? (
                            <img
                              src={comment.userPic}
                              alt={comment.userName}
                              className="comment-avatar"
                            />
                          ) : (
                            <div className="comment-avatar-placeholder">
                              {comment.userName?.charAt(0) || "U"}
                            </div>
                          )}
                        </Link>
                        <Link
                          to={`/profile/${comment.userId}`}
                          className="comment-username"
                        >
                          {comment.userName || "Anonymous"}
                        </Link>
                      </div>
                      <span className="comment-date">
                        {comment.createdAt?.toDate?.()?.toLocaleDateString() ||
                          new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {comment.rating && (
                      <div className="comment-rating-display">
                        <span className="comment-rating-stars">
                          {renderStars(comment.rating)}
                        </span>
                        <span className="comment-rating-value">
                          {comment.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                    {comment.text && (
                      <p className="comment-text">{comment.text}</p>
                    )}
                  </div>
                ))}

                {comments.length > COMMENTS_PER_PAGE && (
                  <button className="load-more-btn" onClick={toggleComments}>
                    {showAllComments ? "Show Less ↑" : "View More Comments →"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {relatedPlaces.length > 0 && (
          <div className="related">
            <h2>You may also like</h2>
            <div className="places">
              {relatedPlaces.map((item) => (
                <Card key={item.id} place={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaceDetails;