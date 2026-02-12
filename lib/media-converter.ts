import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

let ffmpegConfigured = false;

async function getSharpModule() {
  try {
    const sharpModule = await import('sharp');
    return sharpModule.default;
  } catch {
    return null;
  }
}

async function getFfmpegModule() {
  try {
    const ffmpegModule = await import('fluent-ffmpeg');
    const ffmpeg = ffmpegModule.default;

    if (!ffmpegConfigured) {
      const ffmpegStaticModule = await import('ffmpeg-static');
      const ffmpegBinaryPath = ffmpegStaticModule.default;
      if (ffmpegBinaryPath) {
        ffmpeg.setFfmpegPath(ffmpegBinaryPath);
      }
      ffmpegConfigured = true;
    }

    return ffmpeg;
  } catch {
    return null;
  }
}

export interface ConversionResult {
  success: boolean;
  buffer?: Buffer;
  mimeType?: string;
  originalSize: number;
  convertedSize?: number;
  compressionRatio?: number;
  error?: string;
}

export interface ConversionOptions {
  // Opsi untuk gambar
  imageQuality?: number; // 1-100, default 85
  imageResize?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  };
  
  // Opsi untuk video  
  videoQuality?: string; // 'low' | 'medium' | 'high' | 'lossless', default 'high'
  videoBitrate?: string; // e.g., '1000k', '2M'
  videoResize?: {
    width?: number;
    height?: number;
  };
  
  // Opsi umum
  skipIfLarger?: boolean; // Skip konversi jika file hasil lebih besar
}

const DEFAULT_OPTIONS: ConversionOptions = {
  imageQuality: 85,
  videoQuality: 'high',
  skipIfLarger: true,
};

/**
 * Konversi gambar ke format WebP dengan optimasi kualitas
 */
export async function convertImageToWebP(
  inputBuffer: Buffer, 
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    const sharp = await getSharpModule();
    if (!sharp) {
      return {
        success: false,
        originalSize: inputBuffer.length,
        error: 'Image converter is not available on this environment',
      };
    }

    let sharpInstance = sharp(inputBuffer);
    
    // Resize jika diperlukan
    if (opts.imageResize) {
      sharpInstance = sharpInstance.resize({
        width: opts.imageResize.width,
        height: opts.imageResize.height,
        fit: opts.imageResize.fit || 'inside',
        withoutEnlargement: true, // Jangan perbesar gambar kecil
      });
    }
    
    // Konversi ke WebP dengan kualitas tinggi
    const convertedBuffer = await sharpInstance
      .webp({ 
        quality: opts.imageQuality,
        effort: 6, // Maksimum effort untuk kompresi terbaik
        smartSubsample: true,
      })
      .toBuffer();
    
    const originalSize = inputBuffer.length;
    const convertedSize = convertedBuffer.length;
    const compressionRatio = ((originalSize - convertedSize) / originalSize) * 100;
    
    // Skip jika file hasil lebih besar dan opsi skipIfLarger aktif
    if (opts.skipIfLarger && convertedSize >= originalSize) {
      return {
        success: false,
        originalSize,
        error: 'Converted file is larger than original, keeping original format',
      };
    }
    
    return {
      success: true,
      buffer: convertedBuffer,
      mimeType: 'image/webp',
      originalSize,
      convertedSize,
      compressionRatio,
    };
    
  } catch (error) {
    return {
      success: false,
      originalSize: inputBuffer.length,
      error: error instanceof Error ? error.message : 'Image conversion failed',
    };
  }
}

/**
 * Konversi video ke format WebM dengan optimasi kualitas
 */
export async function convertVideoToWebM(
  inputBuffer: Buffer,
  originalFilename: string,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Generate temporary file paths
  const tempDir = tmpdir();
  const inputPath = join(tempDir, `input-${Date.now()}-${Math.random().toString(36).substring(7)}.tmp`);
  const outputPath = join(tempDir, `output-${Date.now()}-${Math.random().toString(36).substring(7)}.webm`);
  
  try {
    const ffmpeg = await getFfmpegModule();
    if (!ffmpeg) {
      return {
        success: false,
        originalSize: inputBuffer.length,
        error: 'Video converter is not available on this environment',
      };
    }

    // Write input buffer to temporary file
    await writeFile(inputPath, inputBuffer);
    
    // Setup ffmpeg command
    let command = ffmpeg(inputPath)
      .videoCodec('libvpx-vp9') // VP9 codec untuk WebM
      .audioCodec('libopus') // Opus audio codec
      .format('webm');
    
    // Set video quality
    switch (opts.videoQuality) {
      case 'low':
        command = command.videoBitrate('500k').audioBitrate('64k');
        break;
      case 'medium':
        command = command.videoBitrate('1000k').audioBitrate('128k');
        break;
      case 'lossless':
        command = command.videoCodec('libvpx-vp9').addOption('-lossless', '1');
        break;
      case 'high':
      default:
        command = command.videoBitrate('2000k').audioBitrate('192k');
        break;
    }
    
    // Custom bitrate jika disediakan
    if (opts.videoBitrate) {
      command = command.videoBitrate(opts.videoBitrate);
    }
    
    // Resize video jika diperlukan
    if (opts.videoResize) {
      const { width, height } = opts.videoResize;
      if (width || height) {
        const scale = width && height 
          ? `${width}:${height}` 
          : width 
            ? `${width}:-2` 
            : `-2:${height}`;
        command = command.videoFilters(`scale=${scale}`);
      }
    }
    
    // Add optimizations
    command = command
      .addOption('-cpu-used', '2') // Balance between speed and quality
      .addOption('-deadline', 'good') // Good quality deadline
      .addOption('-row-mt', '1') // Enable row-based multithreading
      .addOption('-tile-columns', '2') // Enable tile-based multithreading
      .addOption('-frame-parallel', '1'); // Enable frame parallel processing
    
    // Convert video
    await new Promise<void>((resolve, reject) => {
      command
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
    
    // Read converted file
    const { readFile } = await import('fs/promises');
    const convertedBuffer = await readFile(outputPath);
    
    const originalSize = inputBuffer.length;
    const convertedSize = convertedBuffer.length;
    const compressionRatio = ((originalSize - convertedSize) / originalSize) * 100;
    
    // Cleanup temporary files
    await Promise.all([
      unlink(inputPath).catch(() => {}),
      unlink(outputPath).catch(() => {}),
    ]);
    
    // Skip jika file hasil lebih besar dan opsi skipIfLarger aktif
    if (opts.skipIfLarger && convertedSize >= originalSize) {
      return {
        success: false,
        originalSize,
        error: 'Converted file is larger than original, keeping original format',
      };
    }
    
    return {
      success: true,
      buffer: convertedBuffer,
      mimeType: 'video/webm',
      originalSize,
      convertedSize,
      compressionRatio,
    };
    
  } catch (error) {
    // Cleanup temporary files on error
    await Promise.all([
      unlink(inputPath).catch(() => {}),
      unlink(outputPath).catch(() => {}),
    ]);
    
    return {
      success: false,
      originalSize: inputBuffer.length,
      error: error instanceof Error ? error.message : 'Video conversion failed',
    };
  }
}

/**
 * Fungsi universal untuk konversi media berdasarkan tipe file
 */
export async function convertMedia(
  inputBuffer: Buffer,
  originalFilename: string,
  mimeType: string,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  // Deteksi tipe file
  if (mimeType.startsWith('image/')) {
    // Skip jika sudah WebP
    if (mimeType === 'image/webp') {
      return {
        success: false,
        originalSize: inputBuffer.length,
        error: 'File already in WebP format',
      };
    }
    
    // Skip SVG karena sudah optimal
    if (mimeType === 'image/svg+xml') {
      return {
        success: false,
        originalSize: inputBuffer.length,
        error: 'SVG files are not converted',
      };
    }
    
    return convertImageToWebP(inputBuffer, options);
  }
  
  if (mimeType.startsWith('video/')) {
    // Skip jika sudah WebM
    if (mimeType === 'video/webm') {
      return {
        success: false,
        originalSize: inputBuffer.length,
        error: 'File already in WebM format',
      };
    }
    
    return convertVideoToWebM(inputBuffer, originalFilename, options);
  }
  
  return {
    success: false,
    originalSize: inputBuffer.length,
    error: 'File type not supported for conversion',
  };
}

/**
 * Utility untuk mendapatkan ekstensi file yang benar setelah konversi
 */
export function getConvertedExtension(mimeType: string): string {
  if (mimeType.startsWith('image/')) {
    return mimeType === 'image/svg+xml' ? 'svg' : 'webp';
  }
  if (mimeType.startsWith('video/')) {
    return 'webm';
  }
  return 'unknown';
}

/**
 * Utility untuk mendapatkan MIME type setelah konversi
 */
export function getConvertedMimeType(originalMimeType: string): string {
  if (originalMimeType.startsWith('image/')) {
    return originalMimeType === 'image/svg+xml' ? originalMimeType : 'image/webp';
  }
  if (originalMimeType.startsWith('video/')) {
    return 'video/webm';
  }
  return originalMimeType;
}


