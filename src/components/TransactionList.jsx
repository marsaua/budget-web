import { TransactionRow } from "./TransactionRow";

export function TransactionList({ transactions, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <span style={{ fontSize: 40 }}>💸</span>
        <p>No transactions this month</p>
        <p className="empty-sub">Tap + or − to add one</p>
      </div>
    );
  }

  // Group by date
  const grouped = {};
  for (const t of transactions) {
    if (!grouped[t.occurred_on]) grouped[t.occurred_on] = [];
    grouped[t.occurred_on].push(t);
  }

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="transaction-list">
      {sortedDates.map((date) => (
        <div key={date} className="date-group">
          <div className="date-label">
            {new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "long",
            })}
          </div>
          <div className="card transaction-group-card">
            {grouped[date].map((t, i) => (
              <div key={t.id}>
                <TransactionRow transaction={t} onEdit={onEdit} onDelete={onDelete} />
                {i < grouped[date].length - 1 && <div className="row-divider" />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
