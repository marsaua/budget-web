import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { api } from "../api";

export function RoomSettingsModal({ room, onClose, onRename, onDelete }) {
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [renameValue, setRenameValue] = useState(room.name);
  const [renameLoading, setRenameLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getMembers(room.id)
      .then(setMembers)
      .catch((err) => setError(err.message))
      .finally(() => setLoadingMembers(false));
  }, [room.id]);

  async function handleRemoveMember(membershipId) {
    try {
      await api.removeMember(room.id, membershipId);
      setMembers((prev) => prev.filter((m) => m.id !== membershipId));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRename() {
    const name = renameValue.trim();
    if (!name || name === room.name) return;
    setRenameLoading(true);
    setError("");
    try {
      await api.updateRoom(room.id, { name });
      onRename(name);
    } catch (err) {
      setError(err.message);
    } finally {
      setRenameLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete room "${room.name}" and all transactions? This cannot be undone.`)) return;
    setDeleteLoading(true);
    setError("");
    try {
      await api.deleteRoom(room.id);
      onDelete();
    } catch (err) {
      setError(err.message);
      setDeleteLoading(false);
    }
  }

  return (
    <div
      className="modal-overlay modal-overlay--center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-sheet modal-sheet--center animate-in">
        <div className="modal-header">
          <span className="modal-title">Room settings</span>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-form">
          {/* Members */}
          <div className="settings-section">
            <div className="settings-section-title">Members</div>
            {loadingMembers ? (
              <div style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>Loading…</div>
            ) : (
              members.map((m) => (
                <div key={m.id} className="member-row">
                  <span className="member-name">{m.name}</span>
                  <span
                    className="member-role-badge"
                    style={
                      m.role === "owner"
                        ? { background: "var(--color-primary-light)", color: "var(--color-primary)" }
                        : { background: "var(--color-bg)", color: "var(--color-text-secondary)" }
                    }
                  >
                    {m.role}
                  </span>
                  <div className="member-stats">
                    <span style={{ color: "var(--color-expense)" }}>
                      −{m.total_expense.toLocaleString("uk-UA")} ₴
                    </span>
                    <span style={{ color: "var(--color-income)" }}>
                      +{m.total_income.toLocaleString("uk-UA")} ₴
                    </span>
                  </div>
                  {m.role !== "owner" && (
                    <button
                      className="member-remove-btn"
                      onClick={() => handleRemoveMember(m.id)}
                      aria-label={`Remove ${m.name}`}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Rename */}
          <div className="settings-section">
            <div className="settings-section-title">Room name</div>
            <div className="settings-save-row">
              <input
                className="input"
                style={{ flex: 1 }}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
              />
              <button
                className="btn-primary"
                style={{
                  width: "auto",
                  flexShrink: 0,
                  height: 48,
                  padding: "0 18px",
                  fontSize: 15,
                  background: "var(--color-primary)",
                }}
                onClick={handleRename}
                disabled={renameLoading || !renameValue.trim() || renameValue.trim() === room.name}
              >
                {renameLoading ? "…" : "Save"}
              </button>
            </div>
            {error && <div className="field-error" style={{ marginTop: 8 }}>{error}</div>}
          </div>

          {/* Danger zone */}
          <div className="settings-section" style={{ marginBottom: 0 }}>
            <div className="settings-danger-title">Danger zone</div>
            <button
              className="btn-danger-outline"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting…" : "Delete room"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
