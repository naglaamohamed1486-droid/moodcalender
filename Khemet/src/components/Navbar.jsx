import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-btn') && !e.target.closest('.profile-dropdown')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setShowProfileMenu(false);
  };

const toggleProfileMenu = () => {
  setShowProfileMenu((prev) => !prev);
  setIsMenuOpen(false);
};
const closeAll = () => {
  setShowProfileMenu(false);
  setIsMenuOpen(false);
};
  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <Link to="/" className="logo">
        <img src={logo} alt="logo" width="40" height="50" />
        <p>KHEMET</p>
      </Link>

      <ul className="links">
        <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
        <li><NavLink to="/map" className={({ isActive }) => isActive ? "active" : ""}>Map</NavLink></li>
        <li><NavLink to="/feed" className={({ isActive }) => isActive ? "active" : ""}>Popular Places</NavLink></li>
        {user && <li><NavLink to="/trip-plan" className={({ isActive }) => isActive ? "active" : ""}>Trip Planner</NavLink></li>}
      </ul>

      <div className="right">
        {user ? (
          <>
            <button className="profile-btn" type="button" onClick={toggleProfileMenu}>
              <div className="profile-avatar">
                {user.name?.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
              </div>
              <span>{user.name}</span>
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <Link to="/profile" onClick={closeAll}>My Profile</Link>
                <Link to="/favorites" onClick={closeAll}>Favorites</Link>
                <Link to="/savedtrips" onClick={closeAll}>My Trips</Link>
                <Link to="/contributions" onClick={closeAll}>My Contributions</Link>
              </div>
            )}

            <button onClick={handleLogout} className="logout" type="button">Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="loginbtn">Log In</Link>
            <Link to="/signup" className="signup">Join Us</Link>
          </>
        )}
      </div>

      {}
      {user && (
        <div className="mobile-profile">
          <button className="profile-btn" type="button" onClick={toggleProfileMenu}>
            <div className="profile-avatar">
              {user.name?.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
            </div>
            <span>{user.name}</span>
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <Link to="/profile" onClick={closeAll}>My Profile</Link>
              <Link to="/favorites" onClick={closeAll}>Favorites</Link>
              <Link to="/savedtrips" onClick={closeAll}>My Trips</Link>
              <Link to="/contributions" onClick={closeAll}>My Contributions</Link>
            </div>
          )}
        </div>
      )}

      <div className="hamburger" onClick={toggleMenu}>
        <span className={`bar ${isMenuOpen ? "active" : ""}`}></span>
        <span className={`bar ${isMenuOpen ? "active" : ""}`}></span>
        <span className={`bar ${isMenuOpen ? "active" : ""}`}></span>
      </div>

      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <ul>
          <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""} onClick={toggleMenu}>Home</NavLink></li>
          <li><NavLink to="/map" className={({ isActive }) => isActive ? "active" : ""} onClick={toggleMenu}>Map</NavLink></li>
          <li><NavLink to="/feed" className={({ isActive }) => isActive ? "active" : ""} onClick={toggleMenu}>Popular Places</NavLink></li>
          {user && <li><NavLink to="/trip-plan" className={({ isActive }) => isActive ? "active" : ""} onClick={toggleMenu}>Trip Planner</NavLink></li>}
        </ul>

        <div className="mobile-right">
          {user ? (
            <button onClick={handleLogout} className="logout">Log out</button>
          ) : (
            <>
              <Link to="/login" className="loginbtn" onClick={toggleMenu}>Log In</Link>
              <Link to="/signup" className="signup" onClick={toggleMenu}>Join Us</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;