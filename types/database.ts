// =================================================================
// DATABASE TYPES FOR SUPABASE
// =================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          headline: string | null;
          summary: string | null;
          email: string | null;
          phone: string | null;
          location: string | null;
          github_url: string | null;
          linkedin_url: string | null;
          twitter_url: string | null;
          website_url: string | null;
          hero_strings: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          headline?: string | null;
          summary?: string | null;
          email?: string | null;
          phone?: string | null;
          location?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          twitter_url?: string | null;
          website_url?: string | null;
          hero_strings?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          headline?: string | null;
          summary?: string | null;
          email?: string | null;
          phone?: string | null;
          location?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          twitter_url?: string | null;
          website_url?: string | null;
          hero_strings?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      education: {
        Row: {
          id: string;
          institution: string;
          degree: string;
          field_of_study: string | null;
          start_date: string;
          end_date: string | null;
          gpa: number | null;
          description: string | null;
          logo_url: string | null;
          is_current: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          institution: string;
          degree: string;
          field_of_study?: string | null;
          start_date: string;
          end_date?: string | null;
          gpa?: number | null;
          description?: string | null;
          logo_url?: string | null;
          is_current?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          institution?: string;
          degree?: string;
          field_of_study?: string | null;
          start_date?: string;
          end_date?: string | null;
          gpa?: number | null;
          description?: string | null;
          logo_url?: string | null;
          is_current?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      experience: {
        Row: {
          id: string;
          title: string;
          company: string;
          location: string | null;
          start_date: string;
          end_date: string | null;
          description: string | null;
          company_logo_url: string | null;
          is_current: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          company: string;
          location?: string | null;
          start_date: string;
          end_date?: string | null;
          description?: string | null;
          company_logo_url?: string | null;
          is_current?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          company?: string;
          location?: string | null;
          start_date?: string;
          end_date?: string | null;
          description?: string | null;
          company_logo_url?: string | null;
          is_current?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      skill_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon_name: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon_name?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon_name?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category_id: string | null;
          proficiency_level: number;
          icon_url: string | null;
          icon_name: string | null;
          years_experience: number;
          description: string | null;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category_id?: string | null;
          proficiency_level?: number;
          icon_url?: string | null;
          icon_name?: string | null;
          years_experience?: number;
          description?: string | null;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category_id?: string | null;
          proficiency_level?: number;
          icon_url?: string | null;
          icon_name?: string | null;
          years_experience?: number;
          description?: string | null;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      project_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          color: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          color?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          color?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_description: string | null;
          detailed_description: string | null;
          category_id: string | null;
          status: 'planning' | 'development' | 'completed' | 'maintenance';
          demo_url: string | null;
          github_url: string | null;
          case_study_url: string | null;
          thumbnail_url: string | null;
          gallery_images: string[] | null;
          video_demo_url: string | null;
          start_date: string | null;
          end_date: string | null;
          client_name: string | null;
          team_size: number | null;
          my_role: string | null;
          featured: boolean;
          is_published: boolean;
          view_count: number;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          short_description?: string | null;
          detailed_description?: string | null;
          category_id?: string | null;
          status?: 'planning' | 'development' | 'completed' | 'maintenance';
          demo_url?: string | null;
          github_url?: string | null;
          case_study_url?: string | null;
          thumbnail_url?: string | null;
          gallery_images?: string[] | null;
          video_demo_url?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          client_name?: string | null;
          team_size?: number | null;
          my_role?: string | null;
          featured?: boolean;
          is_published?: boolean;
          view_count?: number;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          short_description?: string | null;
          detailed_description?: string | null;
          category_id?: string | null;
          status?: 'planning' | 'development' | 'completed' | 'maintenance';
          demo_url?: string | null;
          github_url?: string | null;
          case_study_url?: string | null;
          thumbnail_url?: string | null;
          gallery_images?: string[] | null;
          video_demo_url?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          client_name?: string | null;
          team_size?: number | null;
          my_role?: string | null;
          featured?: boolean;
          is_published?: boolean;
          view_count?: number;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      technologies: {
        Row: {
          id: string;
          name: string;
          category: string | null;
          icon_url: string | null;
          color: string | null;
          official_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string | null;
          icon_url?: string | null;
          color?: string | null;
          official_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string | null;
          icon_url?: string | null;
          color?: string | null;
          official_url?: string | null;
          created_at?: string;
        };
      };
      project_technologies: {
        Row: {
          project_id: string;
          technology_id: string;
        };
        Insert: {
          project_id: string;
          technology_id: string;
        };
        Update: {
          project_id?: string;
          technology_id?: string;
        };
      };
      project_features: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      community_stats: {
        Row: {
          id: string;
          label: string;
          value: string;
          icon_name: string | null;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          label: string;
          value: string;
          icon_name?: string | null;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          label?: string;
          value?: string;
          icon_name?: string | null;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          role: string;
          company: string | null;
          content: string;
          rating: number;
          avatar_url: string | null;
          company_logo_url: string | null;
          linkedin_url: string | null;
          email: string | null;
          is_featured: boolean;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          company?: string | null;
          content: string;
          rating?: number;
          avatar_url?: string | null;
          company_logo_url?: string | null;
          linkedin_url?: string | null;
          email?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          company?: string | null;
          content?: string;
          rating?: number;
          avatar_url?: string | null;
          company_logo_url?: string | null;
          linkedin_url?: string | null;
          email?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      community_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          message_type: 'inquiry' | 'collaboration' | 'feedback' | 'other';
          status: 'unread' | 'read' | 'replied' | 'archived';
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          message_type?: 'inquiry' | 'collaboration' | 'feedback' | 'other';
          status?: 'unread' | 'read' | 'replied' | 'archived';
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          message_type?: 'inquiry' | 'collaboration' | 'feedback' | 'other';
          status?: 'unread' | 'read' | 'replied' | 'archived';
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      blog_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          color?: string | null;
          created_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          category_id: string | null;
          featured_image_url: string | null;
          meta_title: string | null;
          meta_description: string | null;
          status: 'draft' | 'published' | 'archived';
          is_featured: boolean;
          view_count: number;
          read_time: number | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          category_id?: string | null;
          featured_image_url?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          status?: 'draft' | 'published' | 'archived';
          is_featured?: boolean;
          view_count?: number;
          read_time?: number | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string;
          category_id?: string | null;
          featured_image_url?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          status?: 'draft' | 'published' | 'archived';
          is_featured?: boolean;
          view_count?: number;
          read_time?: number | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      media_files: {
        Row: {
          id: string;
          filename: string;
          original_filename: string;
          file_path: string;
          file_url: string;
          file_type: string;
          file_size: number;
          width: number | null;
          height: number | null;
          duration: number | null;
          alt_text: string | null;
          caption: string | null;
          tags: string[] | null;
          is_public: boolean;
          uploaded_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          filename: string;
          original_filename: string;
          file_path: string;
          file_url: string;
          file_type: string;
          file_size: number;
          width?: number | null;
          height?: number | null;
          duration?: number | null;
          alt_text?: string | null;
          caption?: string | null;
          tags?: string[] | null;
          is_public?: boolean;
          uploaded_by?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          filename?: string;
          original_filename?: string;
          file_path?: string;
          file_url?: string;
          file_type?: string;
          file_size?: number;
          width?: number | null;
          height?: number | null;
          duration?: number | null;
          alt_text?: string | null;
          caption?: string | null;
          tags?: string[] | null;
          is_public?: boolean;
          uploaded_by?: string;
          created_at?: string;
        };
      };
      homepage_assets: {
        Row: {
          id: string;
          asset_type: string;
          title: string;
          description: string | null;
          file_url: string;
          file_type: string;
          mime_type: string | null;
          file_size: number | null;
          is_active: boolean;
          sort_order: number;
          metadata: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          asset_type: string;
          title: string;
          description?: string | null;
          file_url: string;
          file_type: string;
          mime_type?: string | null;
          file_size?: number | null;
          is_active?: boolean;
          sort_order?: number;
          metadata?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          asset_type?: string;
          title?: string;
          description?: string | null;
          file_url?: string;
          file_type?: string;
          mime_type?: string | null;
          file_size?: number | null;
          is_active?: boolean;
          sort_order?: number;
          metadata?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_project_views: {
        Args: {
          project_id: string;
        };
        Returns: undefined;
      };
      increment_blog_views: {
        Args: {
          post_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types for commonly used data
export type Education = Database['public']['Tables']['education']['Row'];
export type Experience = Database['public']['Tables']['experience']['Row'];
export type Skill = Database['public']['Tables']['skills']['Row'];
export type SkillCategory = Database['public']['Tables']['skill_categories']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectCategory = Database['public']['Tables']['project_categories']['Row'];
export type Technology = Database['public']['Tables']['technologies']['Row'];
export type ProjectFeature = Database['public']['Tables']['project_features']['Row'];
export type CommunityStat = Database['public']['Tables']['community_stats']['Row'];
export type Testimonial = Database['public']['Tables']['testimonials']['Row'];
export type CommunityMessage = Database['public']['Tables']['community_messages']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogCategory = Database['public']['Tables']['blog_categories']['Row'];
export type MediaFile = Database['public']['Tables']['media_files']['Row'];
export type HomepageAsset = Database['public']['Tables']['homepage_assets']['Row'];

// Insert types
export type NewEducation = Database['public']['Tables']['education']['Insert'];
export type NewExperience = Database['public']['Tables']['experience']['Insert'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type NewProfile = Database['public']['Tables']['profiles']['Insert'];
export type NewSkill = Database['public']['Tables']['skills']['Insert'];
export type NewProject = Database['public']['Tables']['projects']['Insert'];
export type NewTestimonial = Database['public']['Tables']['testimonials']['Insert'];
export type NewCommunityMessage = Database['public']['Tables']['community_messages']['Insert'];
export type NewBlogPost = Database['public']['Tables']['blog_posts']['Insert'];
export type NewMediaFile = Database['public']['Tables']['media_files']['Insert'];
export type NewHomepageAsset = Database['public']['Tables']['homepage_assets']['Insert'];

// Enhanced types with relationships
export type ProjectWithDetails = Project & {
  category: ProjectCategory | null;
  technologies: Technology[];
  features: ProjectFeature[];
};

export type SkillWithCategory = Skill & {
  category: SkillCategory | null;
};

export type BlogPostWithCategory = BlogPost & {
  category: BlogCategory | null;
};

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Upload types
export interface UploadResponse {
  success: boolean;
  file_url: string;
  file_path: string;
  filename: string;
  file_size: number;
  file_type: string;
  width?: number;
  height?: number;
  duration?: number;
}

export interface UploadError {
  success: false;
  error: string;
  message: string;
}