import { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { DonutChart } from "./components/DonutChart";
import { TransactionList } from "./components/TransactionList";
import { TransactionModal } from "./components/TransactionModal";
import { api } from "./api";

const now = new Date();

export default function App() {
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { mode: "add"|"edit", kind?: "income"|"expense", prefill?: transaction }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getTransactions(year, month);
      setTransactions(data.transactions);
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => { load(); }, [load]);

  function handleMonthChange(y, m) {
    setYear(y);
    setMonth(m);
  }

  async function handleSave(attrs) {
    if (modal.mode === "edit") {
      await api.updateTransaction(modal.prefill.id, attrs);
    } else {
      await api.createTransaction(attrs);
    }
    setModal(null);
    load();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this transaction?")) return;
    await api.deleteTransaction(id);
    load();
  }

  return (
    <div className="app">
      <Header selectedYear={year} selectedMonth={month} onChange={handleMonthChange} />

      <main className="main-content">
        {loading ? (
          <div className="loader">Loading…</div>
        ) : (
          <>
            <DonutChart transactions={transactions} summary={summary} />

            <div className="balance-bar">
              <span>Income <strong style={{ color: "var(--color-income)" }}>+{summary.income.toLocaleString("uk-UA")} ₴</strong></span>
              <span className="balance-divider">|</span>
              <span>Expenses <strong style={{ color: "var(--color-expense)" }}>−{summary.expense.toLocaleString("uk-UA")} ₴</strong></span>
            </div>

            <div className="fab-row">
              <button
                className="fab fab--remove"
                onClick={() => setModal({ mode: "add", kind: "expense" })}
                aria-label="Add expense"
              >
                −
              </button>
              <button
                className="fab fab--add"
                onClick={() => setModal({ mode: "add", kind: "income" })}
                aria-label="Add income"
              >
                +
              </button>
            </div>

            <TransactionList
              transactions={transactions}
              onEdit={(t) => setModal({ mode: "edit", prefill: t })}
              onDelete={handleDelete}
            />
          </>
        )}
      </main>

      {modal && (
        <TransactionModal
          mode={modal.mode}
          initialKind={modal.kind ?? "expense"}
          prefill={modal.prefill}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
