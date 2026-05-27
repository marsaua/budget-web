// budget-web/src/components/CategoryFilter.jsx
import { CATEGORIES, CATEGORY_META } from "../constants";

export function CategoryFilter({ selected, onToggle, onClear }) {
  return (
    <div className="category-filter">
      {CATEGORIES.map((cat) => {
        const meta = CATEGORY_META[cat];
        const isActive = selected.has(cat);
        return (
          <button
            key={cat}
            className={`category-chip${isActive ? " category-chip--active" : ""}`}
            style={isActive ? { background: meta.color } : undefined}
            onClick={() => onToggle(cat)}
          >
            {meta.emoji} {meta.label}
          </button>
        );
      })}
      {selected.size > 0 && (
        <button className="category-chip-clear" onClick={onClear}>
          ✕ Clear
        </button>
      )}
    </div>
  );
}
