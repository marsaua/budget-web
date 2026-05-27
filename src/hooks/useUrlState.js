import { useState, useEffect, useRef } from "react";

function toggle(set, item) {
  const next = new Set(set);
  next.has(item) ? next.delete(item) : next.add(item);
  return next;
}

function parseUrl() {
  const p = new URLSearchParams(window.location.search);
  const now = new Date();
  const roomParam = p.get("room");
  const catParam = p.get("cat");
  const pageParam = parseInt(p.get("page"), 10);
  return {
    roomId:     roomParam ? parseInt(roomParam, 10) : null,
    year:       parseInt(p.get("year"), 10) || now.getFullYear(),
    month:      parseInt(p.get("month"), 10) || now.getMonth() + 1,
    categories: catParam ? new Set(catParam.split(",").filter(Boolean)) : new Set(),
    page:       pageParam > 0 ? pageParam : 1,
  };
}

function buildUrl(state) {
  const p = new URLSearchParams();
  if (state.roomId != null) p.set("room", state.roomId);
  p.set("year", state.year);
  p.set("month", state.month);
  if (state.categories.size > 0) p.set("cat", [...state.categories].sort().join(","));
  if (state.page > 1) p.set("page", state.page);
  const qs = p.toString();
  return qs ? `?${qs}` : window.location.pathname;
}

export function useUrlState() {
  const [state, setState] = useState(() => parseUrl());
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const onPop = () => setState(parseUrl());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function push(next) {
    setState(next);
    history.pushState(null, "", buildUrl(next));
  }

  return {
    ...state,
    setRoom:         (roomId) => push({ ...stateRef.current, roomId, page: 1, categories: new Set() }),
    setMonth:        (y, m)   => push({ ...stateRef.current, year: y, month: m, page: 1, categories: new Set() }),
    toggleCategory:  (cat)    => push({ ...stateRef.current, categories: toggle(stateRef.current.categories, cat), page: 1 }),
    clearCategories: ()       => push({ ...stateRef.current, categories: new Set(), page: 1 }),
    setPage:         (page)   => push({ ...stateRef.current, page }),
  };
}
