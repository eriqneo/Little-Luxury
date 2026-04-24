import { useState, useEffect } from 'react';
import { pb, Room } from '../lib/pocketbase';

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    pb.collection('rooms')
      .getFullList({ sort: '+sort_order', requestKey: null })
      .then((res) => {
        if (!cancelled) setRooms(res as unknown as Room[]);
      })
      .catch((err) => {
        // Silently ignore auto-cancellations
        if (err?.isAbort) return;
        console.error('useRooms error:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { rooms, loading };
}
