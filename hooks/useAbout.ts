import { useState, useEffect } from 'react';
import { Education, Experience, SkillWithCategory, ApiResponse, Profile } from '@/types/database';

interface AboutData {
  education: Education[];
  experience: Experience[];
  skills: SkillWithCategory[];
}

interface UseAboutReturn {
  data: AboutData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAbout(): UseAboutReturn {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/about');
      const result: ApiResponse<AboutData> = await response.json();

      if (result.data) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch about data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchAboutData,
  };
}

// Individual hooks for specific sections
export function useEducation() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/about?section=education');
        const result: ApiResponse<Education[]> = await response.json();

        if (result.data) {
          setEducation(result.data);
        } else {
          setError(result.error || 'Failed to fetch education data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  return { education, loading, error };
}

export function useExperience() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/about?section=experience');
        const result: ApiResponse<Experience[]> = await response.json();

        if (result.data) {
          setExperience(result.data);
        } else {
          setError(result.error || 'Failed to fetch experience data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  return { experience, loading, error };
}

export function useSkills() {
  const [skills, setSkills] = useState<SkillWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/about?section=skills');
        const result: ApiResponse<SkillWithCategory[]> = await response.json();

        if (result.data) {
          setSkills(result.data);
        } else {
          setError(result.error || 'Failed to fetch skills data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return { skills, loading, error };
}

// Profile hook for hero/about info
export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/profile');
        const result: ApiResponse<Profile> = await response.json();
        if (result.data) {
          setProfile(result.data);
        } else {
          setError(result.error || 'Failed to fetch profile');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return { profile, loading, error };
}