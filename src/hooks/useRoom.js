import { useState, useEffect, useCallback } from "react";
import { api } from "../api";

export function useRoom(roomId, enabled, onAutoSelect) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    let active = true;

    api.getRooms()
      .then((data) => {
        if (!active) return;
        setRooms(data);
        setLoading(false);
        if (roomId == null && data.length === 1) {
          onAutoSelect(data[0].id);
        }
      })
      .catch(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  const room = rooms.find((r) => r.id === roomId) ?? null;

  const createRoom = useCallback(async (name) => {
    const r = await api.createRoom(name);
    setRooms((prev) => [...prev, r]);
    return r;
  }, []);

  const renameRoom = useCallback((newName) => {
    setRooms((prev) => prev.map((r) => r.id === roomId ? { ...r, name: newName } : r));
  }, [roomId]);

  const roomNotFound = !loading && roomId != null && room === null;
  return { room, rooms, loading, roomNotFound, createRoom, renameRoom };
}
