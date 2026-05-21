import { useRef, useEffect } from "react";
import { UserPlus, LogOut, Settings } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function Header({ selectedYear, selectedMonth, onChange, roomName, user, onSignOut, onInvite, isOwner, onSettings }) {
  const scrollRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  // Build list of (year, month) tabs — 24 months centred on current
  const tabs = [];
  for (const y of years) {
    for (let m = 1; m <= 12; m++) {
      tabs.push({ year: y, month: m });
    }
  }

  const activeIdx = tabs.findIndex(
    (t) => t.year === selectedYear && t.month === selectedMonth
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const active = el.children[activeIdx];
    if (active) {
      active.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
    }
  }, [activeIdx]);

  return (
    <header className="header">
      <div className="header-top">
        <span className="header-logo">{roomName ?? "Budget"}</span>
        <div className="header-right">
          {user && <span className="header-user">{user.name}</span>}
          {isOwner && onSettings && (
            <button className="header-icon-btn" onClick={onSettings} aria-label="Room settings">
              <Settings size={17} />
            </button>
          )}
          {onInvite && (
            <button className="header-icon-btn" onClick={onInvite} aria-label="Invite member">
              <UserPlus size={17} />
            </button>
          )}
          {onSignOut && (
            <button
              className="header-icon-btn"
              onClick={() => window.confirm("Sign out?") && onSignOut()}
              aria-label="Sign out"
            >
              <LogOut size={17} />
            </button>
          )}
        </div>
      </div>
      <div className="month-tabs-wrap">
        <div className="month-tabs" ref={scrollRef}>
          {tabs.map((t, i) => {
            const isActive = i === activeIdx;
            const label = t.year !== currentYear
              ? `${MONTHS[t.month - 1].slice(0, 3)} ${t.year}`
              : MONTHS[t.month - 1].slice(0, 3);
            return (
              <button
                key={i}
                className={`month-tab${isActive ? " month-tab--active" : ""}`}
                onClick={() => onChange(t.year, t.month)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
