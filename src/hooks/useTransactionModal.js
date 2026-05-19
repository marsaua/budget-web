import { useState, useCallback } from "react";

export function useTransactionModal() {
  const [modal, setModal] = useState(null);

  const openAdd = useCallback((kind = "expense") => {
    setModal({ mode: "add", kind });
  }, []);

  const openEdit = useCallback((transaction) => {
    setModal({ mode: "edit", prefill: transaction });
  }, []);

  const close = useCallback(() => setModal(null), []);

  return { modal, openAdd, openEdit, close };
}
