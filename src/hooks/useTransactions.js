import { useState, useEffect, useCallback } from "react";
import { api } from "../api";

const DEFAULT_SUMMARY    = { income: 0, expense: 0, balance: 0 };
const DEFAULT_PAGINATION = { page: 1, per_page: 20, total: 0, total_pages: 1 };

export function useTransactions(roomId, year, month, categories, page) {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary]           = useState(DEFAULT_SUMMARY);
  const [pagination, setPagination]     = useState(DEFAULT_PAGINATION);
  const [tick, setTick]                 = useState(0);

  const invalidate = useCallback(() => setTick((t) => t + 1), []);

  const categoriesKey = categories ? [...categories].sort().join(",") : "";
  const fetchKey = roomId
    ? `${roomId}:${year}:${month}:${page}:${tick}:${categoriesKey}`
    : null;
  const [resolvedKey, setResolvedKey] = useState(null);
  const loading = fetchKey !== resolvedKey;

  useEffect(() => {
    if (!fetchKey) return;
    let active = true;

    const cats = categoriesKey ? categoriesKey.split(",") : [];
    api
      .getTransactions(roomId, year, month, cats, page)
      .then((data) => {
        if (!active) return;
        setTransactions(data.transactions);
        setSummary(data.summary);
        setPagination(data.pagination);
        setResolvedKey(fetchKey);
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
        setResolvedKey(fetchKey);
      });

    return () => { active = false; };
  }, [fetchKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const create = useCallback(
    async (attrs) => { await api.createTransaction(roomId, attrs); invalidate(); },
    [roomId, invalidate]
  );

  const update = useCallback(
    async (id, attrs) => { await api.updateTransaction(roomId, id, attrs); invalidate(); },
    [roomId, invalidate]
  );

  const remove = useCallback(
    async (id) => { await api.deleteTransaction(roomId, id); invalidate(); },
    [roomId, invalidate]
  );

  return { transactions, summary, pagination, loading, create, update, remove };
}
