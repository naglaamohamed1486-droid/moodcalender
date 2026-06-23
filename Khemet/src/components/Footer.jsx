import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Footer() {
  const { user } = useAuth();

  return (
    <footer className="footer">

      <div className="grid">

       
        <div>
          <h3>Explore Egypt</h3>
          <p>
            Discover Egypt through local eyes — hidden gems, cozy spots, and real experiences.
          </p>
        </div>

        
        <div className="footer-container">

          <div>
            <h3>Navigate</h3>

            <Link to="/">Home</Link>
            <Link to="/map">Map</Link>

            {user?.role === "explorer" && (
              <Link to="/saved">Favorites</Link>
            )}

            {user?.role === "local" && (
              <Link to="/add-place">Add Place</Link>
            )}
          </div>

          <div>
            <h3>Contact</h3>
            <Link to="/about">About</Link>
            <Link to="/support">Support</Link>
          </div>

        </div>
      </div>

      <hr />

      <div className="footer-bottom">
        © 2026 KHEMET — Built with local love 🇪🇬
      </div>

    </footer>
  );
}

export default Footer;