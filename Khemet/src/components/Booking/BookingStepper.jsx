function BookingStepper({ step }) {
  const steps = [
    "Flight",
    "Trip",
    "Reservations",
    "Summary",
  ];

  return (
    <div className="booking-stepper">
      {steps.map((item, index) => (
        <div
          key={item}
          className={`step ${
            step === index + 1
              ? "active"
              : step > index + 1
              ? "done"
              : ""
          }`}
        >
          <div className="circle">
            {index + 1}
          </div>

          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

export default BookingStepper;