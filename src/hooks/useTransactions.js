import { useState, useEffect, useCallback } from "react";
import { api } from "../api";

const DEFAULT_SUMMARY = { income: 0, expense: 0, balance: 0 };

export function useTransactions(roomId, year, month, categories) {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  const invalidate = useCallback(() => setTick((t) => t + 1), []);

  const categoriesKey = categories ? [...categories].sort().join(",") : "";

  useEffect(() => {
    if (!roomId) return;
    let active = true;
    setLoading(true);

    api
      .getTransactions(roomId, year, month, categoriesKey ? categoriesKey.split(",") : [])
      .then((data) => {
        if (!active) return;
        setTransactions(data.transactions);
        setSummary(data.summary);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
        setLoading(false);
      });

    return () => { active = false; };
  }, [roomId, year, month, tick, categoriesKey]);

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

  return { transactions, summary, loading, create, update, remove };
}
