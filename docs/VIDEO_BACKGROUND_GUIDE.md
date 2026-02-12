# Panduan Video Background

## Fitur Baru Video Background

Sistem video background telah ditingkatkan dengan fitur-fitur berikut:

### 1. Upload Multiple Video
- Dapat mengunggah beberapa video background melalui panel admin
- Video akan diputar secara bergantian (rotasi)
- Mendukung format video MP4

### 2. Pengaturan Rotasi
- **Interval Rotasi**: Durasi setiap video sebelum berganti (5-60 detik)
- **Prioritas Video**: Menentukan seberapa sering video ditampilkan
  - Tinggi: Video akan ditampilkan lebih sering
  - Normal: Frekuensi standar
  - Rendah: Video ditampilkan lebih jarang

### 3. Optimasi Mobile
- **Optimasi Mobile**: Mengoptimalkan tampilan video di perangkat mobile
- **Responsive**: Video akan menyesuaikan ukuran layar
- **Performance**: Mengurangi beban pada perangkat mobile

### 4. Kontrol Pemutaran
- **Autoplay**: Video dimulai otomatis saat halaman dimuat
- **Loop**: Video diulang terus menerus (hanya untuk video tunggal)
- **Muted**: Video diputar tanpa suara (default)

## Cara Menggunakan

### 1. Menambah Video Background
1. Masuk ke panel admin
2. Pilih menu "Homepage Assets"
3. Klik "Tambah Aset Baru"
4. Pilih tipe aset "Video Background"
5. Upload file video (max 10MB)
6. Atur pengaturan video:
   - Interval rotasi
   - Prioritas video
   - Optimasi mobile
   - Kontrol pemutaran
7. Simpan

### 2. Mengelola Video Background
- **Aktif/Nonaktif**: Toggle status video melalui ikon mata
- **Edit**: Ubah pengaturan video yang sudah ada
- **Hapus**: Menghapus video dari sistem
- **Urutan**: Mengatur prioritas tampilan (angka kecil = prioritas tinggi)

### 3. Tips Optimasi
- Gunakan video dengan resolusi maksimal 1920x1080
- Kompres video untuk mengurangi ukuran file
- Aktifkan optimasi mobile untuk performa yang lebih baik
- Atur interval rotasi sesuai durasi video

## Pengaturan Teknis

### Metadata Video
Setiap video background menyimpan metadata berikut:
```json
{
  "rotationInterval": 15,
  "priority": "high",
  "enableMobileOptimization": true,
  "autoplay": true,
  "loop": true
}
```

### Fallback Video
Jika tidak ada video background yang aktif, sistem akan menggunakan video fallback default (`/videos/firestars.mp4`).

### Indikator Rotasi
Ketika ada multiple video aktif, indikator titik akan muncul di pojok kanan bawah untuk menunjukkan video mana yang sedang diputar.

## Troubleshooting

### Video Tidak Muncul
1. Pastikan video dalam status "Aktif"
2. Periksa format file (harus MP4)
3. Pastikan ukuran file tidak melebihi 10MB
4. Periksa URL file dapat diakses

### Video Tidak Berganti
1. Pastikan ada lebih dari satu video aktif
2. Periksa pengaturan interval rotasi
3. Refresh halaman untuk memulai ulang rotasi

### Performa Lambat di Mobile
1. Aktifkan "Optimasi Mobile"
2. Gunakan video dengan resolusi lebih rendah
3. Kurangi jumlah video aktif