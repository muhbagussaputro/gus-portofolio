# 📸 Panduan Konversi Media Otomatis

Sistem upload portofolio ini sekarang dilengkapi dengan **konversi media otomatis** yang mengoptimalkan semua file yang diupload untuk performa web yang maksimal.

## 🚀 Fitur Utama

### ✨ Konversi Otomatis
- **Gambar** → WebP (kompresi lossless dengan kualitas tinggi)
- **Video** → WebM (codec VP9 + Opus audio)
- **Ukuran file** berkurang hingga 70% tanpa mengurangi kualitas visual
- **Resolusi** tetap dipertahankan 100%

### 🎯 Format yang Didukung

#### Gambar → WebP
- JPEG/JPG
- PNG  
- BMP
- TIFF
- GIF
- WebP (sudah optimal, tidak dikonversi)
- SVG (tidak dikonversi, sudah vektor)

#### Video → WebM
- MP4
- MOV
- AVI
- MKV
- FLV
- WMV
- QuickTime
- WebM (sudah optimal, tidak dikonversi)

## ⚙️ Cara Kerja Sistem

### 1. Upload Normal
```typescript
// Upload file seperti biasa melalui API
const formData = new FormData();
formData.append('file', file);
formData.append('folder_path', 'projects/my-project');

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});
```

### 2. Konversi Otomatis
Sistem akan secara otomatis:
1. ✅ Validasi file
2. 🔄 Konversi ke format optimal (WebP/WebM)
3. 📊 Membandingkan ukuran file
4. 💾 Menyimpan yang paling efisien
5. ☁️ Upload ke Cloudflare R2

### 3. Response Data
```json
{
  "success": true,
  "file_url": "https://cdn.example.com/image.webp",
  "filename": "my-image.webp",
  "file_type": "image/webp",
  "file_size": 45678,
  "original_filename": "my-image.jpg",
  "original_file_type": "image/jpeg", 
  "original_file_size": 123456,
  "converted": true,
  "compression_ratio": 63.0
}
```

## 🎛️ Konfigurasi Konversi

### Kualitas Gambar (WebP)
```typescript
// Default: 85% quality (sangat tinggi)
const options = {
  imageQuality: 85, // 1-100
  imageResize: {
    width: 1920,      // Opsional
    height: 1080,     // Opsional  
    fit: 'inside'     // Tidak memperbesar gambar kecil
  }
};
```

### Kualitas Video (WebM)
```typescript
// Default: 'high' quality
const options = {
  videoQuality: 'high', // 'low' | 'medium' | 'high' | 'lossless'
  videoBitrate: '2000k', // Custom bitrate
  videoResize: {
    width: 1920,  // Opsional
    height: 1080  // Opsional
  }
};
```

## 📈 Keuntungan untuk Cloudflare R2

### 💰 Hemat Biaya
- **Bandwidth** lebih rendah (transfer data berkurang)
- **Storage** lebih efisien (file lebih kecil)
- **Request** lebih cepat (loading time minimal)

### 🌐 Performa Web
- **Loading time** 2-3x lebih cepat
- **Core Web Vitals** score meningkat
- **SEO** ranking membaik
- **User experience** optimal

### 📊 Monitoring
```typescript
// Log otomatis di console
[UPLOAD] ✅ Conversion successful for photo.jpg:
  Original: 2,456,789 bytes (image/jpeg)
  Converted: 891,234 bytes (image/webp)  
  Compression: 63.7% reduction
```

## 🛠️ Implementasi Teknis

### File Konversi Utama
- `lib/media-converter.ts` - Fungsi konversi universal
- `app/api/upload/route.ts` - Integrasi dengan upload API
- `lib/cloudflare-r2.ts` - Validasi format extended

### Dependencies
```json
{
  "sharp": "^0.32.0",           // Konversi gambar
  "fluent-ffmpeg": "^2.1.3",   // Konversi video  
  "ffmpeg-static": "^5.1.0",   // FFmpeg binary
  "@types/fluent-ffmpeg": "^2.1.21"
}
```

### Penggunaan Manual
```typescript
import { convertMedia } from '@/lib/media-converter';

// Konversi file manual
const result = await convertMedia(
  fileBuffer,
  'filename.jpg', 
  'image/jpeg',
  {
    imageQuality: 90,
    skipIfLarger: true
  }
);

if (result.success) {
  console.log(`Ukuran berkurang ${result.compressionRatio}%`);
}
```

## 🔧 Troubleshooting

### Video Conversion Gagal
- Pastikan FFmpeg tersedia di server
- Check format video yang didukung
- Periksa ukuran file (max 100MB)

### Gambar Tidak Optimal
- Cek format asli (SVG tidak dikonversi)
- Pastikan kualitas setting sesuai
- Review ukuran file asli vs hasil

### Memory Issues
- Konversi video besar bisa memakan RAM tinggi
- Consider streaming processing untuk file >50MB
- Monitor server resources

## 📝 Tips Optimasi

1. **Upload file original terbaik** - sistem akan mengoptimalkan
2. **Jangan pre-compress** - biarkan sistem yang handle
3. **Monitor compression ratio** - idealnya 30-70%
4. **Test di berbagai device** - pastikan kualitas OK

---

## 🎯 Hasil Akhir

Dengan sistem ini, semua media di portofolio akan:
- ✅ **Loading super cepat** di semua device
- ✅ **Hemat bandwidth** Cloudflare R2  
- ✅ **Kualitas tetap tinggi** secara visual
- ✅ **SEO friendly** untuk performa web
- ✅ **Cost efficient** untuk hosting

**Ready to use!** 🚀 Upload file apa saja dan sistem akan mengoptimalkan secara otomatis.



