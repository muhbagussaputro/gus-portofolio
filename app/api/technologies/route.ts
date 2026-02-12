import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Get technologies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // frontend, backend, database, etc.

    let query = supabaseAdmin
      .from('technologies')
      .select('*')
      .order('name', { ascending: true });

    // Filter by category if provided
    if (category) {
      query = query.eq('category', category);
    }

    const { data: technologies, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch technologies' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: technologies,
    });

  } catch (error) {
    console.error('Get technologies error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch technologies' 
      },
      { status: 500 }
    );
  }
}