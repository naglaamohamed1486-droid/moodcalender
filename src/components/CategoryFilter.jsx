import "../css/CategoryFilter.css";

export default function CategoryFilter({
  places,
  tag,
  setTag,
}) {
  const allTags = [
    "All",
    ...new Set(
      (places || []).flatMap((p) =>
        Array.isArray(p.tags) ? p.tags : []
      )
    ),
  ];

  return (
    <div className="category-filter">
      <span className="category-icon">
        🏛️
      </span>

      <select
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="category-select"
      >
        {allTags.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <span className="category-arrow">
        ▼
      </span>
    </div>
  );
}