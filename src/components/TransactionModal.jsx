import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { CATEGORIES, CATEGORY_META } from "../constants";
import { parseInput } from "../utils/parseInput";

const today = () => new Date().toISOString().slice(0, 10);

function initState(kind, prefill) {
  return {
    raw: "",
    description: prefill?.description ?? "",
    amount: prefill?.amount?.toString() ?? "",
    category: prefill?.category ?? (kind === "income" ? "income" : "other"),
    occurred_on: prefill?.occurred_on ?? today(),
    kind: prefill?.kind ?? kind,
    parsed: !!prefill,
  };
}

export function TransactionModal({ mode, initialKind, prefill, onSave, onClose }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useState(() => initState(initialKind, prefill));
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleRawChange(e) {
    const raw = e.target.value;
    setForm((f) => ({ ...f, raw, parsed: false }));

    // Auto-parse on-the-fly
    const parsed = parseInput(raw);
    if (parsed) {
      setForm((f) => ({
        ...f,
        raw,
        description: parsed.description,
        amount: parsed.amount.toString(),
        category: f.kind === "income" ? "income" : parsed.category,
        parsed: true,
      }));
    }
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const amount = parseFloat(form.amount);
    if (!form.description.trim()) return setError("Description is required");
    if (isNaN(amount) || amount <= 0) return setError("Enter a valid amount");
    try {
      await onSave({
        description: form.description.trim(),
        amount,
        kind: form.kind,
        category: form.category,
        occurred_on: form.occurred_on,
      });
    } catch (err) {
      setError(err.message);
    }
  }

  const kindColor = form.kind === "income" ? "var(--color-income)" : "var(--color-expense)";
  const catMeta = CATEGORY_META[form.category] || CATEGORY_META.other;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet animate-in">
        <div className="modal-header">
          <span className="modal-title" style={{ color: kindColor }}>
            {isEdit ? "Edit transaction" : form.kind === "income" ? "Add income" : "Add expense"}
          </span>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {!isEdit && (
            <div className="kind-toggle">
              <button
                type="button"
                className={`kind-btn${form.kind === "expense" ? " kind-btn--active kind-btn--expense" : ""}`}
                onClick={() => set("kind", "expense")}
              >
                − Expense
              </button>
              <button
                type="button"
                className={`kind-btn${form.kind === "income" ? " kind-btn--active kind-btn--income" : ""}`}
                onClick={() => set("kind", "income")}
              >
                + Income
              </button>
            </div>
          )}

          {!isEdit && (
            <div className="field">
              <label className="field-label">Quick input</label>
              <input
                ref={inputRef}
                className="input"
                placeholder='e.g. "Ваня танці гуртки 200" or "salary 5000"'
                value={form.raw}
                onChange={handleRawChange}
              />
              {form.parsed && (
                <div className="parse-preview">
                  <span className="parse-chip" style={{ background: catMeta.bg, color: catMeta.color }}>
                    {catMeta.emoji} {catMeta.label}
                  </span>
                  <span className="parse-desc">{form.description}</span>
                  <span className="parse-amount" style={{ color: kindColor }}>
                    {form.amount} ₴
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="field">
            <label className="field-label">Description</label>
            <input
              className="input"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Description"
              ref={isEdit ? inputRef : undefined}
            />
          </div>

          <div className="field-row">
            <div className="field" style={{ flex: 1 }}>
              <label className="field-label">Amount (₴)</label>
              <input
                className="input"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label className="field-label">Date</label>
              <input
                className="input"
                type="date"
                value={form.occurred_on}
                onChange={(e) => set("occurred_on", e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="field-label">Category</label>
            <div className="category-grid">
              {CATEGORIES.map((cat) => {
                const m = CATEGORY_META[cat];
                const active = form.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`cat-pill${active ? " cat-pill--active" : ""}`}
                    style={active ? { background: m.bg, color: m.color, borderColor: m.color } : {}}
                    onClick={() => set("category", cat)}
                  >
                    {m.emoji} {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <div className="field-error">{error}</div>}

          <button type="submit" className="btn-primary" style={{ background: kindColor }}>
            {isEdit ? "Save changes" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
}
