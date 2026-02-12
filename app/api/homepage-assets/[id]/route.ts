import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET - Fetch a specific homepage asset by ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    
    const { data: asset, error } = await supabaseAdmin
      .from('homepage_assets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Homepage asset not found' }, { status: 404 });
      }
      console.error('Error fetching homepage asset:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(asset, { status: 200 });
    
  } catch (error) {
    console.error('Error in GET /api/homepage-assets/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update a specific homepage asset
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    // Remove id from body to prevent updating it
    const { id: _, created_at, updated_at, ...updateData } = body;
    
    // Validate asset_type if it's being updated
    if (updateData.asset_type) {
      const validAssetTypes = ['profile_photo', 'background_video', 'animation', 'logo', 'social_media_image'];
      if (!validAssetTypes.includes(updateData.asset_type)) {
        return NextResponse.json(
          { error: `Invalid asset_type. Must be one of: ${validAssetTypes.join(', ')}` },
          { status: 400 }
        );
      }
    }
    
    const { data: asset, error } = await supabaseAdmin
      .from('homepage_assets')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Homepage asset not found' }, { status: 404 });
      }
      console.error('Error updating homepage asset:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(asset, { status: 200 });
    
  } catch (error) {
    console.error('Error in PATCH /api/homepage-assets/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific homepage asset
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    
    // First get the asset to check if it exists and get file info for cleanup
    const { data: asset, error: fetchError } = await supabaseAdmin
      .from('homepage_assets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Homepage asset not found' }, { status: 404 });
      }
      console.error('Error fetching homepage asset for deletion:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }
    
    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('homepage_assets')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('Error deleting homepage asset:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
    
    // TODO: Optionally delete the file from Cloudflare R2
    // This could be implemented later based on requirements
    
    return NextResponse.json(
      { message: 'Homepage asset deleted successfully', deleted_asset: asset },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error in DELETE /api/homepage-assets/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}