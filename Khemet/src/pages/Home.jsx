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
              <svg
  className="line-svg search-home-line "
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  width="64"
  height="64"
  viewBox="0 0 290.658 290.658"
  fill="#C9A84C"
  stroke="#C9A84C"
  strokeWidth="6.685134"
>
  <g strokeWidth="0"></g>

  <g
    strokeLinecap="round"
    strokeLinejoin="round"
  ></g>

  <g>
    <g>
      <rect
       className="search-home-line-rect"
        y="139.474"
        width="230.658"
        height="11.711"
        fill="#C9A84C"
      />
    </g>
  </g>
              </svg>
              <div className="search-home-card-data">
              <h3 className="search-home-card-tit">History</h3>
              <p className="search-home-card-p">Pyramids, temples and tombs</p>
            </div>
          </div>
            <div className="tag-card">
                <svg
  className="line-svg search-home-line "
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  width="64"
  height="64"
  viewBox="0 0 290.658 290.658"
  fill="#C9A84C"
  stroke="#C9A84C"
  strokeWidth="6.685134"
>
  <g strokeWidth="0"></g>

  <g
    strokeLinecap="round"
    strokeLinejoin="round"
  ></g>

  <g>
    <g>
      <rect
       className="search-home-line-rect"
        y="139.474"
        width="230.658"
        height="11.711"
        fill="#C9A84C"
      />
    </g>
  </g>
              </svg>
              <div className="search-home-card-data">
              <h3 className="search-home-card-tit">Adventure</h3>
              <p className="search-home-card-p">Diving, desert and trekking</p>
                  <svg
  className="search-home-arrow-svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <g strokeWidth="0"></g>

  <g
    strokeLinecap="round"
    strokeLinejoin="round"
  ></g>

  <g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L13.7071 19.7071C13.3166 20.0976 12.6834 20.0976 12.2929 19.7071C11.9024 19.3166 11.9024 18.6834 12.2929 18.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L12.2929 5.70711C11.9024 5.31658 11.9024 4.68342 12.2929 4.29289Z"
      fill="#C9A84C"
    />
  </g>
</svg>
              </div>
              </div>
            <div className="tag-card">
                <svg
  className="line-svg search-home-line "
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  width="64"
  height="64"
  viewBox="0 0 290.658 290.658"
  fill="#C9A84C"
  stroke="#C9A84C"
  strokeWidth="6.685134"
>
  <g strokeWidth="0"></g>

  <g
    strokeLinecap="round"
    strokeLinejoin="round"
  ></g>

  <g>
    <g>
      <rect
       className="search-home-line-rect"
        y="139.474"
        width="230.658"
        height="11.711"
        fill="#C9A84C"
      />
    </g>
  </g>
              </svg>
              <div className="search-home-card-data">
              <h3  className="search-home-card-tit">Culture</h3>
              <p className="search-home-card-p">Bazar, food and craft</p>
                <svg
  className="search-home-arrow-svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <g strokeWidth="0"></g>

  <g
    strokeLinecap="round"
    strokeLinejoin="round"
  ></g>

  <g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L13.7071 19.7071C13.3166 20.0976 12.6834 20.0976 12.2929 19.7071C11.9024 19.3166 11.9024 18.6834 12.2929 18.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L12.2929 5.70711C11.9024 5.31658 11.9024 4.68342 12.2929 4.29289Z"
      fill="#C9A84C"
    />
  </g>
</svg>
              </div>
              </div>
            <div className="tag-card">
                <svg
  className="line-svg search-home-line "
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  width="64"
  height="64"
  viewBox="0 0 290.658 290.658"
  fill="#C9A84C"
  stroke="#C9A84C"
  strokeWidth="6.685134"
>
  <g strokeWidth="0"></g>

  <g
    strokeLinecap="round"
    strokeLinejoin="round"
  ></g>

  <g>
    <g>
      <rect
       className="search-home-line-rect"
        y="139.474"
        width="230.658"
        height="11.711"
        fill="#C9A84C"
      />
    </g>
  </g>
              </svg>
              <div className="search-home-card-data">
              <h3  className="search-home-card-tit">Nature</h3>
              <p className="search-home-card-p">Oases, coasts and seas</p>
             <svg
  className="search-home-arrow-svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <g strokeWidth="0"></g>

  <g
    strokeLinecap="round"
    strokeLinejoin="round"
  ></g>

  <g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L13.7071 19.7071C13.3166 20.0976 12.6834 20.0976 12.2929 19.7071C11.9024 19.3166 11.9024 18.6834 12.2929 18.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L12.2929 5.70711C11.9024 5.31658 11.9024 4.68342 12.2929 4.29289Z"
      fill="#C9A84C"
    />
  </g>
</svg>
              </div>
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
          <img className="trip-section-pattern" alt="" aria-hidden="true" src={st} />
          <div className="trip-section-data">
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
          </div>
      </section>

    </main>
  );
}