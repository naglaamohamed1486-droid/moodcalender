import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef } from "react";
import Card from "../components/Card";
import PlaceCard from "../components/AddPlaceCard";
import '../css/profile.css'


export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  if (!user) {
  return <h2>Please login first</h2>;
  }
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    location: user.location || "",
    bio: user.bio || "",
  });
  const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fileInputRef = useRef(null);

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updateUser({ profilePic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateUser(formData);
    setShowEditModal(false);
};
  const [activeTab, setActiveTab] = useState("info");
  const formatDate = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    });
};

  return (
    <main className="profile-main" >
      <div className="profile-hero">
        <div className="profile-hero-cont">
        <div className="profile-data">
          <div className="profile-pic-wrapper" onClick={() => fileInputRef.current.click()}>
  {user.profilePic ? (
    <img className="profile-pic" src={user.profilePic} alt="profile" />
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

  <div className="profile-pic-overlay">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#FDF8EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span>Edit</span>
  </div>

  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    style={{ display: "none" }}
    onChange={handlePicChange}
  />
</div>
          <div className="profile-hero-personal">
          <p className="profile-hero-type">EXPLORER</p>
          <p className="profile-hero-name"> {user.name}</p>
            <p className="profile-hero-email"> <svg
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
            </svg>{user.email}</p>
              </div>
          </div>
          <div className="profile-hero-btns">
            <Link  className="profile-hero-btns-gen" to="/trip-plan"><svg className="create-svg" fill="#2A1A08" width="24px" height="20px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#2A1A08" strokeWidth="8.096"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M197.00781,132.74023l-52.16015-19.21777a3.99186,3.99186,0,0,1-2.3711-2.37012L123.25977,58.99219a11.99948,11.99948,0,0,0-22.51954,0L81.52246,111.15234a3.99186,3.99186,0,0,1-2.37012,2.3711L26.99219,132.74023a11.99948,11.99948,0,0,0,0,22.51954l52.16015,19.21777a3.99186,3.99186,0,0,1,2.3711,2.37012l19.21679,52.16015a11.99948,11.99948,0,0,0,22.51954,0l19.21679-52.16015h.001a3.99186,3.99186,0,0,1,2.37012-2.3711l52.16015-19.21679a11.99948,11.99948,0,0,0,0-22.51954Zm-2.76562,15.01368L142.082,166.96973a11.98076,11.98076,0,0,0-7.11133,7.1123l-19.21679,52.16016a4.00076,4.00076,0,0,1-7.50782,0L89.03027,174.082a11.98076,11.98076,0,0,0-7.1123-7.11133L29.75781,147.75391a4.00076,4.00076,0,0,1,0-7.50782L81.918,121.03027a11.98076,11.98076,0,0,0,7.11133-7.1123l19.21679-52.16016a4.00076,4.00076,0,0,1,7.50782,0L134.96973,113.918a11.98076,11.98076,0,0,0,7.1123,7.11133l52.16016,19.21679a4.00076,4.00076,0,0,1,0,7.50782ZM148,40a4.0002,4.0002,0,0,1,4-4h20V16a4,4,0,0,1,8,0V36h20a4,4,0,0,1,0,8H180V64a4,4,0,0,1-8,0V44H152A4.0002,4.0002,0,0,1,148,40Zm96,48a4.0002,4.0002,0,0,1-4,4H228v12a4,4,0,0,1-8,0V92H208a4,4,0,0,1,0-8h12V72a4,4,0,0,1,8,0V84h12A4.0002,4.0002,0,0,1,244,88Z"></path> </g></svg>
               Plan a trip</Link>
            <Link className="profile-hero-btns-add" to="/addplace"> <span className="pf-hero-add-svg">+</span>Add a place</Link>
          </div>
        </div>
        
      </div>
      <div className="pf-link">
        <div className="pf-link-cont">
          <Link  to="/favorites" className="pf-linkat">
            <div className="pf-linkat-data">
              <div className="pf-linkat-svg"><svg
  fill="#C9A84C"
  width="28"
  height="34"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M20.5,4.609A5.811,5.811,0,0,0,16,2.5a5.75,5.75,0,0,0-4,1.455A5.75,5.75,0,0,0,8,2.5,5.811,5.811,0,0,0,3.5,4.609c-.953,1.156-1.95,3.249-1.289,6.66,1.055,5.447,8.966,9.917,9.3,10.1a1,1,0,0,0,.974,0c.336-.187,8.247-4.657,9.3-10.1C22.45,7.858,21.453,5.765,20.5,4.609Zm-.674,6.28C19.08,14.74,13.658,18.322,12,19.34c-2.336-1.41-7.142-4.95-7.821-8.451-.513-2.646.189-4.183.869-5.007A3.819,3.819,0,0,1,8,4.5a3.493,3.493,0,0,1,3.115,1.469,1.005,1.005,0,0,0,1.76.011A3.489,3.489,0,0,1,16,4.5a3.819,3.819,0,0,1,2.959,1.382C19.637,6.706,20.339,8.243,19.826,10.889Z" />
</svg></div>
            <div className="pf-linkat-det">
              <p className="pf-link-num">{user.favorites?.length || 0}</p>
              <p className="pf-link-title">FAVORITES</p>
            </div>
            </div>
          </Link>
          <Link to="/SavedTrips" className="pf-linkat">
            <div className="pf-linkat-data">
              <div className="pf-linkat-svg"><svg
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
              </svg></div>
            <div className="pf-linkat-det">
              <p className="pf-link-num">{user.savedTrips?.length || 0}</p>
              <p className="pf-link-title">SAVED TRIPS</p>
            </div>
            </div>
          </Link>
          <Link to="/savedtrips" className="pf-linkat">
            <div className="pf-linkat-data">
            <div className="pf-linkat-svg"><svg className="create-svg" fill="#C9A84C" width="34px" height="34px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#C9A84C" strokeWidth="8.096"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M197.00781,132.74023l-52.16015-19.21777a3.99186,3.99186,0,0,1-2.3711-2.37012L123.25977,58.99219a11.99948,11.99948,0,0,0-22.51954,0L81.52246,111.15234a3.99186,3.99186,0,0,1-2.37012,2.3711L26.99219,132.74023a11.99948,11.99948,0,0,0,0,22.51954l52.16015,19.21777a3.99186,3.99186,0,0,1,2.3711,2.37012l19.21679,52.16015a11.99948,11.99948,0,0,0,22.51954,0l19.21679-52.16015h.001a3.99186,3.99186,0,0,1,2.37012-2.3711l52.16015-19.21679a11.99948,11.99948,0,0,0,0-22.51954Zm-2.76562,15.01368L142.082,166.96973a11.98076,11.98076,0,0,0-7.11133,7.1123l-19.21679,52.16016a4.00076,4.00076,0,0,1-7.50782,0L89.03027,174.082a11.98076,11.98076,0,0,0-7.1123-7.11133L29.75781,147.75391a4.00076,4.00076,0,0,1,0-7.50782L81.918,121.03027a11.98076,11.98076,0,0,0,7.11133-7.1123l19.21679-52.16016a4.00076,4.00076,0,0,1,7.50782,0L134.96973,113.918a11.98076,11.98076,0,0,0,7.1123,7.11133l52.16016,19.21679a4.00076,4.00076,0,0,1,0,7.50782ZM148,40a4.0002,4.0002,0,0,1,4-4h20V16a4,4,0,0,1,8,0V36h20a4,4,0,0,1,0,8H180V64a4,4,0,0,1-8,0V44H152A4.0002,4.0002,0,0,1,148,40Zm96,48a4.0002,4.0002,0,0,1-4,4H228v12a4,4,0,0,1-8,0V92H208a4,4,0,0,1,0-8h12V72a4,4,0,0,1,8,0V84h12A4.0002,4.0002,0,0,1,244,88Z"></path> </g></svg></div>
            <div className="pf-linkat-det">
              <p className="pf-link-num">{user.savedTrips?.length || 0}</p>
              <p className="pf-link-title">GENERATED TRIPS</p>
            </div>
            </div>
          </Link>
          <Link to="/contributions" className="pf-linkat">
            <div className="pf-linkat-data">
              <div className="pf-linkat-svg"><svg
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
            </svg></div>
            <div className="pf-linkat-det">
              <p className="pf-link-num">{user.contributions?.length || 0}</p>
              <p className="pf-link-title">CONTRIBUTIONS</p>
            </div>
            </div>
          </Link>

        </div>
      </div>
      <div className="pf-btn-sec">
        <div className="pf-btn-cont">
          <button  className={`pf-btn ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")}><svg className="pf-btn-svg" width="14px" height="13px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="##7A6040">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <title>profile_round [#0A1F35]</title>
                  <desc>Created with Sketch.</desc>
                  <defs> </defs>
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -2159.000000)" fill="#7A6040">
                      <g id="icons" transform="translate(56.000000, 160.000000)">
                        <path d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598" id="profile_round-[#4A8FAA]">
                        </path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>User info</button>
          <button className={`pf-btn ${activeTab === "places" ? "active" : ""}`} onClick={() => setActiveTab("places")}>
            <svg
              className="pf-btn-svg love-btn"
              fill="#7A6040"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.5,4.609A5.811,5.811,0,0,0,16,2.5a5.75,5.75,0,0,0-4,1.455A5.75,5.75,0,0,0,8,2.5,5.811,5.811,0,0,0,3.5,4.609c-.953,1.156-1.95,3.249-1.289,6.66,1.055,5.447,8.966,9.917,9.3,10.1a1,1,0,0,0,.974,0c.336-.187,8.247-4.657,9.3-10.1C22.45,7.858,21.453,5.765,20.5,4.609Zm-.674,6.28C19.08,14.74,13.658,18.322,12,19.34c-2.336-1.41-7.142-4.95-7.821-8.451-.513-2.646.189-4.183.869-5.007A3.819,3.819,0,0,1,8,4.5a3.493,3.493,0,0,1,3.115,1.469,1.005,1.005,0,0,0,1.76.011A3.489,3.489,0,0,1,16,4.5a3.819,3.819,0,0,1,2.959,1.382C19.637,6.706,20.339,8.243,19.826,10.889Z" />
            </svg>
            Saved places <span className="pf-btn-num" >{ user.favorites?.length || 0}</span></button>
          <button className={`pf-btn ${activeTab === "trips" ? "active" : ""}`} onClick={() => setActiveTab("trips")}>
            <svg
               className="pf-btn-svg s-btn"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 19.2674V7.84496C19 5.64147 17.4253 3.74489 15.2391 3.31522C13.1006 2.89493 10.8994 2.89493 8.76089 3.31522C6.57467 3.74489 5 5.64147 5 7.84496V19.2674C5 20.6038 6.46752 21.4355 7.63416 20.7604L10.8211 18.9159C11.5492 18.4945 12.4508 18.4945 13.1789 18.9159L16.3658 20.7604C17.5325 21.4355 19 20.6038 19 19.2674Z"
                  stroke="#7A6040"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
           
            Saved trips <span className="pf-btn-num"> {user.savedTrips?.length || 0}</span></button>
          <button  className={`pf-btn ${activeTab === "contributions" ? "active" : ""}`} onClick={() =>setActiveTab("contributions")}>
            <svg
              className="pf-btn-svg cont-btn"
                width="18px"
                height="18px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.186 2.09c.521.25 1.136.612 1.625 1.101.49.49.852 1.104 1.1 1.625.313.654.11 1.408-.401 1.92l-7.214 7.213c-.31.31-.688.541-1.105.675l-4.222 1.353a.75.75 0 0 1-.943-.944l1.353-4.221a2.75 2.75 0 0 1 .674-1.105l7.214-7.214c.512-.512 1.266-.714 1.92-.402zm.211 2.516a3.608 3.608 0 0 0-.828-.586l-6.994 6.994a1.002 1.002 0 0 0-.178.241L9.9 14.102l2.846-1.496c.09-.047.171-.107.242-.178l6.994-6.994a3.61 3.61 0 0 0-.586-.828zM4.999 5.5A.5.5 0 0 1 5.47 5l5.53.005a1 1 0 0 0 0-2L5.5 3A2.5 2.5 0 0 0 3 5.5v12.577c0 .76.082 1.185.319 1.627.224.419.558.754.977.978.442.236.866.318 1.627.318h12.154c.76 0 1.185-.082 1.627-.318.42-.224.754-.559.978-.978.236-.442.318-.866.318-1.627V13a1 1 0 1 0-2 0v5.077c0 .459-.021.571-.082.684a.364.364 0 0 1-.157.157c-.113.06-.225.082-.684.082H5.923c-.459 0-.57-.022-.684-.082a.363.363 0 0 1-.157-.157c-.06-.113-.082-.225-.082-.684V5.5z"
                fill="#7A6040"
              />
            </svg>
            Contributions <span className="pf-btn-num"> {user.contributions?.length || 0}</span></button>
        </div>
      </div>
      <div className="profile-content">
        {activeTab === "info" &&
          <div className="info-section">
            <div className="info-cont">
              <div className="info-sec">
                <h3 className="info-sec-tit">About</h3>
                <p className="about-sec-p">
                   {user?.bio || "Tell people about yourself..."}
                </p>
              </div>
              <div className="info-sec">
                <div className="details-sec-head">
                  <h3 className="info-sec-tit">Details</h3>
                  <button className="info-sec-btn" onClick={() => setShowEditModal(true)}>Edit Profile</button>
                </div>
                <ul className="sec-details-cont">
                  <li className="info-det"><span className="info-det-title">NAME</span>{ user.name}</li>
                  
                  <li className="info-det"><span className="info-det-title">EMAIL</span>{ user.email}</li>
                  
                  <li className="info-det"><span className="info-det-title">HOME BASE</span>{user?.location || "Add your location"}</li>
                  
                  <li className="info-det"><span className="info-det-title">MEMBER SINCE</span>{formatDate(user.createdAt)}</li>
                  
                </ul>
              </div>
            </div>
                {showEditModal && (
              <div className="edit-modal-overlay" onClick={() => setShowEditModal(false)}>
             <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
              <div className="edit-modal-head">
                <h3 className="edit-modal-title">Edit Profile</h3>
                <button className="edit-modal-close" onClick={() => setShowEditModal(false)}>✕</button>
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
                <button className="edit-cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="edit-save-btn" onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          </div>
        )}
          </div>}
      {activeTab === "places" && (
          <div className="pf-content-section">
            {user.favorites?.length > 0 ? (
              <div className="pf-content-section-container" >
                  <div className="pf-content-section-header" >
                <h3 className="title-sect-saved">My Saved Places</h3>
                <Link to="/favorites" className="fav-more">View All Saved Places</Link>
                </div>
                <div className="pf-cards-grid">
                  {user.favorites
                      .slice(-6)
                      .map((place, i) => (
                        <Card key={place.id || i} place={place} />
                    ))}
                  </div>
                  </div>
        ) : (
            <div className="pf-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.5,4.609A5.811,5.811,0,0,0,16,2.5a5.75,5.75,0,0,0-4,1.455A5.75,5.75,0,0,0,8,2.5,5.811,5.811,0,0,0,3.5,4.609c-.953,1.156-1.95,3.249-1.289,6.66,1.055,5.447,8.966,9.917,9.3,10.1a1,1,0,0,0,.974,0c.336-.187,8.247-4.657,9.3-10.1C22.45,7.858,21.453,5.765,20.5,4.609Z" fill="#C9A84C" opacity="0.3"/>
                </svg>
                <p className="pf-empty-title">No saved places yet</p>
                <p className="pf-empty-sub">Explore the map and save places you love</p>
                <Link to="/map" className="pf-empty-btn">Explore Map</Link>
            </div>
        )}
    </div>
)}

{activeTab === "trips" && (
    <div className="pf-content-section">
        {user.savedTrips?.length > 0 ? (
            <div className="pf-trips-grid">
                {user?.savedTrips?.slice(0, 6).map((trip, i) => {
  const title = trip.title || `Trip ${i + 1}`;
  const places = trip.places || [];

  const destination =
    places.length > 0
      ? places
          .filter((p) => p?.title)
          .map((p) => p.title)
          .join(" • ")
      : trip.destination || "—";

  const image =
    places[0]?.coverImage || "/assets/placeholder.jpg";

  return (
    <div
      key={trip.id || i}
      className="pf-trip-card"
      onClick={() => onPreview?.(trip)} 
      style={{ cursor: "pointer" }}
    >
      
     
      <div className="pf-trip-card-image">
        <img src={image} alt={title} />
      </div>

      <div className="pf-trip-card-head">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 19.2674V7.84496C19 5.64147 17.4253 3.74489 15.2391 3.31522C13.1006 2.89493 10.8994 2.89493 8.76089 3.31522C6.57467 3.74489 5 5.64147 5 7.84496V19.2674C5 20.6038 6.46752 21.4355 7.63416 20.7604L10.8211 18.9159C11.5492 18.4945 12.4508 18.4945 13.1789 18.9159L16.3658 20.7604C17.5325 21.4355 19 20.6038 19 19.2674Z"
            stroke="#C9A84C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className="pf-trip-card-title">
          {title}
        </span>
      </div>

      <p className="pf-trip-card-sub">
        {destination}
      </p>

      <p className="pf-trip-card-date">
        {trip.createdAt
          ? formatDate(new Date(trip.createdAt))
          : "Recently added"}
      </p>
      <div className="pf-trip-card-actions"> 
        <button className="edit-btn">Edit</button>

      </div>
    </div>
  );
})}
            </div>
        ) : (
            <div className="pf-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 19.2674V7.84496C19 5.64147 17.4253 3.74489 15.2391 3.31522C13.1006 2.89493 10.8994 2.89493 8.76089 3.31522C6.57467 3.74489 5 5.64147 5 7.84496V19.2674C5 20.6038 6.46752 21.4355 7.63416 20.7604L10.8211 18.9159C11.5492 18.4945 12.4508 18.4945 13.1789 18.9159L16.3658 20.7604C17.5325 21.4355 19 20.6038 19 19.2674Z" stroke="#C9A84C" strokeWidth="1.5" opacity="0.3"/>
                </svg>
                <p className="pf-empty-title">No saved trips yet</p>
                <p className="pf-empty-sub">Plan a trip and it'll appear here</p>
                <Link to="/trip-plan" className="pf-empty-btn">Plan a Trip</Link>
            </div>
        )}
    </div>
)}

{activeTab === "contributions" && (
  <div className="pf-content-section">
    {user?.contributions?.length > 0 ? (
      <div className="pf-content-section-container">
        <div className="pf-content-section-header">
          <h3 className="title-sect-saved">My Contributions</h3>
          <div className="cont-btns">
            <Link to="/contributions" className="fav-more">Manage All</Link>
            <Link className="profile-btns-add" to="/addplace">
              <span className="pf-hero-add-svg">+</span>Add a place
            </Link>
          </div>
        </div>
        <div className="pf-cards-grid">
          {user.contributions.slice(-6).map((place, i) => (
            <Card
              key={place.id || i}
              place={place}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      </div>
    ) : (
      <div className="pf-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M19.186 2.09c.521.25 1.136.612 1.625 1.101.49.49.852 1.104 1.1 1.625.313.654.11 1.408-.401 1.92l-7.214 7.213c-.31.31-.688.541-1.105.675l-4.222 1.353a.75.75 0 0 1-.943-.944l1.353-4.221a2.75 2.75 0 0 1 .674-1.105l7.214-7.214c.512-.512 1.266-.714 1.92-.402zm.211 2.516a3.608 3.608 0 0 0-.828-.586l-6.994 6.994a1.002 1.002 0 0 0-.178.241L9.9 14.102l2.846-1.496c.09-.047.171-.107.242-.178l6.994-6.994a3.61 3.61 0 0 0-.586-.828zM4.999 5.5A.5.5 0 0 1 5.47 5l5.53.005a1 1 0 0 0 0-2L5.5 3A2.5 2.5 0 0 0 3 5.5v12.577c0 .76.082 1.185.319 1.627.224.419.558.754.977.978.442.236.866.318 1.627.318h12.154c.76 0 1.185-.082 1.627-.318.42-.224.754-.559.978-.978.236-.442.318-.866.318-1.627V13a1 1 0 1 0-2 0v5.077c0 .459-.021.571-.082.684a.364.364 0 0 1-.157.157c-.113.06-.225.082-.684.082H5.923c-.459 0-.57-.022-.684-.082a.363.363 0 0 1-.157-.157c-.06-.113-.082-.225-.082-.684V5.5z" fill="#C9A84C" opacity="0.3"/>
        </svg>
        <p className="pf-empty-title">No contributions yet</p>
        <p className="pf-empty-sub">Add places to help other explorers discover Egypt</p>
        <Link to="/addplace" className="pf-empty-btn">Add a Place</Link>
      </div>
    )}
  </div>
)}
</div>

    </main>
  );
}