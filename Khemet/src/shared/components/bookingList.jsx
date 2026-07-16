import { useState } from "react";
import { useAuth } from "../../app/providers/AuthContext";
import BookingCard from "./BookingCard";
import TripDetailsModal from "../../features/trip-generator/generatorComponents/TripDetailsModal";

function BookingList({ bookings }) {
  const { deleteBooking } = useAuth();

  const [selectedBooking, setSelectedBooking] = useState(null);

  return (
    <>
      <div className="saved-grid">
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onView={setSelectedBooking}
            onCancel={deleteBooking}
          />
        ))}
      </div>

      {selectedBooking && (
        <TripDetailsModal
          trip={selectedBooking.plan}
          onClose={() => setSelectedBooking(null)}
          hideEdit
          hideBook
        />
      )}
    </>
  );
}

export default BookingList;