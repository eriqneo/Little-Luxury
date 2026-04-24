import { useState, useEffect } from 'react';
import { pb, Reservation } from '../lib/pocketbase';

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Initial fetch — requestKey: null prevents SDK auto-cancellation
    pb.collection('reservations')
      .getFullList({ sort: '-created', requestKey: null })
      .then((res) => {
        if (!cancelled) setReservations(res as unknown as Reservation[]);
      })
      .catch((err) => {
        if (err?.isAbort) return; // Silently ignore auto-cancellations
        console.error('useReservations error:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // 🔴 Real-time subscription — calendar updates instantly when admin books a date
    pb.collection('reservations').subscribe('*', ({ action, record }) => {
      if (cancelled) return;
      setReservations(prev => {
        if (action === 'create') return [...prev, record as unknown as Reservation];
        if (action === 'update') return prev.map(r => r.id === record.id ? record as unknown as Reservation : r);
        if (action === 'delete') return prev.filter(r => r.id !== record.id);
        return prev;
      });
    }).catch(() => {
      // PocketHost realtime may not work on all plans — fail silently
    });

    return () => {
      cancelled = true;
      pb.collection('reservations').unsubscribe('*');
    };
  }, []);

  return { reservations, loading };
}
