import { useMemo, useState, useEffect } from "react";
import "./Feed.css";

import { useAuth } from "../../app/providers/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";

import placesData from "../../places.json";

import PlaceCard from "../places/PlaceCard";
import SearchBar from "../../shared/components/SearchBar";
import CategoryFilter from "../places/CategoryFilter";
import LatestReview from "./LatestReview";
import { getApprovedPlaces } from "../contribution/placesdatahandling";
export default function Feed() {
  const navigate = useNavigate();

  const { toggleFavorite, isFavorite } = useAuth();

  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [activeTab, setActiveTab] = useState("new");

  const [comments, setComments] = useState([]);
  const [approvedPlaces, setApprovedPlaces] = useState([]);
  const jsonPlaces = Array.isArray(placesData)
    ? placesData
    : [];

  const places =
    activeTab === "new"
      ? approvedPlaces
      : jsonPlaces;

  useEffect(() => {
    async function loadComments() {
      try {
        const snap = await getDocs(
          collection(db, "comments")
        );

        setComments(
          snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (err) {
        console.error(err);
      }
    }

    loadComments();
  }, []);
  useEffect(() => {
  async function loadApprovedPlaces() {
    try {
      const approved = await getApprovedPlaces();
      setApprovedPlaces(approved);
    } catch (err) {
      console.error(err);
    }
  }

  loadApprovedPlaces();
}, []);

  const placesWithReviews = useMemo(() => {
    return (
    activeTab === "new"
    ? places
    : places.filter((place) => {
      const jsonReviews = place.reviews || 0;

      const firebaseReviews = comments.filter(
        (comment) =>
          comment.placeId === String(place.id)
      ).length;

      return jsonReviews + firebaseReviews > 0;
    })
    );
  }, [places, comments]);

  const filteredPlaces = useMemo(() => {
    let result = [...placesWithReviews];

    const searchText = search.toLowerCase();

    result = result.filter((place) => {
      const matchesSearch =
        place.title
          ?.toLowerCase()
          .includes(searchText) ||
        place.city
          ?.toLowerCase()
          .includes(searchText);

      const normalize = (value) =>
        (value || "")
          .toString()
          .trim()
          .toLowerCase();

      const matchesTag =
        selectedTags.length === 0 ||
        place.tags?.some((tag) =>
          selectedTags.some(
            (selected) =>
              normalize(tag) ===
              normalize(selected)
          )
        );

      return matchesSearch && matchesTag;
    });

if (activeTab === "popular") {
  result.sort((a, b) => {
    const aFirebase = comments.filter(
      (c) => c.placeId === String(a.id)
    );

    const bFirebase = comments.filter(
      (c) => c.placeId === String(b.id)
    );

    const aRatings = [
      ...(a.rating ? [a.rating] : []),
      ...aFirebase
        .map((c) => c.rating)
        .filter((r) => r != null),
    ];

    const bRatings = [
      ...(b.rating ? [b.rating] : []),
      ...bFirebase
        .map((c) => c.rating)
        .filter((r) => r != null),
    ];

    const aAvg =
      aRatings.length > 0
        ? aRatings.reduce((x, y) => x + y, 0) /
          aRatings.length
        : 0;

    const bAvg =
      bRatings.length > 0
        ? bRatings.reduce((x, y) => x + y, 0) /
          bRatings.length
        : 0;

    const aReviews =
      (a.reviews || 0) + aFirebase.length;

    const bReviews =
      (b.reviews || 0) + bFirebase.length;

    if (bAvg !== aAvg) {
      return bAvg - aAvg;
    }
    return bReviews - aReviews;
  });
}

    if (activeTab === "reviewed") {
      result.sort((a, b) => {
        const aLast =
          comments
            .filter(
              (c) =>
                c.placeId === String(a.id)
            )
            .sort(
              (x, y) =>
                (y.createdAt?.seconds || 0) -
                (x.createdAt?.seconds || 0)
            )[0]?.createdAt?.seconds || 0;

        const bLast =
          comments
            .filter(
              (c) =>
                c.placeId === String(b.id)
            )
            .sort(
              (x, y) =>
                (y.createdAt?.seconds || 0) -
                (x.createdAt?.seconds || 0)
            )[0]?.createdAt?.seconds || 0;

        return bLast - aLast;
      });
    }

    if (activeTab === "new") {
      result.sort((a, b) => {
        const aCreated =
          a.createdAt?.seconds || 0;

        const bCreated =
          b.createdAt?.seconds || 0;

        return bCreated - aCreated;
      });
    }

    return result;
  }, [
    placesWithReviews,
    comments,
    search,
    selectedTags,
    activeTab,
  ]);

  return (
    <main className="feed-page">

      <section className="feed-hero">

    <div className="feed-overlay"></div>

    <div className="feed-hero-content">

        <span className="feed-subtitle">
            SHARED BY EXPLORERS
        </span>

        <h1>
            Hidden gems from
            <br />
            the community
        </h1>

        <p>
            Places submitted by real travelers,
            hidden cafés, quiet streets,
            unforgettable sunsets and authentic experiences.
        </p>

      <button
        className="feed-share-btn"
        onClick={() => navigate("/addplace")}
      >
        Share a Place
      </button>

    </div>

</section>

      <section className="feed-discover">

        <span className="feed-small-title">
          FROM THE COMMUNITY
        </span>

        <h2>
          Discoveries from travelers
        </h2>

        <p>
          Every place here was submitted by a
          real explorer.
        </p>

        <div className="feed-filter-box">

          <SearchBar
            search={search}
            setSearch={setSearch}
          />

          <CategoryFilter
            places={places}
            selectedTags={selectedTags}
            setSelectedTags={
              setSelectedTags
            }
          />

        </div>

        <div className="feed-tabs">

          <button
            className={
              activeTab === "new"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("new")
            }
          >
            New
          </button>

          <button
            className={
              activeTab === "popular"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("popular")
            }
          >
            Popular
          </button>

          <button
            className={
              activeTab === "reviewed"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("reviewed")
            }
          >
            Recently Reviewed
          </button>

        </div>

      </section>
            {/* ================= POSTS ================= */}

      <section className="feed-cards">
        {filteredPlaces.map((place) => (
          <div
            className="feed-post"
            key={place.id}
          >
            <PlaceCard
              place={place}
              hideActions
            />

            <div className="feed-review-section">

              <div className="feed-actions">

                <button
                  className={`community-save-btn ${
                    isFavorite(place.id)
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    toggleFavorite(place)
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill={
                      isFavorite(place.id)
                        ? "currentColor"
                        : "none"
                    }
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>

                  <span>Save</span>
                </button>
                <button
                  onClick={() =>
                    navigate(`/place/${place.id}`)
                  }
                >
                  👁 View Details
                </button>

              </div>

              <LatestReview
                placeId={place.id}
              />

            </div>

          </div>
        ))}
      </section>

    </main>
  );
}