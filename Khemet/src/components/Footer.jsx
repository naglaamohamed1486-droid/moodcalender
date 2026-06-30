import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function Footer() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSent(false);
    setFormData({ email: "", message: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch("https://formspree.io/f/xaqgqyld", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSent(true);
        setTimeout(() => {
          setSent(false);
          setFormData({ email: "", message: "" });
          closeModal();
        }, 2000);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleClear = () => {
    setFormData({ email: "", message: "" });
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-grid">
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
              <Link to="/feed">Popular Places</Link>
              {user && <Link to="/trip-plan">Trip Planner</Link>}
            </div>

            <div>
              <h3>Contact</h3>
              <Link to="/about">About</Link>
              <button onClick={openModal} className="footer-link-btn">Support</button>
            </div>
          </div>
        </div>

        <hr />

        <div className="footer-bottom">
          © 2026 KHEMET — Built with local love 🇪🇬
        </div>
      </footer>

      {}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>

            <div className="modal-header">
              <h2>Contact Us</h2>
              <p>We'd love to hear from you!</p>
            </div>

            {sent ? (
              <div className="success-message">
                {}
                <p>Thank you! Your message has been sent successfully.</p>
              </div>
            ) : (
              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows="4"
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-clear" onClick={handleClear}>
                    Clear
                  </button>
                  <button type="submit" className="btn-submit" disabled={isSending}>
                    {isSending ? "Sending..." : "Submit"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;