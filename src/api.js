const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3002/api/v1";

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.errors?.join(", ") || "Request failed");
  return data;
}

export const api = {
  getTransactions: (year, month) =>
    req("GET", `/transactions?year=${year}&month=${month}`),
  createTransaction: (attrs) =>
    req("POST", "/transactions", { transaction: attrs }),
  updateTransaction: (id, attrs) =>
    req("PATCH", `/transactions/${id}`, { transaction: attrs }),
  deleteTransaction: (id) =>
    req("DELETE", `/transactions/${id}`),
};
