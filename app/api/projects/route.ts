import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { NewProject } from '@/types/database';

// Get projects with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    let query = supabase
      .from('projects')
      .select(`
        *,
        category:project_categories(*),
        technologies:project_technologies(
          technology:technologies(*)
        )
      `, { count: 'exact' })
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    // Filter by category
    if (category && category !== 'all') {
      query = query.eq('category_id', category);
    }

    // Filter by featured
    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    // Search in title and description
    if (search) {
      query = query.or(`title.ilike.%${search}%, short_description.ilike.%${search}%`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: projects, count, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch projects' 
      },
      { status: 500 }
    );
  }
}

// Create new project (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const projectData: NewProject = {
      title: body.title,
      slug: body.slug,
      short_description: body.short_description,
      detailed_description: body.detailed_description,
      category_id: body.category_id,
      status: body.status || 'completed',
      demo_url: body.demo_url,
      github_url: body.github_url,
      case_study_url: body.case_study_url,
      thumbnail_url: body.thumbnail_url,
      gallery_images: body.gallery_images,
      video_demo_url: body.video_demo_url,
      start_date: body.start_date,
      end_date: body.end_date,
      client_name: body.client_name,
      team_size: body.team_size,
      my_role: body.my_role,
      featured: body.featured || false,
      is_published: body.is_published !== false,
      sort_order: body.sort_order || 0,
    };

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create project' },
        { status: 500 }
      );
    }

    // Add technologies if provided
    if (body.technology_ids && body.technology_ids.length > 0) {
      const techData = body.technology_ids.map((tech_id: string) => ({
        project_id: project.id,
        technology_id: tech_id,
      }));

      await supabaseAdmin
        .from('project_technologies')
        .insert(techData);
    }

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project created successfully',
    });

  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create project' 
      },
      { status: 500 }
    );
  }
}