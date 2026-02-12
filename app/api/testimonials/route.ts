import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Get testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit');
    const includeUnpublished = searchParams.get('include_unpublished') === 'true';
    
    let query = supabaseAdmin
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (!includeUnpublished) {
      query = query.eq('is_published', true);
    }
    
    if (featured) {
      query = query.eq('is_featured', true);
    }
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch testimonials' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch testimonials' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, company, content, rating, avatar_url, is_featured, is_published, sort_order } = body;
    
    // Validation
    if (!name || !role || !content) {
      return NextResponse.json(
        { success: false, error: 'Name, role, and content are required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert({
        name,
        role,
        company: company || null,
        content,
        rating: rating || 5,
        avatar_url: avatar_url || null,
        is_featured: is_featured || false,
        is_published: is_published !== undefined ? is_published : true,
        sort_order: sort_order || 0
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating testimonial:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create testimonial' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in POST /api/testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}