import { CATEGORIES, CATEGORY_META } from "../constants";

export function CategoryFilter({ selected, onToggle, onClear }) {
  return (
    <div className="category-filter">
      {CATEGORIES.map((cat) => {
        const meta = CATEGORY_META[cat] || CATEGORY_META.other;
        const isActive = selected.has(cat);
        return (
          <button
            key={cat}
            type="button"
            className={`category-chip${isActive ? " category-chip--active" : ""}`}
            style={isActive ? { background: meta.bg, color: meta.color } : undefined}
            onClick={() => onToggle(cat)}
            aria-pressed={isActive}
          >
            {meta.emoji} {meta.label}
          </button>
        );
      })}
      {selected.size > 0 && (
        <button type="button" className="category-chip-clear" onClick={onClear}>
          ✕ Clear
        </button>
      )}
    </div>
  );
}
