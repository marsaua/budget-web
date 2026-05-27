import { useState } from "react";

export function RoomSelector({ rooms, onSelect, onCreate, notice }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return setError("Room name is required");
    setError("");
    setLoading(true);
    try {
      await onCreate(name.trim());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">Budget</div>

        {notice && <div className="field-error">{notice}</div>}

        {rooms.length > 0 && (
          <>
            <p className="field-label" style={{ marginBottom: 10 }}>Your rooms</p>
            <div className="room-list">
              {rooms.map((r) => (
                <button key={r.id} className="room-item" onClick={() => onSelect(r)}>
                  <span className="room-item-name">{r.name}</span>
                  <span className="room-item-meta">{r.members_count} member{r.members_count !== 1 ? "s" : ""}</span>
                </button>
              ))}
            </div>
            <div className="auth-divider">or create a new one</div>
          </>
        )}

        <form onSubmit={handleCreate} className="modal-form">
          <div className="field">
            <label className="field-label">
              {rooms.length === 0 ? "Create your family room" : "New room"}
            </label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Family Budget"
              autoFocus
            />
          </div>

          {error && <div className="field-error">{error}</div>}

          <button
            type="submit"
            className="btn-primary"
            style={{ background: "var(--color-primary)" }}
            disabled={loading}
          >
            {loading ? "…" : "Create room"}
          </button>
        </form>
      </div>
    </div>
  );
}
