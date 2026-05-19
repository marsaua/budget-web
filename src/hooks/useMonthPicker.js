import { useState, useCallback } from "react";

export function useMonthPicker() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const onChange = useCallback((y, m) => {
    setYear(y);
    setMonth(m);
  }, []);

  return { year, month, onChange };
}
