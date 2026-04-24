import { useState, useEffect } from 'react';
import { pb, Testimonial } from '../lib/pocketbase';

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection('testimonials')
      .getFullList({
        filter: 'is_published = true',
        sort: '-created' // newest first
      })
      .then((res) => setTestimonials(res as unknown as Testimonial[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { testimonials, loading };
}
