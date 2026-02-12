import { useState, useEffect } from 'react';
import { CommunityStat, ApiResponse } from '@/types/database';

interface UseCommunityStatsReturn {
  stats: CommunityStat[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCommunityStats(): UseCommunityStatsReturn {
  const [stats, setStats] = useState<CommunityStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/community/stats');
      const data: ApiResponse<CommunityStat[]> = await response.json();

      if (data.data) {
        setStats(data.data);
      } else {
        setError(data.error || 'Failed to fetch community stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}