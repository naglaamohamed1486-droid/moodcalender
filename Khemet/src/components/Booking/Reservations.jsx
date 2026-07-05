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

    reservations.forEach(r => {

      if (r.transportation)
        total += 200;

      if (r.restaurant)
        total += 350;

      if (r.ticket)
        total += 400;

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

                <label>

                  Restaurant

                </label>

                <input

                  type="text"

                  placeholder="Optional"

                  value={
                    reservation.restaurant || ""
                  }

                  onChange={(e)=>

                    updateReservation(

                      dayIndex,

                      placeIndex,

                      "restaurant",

                      e.target.value

                    )

                  }

                />

                <label>

                  Time

                </label>

                <input

                  type="time"

                  value={
                    reservation.time || ""
                  }

                  onChange={(e)=>

                    updateReservation(

                      dayIndex,

                      placeIndex,

                      "time",

                      e.target.value

                    )

                  }

                />

                <label>

                  Guests

                </label>

                <input

                  type="number"

                  min="1"

                  value={
                    reservation.guests || 1
                  }

                  onChange={(e)=>

                    updateReservation(

                      dayIndex,

                      placeIndex,

                      "guests",

                      e.target.value

                    )

                  }

                />

                <label>

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

                  Book Ticket

                </label>

              </div>

            );

          })}

        </div>

      ))}

      <div className="booking-buttons">

        <button
          onClick={prevStep}
        >
          ← Back
        </button>

        <button
          onClick={handleContinue}
        >
          Continue →
        </button>

      </div>

    </div>

  );

}

export default Reservations;