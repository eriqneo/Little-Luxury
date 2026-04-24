import { useState, useEffect } from 'react';
import { pb, SiteSettings } from '../lib/pocketbase';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection('site_settings')
      .getList(1, 1, { requestKey: null })                           // more reliable than getFirstListItem
      .then(res => {
        if (res.items.length > 0) {
          setSettings(res.items[0] as unknown as SiteSettings);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}
