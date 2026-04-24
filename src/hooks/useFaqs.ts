import { useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';

export interface Faq {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

export function useFaqs() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection('faqs')
      .getFullList<Faq>({
        sort: 'sort_order',
        requestKey: null,
      })
      .then((res) => {
        console.log('[useFaqs] fetched:', res);
        setFaqs(res.filter(f => f.is_active !== false));
      })
      .catch((err) => {
        console.error('[useFaqs] error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { faqs, loading };
}
