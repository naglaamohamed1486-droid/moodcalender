import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthContext";
import { useState, useRef, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Card from "../../shared/components/Card";
import PlaceCard from "../contribution/ContributionCard";
import Toast from "../../shared/components/Toast";
import SavedTripsList from "../../shared/components/savedTripsList";
import {
  setUserProfilePic,
  getUserProfilePic,
} from "../../shared/utils/PicCache";
import "./profile.css";

export default function Profile() {
  const { id } = useParams();
  const { user: authUser, logout, updateUser } = useAuth();
  const isOwnProfile = !id || (authUser && id === authUser.uid);

  const [viewedUser, setViewedUser] = useState(null);
  const [loadingViewed, setLoadingViewed] = useState(!isOwnProfile);
  const [viewError, setViewError] = useState("");

 useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, []);

useEffect(() => {
  if (isOwnProfile) return;

  let cancelled = false;

  setLoadingViewed(true);
  setViewError("");

  getDoc(doc(db, "users", id))
    .then((snap) => {
      if (cancelled) return;

      if (!snap.exists()) {
        setViewError("This user doesn't exist.");
        setViewedUser(null);
      } else {
        setViewedUser({
          ...snap.data(),
          uid: id,
        });
      }
    })
    .catch((err) => {
      if (!cancelled) {
        console.error("Failed to load profile:", err);
        setViewError("Couldn't load this profile.");
      }
    })
    .finally(() => {
      if (!cancelled) {
        setLoadingViewed(false);
      }
    });

  return () => {
    cancelled = true;
  };
}, [id, isOwnProfile]);

  const user = isOwnProfile ? authUser : viewedUser;

  const viewerRole = isOwnProfile
    ? "self"
    : authUser?.role === "admin"
      ? "admin"
      : "peer";

  const availableTabs =
    viewerRole === "self"
      ? ["info", "places", "trips", "contributions"]
      : viewerRole === "admin"
        ? ["info", "trips", "contributions"]
        : ["info", "contributions"];

  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    location: authUser?.location || "",
    bio: authUser?.bio || "",
  });
  const fileInputRef = useRef(null);
  const { savedTrips } = useAuth();
  const [activeTab, setActiveTab] = useState("info");
  const [toast, setToast] = useState({
    visible: false,
    type: "success",
    message: "",
  });
  const toastTimeout = useRef(null);
  const showToast = (type, message) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ visible: true, type, message });
    toastTimeout.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 3000);
  };

  useEffect(() => {
    if (!availableTabs.includes(activeTab)) setActiveTab("info");
  }, [viewerRole]);

  if (!authUser) {
    return <h2>Please login first</h2>;
  }

  if (!isOwnProfile && loadingViewed) {
    return (
      <main className="profile-main">
        <p className="pf-loading-state">Loading profile…</p>
      </main>
    );
  }

  if (!isOwnProfile && (viewError || !user)) {
    return (
      <main className="profile-main">
        <p className="pf-empty-title">{viewError || "User not found."}</p>
        {authUser.role === "admin" && (
          <Link to="/adminUsers" className="pf-empty-btn">
            ← Back to User Administration
          </Link>
        )}
      </main>
    );
  }

  const formatDate = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageUrl = await setUserProfilePic(authUser.email, reader.result);
      await updateUser({ profilePic: imageUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleOpenEdit = () => {
    setFormData({
      name: authUser.name || "",
      email: authUser.email || "",
      location: authUser.location || "",
      bio: authUser.bio || "",
    });
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateUser(formData);
    setShowEditModal(false);
  };

  const visibleContributions =
    viewerRole === "peer"
      ? (user.contributions || []).filter((p) => p.status === "approved")
      : user.contributions || [];
      

  return (
    <main className="profile-main">
      <Toast
        message={toast.message}
        visible={toast.visible}
        type={toast.type}
      />

      {!isOwnProfile && (
        <div className="pf-viewing-notice">
          {authUser.role === "admin" && (
            <Link to="/adminUsers" className="pf-viewing-back">
              ← Back to User Administration
            </Link>
          )}
          {viewerRole === "admin" && user.banned && (
            <span className="pf-viewing-banned-tag">Banned</span>
          )}
        </div>
      )}

      <div className="profile-hero">
        <div className="profile-hero-cont">
          <div className="profile-data">
            <div
              className="profile-pic-wrapper"
              onClick={() => isOwnProfile && fileInputRef.current.click()}
              style={{ cursor: isOwnProfile ? "pointer" : "default" }}
            >
              {user.profilePic ? (
                <img
                  className="profile-pic"
                  src={user.profilePic}
                  alt="profile"
                />
              ) : (
                <div className="placeholder-pic">
                  <svg
                    className="placeholder-pic-svg"
                    width="100"
                    height="100"
                    viewBox="120 1990 40 40"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#3A2A1A"
                  >
                    <path d="M134,2008.99998 C131.783496,2008.99998 129.980955,2007.20598 129.980955,2004.99998 C129.980955,2002.79398 131.783496,2000.99998 134,2000.99998 C136.216504,2000.99998 138.019045,2002.79398 138.019045,2004.99998 C138.019045,2007.20598 136.216504,2008.99998 134,2008.99998 M137.775893,2009.67298 C139.370449,2008.39598 140.299854,2006.33098 139.958235,2004.06998 C139.561354,2001.44698 137.368965,1999.34798 134.722423,1999.04198 C131.070116,1998.61898 127.971432,2001.44898 127.971432,2004.99998 C127.971432,2006.88998 128.851603,2008.57398 130.224107,2009.67298 C126.852128,2010.93398 124.390463,2013.89498 124.004634,2017.89098 C123.948368,2018.48198 124.411563,2018.99998 125.008391,2018.99998 C125.519814,2018.99998 125.955881,2018.61598 126.001095,2018.10898 C126.404004,2013.64598 129.837274,2010.99998 134,2010.99998 C138.162726,2010.99998 141.595996,2013.64598 141.998905,2018.10898 C142.044119,2018.61598 142.480186,2018.99998 142.991609,2018.99998 C143.588437,2018.99998 144.051632,2018.48198 143.995366,2017.89098 C143.609537,2013.89498 141.147872,2010.93398 137.775893,2009.67298" />
                  </svg>
                </div>
              )}

              {isOwnProfile && (
                <div className="profile-pic-overlay">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                      stroke="#FDF8EE"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Edit</span>
                </div>
              )}

              {isOwnProfile && (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlePicChange}
                />
              )}
            </div>
            <div className="profile-hero-personal">
              <p className="profile-hero-type">EXPLORER</p>
              <p className="profile-hero-name"> {user.name}</p>
              <p className="profile-hero-email">
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

          {isOwnProfile && (
            <div className="profile-hero-btns">
              <Link className="profile-hero-btns-gen" to="/trip-plan">
                <svg
                  className="create-svg"
                  fill="#2A1A08"
                  width="24px"
                  height="20px"
                  viewBox="0 0 256 256"
                  id="Flat"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#2A1A08"
                  strokeWidth="8.096"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path d="M197.00781,132.74023l-52.16015-19.21777a3.99186,3.99186,0,0,1-2.3711-2.37012L123.25977,58.99219a11.99948,11.99948,0,0,0-22.51954,0L81.52246,111.15234a3.99186,3.99186,0,0,1-2.37012,2.3711L26.99219,132.74023a11.99948,11.99948,0,0,0,0,22.51954l52.16015,19.21777a3.99186,3.99186,0,0,1,2.3711,2.37012l19.21679,52.16015a11.99948,11.99948,0,0,0,22.51954,0l19.21679-52.16015h.001a3.99186,3.99186,0,0,1,2.37012-2.3711l52.16015-19.21679a11.99948,11.99948,0,0,0,0-22.51954Zm-2.76562,15.01368L142.082,166.96973a11.98076,11.98076,0,0,0-7.11133,7.1123l-19.21679,52.16016a4.00076,4.00076,0,0,1-7.50782,0L89.03027,174.082a11.98076,11.98076,0,0,0-7.1123-7.11133L29.75781,147.75391a4.00076,4.00076,0,0,1,0-7.50782L81.918,121.03027a11.98076,11.98076,0,0,0,7.11133-7.1123l19.21679-52.16016a4.00076,4.00076,0,0,1,7.50782,0L134.96973,113.918a11.98076,11.98076,0,0,0,7.1123,7.11133l52.16016,19.21679a4.00076,4.00076,0,0,1,0,7.50782ZM148,40a4.0002,4.0002,0,0,1,4-4h20V16a4,4,0,0,1,8,0V36h20a4,4,0,0,1,0,8H180V64a4,4,0,0,1-8,0V44H152A4.0002,4.0002,0,0,1,148,40Zm96,48a4.0002,4.0002,0,0,1-4,4H228v12a4,4,0,0,1-8,0V92H208a4,4,0,0,1,0-8h12V72a4,4,0,0,1,8,0V84h12A4.0002,4.0002,0,0,1,244,88Z"></path>{" "}
                  </g>
                </svg>
                Plan a trip
              </Link>
              <Link className="profile-hero-btns-add" to="/addplace">
                {" "}
                <span className="pf-hero-add-svg">+</span>Add a place
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="pf-link">
        <div className="pf-link-cont">
          {viewerRole === "self" && (
            <Link to="/favorites" className="pf-linkat">
              <div className="pf-linkat-data">
                <div className="pf-linkat-svg">
                  <svg
                    fill="#C9A84C"
                    width="28"
                    height="34"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.5,4.609A5.811,5.811,0,0,0,16,2.5a5.75,5.75,0,0,0-4,1.455A5.75,5.75,0,0,0,8,2.5,5.811,5.811,0,0,0,3.5,4.609c-.953,1.156-1.95,3.249-1.289,6.66,1.055,5.447,8.966,9.917,9.3,10.1a1,1,0,0,0,.974,0c.336-.187,8.247-4.657,9.3-10.1C22.45,7.858,21.453,5.765,20.5,4.609Zm-.674,6.28C19.08,14.74,13.658,18.322,12,19.34c-2.336-1.41-7.142-4.95-7.821-8.451-.513-2.646.189-4.183.869-5.007A3.819,3.819,0,0,1,8,4.5a3.493,3.493,0,0,1,3.115,1.469,1.005,1.005,0,0,0,1.76.011A3.489,3.489,0,0,1,16,4.5a3.819,3.819,0,0,1,2.959,1.382C19.637,6.706,20.339,8.243,19.826,10.889Z" />
                  </svg>
                </div>
                <div className="pf-linkat-det">
                  <p className="pf-link-num">{user.favorites?.length || 0}</p>
                  <p className="pf-link-title">FAVORITES</p>
                </div>
              </div>
            </Link>
          )}

          {(viewerRole === "self" || viewerRole === "admin") && (
            <Link
              to={viewerRole === "self" ? "/SavedTrips" : "#"}
              className="pf-linkat"
              onClick={(e) => viewerRole !== "self" && e.preventDefault()}
            >
              <div className="pf-linkat-data">
                <div className="pf-linkat-svg">
                  <svg
                    width="32"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C9A84C"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.75 6L7.5 5.25H16.5L17.25 6V19.3162L12 16.2051L6.75 19.3162V6Z
                    M8.25 6.75V16.6838L12 14.4615L15.75 16.6838V6.75H8.25Z"
                      fill="#C9A84C"
                    />
                  </svg>
                </div>
                <div className="pf-linkat-det">
                  <p className="pf-link-num">{user.savedTrips?.length || 0}</p>
                  <p className="pf-link-title">SAVED TRIPS</p>
                </div>
              </div>
            </Link>
          )}

          {viewerRole === "self" && (
            <Link to="/savedtrips" className="pf-linkat">
              <div className="pf-linkat-data">
                <div className="pf-linkat-svg">
                  <svg
                    className="create-svg"
                    fill="#C9A84C"
                    width="34px"
                    height="34px"
                    viewBox="0 0 256 256"
                    id="Flat"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#C9A84C"
                    strokeWidth="8.096"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path d="M197.00781,132.74023l-52.16015-19.21777a3.99186,3.99186,0,0,1-2.3711-2.37012L123.25977,58.99219a11.99948,11.99948,0,0,0-22.51954,0L81.52246,111.15234a3.99186,3.99186,0,0,1-2.37012,2.3711L26.99219,132.74023a11.99948,11.99948,0,0,0,0,22.51954l52.16015,19.21777a3.99186,3.99186,0,0,1,2.3711,2.37012l19.21679,52.16015a11.99948,11.99948,0,0,0,22.51954,0l19.21679-52.16015h.001a3.99186,3.99186,0,0,1,2.37012-2.3711l52.16015-19.21679a11.99948,11.99948,0,0,0,0-22.51954Zm-2.76562,15.01368L142.082,166.96973a11.98076,11.98076,0,0,0-7.11133,7.1123l-19.21679,52.16016a4.00076,4.00076,0,0,1-7.50782,0L89.03027,174.082a11.98076,11.98076,0,0,0-7.1123-7.11133L29.75781,147.75391a4.00076,4.00076,0,0,1,0-7.50782L81.918,121.03027a11.98076,11.98076,0,0,0,7.11133-7.1123l19.21679-52.16016a4.00076,4.00076,0,0,1,7.50782,0L134.96973,113.918a11.98076,11.98076,0,0,0,7.1123,7.11133l52.16016,19.21679a4.00076,4.00076,0,0,1,0,7.50782ZM148,40a4.0002,4.0002,0,0,1,4-4h20V16a4,4,0,0,1,8,0V36h20a4,4,0,0,1,0,8H180V64a4,4,0,0,1-8,0V44H152A4.0002,4.0002,0,0,1,148,40Zm96,48a4.0002,4.0002,0,0,1-4,4H228v12a4,4,0,0,1-8,0V92H208a4,4,0,0,1,0-8h12V72a4,4,0,0,1,8,0V84h12A4.0002,4.0002,0,0,1,244,88Z"></path>{" "}
                    </g>
                  </svg>
                </div>
                <div className="pf-linkat-det">
                  <p className="pf-link-num">{user.savedTrips?.length || 0}</p>
                  <p className="pf-link-title">GENERATED TRIPS</p>
                </div>
              </div>
            </Link>
          )}

          <Link
            to={viewerRole === "self" ? "/contributions" : "#"}
            className="pf-linkat"
            onClick={(e) => viewerRole !== "self" && e.preventDefault()}
          >
            <div className="pf-linkat-data">
              <div className="pf-linkat-svg">
                <svg
                  width="28px"
                  height="34px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.186 2.09c.521.25 1.136.612 1.625 1.101.49.49.852 1.104 1.1 1.625.313.654.11 1.408-.401 1.92l-7.214 7.213c-.31.31-.688.541-1.105.675l-4.222 1.353a.75.75 0 0 1-.943-.944l1.353-4.221a2.75 2.75 0 0 1 .674-1.105l7.214-7.214c.512-.512 1.266-.714 1.92-.402zm.211 2.516a3.608 3.608 0 0 0-.828-.586l-6.994 6.994a1.002 1.002 0 0 0-.178.241L9.9 14.102l2.846-1.496c.09-.047.171-.107.242-.178l6.994-6.994a3.61 3.61 0 0 0-.586-.828zM4.999 5.5A.5.5 0 0 1 5.47 5l5.53.005a1 1 0 0 0 0-2L5.5 3A2.5 2.5 0 0 0 3 5.5v12.577c0 .76.082 1.185.319 1.627.224.419.558.754.977.978.442.236.866.318 1.627.318h12.154c.76 0 1.185-.082 1.627-.318.42-.224.754-.559.978-.978.236-.442.318-.866.318-1.627V13a1 1 0 1 0-2 0v5.077c0 .459-.021.571-.082.684a.364.364 0 0 1-.157.157c-.113.06-.225.082-.684.082H5.923c-.459 0-.57-.022-.684-.082a.363.363 0 0 1-.157-.157c-.06-.113-.082-.225-.082-.684V5.5z"
                    fill="#C9A84C"
                  />
                </svg>
              </div>
              <div className="pf-linkat-det">
                <p className="pf-link-num">{visibleContributions.length}</p>
                <p className="pf-link-title">CONTRIBUTIONS</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

     
      <div className="pf-btn-sec">
        <div className="pf-btn-cont">
          {availableTabs.includes("info") && (
            <button
              className={`pf-btn ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              User info
            </button>
          )}
          {availableTabs.includes("places") && (
            <button
              className={`pf-btn ${activeTab === "places" ? "active" : ""}`}
              onClick={() => setActiveTab("places")}
            >
              Favorite places{" "}
              <span className="pf-btn-num">{user.favorites?.length || 0}</span>
            </button>
          )}
          {availableTabs.includes("trips") && (
            <button
              className={`pf-btn ${activeTab === "trips" ? "active" : ""}`}
              onClick={() => setActiveTab("trips")}
            >
              Saved trips{" "}
              <span className="pf-btn-num">
                {" "}
                {user.savedTrips?.length || 0}
              </span>
            </button>
          )}
          {availableTabs.includes("contributions") && (
            <button
              className={`pf-btn ${activeTab === "contributions" ? "active" : ""}`}
              onClick={() => setActiveTab("contributions")}
            >
              Contributions{" "}
              <span className="pf-btn-num"> {visibleContributions.length}</span>
            </button>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="user-profile-content">
          {activeTab === "info" && (
            <div className="info-section">
              {isOwnProfile && (
                <button className="info-sec-btn" onClick={handleOpenEdit}>
                  Edit Profile
                </button>
              )}
              <div className="info-cont">
                <div className="info-sec">
                  <h3 className="info-sec-tit">BIO</h3>
                  <p className="about-sec-p">
                    {user?.bio ||
                      (isOwnProfile
                        ? "Tell people about yourself..."
                        : `${user.name} hasn't shared a bio yet.`)}
                  </p>
                </div>
                <div className="info-sec">
                  <div className="details-sec-head">
                    <h3 className="info-sec-tit">Details</h3>
                  </div>
                  <ul className="sec-details-cont">
                    <li className="info-det">
                      <span className="info-det-title">NAME</span>
                      {user.name}
                    </li>
                    <li className="info-det">
                      <span className="info-det-title">EMAIL</span>
                      {user.email}
                    </li>
                    <li className="info-det">
                      <span className="info-det-title">HOME BASE</span>
                      {user?.location || "Add your location"}
                    </li>
                    <li className="info-det">
                      <span className="info-det-title">MEMBER SINCE</span>
                      {formatDate(user.createdAt)}
                    </li>
                    {viewerRole === "admin" && (
                      <li className="info-det">
                        <span className="info-det-title">STATUS</span>
                        {user.banned ? "Banned" : "Active"}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              {isOwnProfile && showEditModal && (
                <div
                  className="edit-modal-overlay"
                  onClick={() => setShowEditModal(false)}
                >
                  <div
                    className="edit-modal"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="edit-modal-head">
                      <h3 className="edit-modal-title">Edit Profile</h3>
                      <button
                        className="edit-modal-close"
                        onClick={() => setShowEditModal(false)}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="edit-modal-body">
                      <div className="edit-field">
                        <label className="edit-label">NAME</label>
                        <input
                          className="edit-input"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                        />
                      </div>

                      <div className="edit-field">
                        <label className="edit-label">EMAIL</label>
                        <input
                          className="edit-input"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                        />
                      </div>

                      <div className="edit-field">
                        <label className="edit-label">HOME BASE</label>
                        <input
                          className="edit-input"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="City, Country"
                        />
                      </div>

                      <div className="edit-field">
                        <label className="edit-label">BIO</label>
                        <textarea
                          className="edit-input edit-textarea"
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          placeholder="Tell us a little about yourself..."
                          rows={4}
                        />
                      </div>
                    </div>

                    <div className="edit-modal-footer">
                      <button
                        className="edit-cancel-btn"
                        onClick={() => setShowEditModal(false)}
                      >
                        Cancel
                      </button>
                      <button className="edit-save-btn" onClick={handleSave}>
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "places" && availableTabs.includes("places") && (
            <div className="pf-content-section">
              {user.favorites?.length > 0 ? (
                <div className="pf-content-section-container">
                  <div className="pf-content-section-header">
                    <h3 className="title-sect-saved"> My Favorite Places</h3>
                    <div className="more-places-links">
                      <Link to="/feed" className="exfav-more">
                        Explore more
                      </Link>
                      <Link to="/favorites" className="fav-more">
                        View All Favorite
                      </Link>
                    </div>
                  </div>
                  <div className="pf-cards-grid">
                    {user.favorites.slice(-8).map((place, i) => (
                      <Card key={place.id || i} place={place} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pf-empty-state">
                  <p className="pf-empty-title">No saved places yet</p>
                  <p className="pf-empty-sub">
                    Explore the map and save places you love
                  </p>
                  <Link to="/map" className="pf-empty-btn">
                    Explore Map
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === "trips" && availableTabs.includes("trips") && (
            <div className="pf-content-section">
              {user.savedTrips?.length > 0 ? (
                <div className="pf-content-section-container">
                  <div className="pf-content-section-header">
                    <h3 className="title-sect-saved">
                      {" "}
                      {isOwnProfile ? "My" : `${user.name}'s`} Saved Trips
                    </h3>
                    {isOwnProfile && (
                      <div className="more-places-links">
                        <Link to="/trip-plan" className="exfav-more">
                          Plan more
                        </Link>
                        <Link to="/savedtrips" className="fav-more">
                          All Saved Trips
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="pf-trips-grid">
                    {isOwnProfile ? (
                      <SavedTripsList />
                    ) : (
                      <p className="pf-empty-sub">
                        Trip details aren't available in read-only view.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="pf-empty-state">
                  <p className="pf-empty-title">No saved trips yet</p>
                  {isOwnProfile && (
                    <>
                      <p className="pf-empty-sub">
                        Plan a trip and it'll appear here
                      </p>
                      <Link to="/trip-plan" className="pf-empty-btn">
                        Plan a Trip
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "contributions" && (
            <div className="pf-content-section">
              {visibleContributions.length > 0 ? (
                <div className="pf-content-section-container">
                  <div className="pf-content-section-header">
                    <h3 className="title-sect-saved">
                      {isOwnProfile ? "My" : `${user.name}'s`} Contributions
                    </h3>
                    {isOwnProfile && (
                      <div className="cont-btns">
                        <Link to="/contributions" className="cont-more">
                          Manage All
                        </Link>
                        <Link className="profile-btns-add" to="/addplace">
                          Add a place
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="pf-cards-grid">
                    {visibleContributions.slice(-6).map((place, i) => (
                      <Card
                        key={place.id || i}
                        place={place}
                        showStatus={viewerRole !== "peer"}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pf-empty-state">
                  <p className="pf-empty-title">No contributions yet</p>
                  {isOwnProfile && (
                    <>
                      <p className="pf-empty-sub">
                        Add places to help other explorers discover Egypt
                      </p>
                      <Link to="/addplace" className="pf-empty-btn">
                        Add a Place
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
  