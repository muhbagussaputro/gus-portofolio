import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Update skill
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
      'name', 'category_id', 'proficiency_level', 'years_experience',
      'description', 'icon_url', 'is_featured', 'sort_order'
    ];

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    const { data: skill, error } = await supabaseAdmin
      .from('skills')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        skill_categories (
          name,
          description,
          icon_name
        )
      `)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update skill' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: skill,
      message: 'Skill updated successfully',
    });

  } catch (error) {
    console.error('Update skill error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update skill' 
      },
      { status: 500 }
    );
  }
}

// Delete skill
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { error } = await supabaseAdmin
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete skill' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Skill deleted successfully',
    });

  } catch (error) {
    console.error('Delete skill error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete skill' 
      },
      { status: 500 }
    );
  }
}