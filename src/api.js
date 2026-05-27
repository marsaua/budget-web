const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3002/api/v1";

function getToken() {
  return localStorage.getItem("auth_token");
}

async function req(method, path, body) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    window.dispatchEvent(new Event("auth:expired"));
    throw new Error("Session expired");
  }

  if (res.status === 204) return null;

  const data = await res.json();
  if (!res.ok) throw new Error(data.errors?.join(", ") || data.error || "Request failed");
  return data;
}

async function authReq(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const token = res.headers.get("Authorization")?.replace("Bearer ", "") ?? null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.errors?.join(", ") || data.error || "Request failed");
  return { user: data.user, token };
}

export const api = {
  // Auth
  signIn: (email, password) =>
    authReq("/auth/sign_in", { user: { email, password } }),
  signUp: (name, email, password) =>
    authReq("/auth/sign_up", { user: { name, email, password } }),
  signOut: () => req("DELETE", "/auth/sign_out"),

  // Rooms
  getRooms: () => req("GET", "/rooms"),
  createRoom: (name) => req("POST", "/rooms", { room: { name } }),
  inviteMember: (roomId, email) =>
    req("POST", `/rooms/${roomId}/invitations`, { invitation: { email } }),
  getMembers: (roomId) => req("GET", `/rooms/${roomId}/members`),
  removeMember: (roomId, membershipId) => req("DELETE", `/rooms/${roomId}/members/${membershipId}`),
  updateRoom: (roomId, attrs) => req("PATCH", `/rooms/${roomId}`, { room: attrs }),
  deleteRoom: (roomId) => req("DELETE", `/rooms/${roomId}`),

  // Transactions (room-scoped)
  getTransactions: (roomId, year, month, categories = [], page = 1) => {
    const params = new URLSearchParams({ year, month, page });
    for (const cat of categories.filter(Boolean)) params.append("categories[]", cat);
    return req("GET", `/rooms/${roomId}/transactions?${params}`);
  },
  createTransaction: (roomId, attrs) =>
    req("POST", `/rooms/${roomId}/transactions`, { transaction: attrs }),
  updateTransaction: (roomId, id, attrs) =>
    req("PATCH", `/rooms/${roomId}/transactions/${id}`, { transaction: attrs }),
  deleteTransaction: (roomId, id) =>
    req("DELETE", `/rooms/${roomId}/transactions/${id}`),
};
