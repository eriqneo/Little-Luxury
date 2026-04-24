import { useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';

export interface AboutValue {
  id: string;
  title: string;
  body: string;
  sort_order: number;
}

// Roman numeral helper — auto-generated from sort_order (1 → I, 2 → II, 3 → III …)
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
export function toRoman(n: number): string {
  return ROMAN[n - 1] ?? String(n);
}

export function useAboutValues() {
  const [values, setValues] = useState<AboutValue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection('about_values')
      .getFullList<AboutValue>({
        sort: 'sort_order',
        requestKey: null,   // disables auto-cancellation
      })
      .then(setValues)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { values, loading };
}
