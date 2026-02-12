-- ================================================================
-- SAMPLE DATA FOR TESTING ADMIN PANEL
-- Jalankan ini setelah supabase-schema.sql untuk populate data awal
-- ================================================================

-- Insert sample project categories
INSERT INTO public.project_categories (name, slug, description, color, sort_order) VALUES
('Web Application', 'web-app', 'Full-stack web applications dan platform digital', '#3B82F6', 1),
('Mobile Application', 'mobile-app', 'iOS dan Android native/cross-platform apps', '#8B5CF6', 2),
('Web Design', 'web-design', 'UI/UX design dan frontend development', '#EC4899', 3),
('API & Backend', 'api-backend', 'Backend services, REST APIs, dan microservices', '#F59E0B', 4),
('E-Commerce', 'ecommerce', 'Online store dan payment integration', '#10B981', 5),
('SaaS Platform', 'saas', 'Software as a Service applications', '#6366F1', 6);

-- Insert sample technologies
INSERT INTO public.technologies (name, category, icon_url, color, official_url) VALUES
-- Frontend
('React', 'frontend', NULL, '#61DAFB', 'https://reactjs.org'),
('Next.js', 'frontend', NULL, '#000000', 'https://nextjs.org'),
('Vue.js', 'frontend', NULL, '#4FC08D', 'https://vuejs.org'),
('TypeScript', 'frontend', NULL, '#3178C6', 'https://typescriptlang.org'),
('Tailwind CSS', 'frontend', NULL, '#06B6D4', 'https://tailwindcss.com'),
('React Native', 'mobile', NULL, '#61DAFB', 'https://reactnative.dev'),
('Flutter', 'mobile', NULL, '#02569B', 'https://flutter.dev'),

-- Backend
('Node.js', 'backend', NULL, '#339933', 'https://nodejs.org'),
('Express.js', 'backend', NULL, '#000000', 'https://expressjs.com'),
('NestJS', 'backend', NULL, '#E0234E', 'https://nestjs.com'),
('PHP', 'backend', NULL, '#777BB4', 'https://php.net'),
('Laravel', 'backend', NULL, '#FF2D20', 'https://laravel.com'),
('Python', 'backend', NULL, '#3776AB', 'https://python.org'),
('Django', 'backend', NULL, '#092E20', 'https://djangoproject.com'),

-- Database
('PostgreSQL', 'database', NULL, '#336791', 'https://postgresql.org'),
('MySQL', 'database', NULL, '#4479A1', 'https://mysql.com'),
('MongoDB', 'database', NULL, '#47A248', 'https://mongodb.com'),
('Supabase', 'database', NULL, '#3ECF8E', 'https://supabase.com'),
('Firebase', 'database', NULL, '#FFCA28', 'https://firebase.google.com'),

-- DevOps & Tools
('Docker', 'devops', NULL, '#2496ED', 'https://docker.com'),
('AWS', 'devops', NULL, '#232F3E', 'https://aws.amazon.com'),
('Vercel', 'devops', NULL, '#000000', 'https://vercel.com'),
('Cloudflare', 'devops', NULL, '#F38020', 'https://cloudflare.com'),
('Git', 'devops', NULL, '#F05032', 'https://git-scm.com'),
('GitHub', 'devops', NULL, '#181717', 'https://github.com');

-- Insert sample skills categories
INSERT INTO public.skill_categories (name, description, icon_name, sort_order) VALUES
('Frontend Development', 'User interface dan client-side development', 'Monitor', 1),
('Backend Development', 'Server-side development dan API creation', 'Server', 2),
('Mobile Development', 'iOS dan Android application development', 'Smartphone', 3),
('Database Management', 'Data storage, query optimization, dan management', 'Database', 4),
('DevOps & Deployment', 'CI/CD, cloud services, dan infrastructure', 'Zap', 5),
('Design & UI/UX', 'User interface design dan user experience', 'Layers', 6),
('Project Management', 'Agile, Scrum, team leadership', 'Users', 7);

-- Insert sample skills
INSERT INTO public.skills (name, category_id, proficiency_level, years_experience, description, is_featured, sort_order) VALUES
-- Frontend (assuming category_id from above, you might need to adjust UUIDs)
('React & Next.js', (SELECT id FROM skill_categories WHERE name = 'Frontend Development'), 5, 3, 'Expert dalam React ecosystem, hooks, context, dan Next.js untuk production apps', true, 1),
('TypeScript', (SELECT id FROM skill_categories WHERE name = 'Frontend Development'), 4, 2, 'Strong typing, interface design, dan type safety untuk large applications', true, 2),
('Tailwind CSS', (SELECT id FROM skill_categories WHERE name = 'Frontend Development'), 5, 2, 'Utility-first CSS framework, responsive design, dan custom component styling', false, 3),

-- Backend
('Node.js & Express', (SELECT id FROM skill_categories WHERE name = 'Backend Development'), 4, 3, 'RESTful API development, middleware, authentication, dan real-time features', true, 1),
('Database Design', (SELECT id FROM skill_categories WHERE name = 'Database Management'), 4, 3, 'PostgreSQL, MySQL, MongoDB, schema design, query optimization', true, 2),
('API Development', (SELECT id FROM skill_categories WHERE name = 'Backend Development'), 5, 3, 'REST APIs, GraphQL, authentication, rate limiting, documentation', true, 3);

-- Insert sample education
INSERT INTO public.education (institution, degree, field_of_study, start_date, end_date, gpa, description, is_current, sort_order) VALUES
('Universitas Dian Nuswantoro', 'Bachelor''s Degree', 'Teknik Informatika', '2021-09-01', '2025-02-01', 3.76, 'Fokus pada pengembangan aplikasi web dan mobile, machine learning, dan database management. Aktif dalam organisasi kampus dan project-based learning.', false, 1),
('SMK Tunas Harapan Pati', 'Vocational High School', 'Computer and Networking Engineering', '2018-07-01', '2021-06-01', NULL, 'Mempelajari dasar-dasar jaringan komputer, hardware troubleshooting, dan pengembangan aplikasi Android menggunakan Java.', false, 2),
('Bangkit Academy', 'Certificate Program', 'Mobile Development (Kotlin)', '2024-02-01', '2024-07-01', NULL, 'Google-backed program focusing pada Android development dengan Kotlin. Capstone project: ISALAT - AI-powered sign language translator using TensorFlow Lite.', false, 3);

-- Insert sample experience
INSERT INTO public.experience (title, company, location, start_date, end_date, description, is_current, sort_order) VALUES
('Full Stack Developer', 'Freelance', 'Remote, Indonesia', '2022-01-01', NULL, 'Mengembangkan aplikasi web dan mobile untuk berbagai klien:\n\n• Membangun 15+ website menggunakan React, Next.js, dan PHP\n• Mengintegrasikan payment gateway (Midtrans, Stripe) untuk e-commerce\n• Mengoptimalkan performa aplikasi hingga 40% lebih cepat\n• Mengelola deployment di AWS, Vercel, dan VPS\n• Berkolaborasi dengan designer dan project manager\n\nTech Stack: React, Next.js, Node.js, PHP, Laravel, MySQL, PostgreSQL', true, 1),
('Mobile Developer Intern', 'Bangkit Academy', 'Remote, Indonesia', '2024-02-01', '2024-07-01', 'Program intensive 6 bulan focusing pada Android development:\n\n• Mengembangkan aplikasi ISALAT (Instant Sign Language Translator)\n• Implementasi machine learning model menggunakan TensorFlow Lite\n• Real-time camera processing untuk sign language detection\n• Kolaborasi dengan Machine Learning dan Cloud Computing tracks\n• Mentoring dari Google engineers dan industry experts\n\nTech Stack: Kotlin, Android Studio, TensorFlow Lite, Retrofit, Room Database', false, 2),
('Web Developer', 'Local Business Projects', 'Semarang, Indonesia', '2021-08-01', '2022-12-01', 'Mengembangkan website untuk UMKM dan bisnis lokal:\n\n• Membuat 10+ website company profile dan landing pages\n• Mengintegrasikan CMS untuk kemudahan update content\n• SEO optimization untuk meningkatkan organic traffic\n• Maintenance dan support berkelanjutan\n• Training client untuk penggunaan dashboard admin\n\nTech Stack: WordPress, PHP, MySQL, HTML/CSS, JavaScript', false, 3);

-- Insert sample testimonials
INSERT INTO public.testimonials (name, role, company, content, rating, linkedin_url, is_featured, is_published, sort_order) VALUES
('Ahmad Fajar Pratama', 'CTO', 'TechStars Indonesia', 'Bagus adalah developer yang sangat kompeten dengan pemahaman mendalam tentang React dan Next.js. Kemampuannya dalam memecahkan masalah kompleks dan menghasilkan solusi yang elegan sangat mengesankan. Proyek yang dikerjakan selalu selesai tepat waktu dengan kualitas tinggi.', 5, 'https://linkedin.com/in/ahmad-fajar', true, true, 1),
('Siti Amalia Putri', 'Product Manager', 'InnovateID', 'Bekerja dengan Bagus selalu menjadi pengalaman yang menyenangkan. Dia tidak hanya memiliki keterampilan teknis yang hebat, tetapi juga pemahaman bisnis yang membantu proyek kami mencapai tujuannya. Komunikasi yang jelas dan proaktif dalam memberikan solusi.', 5, 'https://linkedin.com/in/siti-amalia', true, true, 2),
('Budi Santoso', 'Founder', 'EdTech Nusantara', 'Bagus membantu kami mengubah visi startup edtech menjadi realitas. Platform e-learning yang dia kembangkan sangat user-friendly dan scalable. Kode berkualitas tinggi dan komitmennya terhadap deadline membuat dia menjadi asset berharga untuk tim manapun.', 5, NULL, true, true, 3),
('Maria Gonzalez', 'Marketing Director', 'Digital Agency Pro', 'Outstanding work on our company website redesign! Bagus delivered a modern, responsive design that perfectly captured our brand identity. The performance improvements were remarkable - page load times decreased by 60%. Highly recommended!', 4, NULL, false, true, 4),
('Rizki Pratama', 'Business Owner', 'Toko Online Sukses', 'Aplikasi e-commerce yang dikembangkan Bagus sangat membantu bisnis kami. Fitur inventory management dan integrasi payment gateway bekerja dengan sempurna. Customer support yang responsif dan ready untuk maintenance jangka panjang.', 5, NULL, false, true, 5);

-- Insert sample community stats (you can update these values)
INSERT INTO public.community_stats (label, value, icon_name, description, sort_order, is_active) VALUES
('LinkedIn Connections', '2,500+', 'Users', 'Professional network dan industry connections', 1, true),
('GitHub Repositories', '25+', 'Code', 'Open source projects dan code contributions', 2, true),
('Happy Clients', '20+', 'Heart', 'Satisfied clients dengan positive testimonials', 3, true),
('Years Experience', '3+', 'Calendar', 'Professional development experience', 4, true),
('Projects Completed', '40+', 'CheckCircle', 'Successfully delivered projects', 5, true),
('Technologies Mastered', '15+', 'Layers', 'Programming languages dan frameworks', 6, true);

-- Insert sample project (basic data)
INSERT INTO public.projects (
  title, slug, short_description, detailed_description, 
  category_id, status, demo_url, github_url,
  start_date, end_date, featured, is_published, sort_order
) VALUES (
  'Portfolio Website v2', 
  'portfolio-website-v2',
  'Modern portfolio website dengan admin panel dan database integration.',
  'Portfolio website generasi terbaru yang dibangun menggunakan Next.js 15, TypeScript, dan Supabase. Features:\n\n• Responsive design dengan Tailwind CSS\n• Admin panel untuk content management\n• Database integration dengan Supabase\n• Media upload ke Cloudflare R2\n• Real-time content updates\n• SEO optimized\n• Performance optimized dengan Core Web Vitals\n\nChallenges & Solutions:\n• Challenge: Managing dynamic content without CMS\n• Solution: Built custom admin panel dengan CRUD operations\n\n• Challenge: Media management dan CDN integration\n• Solution: Implemented Cloudflare R2 dengan presigned URLs\n\nResults:\n• 95+ Lighthouse performance score\n• 100% mobile responsive\n• Sub-second page load times\n• Easy content management workflow',
  (SELECT id FROM project_categories WHERE slug = 'web-app'),
  'completed',
  'https://muhbagussaputro.my.id',
  'https://github.com/bagussaputro/portfolio-v2',
  '2024-01-01',
  '2024-01-31',
  true,
  true,
  1
);

-- Link technologies to the sample project
INSERT INTO public.project_technologies (project_id, technology_id) 
SELECT 
  (SELECT id FROM projects WHERE slug = 'portfolio-website-v2'),
  technologies.id
FROM technologies 
WHERE technologies.name IN ('Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Cloudflare');

-- Insert project features for the sample project
INSERT INTO public.project_features (project_id, title, description, sort_order) VALUES
((SELECT id FROM projects WHERE slug = 'portfolio-website-v2'), 'Admin Panel', 'Full CRUD operations untuk semua content sections', 1),
((SELECT id FROM projects WHERE slug = 'portfolio-website-v2'), 'Media Management', 'Upload dan manage files dengan Cloudflare R2', 2),
((SELECT id FROM projects WHERE slug = 'portfolio-website-v2'), 'Real-time Updates', 'Content changes reflected immediately', 3),
((SELECT id FROM projects WHERE slug = 'portfolio-website-v2'), 'SEO Optimized', 'Meta tags, structured data, sitemap generation', 4),
((SELECT id FROM projects WHERE slug = 'portfolio-website-v2'), 'Performance', '95+ Lighthouse score, optimized images, lazy loading', 5);

-- Note: UUIDs will be auto-generated, so you might need to adjust the foreign key references
-- after running this script based on your actual generated UUIDs

-- ================================================================
-- USER PROFILE & EXPERIENCES FROM CV
-- ================================================================
INSERT INTO public.profiles (
  full_name, headline, summary, email, phone, location,
  github_url, linkedin_url, twitter_url, website_url, hero_strings
) VALUES (
  'MUH BAGUS SAPUTRO',
  'Full Stack Developer & Mobile Developer',
  'Full Stack Developer & Mobile Developer dengan pengalaman lebih dari 3 tahun dalam merancang, mengembangkan, dan mengelola aplikasi berbasis web dan mobile. Terbiasa bekerja dari sisi frontend hingga backend dengan pendekatan yang efisien, terstruktur, dan berorientasi pada kebutuhan pengguna. Menguasai berbagai bahasa dan teknologi pemrograman seperti Kotlin, Java, PHP, dan JavaScript, serta terbiasa dengan framework modern dan pengelolaan database. Aktif mendalami teknologi baru seperti AI Agent dan Blockchain untuk menciptakan solusi digital yang inovatif, scalable, dan siap menghadapi tantangan masa depan.',
  'muhbagussaputro.id@gmail.com',
  '081391782589',
  'Pati, Jawa Tengah, 59171',
  'https://github.com/BagusCPaste/',
  'https://linkedin.com/in/gusaja',
  NULL,
  'https://muhbagussaputro.my.id',
  ARRAY[
    'Full Stack Developer & Mobile Developer',
    'Android Development with Kotlin and Java',
    'Web Development with React and Next.js',
    'Laravel and PHP Development'
  ]
);

-- Experiences from CV (complement samples)
INSERT INTO public.experience (title, company, location, start_date, end_date, description, experience_type, is_current, sort_order) VALUES
('Komputer & Jaringan', 'SMK Tunas Harapan Pati', 'Pati, Jawa Tengah', '2018-07-01', '2020-01-31', '• Pemeliharaan, perbaikan, dan troubleshooting perangkat keras dan jaringan.\n• Dukungan Ujian Nasional 2019 untuk >300 siswa tanpa gangguan.\n• Implementasi Cisco & Mikrotik, LAN & Wi‑Fi, distribusi jaringan antar gedung (+75% stabilitas).', 'education_program', false, 10),
('Mobile Development (Java)', 'SMK Tunas Harapan Pati', 'Pati, Jawa Tengah', '2019-12-01', '2021-05-31', '• Aplikasi Perpustakaan Digital (+50% efisiensi peminjaman).\n• Aplikasi BKK SMK TH untuk lowongan dan pelacakan lamaran real‑time (>100 lowongan).', 'education_program', false, 9),
('Fullstack Mobile Development (Java)', 'IT Center Pati', 'Pati, Jawa Tengah', '2020-11-01', '2021-01-31', '• Aplikasi Koperasi Simpan Pinjam Android (anggota, transaksi, integrasi API).\n• Digunakan >200 anggota; kesalahan pencatatan turun 30%.', 'project', false, 8),
('Data Science (Python)', 'Universitas Dian Nuswantoro', 'Semarang, Indonesia', '2022-01-01', '2022-06-30', '• Model berbasis YOLO untuk steganography teks pada gambar (≈90% akurasi).\n• Sistem rekomendasi obat berbasis gejala (+40% akurasi).', 'education_program', false, 7),
('Web Development Mentor', 'Bengkel Coding', 'Semarang, Indonesia', '2024-02-01', '2024-12-31', '• Bimbingan intensif PHP Native.\n• Sistem Bimbingan Online (Laravel & Next.js) mempercepat pelacakan kemajuan 50%.', 'job', false, 6),
('Staff Ahli', 'Badan Amalan Islam', 'Semarang, Indonesia', '2021-11-01', '2022-12-31', '• Ketua Perkab, event hingga 200 peserta.\n• Koordinasi sedekah rutin (≈Rp 2 juta/bulan).', 'organization', false, 5),
('Mobile Development Cohort (Kotlin)', 'Bangkit Academy', 'Remote, Indonesia', '2024-02-01', '2024-05-31', '• Proyek Kotlin berstandar industri, MVVM & Jetpack Compose.', 'education_program', false, 4),
('Mobile Development Capstone Project (Kotlin) — ISALAT', 'Bangkit Academy', 'Remote, Indonesia', '2024-05-01', '2024-07-31', '• Aplikasi ISALAT untuk penerjemahan bahasa isyarat.\n• TensorFlow Lite untuk deteksi gestur; deteksi benda ≈95%.', 'education_program', false, 3),
('KPPS 2 — Pemilu 2024 (SIREKAP Satu)', 'Komisi Pemilihan Umum RI', 'Pati, Jawa Tengah', '2024-01-01', '2024-02-29', '• Validasi surat suara dan dukungan proses perhitungan.\n• Operator SIREKAP untuk input digital akurat.', 'government', false, 2),
('Ketua KPPS — Pilkada 2024', 'Komisi Pemilihan Umum RI', 'Pati, Jawa Tengah', '2024-10-01', '2024-11-30', '• Pimpin seluruh tahapan TPS: persiapan, pemungutan, ketertiban, rekap & pelaporan akhir.', 'government', false, 1);

-- Certifications (Dicoding 2027)
INSERT INTO public.certifications (title, provider, issue_date, description, sort_order)
VALUES
('Belajar Dasar UI Design', 'Dicoding Indonesia', '2027-01-01', NULL, 100),
('Belajar Membuat Aplikasi Android dengan Jetpack Compose', 'Dicoding Indonesia', '2027-01-01', NULL, 99),
('Belajar Pengembangan Aplikasi Android Intermediate', 'Dicoding Indonesia', '2027-01-01', NULL, 98),
('Belajar Dasar Git dengan GitHub', 'Dicoding Indonesia', '2027-01-01', NULL, 97),
('Memulai Dasar Pemrograman untuk Menjadi Pengembang Software', 'Dicoding Indonesia', '2027-01-01', NULL, 96),
('Pengenalan ke Logika Pemrograman (Programming Logic 101)', 'Dicoding Indonesia', '2027-01-01', NULL, 95),
('Belajar Dasar AI', 'Dicoding Indonesia', '2027-01-01', NULL, 94),
('Belajar Penerapan Machine Learning untuk Android', 'Dicoding Indonesia', '2027-01-01', NULL, 93),
('Belajar Prinsip Pemrograman SOLID', 'Dicoding Indonesia', '2027-01-01', NULL, 92),\
('Belajar Fundamental Aplikasi Android', 'Dicoding Indonesia', '2027-01-01', NULL, 91),
('Belajar Membuat Aplikasi Android untuk Pemula', 'Dicoding Indonesia', '2027-01-01', NULL, 90),
('Memulai Pemrograman dengan Kotlin', 'Dicoding Indonesia', '2027-01-01', NULL, 89);

-- Additional technical skills mapped from CV
INSERT INTO public.skills (name, category_id, proficiency_level, years_experience, description, is_featured, sort_order)
VALUES
('Next.js & React.js', (SELECT id FROM skill_categories WHERE name = 'Frontend Development'), 5, 3, 'Next.js, React.js, JavaScript (ES6+), responsive design', true, 10),
('UI/UX Principles', (SELECT id FROM skill_categories WHERE name = 'Design & UI/UX'), 4, 3, 'Responsive UI, usability, accessibility', false, 11),
('Android (Kotlin & Java)', (SELECT id FROM skill_categories WHERE name = 'Mobile Development'), 5, 3, 'Kotlin, Java, Android Studio', true, 12),
('Jetpack Compose & MVVM', (SELECT id FROM skill_categories WHERE name = 'Mobile Development'), 4, 2, 'Modern Android stack', false, 13),
('Laravel & PHP', (SELECT id FROM skill_categories WHERE name = 'Backend Development'), 4, 3, 'Backend API, MVC, authentication', true, 14),
('RESTful API', (SELECT id FROM skill_categories WHERE name = 'Backend Development'), 4, 3, 'Designing and consuming REST APIs', false, 15),
('SQL & MySQL', (SELECT id FROM skill_categories WHERE name = 'Database Management'), 4, 3, 'Schema design, query optimization', false, 16),
('Firebase', (SELECT id FROM skill_categories WHERE name = 'Database Management'), 3, 2, 'Auth, Firestore/Realtime DB (basic)', false, 17);