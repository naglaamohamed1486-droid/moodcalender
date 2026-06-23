function Card({ place }) {
  return (
    <div className="card">
      <div className="cover"></div>

      <button className="saved">❤️</button>

      <div className="bod">
        <h1 className="title">{place.title}</h1>
        <h3 className="loc">{place.location}</h3>
        <p className="dis">{place.description}</p>

        <ul className="tags">
          {place.tags.map((tag, i) => (
            <li key={i}>{tag}</li>
          ))}
        </ul>

        <div className="view">
          <a href="#">Details</a>
        </div>
      </div>
    </div>
  );
}

export default Card;