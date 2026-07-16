import { Link } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthContext";
import BookingList from "../../shared/components/BookingList";
import "../../shared/components/SavedTrips.css";
import "./MyBookings.css";
import useScrollToTop from "../../shared/utils/UseScrollToTop";

export default function MyBookings() {
  useScrollToTop();

  const { bookings } = useAuth();

  return (
    <section className="saved-page">

      <div className="saved-header">

        <div className="title-area">

          <span className="saved-step">
            MY BOOKINGS
          </span>

          <h1>
            My Bookings
          </h1>

          <p>
            {bookings.length === 0
              ? "No confirmed trips yet."
              : `${bookings.length} confirmed ${
                  bookings.length === 1 ? "trip" : "trips"
                }`}
          </p>

        </div>

        <Link
          to="/savedtrips"
          className="new-trip-btn"
        >
          + Book Another Trip
        </Link>

      </div>

      {bookings.length === 0 ? (
        <div className="saved-empty">

          <div className="empty-icon">
            🧳
          </div>

          <h2>
            No Bookings Yet
          </h2>

          <p>
            Book your first adventure and
            it will appear here.
          </p>

          <Link
            to="/trip-planner"
            className="new-trip-btn empty-btn"
          >
            Explore Trips
          </Link>

        </div>
      ) : (
        <BookingList bookings={bookings} />
      )}

    </section>
  );
}