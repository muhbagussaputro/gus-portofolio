# 🚀 Portfolio Setup Guide

## 📋 Prerequisites

1. **Node.js** (v18 atau lebih baru)
2. **NPM** atau **Yarn**
3. **Supabase Account** - [supabase.com](https://supabase.com)
4. **Cloudflare R2 Account** - [cloudflare.com](https://cloudflare.com)

## 🔧 Installation

### 1. Clone & Install Dependencies

```bash
git clone <your-repo>
cd gus-portofolio
npm install
```

### 2. Environment Variables

Copy `env-template.txt` ke `.env.local` dan isi dengan nilai yang sesuai:

```bash
cp env-template.txt .env.local
```

**Supabase Setup:**
1. Buat project baru di [Supabase](https://supabase.com)
2. Jalankan SQL schema dari `database/supabase-schema.sql`
3. Copy URL dan keys ke `.env.local`

**Cloudflare R2 Setup:**
1. Buat R2 bucket di Cloudflare dashboard
2. Generate API tokens dengan permissions:
   - `Object:Read`, `Object:Write`, `Object:Delete` 
3. Setup custom domain (opsional tapi direkomendasikan)

### 3. Database Setup

1. Login ke Supabase dashboard
2. Buka SQL Editor
3. Copy-paste semua content dari `database/supabase-schema.sql`
4. Jalankan query

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
gus-portofolio/
├── app/                    # Next.js 15 App Router
│   ├── (home)/            # Home page components
│   ├── about/             # About page
│   ├── portfolio/         # Portfolio page  
│   ├── community/         # Community page
│   ├── contact/           # Contact page
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/            # Shared components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities
├── types/                 # TypeScript definitions
├── database/              # Database schema
└── public/                # Static assets
```

## 🔌 API Endpoints

### Projects
- `GET /api/projects` - List projects
- `GET /api/projects/[slug]` - Get single project
- `POST /api/projects` - Create project (admin)
- `PATCH /api/projects/[slug]` - Update project (admin)
- `DELETE /api/projects/[slug]` - Delete project (admin)

### Media Upload
- `POST /api/upload` - Upload media to Cloudflare R2
- `GET /api/upload` - List uploaded files
- `DELETE /api/upload/[id]` - Delete file
- `PATCH /api/upload/[id]` - Update file metadata

### Community
- `GET /api/testimonials` - Get testimonials
- `POST /api/testimonials` - Add testimonial (admin)
- `GET /api/community/stats` - Get community stats
- `POST /api/community/messages` - Submit contact message
- `GET /api/community/messages` - List messages (admin)

### About
- `GET /api/about` - Get all about data
- `GET /api/about?section=education` - Get education only
- `GET /api/about?section=experience` - Get experience only
- `GET /api/about?section=skills` - Get skills only

## 👨‍💼 Admin Panel

Akses admin panel di `/admin` untuk:

- **Media Upload**: Upload gambar, video, dokumen ke Cloudflare R2
- **Manage Projects**: CRUD operations untuk portfolio projects
- **Testimonials**: Kelola testimonial klien
- **About Content**: Update pendidikan, pengalaman, skills
- **Analytics**: View site statistics
- **Settings**: Konfigurasi website

## 🗄️ Database Schema

### Tables
- `education` - Data pendidikan
- `experience` - Data pengalaman kerja  
- `skills` & `skill_categories` - Skills dan kategorinya
- `projects` & `project_categories` - Portfolio projects
- `technologies` - Tech stack
- `testimonials` - Client testimonials
- `community_stats` - Community statistics
- `community_messages` - Contact form messages
- `media_files` - File metadata untuk Cloudflare R2
- `blog_posts` & `blog_categories` - Blog system (bonus)

### Sample Data
Schema sudah include sample data untuk:
- Skill categories
- Project categories  
- Community stats
- Fungsi helper dan triggers

## 🎯 Features

### ✅ Completed
- **Modern UI/UX** dengan Tailwind CSS + Framer Motion
- **Clean Code Architecture** dengan TypeScript
- **Database Integration** dengan Supabase
- **Media Management** dengan Cloudflare R2
- **API Routes** untuk semua data operations
- **Admin Panel** untuk content management
- **Mobile Responsive** design
- **Performance Optimized** dengan Next.js 15
- **Error Handling** dan validation
- **File Upload System** dengan progress tracking

### 🚀 Next Steps
1. Setup environment variables
2. Jalankan database schema
3. Upload sample content via admin panel
4. Customize design sesuai preferensi
5. Deploy ke production (Vercel recommended)

## 🚀 Deployment

### Recommended: Vercel

1. Push ke GitHub repository
2. Connect ke Vercel
3. Add environment variables di Vercel dashboard
4. Deploy!

Environment variables yang dibutuhkan di production:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- `SUPABASE_SERVICE_ROLE_KEY`
- `CLOUDFLARE_R2_ACCOUNT_ID`
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_R2_BUCKET_NAME`
- `CLOUDFLARE_R2_PUBLIC_URL`

## 🤝 Development Workflow

1. **Content Management**: Gunakan admin panel di `/admin`
2. **Media Upload**: Upload files via `/admin/upload`
3. **Database Changes**: Update schema di Supabase dashboard
4. **Code Changes**: Development server auto-reload
5. **Build Testing**: `npm run build` sebelum deploy

## 🔒 Security

- **Row Level Security (RLS)** enabled di Supabase
- **Public read access** untuk portfolio data
- **Admin-only write access** untuk sensitive operations
- **File validation** untuk uploads
- **Rate limiting** recommendations

## 📞 Support

Jika ada pertanyaan atau butuh bantuan:
1. Check SETUP.md ini dulu
2. Review error messages di console
3. Check Supabase logs untuk database issues
4. Check Cloudflare R2 logs untuk upload issues

Happy coding! 🎉