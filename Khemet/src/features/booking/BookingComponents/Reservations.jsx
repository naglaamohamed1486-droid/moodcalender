import { useState } from "react";

function Reservations({
  booking,
  setBooking,
  nextStep,
  prevStep,
}) {

  const [reservations, setReservations] = useState(
    booking.reservations || []
  );

  const transportation = [
    "Private Car",
    "Taxi",
    "Uber",
    "Train",
    "Bus",
  ];

  const updateReservation = (
    dayIndex,
    placeIndex,
    field,
    value
  ) => {

    const updated = [...reservations];

    const index = `${dayIndex}-${placeIndex}`;

    const existing =
      updated.find(r => r.id === index);

    if (existing) {

      existing[field] = value;

    } else {

      updated.push({

        id: index,

        dayIndex,

        placeIndex,

        transportation: "",

        restaurant: "",

        time: "",

        guests: 1,

        ticket: false,

        [field]: value,

      });

    }

    setReservations(updated);

  };

  const getReservation = (day, place) => {

    return (
      reservations.find(
        r =>
          r.dayIndex === day &&
          r.placeIndex === place
      ) || {}
    );

  };

const handleContinue = () => {
  let total = booking.flight
    ? Number(booking.flight.price)
    : 0;

  reservations.forEach((r) => {
    // Transportation
    if (r.transportation) {
      total += 20;
    }

    // Restaurant reservation
    if (r.restaurant) {
      total += Number(r.restaurant.price || 0);
    }

    // Attraction ticket
    if (r.ticket) {
      total += 40;
    }
  });

  setBooking({
    ...booking,
    reservations,
    totalPrice: total,
  });

  nextStep();
};

  return (

    <div className="booking-card">

      <h2>Reservations</h2>

      {booking.plan.itinerary.map((day, dayIndex)=>(

        <div
          key={dayIndex}
          className="reservation-day"
        >

          <h3>

            Day {day.day}

          </h3>

          <small>{day.date}</small>

          {day.places.map((place, placeIndex)=>{

            const reservation =
              getReservation(
                dayIndex,
                placeIndex
              );
              const isRestaurant =
                place.type === "restaurant";

            return(

              <div
                key={place.id}
                className="place-booking"
              >

                <h4>

                  {place.title}

                </h4>

                <label>

                  Transportation

                </label>

                <select

                  value={
                    reservation.transportation || ""
                  }

                  onChange={(e)=>

                    updateReservation(

                      dayIndex,

                      placeIndex,

                      "transportation",

                      e.target.value

                    )

                  }

                >

                  <option value="">

                    Choose

                  </option>

                  {transportation.map(item=>(

                    <option
                      key={item}
                      value={item}
                    >

                      {item}

                    </option>

                  ))}

                </select>


{isRestaurant ? (
  <>
    <label className="ticket-label">
      Reserve a Table

      <input
        type="checkbox"
        checked={reservation.reserveRestaurant || false}
        onChange={(e) => {
          updateReservation(
            dayIndex,
            placeIndex,
            "reserveRestaurant",
            e.target.checked
          );

          if (e.target.checked) {
            updateReservation(
              dayIndex,
              placeIndex,
              "restaurant",
              {
                name: place.title,
                price: 10, 
              }
            );
          } else {
            updateReservation(
              dayIndex,
              placeIndex,
              "restaurant",
              null
            );
          }
        }}
      />
    </label>
  </>
) : (
  <>
    <label className="ticket-label">
      Reserve a Restaurant

      <input
        type="checkbox"
        checked={reservation.reserveRestaurant || false}
        onChange={(e) =>
          updateReservation(
            dayIndex,
            placeIndex,
            "reserveRestaurant",
            e.target.checked
          )
        }
      />
    </label>

    {reservation.reserveRestaurant && (
      <>
        <label>Restaurant</label>

        <select
          value={reservation.restaurant?.name || ""}
          onChange={(e) => {
            const selectedRestaurant =
              place.nearbyRestaurants.find(
                (restaurant) =>
                  restaurant.name === e.target.value
              );

            updateReservation(
              dayIndex,
              placeIndex,
              "restaurant",
              selectedRestaurant
            );
          }}
        >
          <option value="">
            Choose a restaurant
          </option>

          {place.nearbyRestaurants?.map(
            (restaurant) => (
              <option
                key={restaurant.name}
                value={restaurant.name}
              >
                {restaurant.name} ({restaurant.price} $)
              </option>
            )
          )}
        </select>
      </>
    )}
  </>
)}

{reservation.reserveRestaurant && (
  <>
    <label>Reservation Time</label>

    <input
      type="time"
      value={reservation.time || ""}
      onChange={(e) =>
        updateReservation(
          dayIndex,
          placeIndex,
          "time",
          e.target.value
        )
      }
    />

    <label>Guests</label>

    <input
      type="number"
      min="1"
      value={reservation.guests || 1}
      onChange={(e) =>
        updateReservation(
          dayIndex,
          placeIndex,
          "guests",
          e.target.value
        )
      }
    />
  </>
)}

                <label className="ticket-label">

                  Book Ticket

                  <input

                    type="checkbox"

                    checked={
                      reservation.ticket || false
                    }

                    onChange={(e)=>

                      updateReservation(

                        dayIndex,

                        placeIndex,

                        "ticket",

                        e.target.checked

                      )

                    }

                  />

                </label>

              </div>

            );

          })}

        </div>

      ))}

      <div className="booking-buttons">

        <button
          className="back-btn"
          onClick={prevStep}
        >
          ← Back
        </button>

        <button
          className="next-btn"
          onClick={handleContinue}
        >
          Continue →
        </button>

      </div>

    </div>

  );

}

export default Reservations;