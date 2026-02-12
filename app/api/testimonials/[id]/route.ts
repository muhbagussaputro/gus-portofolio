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
      .update({
        name,
        role,
        company: company || null,
        content,
        rating: rating || 5,
        avatar_url: avatar_url || null,
        is_featured: is_featured || false,
        is_published: is_published !== undefined ? is_published : true,
        sort_order: sort_order || 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating testimonial:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update testimonial' },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in PATCH /api/testimonials/[id]:', error);
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
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting testimonial:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete testimonial' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/testimonials/[id]:', error);
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
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching testimonial:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch testimonial' },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in GET /api/testimonials/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
