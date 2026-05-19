import { useState, useEffect, useCallback } from "react";
import { api } from "../api";

export function useRoom(enabled) {
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    let active = true;

    api.getRooms()
      .then((data) => {
        if (!active) return;
        setRooms(data);
        if (data.length === 1) setRoom(data[0]);
        setLoading(false);
      })
      .catch(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [enabled]);

  const selectRoom = useCallback((r) => setRoom(r), []);

  const createRoom = useCallback(async (name) => {
    const r = await api.createRoom(name);
    setRooms((prev) => [...prev, r]);
    setRoom(r);
  }, []);

  return { room, rooms, loading, selectRoom, createRoom };
}
