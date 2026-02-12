import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Update experience
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updateData: any = {};
    
    // Only update fields that are provided
    const allowedFields = [
      'title', 'company', 'location', 'start_date', 'end_date',
      'description', 'company_logo_url', 'is_current', 'sort_order'
    ];

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    const { data: experience, error } = await supabaseAdmin
      .from('experience')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update experience record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: experience,
      message: 'Experience record updated successfully',
    });

  } catch (error) {
    console.error('Update experience error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update experience record' 
      },
      { status: 500 }
    );
  }
}

// Delete experience
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { error } = await supabaseAdmin
      .from('experience')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete experience record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Experience record deleted successfully',
    });

  } catch (error) {
    console.error('Delete experience error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete experience record' 
      },
      { status: 500 }
    );
  }
}