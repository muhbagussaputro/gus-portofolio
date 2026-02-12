# 🔧 Cloudflare R2 Setup Guide

## ❌ **Error Fix: Bucket name shouldn't contain '/'**

Jika Anda mengalami error ini:
```
Bucket name shouldn't contain '/', received 'https://dfa5b1cac80503316e48a1d488892a15.r2.cloudflarestorage.com/layananmurah/'
```

### 🔍 **Penyebab Error:**
Error terjadi karena ada kesalahan konfigurasi di environment variables. Bucket name tidak boleh berisi URL, hanya nama bucket saja.

### ✅ **Solusi:**

#### **1. Periksa file `.env.local` Anda:**

```bash
# ❌ SALAH - Jangan masukkan URL di BUCKET_NAME
CLOUDFLARE_R2_BUCKET_NAME=https://dfa5b1cac80503316e48a1d488892a15.r2.cloudflarestorage.com/layananmurah/

# ✅ BENAR - Hanya nama bucket
CLOUDFLARE_R2_BUCKET_NAME=layananmurah
CLOUDFLARE_R2_PUBLIC_URL=https://dfa5b1cac80503316e48a1d488892a15.r2.cloudflarestorage.com
```

#### **2. Konfigurasi yang Benar:**

```env
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_here  
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key_here
CLOUDFLARE_R2_BUCKET_NAME=layananmurah
CLOUDFLARE_R2_PUBLIC_URL=https://dfa5b1cac80503316e48a1d488892a15.r2.cloudflarestorage.com
```

---

## 🚀 **Cloudflare R2 Complete Setup**

### **Step 1: Buat R2 Bucket**

1. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pilih account Anda
3. Go to **R2 Object Storage**
4. Click **Create bucket**
5. Masukkan nama bucket: `layananmurah` (atau nama lain)
6. Pilih location sesuai kebutuhan
7. Click **Create bucket**

### **Step 2: Generate API Token**

1. Dari R2 dashboard, click **Manage R2 API tokens**
2. Click **Create API token**
3. Pilih permissions:
   - **Object:Read**
   - **Object:Write** 
   - **Object:Delete**
4. Pilih bucket: `layananmurah`
5. Click **Create API token**
6. Copy **Access Key ID** (32 karakter) dan **Secret Access Key** (64 karakter)

⚠️ **PENTING - Format Credential:**
- **Access Key ID**: Harus tepat 32 karakter (contoh: `a1b2c3d4e5f6789012345678901234ab`)
- **Secret Access Key**: Harus tepat 64 karakter
- Jika panjangnya berbeda, generate ulang API token

### **Step 3: Setup Custom Domain (Opsional tapi Direkomendasikan)**

#### **Option A: Gunakan Domain Sendiri**
1. Di R2 bucket settings, click **Connect Domain**
2. Masukkan subdomain: `cdn.yoursite.com`
3. Tambahkan CNAME record di DNS:
   ```
   cdn.yoursite.com -> your-bucket.r2.dev
   ```

#### **Option B: Gunakan r2.dev Domain**
URL public akan menjadi:
```
https://layananmurah.r2.dev
```

### **Step 4: Environment Variables**

Sesuaikan `.env.local`:

```env
# Dapatkan dari Cloudflare R2 Dashboard
CLOUDFLARE_R2_ACCOUNT_ID=1234567890abcdef1234567890abcdef
CLOUDFLARE_R2_ACCESS_KEY_ID=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef  
CLOUDFLARE_R2_SECRET_ACCESS_KEY=abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# Hanya nama bucket (tanpa URL!)
CLOUDFLARE_R2_BUCKET_NAME=layananmurah

# URL publik untuk akses file
# Option A: Custom domain
CLOUDFLARE_R2_PUBLIC_URL=https://cdn.yoursite.com

# Option B: R2.dev domain  
CLOUDFLARE_R2_PUBLIC_URL=https://layananmurah.r2.dev
```

### **Step 5: Test Upload**

1. Restart development server:
   ```bash
   npm run dev
   ```

2. Buka `/admin/upload`

3. Upload file test

4. Cek apakah file berhasil diupload dan URL-nya benar

---

## 🔒 **Security Best Practices**

### **1. Bucket Permissions**
- Set bucket ke **Private** (tidak public by default)
- Hanya allow akses via API token

### **2. API Token Restrictions**
- Limit token hanya ke bucket yang dibutuhkan
- Set expiration date untuk security
- Gunakan principle of least privilege

### **3. CORS Setup**
Jika upload dari frontend, tambahkan CORS rules:

```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

---

## 🐛 **Troubleshooting Common Issues**

### **Error: "AccessDenied"**
- Periksa API token permissions
- Pastikan token belum expired
- Pastikan account ID benar

### **Error: "NoSuchBucket"**
- Periksa nama bucket di environment variables
- Pastikan bucket sudah dibuat di R2 dashboard

### **Error: "InvalidBucketName"**  
- Nama bucket harus lowercase
- Tidak boleh ada spasi atau karakter khusus
- Gunakan huruf, angka, dan dash (-) saja

### **Upload Lambat/Gagal**
- Periksa ukuran file (max 50MB di kode kita)
- Periksa koneksi internet
- Coba bucket di region yang lebih dekat

---

## 📊 **Monitoring & Analytics**

### **Check Upload Success**
1. File muncul di R2 bucket dashboard
2. File bisa diakses via public URL
3. Record tersimpan di database `media_files`

### **Monitor Usage**
- Cloudflare dashboard menampilkan:
  - Storage usage
  - Request count
  - Bandwidth usage
  - Costs

---

## 💰 **Pricing Info**

### **Cloudflare R2 Pricing (2024):**
- **Storage**: $0.015/GB/month
- **Class A Operations** (writes): $4.50/million
- **Class B Operations** (reads): $0.36/million
- **Egress**: FREE (tidak ada biaya keluar)

### **Estimasi untuk Portfolio:**
- 1GB media files: ~$0.015/month
- 1000 uploads/month: ~$0.005
- Unlimited page views: $0 (egress gratis!)

**Total: ~$0.02/month** untuk usage normal portfolio!

---

## ✅ **Final Checklist**

- [ ] Bucket dibuat di Cloudflare R2
- [ ] API token generated dengan permissions yang benar
- [ ] Environment variables configured dengan benar  
- [ ] BUCKET_NAME hanya nama bucket (tidak ada URL)
- [ ] PUBLIC_URL sesuai dengan domain yang digunakan
- [ ] Test upload berhasil
- [ ] File bisa diakses via public URL
- [ ] Record tersimpan di database

Setelah semua checklist selesai, upload functionality harus berjalan lancar! 🎉