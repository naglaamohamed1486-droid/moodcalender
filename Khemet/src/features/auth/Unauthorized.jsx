import { Link } from "react-router-dom";
import "../css/unauthorized.css";

export default function Unauthorized({ code = "401" }) {
  return (
    <div className="unauth-page">
      <div className="unauth-card">
        <div className="unauth-seal" aria-hidden="true">
          <svg viewBox="0 0 120 120" className="unauth-seal-svg">
            <circle
              cx="60"
              cy="60"
              r="52"
              className="unauth-seal-ring"
            />
            <circle
              cx="60"
              cy="60"
              r="40"
              className="unauth-seal-ring unauth-seal-ring-inner"
            />
            {/* stylized ancient eye motif */}
            <path
              d="M28 60 C42 42, 78 42, 92 60 C78 78, 42 78, 28 60 Z"
              className="unauth-eye"
            />
            <circle cx="60" cy="60" r="9" className="unauth-pupil" />
            <path
              d="M55 69 L50 82 M65 69 L70 82"
              className="unauth-eye-mark"
            />
            {/* crack across the seal */}
            <path
              d="M14 30 L46 52 L38 66 L66 74 L58 92 L106 96"
              className="unauth-crack"
            />
          </svg>
        </div>

        <p className="unauth-eyebrow">Chamber sealed</p>
        <h1 className="unauth-code">{code}</h1>
        <h2 className="unauth-title">This passage is not open to you</h2>
        <p className="unauth-message">
          The page beyond this seal requires access you don't currently
          have. Sign in with an authorized account, or return to ground
          you're free to walk.
        </p>

        <div className="unauth-actions">
          <Link to="/" className="unauth-btn unauth-btn-primary">
            Return to entrance
          </Link>
          <Link to="/login" className="unauth-btn unauth-btn-ghost">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}