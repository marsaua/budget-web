import { useState } from "react";
import { api } from "./api";
import { useAuth } from "./hooks/useAuth";
import { useRoom } from "./hooks/useRoom";
import { useMonthPicker } from "./hooks/useMonthPicker";
import { useTransactions } from "./hooks/useTransactions";
import { useTransactionModal } from "./hooks/useTransactionModal";
import { AuthPage } from "./components/AuthPage";
import { RoomSelector } from "./components/RoomSelector";
import { Header } from "./components/Header";
import { DonutChart } from "./components/DonutChart";
import { TransactionList } from "./components/TransactionList";
import { TransactionModal } from "./components/TransactionModal";
import { InviteModal } from "./components/InviteModal";
import { RoomSettingsModal } from "./components/RoomSettingsModal";

export default function App() {
  const { user, isAuthenticated, signIn, signUp, signOut } = useAuth();
  const { room, rooms, loading: roomLoading, selectRoom, createRoom, renameRoom, clearRoom } = useRoom(isAuthenticated);
  const { year, month, onChange } = useMonthPicker();
  const { transactions, summary, loading, create, update, remove } = useTransactions(room?.id, year, month);
  const { modal, openAdd, openEdit, close } = useTransactionModal();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isOwner = !!user && !!room && user.id === room.owner_id;

  if (!isAuthenticated) {
    return <AuthPage onSignIn={signIn} onSignUp={signUp} />;
  }

  if (roomLoading) {
    return <div className="loader" style={{ paddingTop: "40vh" }}>Loading…</div>;
  }

  if (!room) {
    return <RoomSelector rooms={rooms} onSelect={selectRoom} onCreate={createRoom} />;
  }

  async function handleInvite(email) {
    const res = await api.inviteMember(room.id, email);
    return res.message;
  }

  async function handleSave(attrs) {
    if (modal.mode === "edit") {
      await update(modal.prefill.id, attrs);
    } else {
      await create(attrs);
    }
    close();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this transaction?")) return;
    await remove(id);
  }

  return (
    <div className="app">
      <Header
        selectedYear={year}
        selectedMonth={month}
        onChange={onChange}
        roomName={room.name}
        user={user}
        onInvite={() => setInviteOpen(true)}
        onSignOut={signOut}
        isOwner={isOwner}
        onSettings={() => setSettingsOpen(true)}
      />

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
              <button className="fab fab--remove" onClick={() => openAdd("expense")} aria-label="Add expense">−</button>
              <button className="fab fab--add" onClick={() => openAdd("income")} aria-label="Add income">+</button>
            </div>

            <TransactionList transactions={transactions} onEdit={openEdit} onDelete={handleDelete} />
          </>
        )}
      </main>

      {inviteOpen && (
        <InviteModal onInvite={handleInvite} onClose={() => setInviteOpen(false)} />
      )}

      {settingsOpen && (
        <RoomSettingsModal
          room={room}
          onClose={() => setSettingsOpen(false)}
          onRename={(newName) => { renameRoom(newName); setSettingsOpen(false); }}
          onDelete={() => { clearRoom(); setSettingsOpen(false); }}
        />
      )}

      {modal && (
        <TransactionModal
          mode={modal.mode}
          initialKind={modal.kind ?? "expense"}
          prefill={modal.prefill}
          onSave={handleSave}
          onClose={close}
        />
      )}
    </div>
  );
}
