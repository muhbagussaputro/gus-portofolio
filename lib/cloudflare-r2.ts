import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Cloudflare R2 configuration
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL;

console.log('R2 Config:', {
  account: R2_ACCOUNT_ID,
  bucket: R2_BUCKET_NAME,
  publicUrl: R2_PUBLIC_URL
});

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  throw new Error(`Missing Cloudflare R2 configuration. Got: account=${R2_ACCOUNT_ID}, bucket=${R2_BUCKET_NAME}`);
}

// Validate bucket name (should not contain URL)
if (R2_BUCKET_NAME.includes('http') || R2_BUCKET_NAME.includes('/')) {
  throw new Error(`Invalid bucket name: ${R2_BUCKET_NAME}. Bucket name should be just the name, not a URL.`);
}

// Validate Access Key ID format (should be 32 characters)
// Skip validation in development if using placeholder values
const isDevelopment = process.env.NODE_ENV === 'development';
const isPlaceholder = R2_ACCESS_KEY_ID.includes('your_') || R2_ACCESS_KEY_ID.includes('a1b2c3d4');

if (!isDevelopment && !isPlaceholder && R2_ACCESS_KEY_ID.length !== 32) {
  throw new Error(`Invalid Access Key ID: length is ${R2_ACCESS_KEY_ID.length}, should be 32 characters. Please check your Cloudflare R2 API token configuration.`);
}

// Validate Secret Access Key format (should be 64 characters)
if (!isDevelopment && !isPlaceholder && R2_SECRET_ACCESS_KEY.length !== 64) {
  throw new Error(`Invalid Secret Access Key: length is ${R2_SECRET_ACCESS_KEY.length}, should be 64 characters. Please check your Cloudflare R2 API token configuration.`);
}

// Show warning in development
if (isDevelopment && (isPlaceholder || R2_ACCESS_KEY_ID.length !== 32)) {
  console.warn('⚠️ Using placeholder R2 credentials. Upload functionality will not work until you configure real credentials.');
}

// Initialize R2 client
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Helper function to generate unique filename
export function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
}

// Helper function to get file category based on type
export function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'images';
  if (mimeType.startsWith('video/')) return 'videos';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf')) return 'documents';
  return 'others';
}

// Upload file to Cloudflare R2
export async function uploadToR2(
  file: Buffer | Uint8Array,
  fileName: string,
  mimeType: string,
  category?: string
): Promise<{
  success: boolean;
  file_url?: string;
  file_path?: string;
  error?: string;
}> {
  try {
    // Use fileName directly if it contains path, otherwise add category
    const filePath = fileName.includes('/') ? fileName : `${category || getFileCategory(mimeType)}/${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: filePath,
      Body: file,
      ContentType: mimeType,
      CacheControl: 'public, max-age=31536000', // 1 year cache
    });

    await r2Client.send(command);

    const fileUrl = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${filePath}` : `https://${R2_BUCKET_NAME}.r2.dev/${filePath}`;

    return {
      success: true,
      file_url: fileUrl,
      file_path: filePath,
    };
  } catch (error) {
    console.error('Error uploading to R2:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

// Delete file from Cloudflare R2
export async function deleteFromR2(filePath: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: filePath,
    });

    await r2Client.send(command);

    return { success: true };
  } catch (error) {
    console.error('Error deleting from R2:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
}

// Generate presigned URL for direct upload (optional)
export async function generatePresignedUrl(
  fileName: string,
  mimeType: string,
  expiresIn: number = 3600 // 1 hour
): Promise<{
  success: boolean;
  presigned_url?: string;
  file_path?: string;
  error?: string;
}> {
  try {
    const fileCategory = getFileCategory(mimeType);
    const filePath = `${fileCategory}/${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: filePath,
      ContentType: mimeType,
    });

    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn });

    return {
      success: true,
      presigned_url: presignedUrl,
      file_path: filePath,
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate presigned URL',
    };
  }
}

// Validate file type and size
export function validateFile(file: File, options?: {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}): {
  valid: boolean;
  error?: string;
} {
  const maxSize = options?.maxSize || 100 * 1024 * 1024; // 100MB default (untuk konversi)
  const allowedTypes = options?.allowedTypes || [
    // Format gambar yang akan dikonversi ke WebP
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/svg+xml',
    
    // Format video yang akan dikonversi ke WebM  
    'video/mp4',
    'video/webm',
    'video/mov',
    'video/avi',
    'video/mkv',
    'video/flv',
    'video/wmv',
    'video/quicktime',
    
    // Dokumen
    'application/pdf',
  ];

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  return { valid: true };
}