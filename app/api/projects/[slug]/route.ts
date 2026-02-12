import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// Get single project by slug
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        category:project_categories(*),
        technologies:project_technologies(
          technology:technologies(*)
        ),
        features:project_features(*)
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error || !project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await supabaseAdmin.rpc('increment_project_views', { 
      project_id: project.id 
    });

    return NextResponse.json({
      success: true,
      data: project,
    });

  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch project' 
      },
      { status: 500 }
    );
  }
}

// Update project (admin only)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();

    const updateData: any = {};
    
    // Only update fields that are provided
    const allowedFields = [
      'title', 'slug', 'short_description', 'detailed_description',
      'category_id', 'status', 'demo_url', 'github_url', 'case_study_url',
      'thumbnail_url', 'gallery_images', 'video_demo_url', 'start_date',
      'end_date', 'client_name', 'team_size', 'my_role', 'featured',
      'is_published', 'sort_order'
    ];

    // Normalize helper: convert empty string to null for date fields and optional text
    const toNullIfEmpty = (val: any) => (val === '' ? null : val);

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        if (field === 'start_date' || field === 'end_date') {
          updateData[field] = toNullIfEmpty(body[field]);
        } else if (
          field === 'demo_url' || field === 'github_url' || field === 'case_study_url' ||
          field === 'thumbnail_url' || field === 'video_demo_url' || field === 'client_name' ||
          field === 'my_role'
        ) {
          updateData[field] = toNullIfEmpty(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    });

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to update project' },
        { status: 500 }
      );
    }

    // Update technologies if provided
    if (body.technology_ids !== undefined) {
      // Remove existing technologies
      await supabaseAdmin
        .from('project_technologies')
        .delete()
        .eq('project_id', project.id);

      // Add new technologies
      if (body.technology_ids.length > 0) {
        const techData = body.technology_ids.map((tech_id: string) => ({
          project_id: project.id,
          technology_id: tech_id,
        }));

        await supabaseAdmin
          .from('project_technologies')
          .insert(techData);
      }
    }

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project updated successfully',
    });

  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update project' 
      },
      { status: 500 }
    );
  }
}

// Delete project (admin only)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('slug', slug);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete project' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });

  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete project' 
      },
      { status: 500 }
    );
  }
}