import { useState, useEffect } from 'react';
import { Testimonial, ApiResponse } from '@/types/database';

interface UseTestimonialsOptions {
  featured?: boolean;
  limit?: number;
}

interface UseTestimonialsReturn {
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTestimonials(options: UseTestimonialsOptions = {}): UseTestimonialsReturn {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      if (options.featured) params.append('featured', 'true');
      if (options.limit) params.append('limit', options.limit.toString());

      const response = await fetch(`/api/testimonials?${params}`);
      const data: ApiResponse<Testimonial[]> = await response.json();

      if (data.data) {
        setTestimonials(data.data);
      } else {
        setError(data.error || 'Failed to fetch testimonials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [options.featured, options.limit]);

  return {
    testimonials,
    loading,
    error,
    refetch: fetchTestimonials,
  };
}