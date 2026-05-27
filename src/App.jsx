import { useState, useEffect } from "react";
import { api } from "./api";
import { useAuth } from "./hooks/useAuth";
import { useRoom } from "./hooks/useRoom";
import { useUrlState } from "./hooks/useUrlState";
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
import { CategoryFilter } from "./components/CategoryFilter";
import { Pagination } from "./components/Pagination";

export default function App() {
  const { user, isAuthenticated, signIn, signUp, signOut } = useAuth();
  const urlState = useUrlState();
  const { room, rooms, loading: roomLoading, roomNotFound, createRoom, renameRoom } =
    useRoom(urlState.roomId, isAuthenticated, urlState.setRoom);
  const { transactions, summary, pagination, loading, create, update, remove } =
    useTransactions(room?.id, urlState.year, urlState.month, urlState.categories, urlState.page);
  const { modal, openAdd, openEdit, close } = useTransactionModal();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [roomError, setRoomError] = useState(null);

  useEffect(() => {
    if (roomNotFound) {
      setRoomError("Room not found or access denied."); // eslint-disable-line react-hooks/set-state-in-effect
      urlState.setRoom(null);
    }
  }, [roomNotFound]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (room != null) setRoomError(null); // eslint-disable-line react-hooks/set-state-in-effect
  }, [room]);

  const isOwner = !!user && !!room && user.id === room.owner_id;

  if (!isAuthenticated) {
    return <AuthPage onSignIn={signIn} onSignUp={signUp} />;
  }

  if (roomLoading) {
    return (
      <div className="loader" style={{ paddingTop: "40vh" }}>
        Loading…
      </div>
    );
  }

  if (!room) {
    return (
      <RoomSelector
        rooms={rooms}
        onSelect={(r) => urlState.setRoom(r.id)}
        onCreate={async (name) => {
          const r = await createRoom(name);
          urlState.setRoom(r.id);
        }}
        notice={roomError}
      />
    );
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
        selectedYear={urlState.year}
        selectedMonth={urlState.month}
        onChange={urlState.setMonth}
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
            <DonutChart summary={summary} />

            <div className="balance-bar">
              <span>
                Income{" "}
                <strong style={{ color: "var(--color-income)" }}>
                  +{summary.income.toLocaleString("uk-UA")} ₴
                </strong>
              </span>
              <span className="balance-divider">|</span>
              <span>
                Expenses{" "}
                <strong style={{ color: "var(--color-expense)" }}>
                  −{summary.expense.toLocaleString("uk-UA")} ₴
                </strong>
              </span>
            </div>

            <div className="fab-row">
              <button
                className="fab fab--remove"
                onClick={() => openAdd("expense")}
                aria-label="Add expense"
              >
                −
              </button>
              <button
                className="fab fab--add"
                onClick={() => openAdd("income")}
                aria-label="Add income"
              >
                +
              </button>
            </div>

            <CategoryFilter
              selected={urlState.categories}
              onToggle={urlState.toggleCategory}
              onClear={urlState.clearCategories}
            />

            <TransactionList
              transactions={transactions}
              onEdit={openEdit}
              onDelete={handleDelete}
            />

            <Pagination
              page={pagination.page}
              totalPages={pagination.total_pages}
              onPage={urlState.setPage}
            />
          </>
        )}
      </main>

      {inviteOpen && (
        <InviteModal
          onInvite={handleInvite}
          onClose={() => setInviteOpen(false)}
        />
      )}

      {settingsOpen && (
        <RoomSettingsModal
          room={room}
          onClose={() => setSettingsOpen(false)}
          onRename={(newName) => {
            renameRoom(newName);
            setSettingsOpen(false);
          }}
          onDelete={() => {
            urlState.setRoom(null);
            setSettingsOpen(false);
          }}
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
