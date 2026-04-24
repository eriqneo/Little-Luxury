import { useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';

export interface Award {
  id: string;
  title: string;
  sort_order: number;
  is_active: boolean;
}

export function useAwards() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    pb.collection('awards')
      .getFullList<Award>({
        sort: 'sort_order',
        requestKey: null,   // disables auto-cancellation
      })
      .then((res) => {
        console.log('[useAwards] fetched:', res);
        setAwards(res.filter(a => a.is_active !== false));
      })
      .catch((err) => {
        console.error('[useAwards] error:', err);
        setError(err?.message ?? 'Unknown error');
      })
      .finally(() => setLoading(false));
  }, []);

  return { awards, loading, error };
}
