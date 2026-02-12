import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Dynamic import for R2 to handle credential validation
async function getR2Client() {
  try {
    const { deleteFromR2 } = await import('@/lib/cloudflare-r2');
    return { deleteFromR2 };
  } catch (error) {
    console.warn('R2 client not available:', error);
    return null;
  }
}

// Delete uploaded file
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Get file info from database
    const { data: mediaFile, error: fetchError } = await supabaseAdmin
      .from('media_files')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !mediaFile) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    // Delete from Cloudflare R2
    const r2Client = await getR2Client();
    if (r2Client && mediaFile.file_path) {
      const deleteResult = await r2Client.deleteFromR2(mediaFile.file_path);
      
      if (!deleteResult?.success) {
        console.error('R2 delete error:', deleteResult?.error);
        // Continue with database deletion even if R2 delete fails
      }
    }

    // Delete from database
    const { error: dbError } = await supabaseAdmin
      .from('media_files')
      .delete()
      .eq('id', id);

    if (dbError) {
      console.error('Database delete error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete file from database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Delete failed' 
      },
      { status: 500 }
    );
  }
}

// Update file metadata
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const updateData: any = {};
    if (body.alt_text !== undefined) updateData.alt_text = body.alt_text;
    if (body.caption !== undefined) updateData.caption = body.caption;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.is_public !== undefined) updateData.is_public = body.is_public;

    const { data: updatedFile, error } = await supabaseAdmin
      .from('media_files')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database update error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update file' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedFile,
      message: 'File updated successfully',
    });

  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Update failed' 
      },
      { status: 500 }
    );
  }
}