import { Link } from "react-router-dom";
import "../css/NotFound.css";

export default function NotFound({ code = "404" }) {
  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <div className="notfound-seal" aria-hidden="true">
          <svg viewBox="0 0 120 120" className="notfound-seal-svg">
            <circle cx="60" cy="60" r="52" className="notfound-seal-ring" />
            <circle
              cx="60"
              cy="60"
              r="40"
              className="notfound-seal-ring notfound-seal-ring-inner"
            />
            {/* stylized compass / wayfinding motif */}
            <path d="M60 26 L60 94" className="notfound-mark" />
            <path d="M26 60 L94 60" className="notfound-mark" />
            <path
              d="M60 38 L68 60 L60 82 L52 60 Z"
              className="notfound-needle"
            />
            <circle cx="60" cy="60" r="4.5" className="notfound-pupil" />
            {/* crack across the seal */}
            <path
              d="M12 78 L44 64 L36 48 L64 40 L56 22 L104 18"
              className="notfound-crack"
            />
          </svg>
        </div>

        <p className="notfound-eyebrow">Off the map</p>
        <h1 className="notfound-code">{code}</h1>
        <h2 className="notfound-title">This passage leads nowhere</h2>
        <p className="notfound-message">
          The page you're looking for may have been moved, renamed, or never
          carved into these walls. Let's get you back to a path that exists.
        </p>

        <div className="notfound-actions">
          <Link to="/" className="notfound-btn notfound-btn-primary">
            Return to entrance
          </Link>
          <Link to="/explore" className="notfound-btn notfound-btn-ghost">
            Explore places
          </Link>
        </div>
      </div>
    </div>
  );
}
