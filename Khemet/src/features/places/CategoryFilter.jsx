import { useState, useRef, useEffect } from "react";
import "./CategoryFilter.css";

export default function CategoryFilter({
  places,
  selectedTags,
  setSelectedTags,
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const allTags = [
    ...new Set(
      (places || []).flatMap((p) => (Array.isArray(p.tags) ? p.tags : [])),
    ),
  ].sort();

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const title =
    selectedTags.length === 0
      ? "Select Categories"
      : selectedTags.length <= 2
        ? selectedTags.join(", ")
        : `${selectedTags.length} Categories Selected`;

  return (
    <div className="category-filter" ref={wrapperRef}>
      <button
        type="button"
        className="category-select"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>

        <span className={`arrow ${open ? "rotate" : ""}`}>▼</span>
      </button>

      {open && (
        <div className="category-dropdown">
          {allTags.map((tag) => (
            <label key={tag} className="category-option">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
              />

              <span>{tag}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
