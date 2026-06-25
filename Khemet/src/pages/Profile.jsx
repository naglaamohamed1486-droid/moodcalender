import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Profile() {
  const { user, logout } = useAuth();
  if (!user) {
  return <h2>Please login first</h2>;
}


  return (
    <main className="profile-main" >
      <div className="profile-hero">
        <div className="profile-hero-cont">
        <div className="profile-data">
            <div className="profile-pic">
            {user.profilePic ? (
              <img src={user.profilePic} alt="profile" />
            ) : (
              <div className="placeholder-pic">No Image</div>
            )}
          </div>
          <p className="type">EXPLORER</p>
          <p className="profile-name"> {user.name}</p>
          <div className="profile-hero-footer">
            <p className="profile-email"> {user.email}</p>
            <p className="profile-location">{user.location}</p>
         </div>
          </div>
          <div className="profile-hero-btns">
            <Link  className="profile-hero-btns-gen" to="./trip-plan"><svg className="create-svg" fill="#2A1A08" width="24px" height="20px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#2A1A08" strokeWidth="4.096"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M197.00781,132.74023l-52.16015-19.21777a3.99186,3.99186,0,0,1-2.3711-2.37012L123.25977,58.99219a11.99948,11.99948,0,0,0-22.51954,0L81.52246,111.15234a3.99186,3.99186,0,0,1-2.37012,2.3711L26.99219,132.74023a11.99948,11.99948,0,0,0,0,22.51954l52.16015,19.21777a3.99186,3.99186,0,0,1,2.3711,2.37012l19.21679,52.16015a11.99948,11.99948,0,0,0,22.51954,0l19.21679-52.16015h.001a3.99186,3.99186,0,0,1,2.37012-2.3711l52.16015-19.21679a11.99948,11.99948,0,0,0,0-22.51954Zm-2.76562,15.01368L142.082,166.96973a11.98076,11.98076,0,0,0-7.11133,7.1123l-19.21679,52.16016a4.00076,4.00076,0,0,1-7.50782,0L89.03027,174.082a11.98076,11.98076,0,0,0-7.1123-7.11133L29.75781,147.75391a4.00076,4.00076,0,0,1,0-7.50782L81.918,121.03027a11.98076,11.98076,0,0,0,7.11133-7.1123l19.21679-52.16016a4.00076,4.00076,0,0,1,7.50782,0L134.96973,113.918a11.98076,11.98076,0,0,0,7.1123,7.11133l52.16016,19.21679a4.00076,4.00076,0,0,1,0,7.50782ZM148,40a4.0002,4.0002,0,0,1,4-4h20V16a4,4,0,0,1,8,0V36h20a4,4,0,0,1,0,8H180V64a4,4,0,0,1-8,0V44H152A4.0002,4.0002,0,0,1,148,40Zm96,48a4.0002,4.0002,0,0,1-4,4H228v12a4,4,0,0,1-8,0V92H208a4,4,0,0,1,0-8h12V72a4,4,0,0,1,8,0V84h12A4.0002,4.0002,0,0,1,244,88Z"></path> </g></svg>
               Plan a trip</Link>
            <Link className="profile-hero-btns-add"> <span className="pf-hero-add-svg">+</span>Add a place</Link>
          </div>
        </div>
        
      </div>
      <div className="pf-link">
        <div className="pf-link-cont">
          <Link  to="/favorites" className="pf-linkat">
            <div className="pf-linkat-data">
              <div className="pf-linkat-svg"></div>
            <div className="pf-linkat-det">
              <p className="pf-link-num">{user.favorites?.length || 0}</p>
              <p className="pf-link-title">FAVORITES</p>
            </div>
            </div>
          </Link>
          <Link to="/SavedTrips" className="pf-linkat">
            <div className="pf-linkat-data">
              <div className="pf-linkat-svg"></div>
            <div className="pf-linkat-det">
              <p className="pf-link-num">{user.savedTrips?.length || 0}</p>
              <p className="pf-link-title">SAVED TRIPS</p>
            </div>
            </div>
          </Link>
          <Link to="/savedtrips" className="pf-linkat">
            <div className="pf-linkat-data">
               <div className="pf-linkat-svg"></div>
            <div className="pf-linkat-det">
              <p className="pf-link-num">{user.savedTrips?.length || 0}</p>
              <p className="pf-link-title">GENERATED TRIPS</p>
            </div>
            </div>
          </Link>
          <Link to="/contributions" className="pf-linkat">
            <div className="pf-linkat-data">
               <div className="pf-linkat-svg"></div>
            <div className="pf-linkat-det">
              <p className="pf-link-num">{user.contributions?.length || 0}</p>
              <p className="pf-link-title">CONTRIBUTIONS</p>
            </div>
            </div>
          </Link>

        </div>
     </div>

    </main>
  );
}