import { useState } from "react";
import { X } from "lucide-react";

export function InviteModal({ onInvite, onClose }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return setError("Email is required");
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const msg = await onInvite(email.trim());
      setSuccess(msg || "Invitation sent!");
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal-overlay modal-overlay--center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-sheet modal-sheet--center animate-in">
        <div className="modal-header">
          <span className="modal-title">Invite member</span>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="field">
            <label className="field-label">Email address</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@example.com"
              autoFocus
            />
          </div>

          {error && <div className="field-error">{error}</div>}
          {success && <div className="field-success">{success}</div>}

          <button
            type="submit"
            className="btn-primary"
            style={{ background: "var(--color-primary)" }}
            disabled={loading}
          >
            {loading ? "…" : "Send invite"}
          </button>
        </form>
      </div>
    </div>
  );
}
