-- =================================================================
-- PORTFOLIO DATABASE SCHEMA FOR SUPABASE
-- =================================================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- =================================================================
-- ABOUT SECTION TABLES
-- =================================================================

-- Basic profile table for homepage hero and about introduction
create table public.profiles (
    id uuid default uuid_generate_v4() primary key,
    full_name varchar(255) not null,
    headline text, -- short title under name
    summary text,  -- introduction paragraph
    email varchar(255),
    phone varchar(50),
    location varchar(255),
    github_url text,
    linkedin_url text,
    twitter_url text,
    website_url text,
    hero_strings text[], -- strings for typewriter on hero
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Education table
create table public.education (
    id uuid default uuid_generate_v4() primary key,
    institution varchar(255) not null,
    degree varchar(255) not null,
    field_of_study varchar(255),
    start_date date not null,
    end_date date,
    gpa decimal(3,2),
    description text,
    logo_url text, -- Cloudflare R2 link
    is_current boolean default false,
    sort_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Experience table
create table public.experience (
    id uuid default uuid_generate_v4() primary key,
    title varchar(255) not null,
    company varchar(255) not null,
    location varchar(255),
    start_date date not null,
    end_date date,
    description text,
    company_logo_url text, -- Cloudflare R2 link
    -- New fields to better categorize CV items (jobs, projects, volunteer, government, cohort)
    experience_type varchar(30) check (experience_type in ('job','internship','project','volunteer','organization','government','education_program')) default 'job',
    reference_url text,
    is_current boolean default false,
    sort_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Skills categories
create table public.skill_categories (
    id uuid default uuid_generate_v4() primary key,
    name varchar(100) not null unique,
    description text,
    icon_name varchar(100), -- Lucide icon name
    sort_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Skills table
create table public.skills (
    id uuid default uuid_generate_v4() primary key,
    name varchar(100) not null,
    category_id uuid references public.skill_categories(id) on delete cascade,
    proficiency_level integer check (proficiency_level >= 1 and proficiency_level <= 5) default 3,
    icon_url text, -- Cloudflare R2 link for custom icons
    icon_name varchar(100), -- Lucide icon name
    years_experience integer default 0,
    description text,
    is_featured boolean default false,
    sort_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Certifications table (licenses & certifications)
create table public.certifications (
    id uuid default uuid_generate_v4() primary key,
    title varchar(255) not null,
    provider varchar(255),
    issue_date date,
    expiration_date date,
    credential_id varchar(255),
    credential_url text,
    description text,
    is_featured boolean default false,
    sort_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =================================================================
-- PORTFOLIO SECTION TABLES
-- =================================================================

-- Project categories
create table public.project_categories (
    id uuid default uuid_generate_v4() primary key,
    name varchar(100) not null unique,
    slug varchar(100) not null unique,
    description text,
    color varchar(7), -- hex color code
    sort_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Projects table
create table public.projects (
    id uuid default uuid_generate_v4() primary key,
    title varchar(255) not null,
    slug varchar(255) not null unique,
    short_description text,
    detailed_description text,
    category_id uuid references public.project_categories(id) on delete set null,
    status varchar(20) check (status in ('planning', 'development', 'completed', 'maintenance')) default 'completed',
    
    -- URLs and links
    demo_url text,
    github_url text,
    case_study_url text,
    
    -- Media
    thumbnail_url text, -- Cloudflare R2 link
    gallery_images text[], -- Array of Cloudflare R2 links
    video_demo_url text, -- Cloudflare R2 link
    
    -- Project details
    start_date date,
    end_date date,
    client_name varchar(255),
    team_size integer,
    my_role varchar(255),
    
    -- SEO and display
    featured boolean default false,
    is_published boolean default true,
    view_count integer default 0,
    sort_order integer default 0,
    
    -- Timestamps
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Technologies table
create table public.technologies (
    id uuid default uuid_generate_v4() primary key,
    name varchar(100) not null unique,
    category varchar(100), -- frontend, backend, database, devops, etc.
    icon_url text, -- Cloudflare R2 link
    color varchar(7), -- hex color code
    official_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Project technologies junction table
create table public.project_technologies (
    project_id uuid references public.projects(id) on delete cascade,
    technology_id uuid references public.technologies(id) on delete cascade,
    primary key (project_id, technology_id)
);

-- Project features table
create table public.project_features (
    id uuid default uuid_generate_v4() primary key,
    project_id uuid references public.projects(id) on delete cascade,
    title varchar(255) not null,
    description text,
    sort_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =================================================================
-- COMMUNITY SECTION TABLES
-- =================================================================

-- Community stats table
create table public.community_stats (
    id uuid default uuid_generate_v4() primary key,
    label varchar(255) not null,
    value varchar(50) not null,
    icon_name varchar(100), -- Lucide icon name
    description text,
    sort_order integer default 0,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Testimonials table
create table public.testimonials (
    id uuid default uuid_generate_v4() primary key,
    name varchar(255) not null,
    role varchar(255) not null,
    company varchar(255),
    content text not null,
    rating integer check (rating >= 1 and rating <= 5) default 5,
    
    -- Media
    avatar_url text, -- Cloudflare R2 link
    company_logo_url text, -- Cloudflare R2 link
    
    -- Contact info (optional)
    linkedin_url text,
    email varchar(255),
    
    -- Display options
    is_featured boolean default false,
    is_published boolean default true,
    sort_order integer default 0,
    
    -- Timestamps
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Community messages/discussions table
create table public.community_messages (
    id uuid default uuid_generate_v4() primary key,
    name varchar(255) not null,
    email varchar(255) not null,
    message text not null,
    message_type varchar(20) check (message_type in ('inquiry', 'collaboration', 'feedback', 'other')) default 'inquiry',
    status varchar(20) check (status in ('unread', 'read', 'replied', 'archived')) default 'unread',
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =================================================================
-- BLOG SECTION TABLES (BONUS)
-- =================================================================

-- Blog categories
create table public.blog_categories (
    id uuid default uuid_generate_v4() primary key,
    name varchar(100) not null unique,
    slug varchar(100) not null unique,
    description text,
    color varchar(7),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Blog posts table
create table public.blog_posts (
    id uuid default uuid_generate_v4() primary key,
    title varchar(255) not null,
    slug varchar(255) not null unique,
    excerpt text,
    content text not null,
    category_id uuid references public.blog_categories(id) on delete set null,
    
    -- Media
    featured_image_url text, -- Cloudflare R2 link
    
    -- SEO
    meta_title varchar(255),
    meta_description text,
    
    -- Status
    status varchar(20) check (status in ('draft', 'published', 'archived')) default 'draft',
    is_featured boolean default false,
    
    -- Stats
    view_count integer default 0,
    read_time integer, -- estimated read time in minutes
    
    -- Timestamps
    published_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =================================================================
-- MEDIA MANAGEMENT TABLES
-- =================================================================

-- Media files table (for tracking Cloudflare R2 uploads)
create table public.media_files (
    id uuid default uuid_generate_v4() primary key,
    filename varchar(255) not null,
    original_filename varchar(255) not null,
    file_path text not null, -- path in Cloudflare R2
    file_url text not null, -- full Cloudflare R2 URL
    file_type varchar(100) not null, -- image/jpeg, video/mp4, etc.
    file_size bigint not null, -- in bytes
    width integer, -- for images/videos
    height integer, -- for images/videos
    duration integer, -- for videos in seconds
    alt_text text,
    caption text,
    tags text[], -- for organization
    is_public boolean default true,
    uploaded_by varchar(255) default 'admin',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =================================================================
-- INDEXES FOR PERFORMANCE
-- =================================================================

-- Projects indexes
create index idx_projects_category on public.projects(category_id);
create index idx_projects_featured on public.projects(featured) where featured = true;
create index idx_projects_published on public.projects(is_published) where is_published = true;
create index idx_projects_status on public.projects(status);

-- Skills indexes
create index idx_skills_category on public.skills(category_id);
create index idx_skills_featured on public.skills(is_featured) where is_featured = true;

-- Certifications indexes
create index idx_certifications_featured on public.certifications(is_featured) where is_featured = true;
create index idx_certifications_issue_date on public.certifications(issue_date);

-- Testimonials indexes
create index idx_testimonials_featured on public.testimonials(is_featured) where is_featured = true;
create index idx_testimonials_published on public.testimonials(is_published) where is_published = true;

-- Media files indexes
create index idx_media_files_type on public.media_files(file_type);
create index idx_media_files_public on public.media_files(is_public) where is_public = true;

-- =================================================================
-- HOMEPAGE ASSETS MANAGEMENT
-- =================================================================

-- Homepage assets table for managing front photos, background videos, and animations
create table public.homepage_assets (
    id uuid default uuid_generate_v4() primary key,
    asset_type varchar(50) not null check (asset_type in ('profile_photo', 'background_video', 'animation', 'logo', 'social_media_image')),
    title varchar(255) not null,
    description text,
    file_url text not null, -- Cloudflare R2 link
    file_type varchar(50) not null, -- 'image', 'video', 'animation'
    mime_type varchar(100),
    file_size bigint,
    is_active boolean default true,
    sort_order integer default 0,
    metadata jsonb, -- For storing additional metadata like animation settings, dimensions, etc.
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for performance
create index idx_homepage_assets_type on public.homepage_assets(asset_type);
create index idx_homepage_assets_active on public.homepage_assets(is_active);
create index idx_homepage_assets_sort on public.homepage_assets(sort_order);

-- =================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.education enable row level security;
alter table public.experience enable row level security;
alter table public.skill_categories enable row level security;
alter table public.skills enable row level security;
alter table public.project_categories enable row level security;
alter table public.projects enable row level security;
alter table public.technologies enable row level security;

-- Public read policy for profiles (data is public on portfolio)
create policy "Public can read profiles" on public.profiles
for select using (true);
alter table public.project_technologies enable row level security;
alter table public.project_features enable row level security;
alter table public.community_stats enable row level security;
alter table public.testimonials enable row level security;
alter table public.community_messages enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.media_files enable row level security;
alter table public.homepage_assets enable row level security;
alter table public.certifications enable row level security;

-- Public read access policies (for portfolio display)
create policy "Public read access" on public.education for select using (true);
create policy "Public read access" on public.experience for select using (true);
create policy "Public read access" on public.skill_categories for select using (true);
create policy "Public read access" on public.skills for select using (true);
create policy "Public read access" on public.project_categories for select using (true);
create policy "Public read access" on public.projects for select using (is_published = true);
create policy "Public read access" on public.technologies for select using (true);
create policy "Public read access" on public.project_technologies for select using (true);
create policy "Public read access" on public.project_features for select using (true);
create policy "Public read access" on public.community_stats for select using (is_active = true);
create policy "Public read access" on public.testimonials for select using (is_published = true);
create policy "Public read access" on public.blog_categories for select using (true);
create policy "Public read access" on public.blog_posts for select using (status = 'published');
create policy "Public read access" on public.media_files for select using (is_public = true);
create policy "Public read access" on public.homepage_assets for select using (true);
create policy "Public read access" on public.certifications for select using (true);

-- Public insert access for community messages
create policy "Public insert access" on public.community_messages for insert with check (true);

-- Homepage assets policies (for admin/authenticated operations)
create policy "Allow insert access" on public.homepage_assets
for insert
with check (auth.role() = 'authenticated');

create policy "Allow update access" on public.homepage_assets
for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Allow delete access" on public.homepage_assets
for delete
using (auth.role() = 'authenticated');

-- =================================================================
-- SAMPLE DATA INSERTION
-- =================================================================

-- Insert skill categories
insert into public.skill_categories (name, description, icon_name, sort_order) values
('Frontend Development', 'Client-side development technologies', 'Monitor', 1),
('Backend Development', 'Server-side development technologies', 'Server', 2),
('Mobile Development', 'Mobile application development', 'Smartphone', 3),
('Database & Storage', 'Data management and storage solutions', 'Database', 4),
('DevOps & Tools', 'Development operations and tools', 'Zap', 5),
('Design & UI/UX', 'User interface and experience design', 'Layers', 6);

-- Insert project categories
insert into public.project_categories (name, slug, description, color, sort_order) values
('Web Application', 'web-app', 'Full-stack web applications', '#3B82F6', 1),
('Mobile App', 'mobile-app', 'iOS and Android applications', '#8B5CF6', 2),
('Web Design', 'web-design', 'UI/UX design projects', '#EC4899', 3),
('Open Source', 'open-source', 'Open source contributions', '#10B981', 4),
('API & Backend', 'api-backend', 'Backend services and APIs', '#F59E0B', 5);

-- Insert community stats
insert into public.community_stats (label, value, icon_name, sort_order) values
('LinkedIn Connections', '2,500+', 'Users', 1),
('Open Source Projects', '15+', 'Code', 2),
('Happy Clients', '20+', 'Heart', 3),
('Years Experience', '5+', 'Calendar', 4);

-- =================================================================
-- FUNCTIONS AND TRIGGERS
-- =================================================================

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Apply update triggers to relevant tables
create trigger update_education_updated_at before update on public.education for each row execute function update_updated_at_column();
create trigger update_experience_updated_at before update on public.experience for each row execute function update_updated_at_column();
create trigger update_projects_updated_at before update on public.projects for each row execute function update_updated_at_column();
create trigger update_testimonials_updated_at before update on public.testimonials for each row execute function update_updated_at_column();
create trigger update_blog_posts_updated_at before update on public.blog_posts for each row execute function update_updated_at_column();
create trigger update_community_stats_updated_at before update on public.community_stats for each row execute function update_updated_at_column();
create trigger update_homepage_assets_updated_at before update on public.homepage_assets for each row execute function update_updated_at_column();
create trigger update_certifications_updated_at before update on public.certifications for each row execute function update_updated_at_column();

-- Function to increment project view count
create or replace function increment_project_views(project_id uuid)
returns void as $$
begin
    update public.projects 
    set view_count = view_count + 1 
    where id = project_id;
end;
$$ language plpgsql;

-- Function to increment blog post view count
create or replace function increment_blog_views(post_id uuid)
returns void as $$
begin
    update public.blog_posts 
    set view_count = view_count + 1 
    where id = post_id;
end;
$$ language plpgsql;
