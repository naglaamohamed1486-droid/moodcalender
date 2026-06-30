import places from "../places.json";

function TripOrganizer({
  trip,
  setTrip,
  saveTrip,
}) {
  // ===========================
  // Add New Day
  // ===========================

  const addDay = () => {
    setTrip({
      ...trip,
      itinerary: [
        ...trip.itinerary,
        [],
      ],
    });
  };

  // ===========================
  // Delete Day
  // ===========================

  const deleteDay = (dayIndex) => {
    const updated = trip.itinerary.filter(
      (_, index) => index !== dayIndex
    );

    setTrip({
      ...trip,
      itinerary: updated,
    });
  };
  // ===========================
  // Add Place
  // ===========================

  const addPlace = (
    dayIndex,
    placeId
  ) => {
    if (!placeId) return;

    const place = places.find(
      (p) => String(p.id) === placeId
    );

    if (!place) return;

    const updated = [...trip.itinerary];

    updated[dayIndex].push(place);

    setTrip({
      ...trip,
      itinerary: updated,
    });
  };

  // ===========================
  // Remove Place
  // ===========================

  const removePlace = (
    dayIndex,
    placeIndex
  ) => {
    const updated = [...trip.itinerary];

    updated[dayIndex].splice(
      placeIndex,
      1
    );

    setTrip({
      ...trip,
      itinerary: updated,
    });
  };

  // ===========================
  // Move Up
  // ===========================

  const moveUp = (
    dayIndex,
    placeIndex
  ) => {
    if (placeIndex === 0) return;

    const updated = [...trip.itinerary];

    [
      updated[dayIndex][placeIndex - 1],
      updated[dayIndex][placeIndex],
    ] = [
      updated[dayIndex][placeIndex],
      updated[dayIndex][placeIndex - 1],
    ];

    setTrip({
      ...trip,
      itinerary: updated,
    });
  };

  // ===========================
  // Move Down
  // ===========================

  const moveDown = (
    dayIndex,
    placeIndex
  ) => {
    const updated = [...trip.itinerary];

    if (
      placeIndex ===
      updated[dayIndex].length - 1
    )
      return;

    [
      updated[dayIndex][placeIndex + 1],
      updated[dayIndex][placeIndex],
    ] = [
      updated[dayIndex][placeIndex],
      updated[dayIndex][placeIndex + 1],
    ];

    setTrip({
      ...trip,
      itinerary: updated,
    });
  };

  return (
    <section className="organizer-section">
      <div className="plans-header">
        <div className="plans-step">
          <span>
            STEP 3 — ORGANIZE
          </span>
        </div>

        <h2>Trip Organizer</h2>

        <p>
          Rearrange places, add
          destinations and personalize
          your trip.
        </p>
      </div>

      <div className="generator-card">
        <div className="generator-top">
          <h2>{trip.name}</h2>
        </div>

        <div className="generator-body">
          <div className="organizer-days">
            {trip.itinerary.map(
              (
                day,
                dayIndex
              ) => (
                <div
                  className="organizer-day"
                  key={dayIndex}
                >
                  {/* HEADER */}

                  <div className="day-toolbar">
                    <div className="day-info">
                      <span className="day-circle">
                        {dayIndex + 1}
                      </span>

                      <div>
                        <div className="day-title">
                          Day{" "}
                          {dayIndex + 1}
                        </div>

                        <span className="places-count">
                          {
                            day.length
                          }{" "}
                          places
                        </span>
                      </div>
                    </div>

                    <div className="day-actions">
                      <select
                        defaultValue=""
                        onChange={(e) =>
                          addPlace(
                            dayIndex,
                            e.target
                              .value
                          )
                        }
                      >
                        <option value="">
                          Add a place...
                        </option>

                        {places.map(
                          (
                            place
                          ) => (
                            <option
                              key={
                                place.id
                              }
                              value={
                                place.id
                              }
                            >
                              {
                                place.title
                              }
                            </option>
                          )
                        )}
                      </select>

                      <button
                        className="icon-btn delete"
                        onClick={() =>
                          deleteDay(
                            dayIndex
                          )
                        }
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* PLACES */}

                  <div className="organizer-places">
                    {day.map(
                      (
                        place,
                        placeIndex
                      ) => (
                        <div
                          className="organizer-place"
                          key={
                            place.id +
                            "-" +
                            placeIndex
                          }
                        >
                          <div className="move-buttons">
                            <button
                              className="icon-btn"
                              onClick={() =>
                                moveUp(
                                  dayIndex,
                                  placeIndex
                                )
                              }
                            >
                              ▲
                            </button>

                            <button
                              className="icon-btn"
                              onClick={() =>
                                moveDown(
                                  dayIndex,
                                  placeIndex
                                )
                              }
                            >
                              ▼
                            </button>
                          </div>

                          <img
                            src={
                              place.coverImage
                            }
                            alt={
                              place.title
                            }
                          />

                          <div className="place-details">
                            <h4>
                              {
                                place.title
                              }
                            </h4>

                            <p>
                              {
                                place.city
                              }
                              {" • "}
                              {
                                place.tags?.[0]
                              }
                            </p>
                          </div>

                          <button
                            className="icon-btn delete"
                            onClick={() =>
                              removePlace(
                                dayIndex,
                                placeIndex
                              )
                            }
                          >
                            ✕
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          {/* FOOTER */}

          <button
            className="add-day-btn"
            onClick={addDay}
          >
            + Add another day
          </button>

          <div className="organizer-footer">
            <button
              className="save-trip-btn"
              onClick={saveTrip}
            >
              ✓ Save Trip
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TripOrganizer;