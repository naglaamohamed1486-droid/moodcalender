import { useState } from "react";

function TripPlanning({
  booking,
  setBooking,
  nextStep,
  prevStep,
}) {

  const [startDate, setStartDate] = useState(
    booking.startDate || ""
  );

  const itinerary = booking.plan.itinerary.map((day, index) => {
  // لو جاي من الـ Organizer
  if (Array.isArray(day)) {
    return {
      day: index + 1,
      places: day,
    };
  }

  // لو جاي من الـ Generator
  return day;
});

  const handleContinue = () => {

    if (!startDate) {
      alert("Please choose a start date.");
      return;
    }

    const updatedItinerary = itinerary.map((day, index) => {

      const date = new Date(startDate);

      date.setDate(date.getDate() + index);

      return {
        ...day,
        date: date.toISOString().split("T")[0],
      };

    });

    const end = new Date(startDate);

    end.setDate(end.getDate() + updatedItinerary.length - 1);

    setBooking({
      ...booking,

      startDate,

      endDate: end.toISOString().split("T")[0],

      plan: {
        ...booking.plan,
        itinerary: updatedItinerary,
      },
    });

    nextStep();

  };

  return (

    <div className="booking-card">

      <h2>Trip Schedule</h2>

      <p>
        Select your trip start date.
      </p>

      <input
        type="date"
        value={startDate}
        onChange={(e)=>setStartDate(e.target.value)}
      />

      <div className="trip-preview">

        {itinerary.map((day,index)=>{

          let date = "";

          if(startDate){

            const d = new Date(startDate);

            d.setDate(d.getDate()+index);

            date = d.toLocaleDateString();

          }

          return(

            <div
              className="trip-day"
              key={index}
            >

              <h3>
                Day {day.day}
              </h3>

              {date && (
                <small>{date}</small>
              )}

              {day.places.map(place=>(

                <div
                  key={place.id}
                >
                  📍 {place.title}
                </div>

              ))}

            </div>

          )

        })}

      </div>

      <div className="booking-buttons">

        <button
          onClick={prevStep}
        >
          Back
        </button>

        <button
          onClick={handleContinue}
        >
          Continue
        </button>

      </div>

    </div>

  );

}

export default TripPlanning;