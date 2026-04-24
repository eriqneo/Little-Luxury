import { useState, useEffect } from 'react';
import { pb, Reservation } from '../lib/pocketbase';

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    pb.collection('reservations')
      .getFullList({ sort: '-created' })
      .then((res) => setReservations(res as unknown as Reservation[]))
      .catch(console.error)
      .finally(() => setLoading(false));

    // 🔴 Real-time subscription — calendar updates instantly when admin books a date
    pb.collection('reservations').subscribe('*', ({ action, record }) => {
      setReservations(prev => {
        if (action === 'create') return [...prev, record as unknown as Reservation];
        if (action === 'update') return prev.map(r => r.id === record.id ? record as unknown as Reservation : r);
        if (action === 'delete') return prev.filter(r => r.id !== record.id);
        return prev;
      });
    });

    return () => {
      pb.collection('reservations').unsubscribe('*');
    };
  }, []);

  return { reservations, loading };
}
