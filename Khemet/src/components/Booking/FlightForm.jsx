import { useState } from "react";

const airlines = [
  {
    name: "EgyptAir",
    price: 180,
    duration: "2h 10m",
  },
  {
    name: "Emirates",
    price: 260,
    duration: "3h 05m",
  },
  {
    name: "Qatar Airways",
    price: 300,
    duration: "3h 30m",
  },
  {
    name: "Turkish Airlines",
    price: 280,
    duration: "3h 45m",
  },
];

function FlightForm({
  booking,
  setBooking,
  nextStep,
  back,
}) {
  const [flight, setFlight] = useState({
    departure: "",
    arrival: "Cairo",
    departureDate: "",
    travelers: 1,
    class: "Economy",
    airline: "",
    price: 0,
  });

  const chooseAirline = (item) => {
    setFlight({
      ...flight,
      airline: item.name,
      price: item.price,
    });
  };

  const continueBooking = () => {
    if (
      !flight.departure ||
      !flight.departureDate ||
      !flight.airline
    ) {
      alert("Please complete the form.");
      return;
    }

    setBooking({
      ...booking,
      flight,
    });

    nextStep();
  };

  return (
    <div className="booking-card">

      <h2>Flight Booking</h2>

      <div className="flight-grid">

        <div>
          <label>Departure</label>

          <input
            type="text"
            placeholder="Alexandria"
            value={flight.departure}
            onChange={(e)=>
              setFlight({
                ...flight,
                departure:e.target.value
              })
            }
          />
        </div>

        <div>
          <label>Arrival</label>

          <input
            value="Cairo"
            disabled
          />
        </div>

        <div>
          <label>Date</label>

          <input
            type="date"
            value={flight.departureDate}
            onChange={(e)=>
              setFlight({
                ...flight,
                departureDate:e.target.value
              })
            }
          />
        </div>

        <div>
          <label>Travelers</label>

          <input
            type="number"
            min="1"
            value={flight.travelers}
            onChange={(e)=>
              setFlight({
                ...flight,
                travelers:Number(e.target.value)
              })
            }
          />
        </div>

        <div>
          <label>Class</label>

          <select
            value={flight.class}
            onChange={(e)=>
              setFlight({
                ...flight,
                class:e.target.value
              })
            }
          >
            <option>Economy</option>
            <option>Business</option>
            <option>First</option>
          </select>
        </div>

      </div>

      <h3>Suggested Flights</h3>

      <div className="airlines">

        {airlines.map((item)=>(

          <div
            key={item.name}
            className={`airline ${
              flight.airline===item.name
              ? "selected"
              : ""
            }`}
            onClick={()=>chooseAirline(item)}
          >

            <div>

              <h4>{item.name}</h4>

              <small>{item.duration}</small>

            </div>

            <strong>
              ${item.price}
            </strong>

          </div>

        ))}

      </div>

      <div className="booking-buttons">

        <button
          className="back-btn"
          onClick={back}
        >
          Back
        </button>

        <button
          className="next-btn"
          onClick={continueBooking}
        >
          Continue →
        </button>

      </div>

    </div>
  );
}

export default FlightForm;