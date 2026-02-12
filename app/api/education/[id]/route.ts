import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Update education
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
      'institution', 'degree', 'field_of_study', 'start_date', 'end_date',
      'gpa', 'description', 'logo_url', 'is_current', 'sort_order'
    ];

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    const { data: education, error } = await supabaseAdmin
      .from('education')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update education record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: education,
      message: 'Education record updated successfully',
    });

  } catch (error) {
    console.error('Update education error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update education record' 
      },
      { status: 500 }
    );
  }
}

// Delete education
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { error } = await supabaseAdmin
      .from('education')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete education record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Education record deleted successfully',
    });

  } catch (error) {
    console.error('Delete education error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete education record' 
      },
      { status: 500 }
    );
  }
}