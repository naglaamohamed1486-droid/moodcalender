import "../css/SearchBar.css";

export default function SearchBar({ search, setSearch }) {
  return (
    <div className="search-bar">
      <span className="search-icon">
        🔍
      </span>

      <input
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by place or city..."
      />
    </div>
  );
}