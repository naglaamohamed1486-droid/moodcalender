import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import placesData from "../places.json";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import hero from "../assets/Hero.png";
import st from "../assets/hieroglyph-pattern.png";
import '../index.css';

export default function Home() {
  const { user } = useAuth();
  const [featuredPlaces, setFeaturedPlaces] = useState([]);

  useEffect(() => {
    setFeaturedPlaces(placesData.slice(0, 3));
  }, []);

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-tit-prim">Explore Egypt</h1>
          <h1 className="hero-tit-sec">like never before.</h1>
          <p className="hero-p">Discover timeless places. Plan unforgettable journeys across the land of pharaohs, pyramids and the eternal Nile.</p>

          {!user && (
            <Link to="/login" className="cta-btn">
              <svg className="exp-svg" width="24px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#3A2A1A"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.048"></g><g id="SVGRepo_iconCarrier"> <path d="M9.87868 9.87869L15.5355 8.46448L14.1213 14.1213L8.46446 15.5355L9.87868 9.87869Z" stroke="#3A2A1A" strokeWidth="1.44" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#3A2A1A" strokeWidth="1.44" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>Start Exploring
            </Link>
          )}

          {user && (
            <div className="linkat">
              <Link to="/map" className="cta-btn home-btn">
                <svg className="exp-svg" width="24px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#3A2A1A"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.048"></g><g id="SVGRepo_iconCarrier"> <path d="M9.87868 9.87869L15.5355 8.46448L14.1213 14.1213L8.46446 15.5355L9.87868 9.87869Z" stroke="#3A2A1A" strokeWidth="1.44" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#3A2A1A" strokeWidth="1.44" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg> Explore Map
              </Link>
              <Link to="/trip-plan" className="trip-btn home-btn">
                <svg className="create-svg" fill="#1B4F6B" width="24px" height="20px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#1B4F6B" strokeWidth="4.096"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M197.00781,132.74023l-52.16015-19.21777a3.99186,3.99186,0,0,1-2.3711-2.37012L123.25977,58.99219a11.99948,11.99948,0,0,0-22.51954,0L81.52246,111.15234a3.99186,3.99186,0,0,1-2.37012,2.3711L26.99219,132.74023a11.99948,11.99948,0,0,0,0,22.51954l52.16015,19.21777a3.99186,3.99186,0,0,1,2.3711,2.37012l19.21679,52.16015a11.99948,11.99948,0,0,0,22.51954,0l19.21679-52.16015h.001a3.99186,3.99186,0,0,1,2.37012-2.3711l52.16015-19.21679a11.99948,11.99948,0,0,0,0-22.51954Zm-2.76562,15.01368L142.082,166.96973a11.98076,11.98076,0,0,0-7.11133,7.1123l-19.21679,52.16016a4.00076,4.00076,0,0,1-7.50782,0L89.03027,174.082a11.98076,11.98076,0,0,0-7.1123-7.11133L29.75781,147.75391a4.00076,4.00076,0,0,1,0-7.50782L81.918,121.03027a11.98076,11.98076,0,0,0,7.11133-7.1123l19.21679-52.16016a4.00076,4.00076,0,0,1,7.50782,0L134.96973,113.918a11.98076,11.98076,0,0,0,7.1123,7.11133l52.16016,19.21679a4.00076,4.00076,0,0,1,0,7.50782ZM148,40a4.0002,4.0002,0,0,1,4-4h20V16a4,4,0,0,1,8,0V36h20a4,4,0,0,1,0,8H180V64a4,4,0,0,1-8,0V44H152A4.0002,4.0002,0,0,1,148,40Zm96,48a4.0002,4.0002,0,0,1-4,4H228v12a4,4,0,0,1-8,0V92H208a4,4,0,0,1,0-8h12V72a4,4,0,0,1,8,0V84h12A4.0002,4.0002,0,0,1,244,88Z"></path> </g></svg>
                Create trip
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="home-num">
        <div className="home-num-cont">
          <div className="num-card">
            <h3 className="num">120+</h3>
            <p className="num-det">Curated places</p>
          </div>
          <div className="num-card">
            <h3 className="num">26</h3>
            <p className="num-det">Egyptian regions</p>
          </div>
          <div className="num-card">
            <h3 className="num">Personalized</h3>
            <p className="num-det">Trip itineraries</p>
          </div>
        </div>
      </section>

      <section className="search-home">
        <div className="search-home-content">
          <p className="search-home-t">
            <svg version="1.1" className="popular-svg" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="34" height="34" viewBox="0 0 290.658 290.658" xmlSpace="preserve" fill="#C9A84C" stroke="#C9A84C"><g strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g><g><rect y="139.474" width="290.658" height="5.711" fill="#C9A84C" /></g></g></svg>
            EXPLORE BY INTEREST
          </p>
          <p className="search-home-tit">What calls to you?</p>
          <p className="search-home-dit">Filter the map and feed by the experiences you crave.</p>
          <div className="search-tags">
            <div className="tag-card">
              <h3 className="search-home-card-tit">History</h3>
              <p className="search-home-card-p">Pyramids, temples and tombs</p>
            </div>
            <div className="tag-card">
              <h3 className="search-home-card-tit">Adventure</h3>
              <p className="search-home-card-p">Diving, desert and trekking</p>
            </div>
            <div className="tag-card">
              <h3 className="search-home-card-tit">Culture</h3>
              <p className="search-home-card-p">Bazar, food and craft</p>
            </div>
            <div className="tag-card">
              <h3 className="search-home-card-tit">Nature</h3>
              <p className="search-home-card-p">Oases, coasts and seas</p>
            </div>
          </div>
        </div>
      </section>

<section className="featured">
  <div className="featured-header">
    <div className="featured-header-left">
      <p className="popular-h5">
        <svg version="1.1" className="popular-svg" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="34" height="34" viewBox="0 0 290.658 290.658" xmlSpace="preserve" fill="#C9A84C" stroke="#C9A84C">
          <g strokeWidth="0"></g>
          <g strokeLinecap="round" strokeLinejoin="round"></g>
          <g>
            <g>
              <rect y="139.474" width="290.658" height="5.711" fill="#C9A84C" />
            </g>
          </g>
        </svg>
        POPULAR RIGHT NOW
      </p>
      <h2 className="popular-tit">Trending across Egypt</h2>
      <p className="popular-det">What other explorers are saving this season.</p>
    </div>
    <Link className="ex-more" to="/feed">
      <svg className="ex-more-svg" width="24" height="24" viewBox="0 0 24 24" id="_24x24_On_Light_Next" data-name="24x24/On Light/Next" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" strokeWidth="0.00024">
        <g strokeWidth="0"></g>
        <g strokeLinecap="round" strokeLinejoin="round"></g>
        <g>
          <rect id="view-box" width="24" height="24" fill="#7A6040" opacity="0" />
          <path id="Shape" d="M10.22,9.28a.75.75,0,0,1,0-1.06l2.72-2.72H.75A.75.75,0,0,1,.75,4H12.938L10.22,1.281A.75.75,0,1,1,11.281.22l4,4a.749.749,0,0,1,0,1.06l-4,4a.75.75,0,0,1-1.061,0Z" transform="translate(4.25 7.25)" fill="#7A6040" />
        </g>
      </svg>
      Explore More
    </Link>
  </div>

  <div className="places">
    {featuredPlaces.map((place) => (
      <Card key={place.id} place={place} />
    ))}
  </div>
</section>

      <section className="trip-section">
        <div className="trip-section-cont">
     
       
          <img alt="" aria-hidden="true" src="../assets/hieroglyph-pattern.png" /> 
          
        <p className="home-trip"> <svg className="trip-section-svg" fill="#C9A84C" width="24px" height="24px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#C9A84C" strokeWidth="4.096"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M197.00781,132.74023l-52.16015-19.21777a3.99186,3.99186,0,0,1-2.3711-2.37012L123.25977,58.99219a11.99948,11.99948,0,0,0-22.51954,0L81.52246,111.15234a3.99186,3.99186,0,0,1-2.37012,2.3711L26.99219,132.74023a11.99948,11.99948,0,0,0,0,22.51954l52.16015,19.21777a3.99186,3.99186,0,0,1,2.3711,2.37012l19.21679,52.16015a11.99948,11.99948,0,0,0,22.51954,0l19.21679-52.16015h.001a3.99186,3.99186,0,0,1,2.37012-2.3711l52.16015-19.21679a11.99948,11.99948,0,0,0,0-22.51954Zm-2.76562,15.01368L142.082,166.96973a11.98076,11.98076,0,0,0-7.11133,7.1123l-19.21679,52.16016a4.00076,4.00076,0,0,1-7.50782,0L89.03027,174.082a11.98076,11.98076,0,0,0-7.1123-7.11133L29.75781,147.75391a4.00076,4.00076,0,0,1,0-7.50782L81.918,121.03027a11.98076,11.98076,0,0,0,7.11133-7.1123l19.21679-52.16016a4.00076,4.00076,0,0,1,7.50782,0L134.96973,113.918a11.98076,11.98076,0,0,0,7.1123,7.11133l52.16016,19.21679a4.00076,4.00076,0,0,1,0,7.50782ZM148,40a4.0002,4.0002,0,0,1,4-4h20V16a4,4,0,0,1,8,0V36h20a4,4,0,0,1,0,8H180V64a4,4,0,0,1-8,0V44H152A4.0002,4.0002,0,0,1,148,40Zm96,48a4.0002,4.0002,0,0,1-4,4H228v12a4,4,0,0,1-8,0V92H208a4,4,0,0,1,0-8h12V72a4,4,0,0,1,8,0V84h12A4.0002,4.0002,0,0,1,244,88Z"></path> </g></svg>
              Trip Generator</p>
        <h2 className="home-trip-tit">Let us plan your journey.</h2>
        <p className="trip-section-det">Tell us your interests and the days you have. We'll craft three personalized itineraries — balanced, adventurous and cultural.</p>
            {!user && (
            <Link to="/login" className="tripsec-btn home-btn">
              Generate my trip<svg
            className="gen-svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            id="_24x24_On_Light_Next"
            data-name="24x24/On Light/Next"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            stroke="#000000"
            strokeWidth="0.00024"
          >
          <g strokeWidth="0"></g>

          <g strokeLinecap="round" strokeLinejoin="round"></g>

          <g>
            <rect
              id="view-box"
              width="24"
              height="24"
              fill="#3A2A1A"
              opacity="0"
            />

            <path
              id="Shape"
              d="M10.22,9.28a.75.75,0,0,1,0-1.06l2.72-2.72H.75A.75.75,0,0,1,.75,4H12.938L10.22,1.281A.75.75,0,1,1,11.281.22l4,4a.749.749,0,0,1,0,1.06l-4,4a.75.75,0,0,1-1.061,0Z"
              transform="translate(4.25 7.25)"
              fill="#3A2A1A"
            />
          </g></svg>
            </Link>
          )}
          {user && (
            <Link to="/trip-plan" className="tripsec-btn home-btn">Generate my trip <svg
            className="gen-svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            id="_24x24_On_Light_Next"
            data-name="24x24/On Light/Next"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            stroke="#000000"
            strokeWidth="0.00024"
          >
          <g strokeWidth="0"></g>

          <g strokeLinecap="round" strokeLinejoin="round"></g>

          <g>
            <rect
              id="view-box"
              width="24"
              height="24"
              fill="#3A2A1A"
              opacity="0"
            />

            <path
              id="Shape"
              d="M10.22,9.28a.75.75,0,0,1,0-1.06l2.72-2.72H.75A.75.75,0,0,1,.75,4H12.938L10.22,1.281A.75.75,0,1,1,11.281.22l4,4a.749.749,0,0,1,0,1.06l-4,4a.75.75,0,0,1-1.061,0Z"
              transform="translate(4.25 7.25)"
              fill="#3A2A1A"
            />
          </g></svg></Link>
          )}
          
</div>
      </section>

      <div className="w">
      <h2>Why KHEMET ?</h2>
      <div className="why">
        <div className="c">
            <div className="sv">
              <div className="svg">
          <svg width="33px" height="34px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
         </div>
              </div>
          <h4>Curated Experiences</h4>
          <p>Every place is handpicked by locals who know Egypt beyond the tourist trail.</p>
          </div>

          <div className="c">
            <div className="sv">
              <div className="svg">
                <svg fill="#C9A84C" width="34px" height="34px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#C9A84C" strokeWidth="4.096"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M197.00781,132.74023l-52.16015-19.21777a3.99186,3.99186,0,0,1-2.3711-2.37012L123.25977,58.99219a11.99948,11.99948,0,0,0-22.51954,0L81.52246,111.15234a3.99186,3.99186,0,0,1-2.37012,2.3711L26.99219,132.74023a11.99948,11.99948,0,0,0,0,22.51954l52.16015,19.21777a3.99186,3.99186,0,0,1,2.3711,2.37012l19.21679,52.16015a11.99948,11.99948,0,0,0,22.51954,0l19.21679-52.16015h.001a3.99186,3.99186,0,0,1,2.37012-2.3711l52.16015-19.21679a11.99948,11.99948,0,0,0,0-22.51954Zm-2.76562,15.01368L142.082,166.96973a11.98076,11.98076,0,0,0-7.11133,7.1123l-19.21679,52.16016a4.00076,4.00076,0,0,1-7.50782,0L89.03027,174.082a11.98076,11.98076,0,0,0-7.1123-7.11133L29.75781,147.75391a4.00076,4.00076,0,0,1,0-7.50782L81.918,121.03027a11.98076,11.98076,0,0,0,7.11133-7.1123l19.21679-52.16016a4.00076,4.00076,0,0,1,7.50782,0L134.96973,113.918a11.98076,11.98076,0,0,0,7.1123,7.11133l52.16016,19.21679a4.00076,4.00076,0,0,1,0,7.50782ZM148,40a4.0002,4.0002,0,0,1,4-4h20V16a4,4,0,0,1,8,0V36h20a4,4,0,0,1,0,8H180V64a4,4,0,0,1-8,0V44H152A4.0002,4.0002,0,0,1,148,40Zm96,48a4.0002,4.0002,0,0,1-4,4H228v12a4,4,0,0,1-8,0V92H208a4,4,0,0,1,0-8h12V72a4,4,0,0,1,8,0V84h12A4.0002,4.0002,0,0,1,244,88Z"></path> </g></svg>
              </div>
         </div>
          <h4>Smart Trip Planning</h4>
          <p>Generate and customize trips tailored to your interests.</p>
          </div>
          
        <div className="c">
            <div className="sv">
              <div className="svg">
            <svg width="44px" height="44px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="8" r="2.5" stroke="#C9A84C" strokeLinecap="round"></circle> <path d="M13.7679 6.5C13.9657 6.15743 14.2607 5.88121 14.6154 5.70625C14.9702 5.5313 15.3689 5.46548 15.7611 5.51711C16.1532 5.56874 16.5213 5.73551 16.8187 5.99632C17.1161 6.25713 17.3295 6.60028 17.4319 6.98236C17.5342 7.36445 17.521 7.76831 17.3939 8.14288C17.2667 8.51745 17.0313 8.8459 16.7175 9.08671C16.4037 9.32751 16.0255 9.46985 15.6308 9.49572C15.2361 9.52159 14.8426 9.42983 14.5 9.23205" stroke="#C9A84C"></path> <path d="M10.2321 6.5C10.0343 6.15743 9.73935 5.88121 9.38458 5.70625C9.02981 5.5313 8.63113 5.46548 8.23895 5.51711C7.84677 5.56874 7.47871 5.73551 7.18131 5.99632C6.88391 6.25713 6.67053 6.60028 6.56815 6.98236C6.46577 7.36445 6.47899 7.76831 6.60614 8.14288C6.73329 8.51745 6.96866 8.8459 7.28248 9.08671C7.5963 9.32751 7.97448 9.46985 8.36919 9.49572C8.76391 9.52159 9.15743 9.42983 9.5 9.23205" stroke="#C9A84C"></path> <path d="M12 12.5C16.0802 12.5 17.1335 15.8022 17.4054 17.507C17.4924 18.0524 17.0523 18.5 16.5 18.5H7.5C6.94771 18.5 6.50763 18.0524 6.59461 17.507C6.86649 15.8022 7.91976 12.5 12 12.5Z" stroke="#C9A84C" strokeLinecap="round"></path> <path d="M19.2965 15.4162L18.8115 15.5377L19.2965 15.4162ZM13.0871 12.5859L12.7179 12.2488L12.0974 12.9283L13.0051 13.0791L13.0871 12.5859ZM17.1813 16.5L16.701 16.639L16.8055 17H17.1813V16.5ZM15.5 12C16.5277 12 17.2495 12.5027 17.7783 13.2069C18.3177 13.9253 18.6344 14.8306 18.8115 15.5377L19.7816 15.2948C19.5904 14.5315 19.2329 13.4787 18.578 12.6065C17.9126 11.7203 16.9202 11 15.5 11V12ZM13.4563 12.923C13.9567 12.375 14.6107 12 15.5 12V11C14.2828 11 13.3736 11.5306 12.7179 12.2488L13.4563 12.923ZM13.0051 13.0791C15.3056 13.4614 16.279 15.1801 16.701 16.639L17.6616 16.361C17.1905 14.7326 16.019 12.5663 13.1691 12.0927L13.0051 13.0791ZM18.395 16H17.1813V17H18.395V16ZM18.8115 15.5377C18.8653 15.7526 18.7075 16 18.395 16V17C19.2657 17 20.0152 16.2277 19.7816 15.2948L18.8115 15.5377Z" fill="#C9A84C"></path> <path d="M10.9129 12.5859L10.9949 13.0791L11.9026 12.9283L11.2821 12.2488L10.9129 12.5859ZM4.70343 15.4162L5.18845 15.5377L4.70343 15.4162ZM6.81868 16.5V17H7.19453L7.29898 16.639L6.81868 16.5ZM8.49999 12C9.38931 12 10.0433 12.375 10.5436 12.923L11.2821 12.2488C10.6264 11.5306 9.71723 11 8.49999 11V12ZM5.18845 15.5377C5.36554 14.8306 5.68228 13.9253 6.22167 13.2069C6.75048 12.5027 7.47226 12 8.49999 12V11C7.0798 11 6.08743 11.7203 5.42199 12.6065C4.76713 13.4787 4.40955 14.5315 4.21841 15.2948L5.18845 15.5377ZM5.60498 16C5.29247 16 5.13465 15.7526 5.18845 15.5377L4.21841 15.2948C3.98477 16.2277 4.73424 17 5.60498 17V16ZM6.81868 16H5.60498V17H6.81868V16ZM7.29898 16.639C7.72104 15.1801 8.69435 13.4614 10.9949 13.0791L10.8309 12.0927C7.98101 12.5663 6.8095 14.7326 6.33838 16.361L7.29898 16.639Z" fill="#C9A84C"></path> </g></svg>
          </div>
              </div>
          <h4>Community Driven</h4>
          <p>Travelers and residents share their favorite hidden gems together.</p>
        </div>
        <div className="c">
            <div className="sv">
              <div className="svg">
           <svg width="45px" height="45px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#C9A84C"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M5.5 11.9999C5.50034 9.13745 7.52262 6.67387 10.3301 6.11575C13.1376 5.55763 15.9484 7.06041 17.0435 9.70506C18.1386 12.3497 17.2131 15.3997 14.833 16.9897C12.4528 18.5798 9.28087 18.2671 7.257 16.2429C6.13183 15.1175 5.49981 13.5912 5.5 11.9999Z" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path fillRule="evenodd" clipRule="evenodd" d="M11.5 14.9999L13.268 13.2429C13.7367 12.7781 14.0003 12.1454 14.0003 11.4854C14.0003 10.8253 13.7367 10.1926 13.268 9.72786C12.2894 8.75673 10.7106 8.75673 9.73199 9.72786C9.26328 10.1926 8.99963 10.8253 8.99963 11.4854C8.99963 12.1454 9.26328 12.7781 9.73199 13.2429L11.5 14.9999Z" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M15.972 15.9999L19.5 18.9999" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg> </div>
              </div>
          <h4>Designed for Fast Exploration</h4>
          <p>A clean, fast interface that helps you find what you need without endless searching or clutter.</p>
        </div>
      </div>

    </div>
    </main>
  );
}