import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { NewMediaFile } from '@/types/database';
import { convertMedia, getConvertedExtension, getConvertedMimeType } from '@/lib/media-converter';

// Dynamic import for R2 to handle credential validation
async function getR2Functions() {
  try {
    const { uploadToR2, generateFileName, validateFile } = await import('@/lib/cloudflare-r2');
    return { uploadToR2, generateFileName, validateFile };
  } catch (error) {
    console.warn('R2 functions not available:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get R2 functions dynamically
    const r2Functions = await getR2Functions();
    
    if (!r2Functions) {
      return NextResponse.json(
        { success: false, error: 'Upload service not configured. Please check R2 credentials.' },
        { status: 503 }
      );
    }

    const { uploadToR2, generateFileName, validateFile } = r2Functions;

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const customName = formData.get('custom_name') as string;
    const folderPath = formData.get('folder_path') as string;
    const altText = formData.get('alt_text') as string;
    const caption = formData.get('caption') as string;
    const tags = formData.get('tags') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file - support lebih banyak format yang bisa dikonversi
    const validation = validateFile(file, {
      maxSize: 100 * 1024 * 1024, // 100MB (lebih besar karena akan dikompres)
      allowedTypes: [
        // Format gambar yang akan dikonversi ke WebP
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/webp', // Sudah optimal
        'image/gif',
        'image/bmp',
        'image/tiff',
        'image/svg+xml', // Tidak dikonversi
        
        // Format video yang akan dikonversi ke WebM  
        'video/mp4',
        'video/webm', // Sudah optimal
        'video/mov',
        'video/avi',
        'video/mkv',
        'video/flv',
        'video/wmv',
        'video/quicktime',
        
        // Dokumen tidak dikonversi
        'application/pdf',
      ],
    });

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    let buffer = new Uint8Array(arrayBuffer);
    let finalMimeType = file.type;
    let finalFileName = customName || generateFileName(file.name);
    
    // Lakukan konversi media jika memungkinkan
    console.log(`[UPLOAD] Starting conversion for ${file.name} (${file.type})`);
    const conversionResult = await convertMedia(
      Buffer.from(buffer), 
      file.name, 
      file.type,
      {
        imageQuality: 85, // Kualitas tinggi untuk gambar
        videoQuality: 'high', // Kualitas tinggi untuk video
        skipIfLarger: true, // Skip jika hasil lebih besar
      }
    );
    
    if (conversionResult.success && conversionResult.buffer) {
      // Konversi berhasil, gunakan file yang sudah dikonversi
      buffer = new Uint8Array(conversionResult.buffer);
      finalMimeType = conversionResult.mimeType!;
      
      // Update ekstensi filename
      const newExtension = getConvertedExtension(file.type);
      const nameWithoutExt = finalFileName.substring(0, finalFileName.lastIndexOf('.')) || finalFileName;
      finalFileName = `${nameWithoutExt}.${newExtension}`;
      
      // Log hasil konversi
      console.log(`[UPLOAD] ✅ Conversion successful for ${file.name}:`);
      console.log(`  Original: ${conversionResult.originalSize} bytes (${file.type})`);
      console.log(`  Converted: ${conversionResult.convertedSize} bytes (${finalMimeType})`);
      console.log(`  Compression: ${conversionResult.compressionRatio?.toFixed(1)}% reduction`);
    } else {
      // Konversi gagal atau tidak diperlukan, gunakan file asli
      console.log(`[UPLOAD] ⚠️ Conversion skipped for ${file.name}: ${conversionResult.error}`);
    }
    
    // Add folder path if provided
    const fullPath = folderPath ? `${folderPath}/${finalFileName}` : finalFileName;

    // Upload to Cloudflare R2
    const uploadResult = await uploadToR2(
      buffer,
      fullPath,
      finalMimeType,
      category
    );

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: uploadResult.error },
        { status: 500 }
      );
    }

    // Get image/video dimensions if applicable
    let width: number | null = null;
    let height: number | null = null;
    let duration: number | null = null;

    // For images, you might want to add image processing library to get dimensions
    // For videos, you might want to add ffprobe or similar

    // Save file info to database
    const mediaData: NewMediaFile = {
      filename: finalFileName,
      original_filename: file.name,
      file_path: fullPath,
      file_url: uploadResult.file_url!,
      file_type: finalMimeType,
      file_size: buffer.length, // Ukuran file setelah konversi
      width,
      height,
      duration,
      alt_text: altText || null,
      caption: caption || null,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : null,
      is_public: true,
      uploaded_by: 'admin', // You might want to implement authentication
    };

    const { data: mediaFile, error: dbError } = await supabaseAdmin
      .from('media_files')
      .insert([mediaData])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to save file info to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mediaFile,
      file_url: uploadResult.file_url,
      file_path: uploadResult.file_path,
      filename: finalFileName,
      file_size: buffer.length, // Ukuran file setelah konversi
      file_type: finalMimeType,
      original_filename: file.name,
      original_file_type: file.type,
      original_file_size: file.size,
      converted: conversionResult.success,
      compression_ratio: conversionResult.compressionRatio || 0,
      width,
      height,
      duration,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      },
      { status: 500 }
    );
  }
}

// Get uploaded files
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type'); // image, video, etc.
    const tags = searchParams.get('tags'); // comma-separated

    let query = supabaseAdmin
      .from('media_files')
      .select('*', { count: 'exact' })
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    // Filter by file type
    if (type) {
      query = query.like('file_type', `${type}/%`);
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query = query.overlaps('tags', tagArray);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: files, count, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch files' },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      success: true,
      data: files,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Get files error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch files' 
      },
      { status: 500 }
    );
  }
}