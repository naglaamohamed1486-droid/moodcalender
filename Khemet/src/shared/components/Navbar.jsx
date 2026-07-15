import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthContext";
import { useState, useEffect } from "react";
import logo from "../../assets/logo.png";

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
      if (
        !e.target.closest(".profile-btn") &&
        !e.target.closest(".profile-dropdown")
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    navigate("/");
  };

  return (
    <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <Link to="/" className="logo">
        <img src={logo} alt="logo" width="40" height="50" />
        <p>KHEMET</p>
      </Link>

      <ul className="links">
        {user?.role != "admin" && (
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Home
            </NavLink>
          </li>
        )}
        {user?.role != "admin" && (
          <li>
            <NavLink
              to="/map"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Map
            </NavLink>
          </li>
        )}
        {user?.role === "admin" && (
          <li>
            {" "}
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Dashboard
            </NavLink>
          </li>
        )}
        {user && (
          <li>
            <NavLink
              to="/feed"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Community
            </NavLink>
          </li>
        )}
        {user?.role === "user" && (
          <li>
            <NavLink
              to="/trip-plan"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Trip Planner
            </NavLink>
          </li>
        )}
        {user?.role === "admin" && (
          <li>
            <NavLink
              to="/submissions"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Submissions
            </NavLink>
          </li>
        )}
        {user?.role === "admin" && (
          <li>
            <NavLink
              to="/adminReports"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Reports
            </NavLink>
          </li>
        )}
      </ul>

      <div className="right">
        {user ? (
          <>
            <button
              className="profile-btn"
              type="button"
              onClick={toggleProfileMenu}
            >
              <div className="profile-avatar">
                {user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()}
              </div>
              <span>{user.name}</span>
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                {user?.role === "user" && (
                  <Link to={`/profile/${user.uid}`} onClick={closeAll}>
                    My Profile
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link to="/dashboard" onClick={closeAll}>
                    Dashboard
                  </Link>
                )}
                {user.role === "user" && (
                  <Link to="/favorites" onClick={closeAll}>
                    Favorites
                  </Link>
                )}
                {user.role === "user" && (
                  <Link to="/savedtrips" onClick={closeAll}>
                    My Trips
                  </Link>
                )}
                {user.role === "user" && (
                  <Link to="/contributions" onClick={closeAll}>
                    My Contributions
                  </Link>
                )}
                {user.role === "user" && (
                  <Link to="/bookings" onClick={closeAll}>
                    My Bookings
                  </Link>

                )}
                {user.role === "admin" && (
                  <Link to="/adminUsers" onClick={closeAll}>
                    Manage Users
                  </Link>
                )}
              </div>
            )}

            <button onClick={handleLogout} className="logout" type="button">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="loginbtn">
              Log In
            </Link>
            <Link to="/signup" className="signup">
              Join Us
            </Link>
          </>
        )}
      </div>

      {user && (
        <div className="mobile-profile">
          <button
            className="profile-btn"
            type="button"
            onClick={toggleProfileMenu}
          >
            <div className="profile-avatar">
              {user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()}
            </div>
            <span>{user.name}</span>
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown">
              {user?.role === "user" && (
                <Link to={`/profile/${user.uid}`} onClick={closeAll}>
                  My Profile
                </Link>
              )}
              {user.role === "admin" && (
                <Link to="/dashboard" onClick={closeAll}>
                  Dashboard
                </Link>
              )}
              {user.role === "user" && (
                <Link to="/favorites" onClick={closeAll}>
                  Favorites
                </Link>
              )}
              {user.role === "user" && (
                <Link to="/savedtrips" onClick={closeAll}>
                  My Trips
                </Link>
              )}
              {user.role === "user" && (
                <Link to="/contributions" onClick={closeAll}>
                  My Contributions
                </Link>
              )}
              {user.role === "admin" && (
                <Link to="/adminUsers" onClick={closeAll}>
                  Manage Users
                </Link>
              )}
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
          {user?.role === "user" && (
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Home
              </NavLink>
            </li>
          )}
          {user?.role === "user" && (
            <li>
              <NavLink
                to="/map"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Map
              </NavLink>
            </li>
          )}
          {user?.role === "admin" && (
            <li>
              {" "}
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Dashboard
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to="/feed"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Community
            </NavLink>
          </li>
          {user?.role === "user" && (
            <li>
              <NavLink
                to="/trip-plan"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Trip Planner
              </NavLink>
            </li>
          )}
          {user?.role === "admin" && (
            <li>
              <NavLink
                to="/submissions"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Submissions
              </NavLink>
            </li>
          )}
          {user?.role === "admin" && (
            <li>
              <NavLink
                to="/adminReports"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Reports
              </NavLink>
            </li>
          )}
        </ul>

        <div className="mobile-right">
          {user ? (
            <button onClick={handleLogout} className="logout">
              Log out
            </button>
          ) : (
            <>
              <Link to="/login" className="loginbtn" onClick={toggleMenu}>
                Log In
              </Link>
              <Link to="/signup" className="signup" onClick={toggleMenu}>
                Join Us
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
