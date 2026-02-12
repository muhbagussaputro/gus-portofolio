import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('include_inactive') === 'true';
    
    let query = supabaseAdmin
      .from('community_stats')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching community stats:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch community stats' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error in GET /api/community/stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { label, value, icon_name, description, sort_order, is_active } = body;
    
    // Validation
    if (!label || !value) {
      return NextResponse.json(
        { success: false, error: 'Label and value are required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabaseAdmin
      .from('community_stats')
      .insert({
        label,
        value,
        icon_name: icon_name || 'Users',
        description: description || null,
        sort_order: sort_order || 0,
        is_active: is_active !== undefined ? is_active : true
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating community stat:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create community stat' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in POST /api/community/stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}