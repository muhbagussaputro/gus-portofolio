import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Get project categories
export async function GET(request: NextRequest) {
  try {
    const { data: categories, error } = await supabaseAdmin
      .from('project_categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch project categories' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: categories,
    });

  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch project categories' 
      },
      { status: 500 }
    );
  }
}