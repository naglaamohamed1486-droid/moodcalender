import { useState } from "react";
import Toast from "../../../shared/components/Toast";

const classMultiplier = {
  Economy: 1,
  Business: 1.6,
  "First Class": 2.2,
};

const egyptAirports = [
  {
    city: "Cairo",
    airport: "Cairo International Airport",
    code: "CAI",
  },
  {
    city: "Alexandria",
    airport: "Borg El Arab International Airport",
    code: "HBE",
  },
  {
    city: "Luxor",
    airport: "Luxor International Airport",
    code: "LXR",
  },
  {
    city: "Aswan",
    airport: "Aswan International Airport",
    code: "ASW",
  },
  {
    city: "Hurghada",
    airport: "Hurghada International Airport",
    code: "HRG",
  },
  {
    city: "Sharm El Sheikh",
    airport: "Sharm El Sheikh International Airport",
    code: "SSH",
  },
  {
    city: "Marsa Alam",
    airport: "Marsa Alam International Airport",
    code: "RMF",
  },
  {
    city: "Taba",
    airport: "Taba International Airport",
    code: "TCP",
  },
  {
    city: "Sohag",
    airport: "Sohag International Airport",
    code: "HMB",
  },
  {
    city: "Assiut",
    airport: "Assiut International Airport",
    code: "ATZ",
  },
  {
    city: "Abu Simbel",
    airport: "Abu Simbel Airport",
    code: "ABS",
  },
  {
    city: "El Alamein",
    airport: "El Alamein International Airport",
    code: "DBB",
  },
];

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

function FlightForm({ booking, setBooking, nextStep, back }) {
  const calculatePrice = (basePrice, cabinClass) => {
    return Math.round(basePrice * classMultiplier[cabinClass]);
  };
  const today = new Date().toISOString().split("T")[0];

  const [flight, setFlight] = useState({
    departure: "",
    arrival: "",
    departureDate: "",
    travelers: 1,
    class: "Economy",
    airline: "",
    basePrice: 0,
    price: 0,
  });

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  const showToast = (message, type = "error") => {
    setToast({
      visible: true,
      message,
      type,
    });

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        visible: false,
      }));
    }, 2500);
  };

  const chooseAirline = (item) => {
    setFlight({
      ...flight,
      airline: item.name,
      basePrice: item.price,
      price: calculatePrice(item.price, flight.class),
    });
  };

  const continueBooking = () => {
    if (!flight.departure || !flight.departureDate || !flight.airline) {
      showToast("Please complete all required fields.");
      return;
    }
    if (flight.departureDate < today) {
      showToast("Departure date cannot be in the past.");
      return;
    }

    setBooking({
      ...booking,
      flight,
    });

    nextStep();
  };

  return (
    <>
      <div className="booking-card">
        <h2>Book Your Flight</h2>

        <p>
          Fill in your travel information and choose the airline that best fits
          your trip.
        </p>

        <div className="flight-grid">
          <div>
            <label>Departure</label>

            <input
              type="text"
              placeholder="Enter Departure Airport"
              value={flight.departure}
              onChange={(e) =>
                setFlight({
                  ...flight,
                  departure: e.target.value,
                })
              }
            />
          </div>

          <div>
  <label>Arrival</label>

  <select
    value={flight.arrival}
    onChange={(e) =>
      setFlight({
        ...flight,
        arrival: e.target.value,
      })
    }
  >
    <option value="">Select Airport</option>

    {egyptAirports.map((airport) => (
      <option
        key={airport.code}
        value={airport.airport}
      >
        {airport.airport} ({airport.code})
      </option>
    ))}
  </select>
</div>

          <div>
            <label>Departure Date</label>

            <input
              type="date"
              min={today}
              value={flight.departureDate}
              onChange={(e) =>
                setFlight({
                  ...flight,
                  departureDate: e.target.value,
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
              onChange={(e) =>
                setFlight({
                  ...flight,
                  travelers: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label>Cabin Class</label>

            <select
              value={flight.class}
              onChange={(e) => {
                const newClass = e.target.value;

                setFlight({
                  ...flight,
                  class: newClass,
                  basePrice: flight.basePrice,
                  price: calculatePrice(flight.basePrice, newClass),
                });
              }}
            >
              <option>Economy</option>
              <option>Business</option>
              <option>First Class</option>
            </select>
          </div>
        </div>

        <h3
          style={{
            marginTop: "35px",
            marginBottom: "15px",
          }}
        >
          Suggested Airlines
        </h3>

        <div className="airlines">
          {airlines.map((item) => (
            <div
              key={item.name}
              className={`airline ${
                flight.airline === item.name ? "selected" : ""
              }`}
              onClick={() => chooseAirline(item)}
            >
              <div>
                <h4>{item.name}</h4>

                <small>{item.duration}</small>
              </div>

              <strong>${calculatePrice(item.price, flight.class)}</strong>
            </div>
          ))}
        </div>

        <div className="booking-buttons">
          <button className="back-btn" onClick={back}>
            ← Back
          </button>

          <button className="next-btn" onClick={continueBooking}>
            Continue →
          </button>
        </div>
      </div>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
      />
    </>
  );
}

export default FlightForm;
