import { useState, useEffect } from 'react';
import { pb, GalleryAsset } from '../lib/pocketbase';

export function useGallery(featuredOnly = false) {
  const [assets, setAssets] = useState<GalleryAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filter = featuredOnly ? 'is_featured=true' : '';
    pb.collection('gallery_assets')
      .getFullList({ sort: '+sort_order', filter })
      .then((res) => setAssets(res as unknown as GalleryAsset[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [featuredOnly]);

  return { assets, loading };
}
