# Homepage Assets Management System

## Overview

Sistem manajemen aset homepage telah berhasil diimplementasikan dengan fitur-fitur lengkap untuk mengelola foto profil, video background, dan animasi secara dinamis melalui database dan panel admin.

## Fitur Utama

### 1. Database Schema
- **Tabel**: `homepage_assets`
- **Tipe Aset**: `profile_photo`, `background_video`, `animation`, `logo`, `social_media_image`
- **File Storage**: Cloudflare R2 dengan link tersimpan di database
- **Metadata**: Dukungan untuk metadata tambahan dalam format JSON
- **Status**: Sistem aktif/non-aktif untuk setiap aset
- **Urutan**: Sistem sorting untuk menentukan prioritas aset

### 2. Panel Admin
**Lokasi**: `/admin/homepage-assets`

**Fitur Panel Admin**:
- ✅ **CRUD Operations**: Create, Read, Update, Delete aset homepage
- ✅ **File Upload**: Drag & drop, click to upload, dan **paste (Ctrl+V)**
- ✅ **Preview**: Pratinjau gambar dan video langsung di panel
- ✅ **Validasi**: Validasi ukuran file dan tipe file
- ✅ **Kategori**: Manajemen berbagai tipe aset dengan icon yang berbeda
- ✅ **Status Toggle**: Aktif/non-aktif aset dengan satu klik
- ✅ **Metadata**: Penyimpanan informasi tambahan untuk setiap aset

### 3. Integrasi Homepage
**Dynamic Content Loading**:
- **Profile Photo**: Otomatis mengambil dari database atau fallback ke gambar default
- **Background Video**: Dinamis menggunakan video dari database dengan fallback
- **Animations**: Support untuk loading animasi Lottie dari database atau fallback

**Components yang Terintegrasi**:
- `ProfilePhoto.tsx` - Menggunakan database untuk foto profil dan animasi
- `BackgroundVideo.tsx` - Komponen baru untuk video background dinamis
- `HomeClient.tsx` - Terintegrasi dengan BackgroundVideo component
- `useHomepageAssets.ts` - Custom hook untuk fetching data aset

### 4. Fitur Upload Paste (Ctrl+V)
**Komponen yang Mendukung Paste**:
- ✅ `SimpleMediaUpload.tsx` - Enhanced dengan paste functionality
- ✅ Homepage Assets Admin Panel - Mendukung paste langsung
- ✅ Visual feedback saat paste dengan animasi
- ✅ Support untuk image dan video dari clipboard

**Cara Kerja Paste**:
1. Copy gambar/video dari aplikasi lain (browser, editor, dll)
2. Buka panel admin atau form upload
3. Press `Ctrl+V` (atau `Cmd+V` di Mac)
4. File otomatis ter-upload dan preview tersedia

## API Endpoints

### Homepage Assets API
- `GET /api/homepage-assets` - Fetch all assets (dengan filter)
- `POST /api/homepage-assets` - Create new asset
- `GET /api/homepage-assets/[id]` - Get specific asset
- `PATCH /api/homepage-assets/[id]` - Update asset
- `DELETE /api/homepage-assets/[id]` - Delete asset

### Query Parameters
- `?asset_type=profile_photo` - Filter by asset type
- `?is_active=true` - Filter by active status

## File Structure

```
app/
├── admin/homepage-assets/
│   └── page.tsx                 # Admin panel
├── api/homepage-assets/
│   ├── route.ts                # CRUD endpoints  
│   └── [id]/route.ts           # Individual asset endpoints
└── (home)/
    └── ProfilePhoto.tsx        # Updated with database integration

components/
├── BackgroundVideo.tsx         # New dynamic video component
├── SimpleMediaUpload.tsx       # Enhanced with paste functionality
└── HomeClient.tsx              # Updated with BackgroundVideo

hooks/
└── useHomepageAssets.ts        # Custom hook for asset management

database/
└── supabase-schema.sql         # Updated with homepage_assets table

types/
└── database.ts                 # Updated with HomepageAsset types
```

## Konfigurasi Database

### Setup Tabel
1. Jalankan script SQL dari `database/supabase-schema.sql`
2. Tabel `homepage_assets` akan otomatis dibuat dengan:
   - RLS policies untuk keamanan
   - Indexes untuk performa
   - Triggers untuk `updated_at`

### Sample Data
```sql
INSERT INTO homepage_assets (
  asset_type, title, description, file_url, file_type, is_active, sort_order
) VALUES 
(
  'profile_photo', 
  'Main Profile Photo', 
  'Primary profile photo for homepage hero section',
  'https://your-r2-url.com/homepage/profile_photo/profile_photo_1.jpg',
  'image',
  true,
  1
);
```

## Penggunaan

### 1. Menambah Aset Baru
1. Buka `/admin/homepage-assets`
2. Klik "Tambah Aset Baru"
3. Pilih tipe aset (Profile Photo, Background Video, Animation, dll)
4. Upload file dengan drag&drop, click, atau **paste (Ctrl+V)**
5. Isi informasi aset (title, description)
6. Simpan

### 2. Mengedit Aset
1. Klik tombol "Edit" pada aset yang ingin diubah
2. Update informasi atau ganti file
3. Simpan perubahan

### 3. Mengatur Prioritas
- Gunakan field "Urutan" untuk menentukan prioritas aset
- Aset dengan urutan lebih kecil akan diprioritaskan

### 4. Toggle Status
- Klik icon mata untuk mengaktifkan/menonaktifkan aset
- Hanya aset aktif yang akan ditampilkan di homepage

## Fallback System

Sistem ini memiliki fallback yang robust:
- **Profile Photo**: Database → Props → `/images/profil.jpg`
- **Background Video**: Database → `/videos/firestars.mp4`
- **Animations**: Database → `/animations/profile-animation.json`

## Performance Optimizations

- ✅ **Lazy Loading**: Assets dimuat hanya saat dibutuhkan
- ✅ **Caching**: Browser caching untuk static assets
- ✅ **Error Handling**: Graceful fallback jika gagal load
- ✅ **File Validation**: Validasi ukuran dan tipe file
- ✅ **Progressive Enhancement**: Aplikasi tetap berfungsi tanpa JavaScript

## Keamanan

- ✅ **RLS Policies**: Row Level Security di Supabase
- ✅ **File Validation**: Server-side validation
- ✅ **Type Safety**: TypeScript untuk semua interfaces
- ✅ **CORS Protection**: Proper CORS configuration
- ✅ **Input Sanitization**: Validasi input di server

## Tips dan Best Practices

### Upload Files
1. **Ukuran File**: Maksimal 10MB untuk performa optimal
2. **Format**: 
   - Images: JPG, PNG, WebP (recommended)
   - Videos: MP4, WebM
   - Animations: JSON (Lottie)
3. **Naming**: Sistem otomatis menggunakan naming convention yang konsisten

### Paste Functionality
1. **Support Format**: Image dan video dari clipboard
2. **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
3. **UX**: Visual feedback saat paste berhasil atau gagal

### Database Management
1. **Backup**: Selalu backup sebelum perubahan besar
2. **Cleanup**: Hapus file dari R2 jika menghapus record database
3. **Monitoring**: Monitor usage disk space R2

## Troubleshooting

### Upload Gagal
- Check environment variables R2 (bucket, access key, secret key)
- Verify file size dan format
- Check network connectivity

### Asset Tidak Muncul
- Verify asset status aktif di database
- Check file URL accessible
- Verify RLS policies

### Paste Tidak Berfungsi
- Ensure HTTPS (paste hanya bekerja di HTTPS)
- Check browser permissions
- Verify clipboard contains valid image/video

## Kesimpulan

Sistem Homepage Assets Management telah berhasil diimplementasikan dengan fitur lengkap:

✅ **Database Schema Complete** - Tabel, policies, triggers, indexes
✅ **API Routes Complete** - CRUD operations dengan validation
✅ **Admin Panel Complete** - User-friendly interface dengan drag&drop dan paste
✅ **Paste Functionality Complete** - Ctrl+V support di semua upload components
✅ **Homepage Integration Complete** - Dynamic loading dengan fallback system
✅ **Build Success** - Zero errors, production ready

Sistem ini memberikan fleksibilitas penuh untuk mengelola aset homepage secara dinamis sambil mempertahankan performa dan keamanan yang optimal.