import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useContext } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="nav">

      <Link to="/" className="logo">
        <img src="/assets/logo.png" alt="logo" width="40" height="50" />
        <p>KHEMET</p>
      </Link>

    
      <ul className="links">

        {role === "explorer" && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/map">Map</Link></li>
            <li><Link to="/saved">Saved</Link></li>
          </>
        )}

        {role === "local" && (
          <>
            <li><Link to="/map">Map</Link></li>
            <li><Link to="/feed">Popular Places</Link></li>
            <li><Link to="/add-place">Add Place</Link></li>
          </>
        )}

        {!role && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/map">Popular Places</Link></li>
          </>
        )}

      </ul>

     
      <div className="right">

        {user ? (
          <>
            <Link to="/profile" className="profile">
              {user.name}
            </Link>

            <button onClick={handleLogout} className="logout">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="loginbtn">Log In</Link>
            <Link to="/signup" className="signup">Join Us</Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;