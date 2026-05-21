import { Pencil, Trash2 } from "lucide-react";
import { CATEGORY_META } from "../constants";

export function TransactionRow({ transaction, onEdit, onDelete }) {
  const meta = CATEGORY_META[transaction.category] || CATEGORY_META.other;
  const isIncome = transaction.kind === "income";
  const sign = isIncome ? "+" : "−";
  const amountColor = isIncome ? "var(--color-income)" : "var(--color-expense)";

  return (
    <div className="transaction-row animate-in">
      <div className="cat-icon" style={{ background: meta.bg }}>
        <span style={{ fontSize: 18 }}>{meta.emoji}</span>
      </div>
      <div className="transaction-info">
        <span className="transaction-label">{transaction.description}</span>
        <span className="transaction-category" style={{ color: meta.color }}>
          {meta.label} · {new Date(transaction.occurred_on + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
        </span>
        {transaction.author?.name && (
          <span className="transaction-author">by {transaction.author.name}</span>
        )}
      </div>
      <div className="transaction-right">
        <span className="transaction-amount" style={{ color: amountColor }}>
          {sign}{transaction.amount.toLocaleString("uk-UA")} ₴
        </span>
        <div className="transaction-actions">
          <button className="action-btn" onClick={() => onEdit(transaction)} aria-label="Edit">
            <Pencil size={14} />
          </button>
          <button className="action-btn action-btn--danger" onClick={() => onDelete(transaction.id)} aria-label="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
