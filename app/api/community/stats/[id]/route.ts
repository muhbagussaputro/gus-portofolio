import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
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
      .update({
        label,
        value,
        icon_name: icon_name || 'Users',
        description: description || null,
        sort_order: sort_order || 0,
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating community stat:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update community stat' },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Community stat not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in PATCH /api/community/stats/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    
    const { error } = await supabaseAdmin
      .from('community_stats')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting community stat:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete community stat' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Community stat deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/community/stats/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    
    const { data, error } = await supabaseAdmin
      .from('community_stats')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching community stat:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch community stat' },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Community stat not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in GET /api/community/stats/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
