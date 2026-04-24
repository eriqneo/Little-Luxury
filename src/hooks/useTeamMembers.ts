import { useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';

export interface TeamMember {
  id: string;
  collectionId: string;
  name: string;
  role: string;
  bio: string;
  photo: string;      // file token
  sort_order: number;
  is_active: boolean;
}

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    pb.collection('team_members')
      .getFullList<TeamMember>({
        sort: 'sort_order',
        requestKey: null,   // disables auto-cancellation
      })
      .then((res) => {
        console.log('[useTeamMembers] fetched:', res);
        // Filter is_active on the client side to avoid PocketBase Bool type issues
        setMembers(res.filter(m => m.is_active !== false));
      })
      .catch((err) => {
        console.error('[useTeamMembers] error:', err);
        setError(err?.message ?? 'Unknown error');
      })
      .finally(() => setLoading(false));
  }, []);

  return { members, loading, error };
}
