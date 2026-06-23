import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import '../index.css'

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="home">


      <section className="hero">
        <div className="hero-content">
          <h1>Explore Egypt</h1>
          <p>Discover timeless places. Plan unforgettable journeys across the land of pharaohs, pyramids and the eternal Nile.</p>

          {!user && (
            <Link to="/login" className="cta-btn">
              Start Exploring
            </Link>
          )}

          {user && (
            <div className="linkat">
            <Link to="/map" className="cta-btn">
              Continue Exploring
            </Link>
            <Link to="/tripplan" className="trip-btn">Create trip</Link>
            </div>)}
        </div>
      </section>


      <section className="featured">
        <h4>Popular right now</h4>
        <h2>Trending across Egypt</h2>
        <p>What other explorers are saving this season.</p>

        <div className="places-grid">
          <div className="places home-cards">
            <div className="card card-template">
            <div className="card-img"></div>
            <h3>Place Name</h3>
            <p>Short description of the place...</p>
          </div>

          <div className="card card-template">
            <div className="card-img"></div>
            <h3>Place Name</h3>
            <p>Short description of the place...</p>
          </div>

          <div className="card card-template">
            <div className="card-img"></div>
            <h3>Place Name</h3>
            <p>Short description of the place...</p>
          </div>



         </div>
        </div>
      </section>

      <section className="trip-section">
        <h4> trip generator</h4>
        <h2>Let us plan your journey.</h2>
        <p>Tell us your interests and the days you have. We'll craft three personalized itineraries — balanced, adventurous and cultural.</p>
            {!user && (
            <Link to="/login" className="trip-btn">
              Generate my trip
            </Link>
          )}
          {user && (
            <Link to="/tripplan" className="trip-btn">Generate my trip</Link>
            )}

      </section>

      <div className="w">
      <h2>Why KHEMET ?</h2>
      <div class="why">
        <div class="c">
          <div class="sv">
          <svg width="34px" height="34px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          </div>
          <h4>Local Knowledge</h4>
          <p>Every place is handpicked by locals who know Egypt beyond the tourist trail.</p>
        </div>
        <div className="c">
          <div className="sv">
            <svg width="44px" height="44px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="8" r="2.5" stroke="#C9A84C" stroke-linecap="round"></circle> <path d="M13.7679 6.5C13.9657 6.15743 14.2607 5.88121 14.6154 5.70625C14.9702 5.5313 15.3689 5.46548 15.7611 5.51711C16.1532 5.56874 16.5213 5.73551 16.8187 5.99632C17.1161 6.25713 17.3295 6.60028 17.4319 6.98236C17.5342 7.36445 17.521 7.76831 17.3939 8.14288C17.2667 8.51745 17.0313 8.8459 16.7175 9.08671C16.4037 9.32751 16.0255 9.46985 15.6308 9.49572C15.2361 9.52159 14.8426 9.42983 14.5 9.23205" stroke="#C9A84C"></path> <path d="M10.2321 6.5C10.0343 6.15743 9.73935 5.88121 9.38458 5.70625C9.02981 5.5313 8.63113 5.46548 8.23895 5.51711C7.84677 5.56874 7.47871 5.73551 7.18131 5.99632C6.88391 6.25713 6.67053 6.60028 6.56815 6.98236C6.46577 7.36445 6.47899 7.76831 6.60614 8.14288C6.73329 8.51745 6.96866 8.8459 7.28248 9.08671C7.5963 9.32751 7.97448 9.46985 8.36919 9.49572C8.76391 9.52159 9.15743 9.42983 9.5 9.23205" stroke="#C9A84C"></path> <path d="M12 12.5C16.0802 12.5 17.1335 15.8022 17.4054 17.507C17.4924 18.0524 17.0523 18.5 16.5 18.5H7.5C6.94771 18.5 6.50763 18.0524 6.59461 17.507C6.86649 15.8022 7.91976 12.5 12 12.5Z" stroke="#C9A84C" stroke-linecap="round"></path> <path d="M19.2965 15.4162L18.8115 15.5377L19.2965 15.4162ZM13.0871 12.5859L12.7179 12.2488L12.0974 12.9283L13.0051 13.0791L13.0871 12.5859ZM17.1813 16.5L16.701 16.639L16.8055 17H17.1813V16.5ZM15.5 12C16.5277 12 17.2495 12.5027 17.7783 13.2069C18.3177 13.9253 18.6344 14.8306 18.8115 15.5377L19.7816 15.2948C19.5904 14.5315 19.2329 13.4787 18.578 12.6065C17.9126 11.7203 16.9202 11 15.5 11V12ZM13.4563 12.923C13.9567 12.375 14.6107 12 15.5 12V11C14.2828 11 13.3736 11.5306 12.7179 12.2488L13.4563 12.923ZM13.0051 13.0791C15.3056 13.4614 16.279 15.1801 16.701 16.639L17.6616 16.361C17.1905 14.7326 16.019 12.5663 13.1691 12.0927L13.0051 13.0791ZM18.395 16H17.1813V17H18.395V16ZM18.8115 15.5377C18.8653 15.7526 18.7075 16 18.395 16V17C19.2657 17 20.0152 16.2277 19.7816 15.2948L18.8115 15.5377Z" fill="#C9A84C"></path> <path d="M10.9129 12.5859L10.9949 13.0791L11.9026 12.9283L11.2821 12.2488L10.9129 12.5859ZM4.70343 15.4162L5.18845 15.5377L4.70343 15.4162ZM6.81868 16.5V17H7.19453L7.29898 16.639L6.81868 16.5ZM8.49999 12C9.38931 12 10.0433 12.375 10.5436 12.923L11.2821 12.2488C10.6264 11.5306 9.71723 11 8.49999 11V12ZM5.18845 15.5377C5.36554 14.8306 5.68228 13.9253 6.22167 13.2069C6.75048 12.5027 7.47226 12 8.49999 12V11C7.0798 11 6.08743 11.7203 5.42199 12.6065C4.76713 13.4787 4.40955 14.5315 4.21841 15.2948L5.18845 15.5377ZM5.60498 16C5.29247 16 5.13465 15.7526 5.18845 15.5377L4.21841 15.2948C3.98477 16.2277 4.73424 17 5.60498 17V16ZM6.81868 16H5.60498V17H6.81868V16ZM7.29898 16.639C7.72104 15.1801 8.69435 13.4614 10.9949 13.0791L10.8309 12.0927C7.98101 12.5663 6.8095 14.7326 6.33838 16.361L7.29898 16.639Z" fill="#C9A84C"></path> </g></svg>
          </div>
          <h4>Community Driven</h4>
          <p>Travelers and residents share their favorite hidden gems together.</p>
        </div>
      </div>

    </div>
    </main>
  );
}