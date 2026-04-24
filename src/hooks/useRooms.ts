import { useState, useEffect } from 'react';
import { pb, Room } from '../lib/pocketbase';

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection('rooms')
      .getFullList({ sort: '+sort_order' })
      .then((res) => setRooms(res as unknown as Room[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { rooms, loading };
}
