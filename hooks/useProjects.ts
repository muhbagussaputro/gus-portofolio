import { useState, useEffect } from 'react';
import { ProjectWithDetails, ApiResponse, PaginatedResponse } from '@/types/database';

interface UseProjectsOptions {
  category?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
  search?: string;
}

interface UseProjectsReturn {
  projects: ProjectWithDetails[];
  loading: boolean;
  error: string | null;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  refetch: () => void;
}

export function useProjects(options: UseProjectsOptions = {}): UseProjectsReturn {
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      if (options.category) params.append('category', options.category);
      if (options.featured) params.append('featured', 'true');
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.page) params.append('page', options.page.toString());
      if (options.search) params.append('search', options.search);

      const response = await fetch(`/api/projects?${params}`);
      const data: PaginatedResponse<ProjectWithDetails> = await response.json();

      if (data.data) {
        setProjects(data.data);
        setPagination(data.pagination);
      } else {
        setError('Failed to fetch projects');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [options.category, options.featured, options.limit, options.page, options.search]);

  return {
    projects,
    loading,
    error,
    pagination,
    refetch: fetchProjects,
  };
}

export function useProject(slug: string) {
  const [project, setProject] = useState<ProjectWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/projects/${slug}`);
        const data: ApiResponse<ProjectWithDetails> = await response.json();

        if (data.data) {
          setProject(data.data);
        } else {
          setError(data.error || 'Project not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  return { project, loading, error };
}