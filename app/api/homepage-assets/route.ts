import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { NewHomepageAsset } from '@/types/database';

// GET - Fetch all homepage assets with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assetType = searchParams.get('asset_type');
    const isActive = searchParams.get('is_active');
    
    let query = supabaseAdmin
      .from('homepage_assets')
      .select('*')
      .order('sort_order', { ascending: true });
    
    // Filter by asset type if provided
    if (assetType) {
      query = query.eq('asset_type', assetType);
    }
    
    // Filter by active status if provided
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }
    
    const { data: assets, error } = await query;
    
    if (error) {
      console.error('Error fetching homepage assets:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(assets, { status: 200 });
    
  } catch (error) {
    console.error('Error in GET /api/homepage-assets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new homepage asset
export async function POST(request: NextRequest) {
  try {
    const body: NewHomepageAsset = await request.json();
    
    // Validate required fields
    if (!body.asset_type || !body.title || !body.file_url || !body.file_type) {
      return NextResponse.json(
        { error: 'Missing required fields: asset_type, title, file_url, file_type' },
        { status: 400 }
      );
    }
    
    // Validate asset_type enum
    const validAssetTypes = ['profile_photo', 'background_video', 'animation', 'logo', 'social_media_image'];
    if (!validAssetTypes.includes(body.asset_type)) {
      return NextResponse.json(
        { error: `Invalid asset_type. Must be one of: ${validAssetTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    const { data: asset, error } = await supabaseAdmin
      .from('homepage_assets')
      .insert([body])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating homepage asset:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(asset, { status: 201 });
    
  } catch (error) {
    console.error('Error in POST /api/homepage-assets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}