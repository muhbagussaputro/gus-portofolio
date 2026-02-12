import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { NewSkill } from '@/types/database';

// Get skills with categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    let query = supabase
      .from('skills')
      .select(`
        *,
        skill_categories (
          name,
          description,
          icon_name
        )
      `)
      .order('sort_order', { ascending: true })
      .order('proficiency_level', { ascending: false });

    // Filter by category if provided
    if (category) {
      query = query.eq('skill_categories.name', category);
    }

    // Filter featured if requested
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    const { data: skills, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch skills' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: skills,
    });

  } catch (error) {
    console.error('Get skills error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch skills' 
      },
      { status: 500 }
    );
  }
}

// Create new skill
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const skillData: NewSkill = {
      name: body.name,
      category_id: body.category_id,
      proficiency_level: body.proficiency_level || 1,
      years_experience: body.years_experience || 0,
      description: body.description,
      icon_url: body.icon_url,
      is_featured: body.is_featured || false,
      sort_order: body.sort_order || 0,
    };

    const { data: skill, error } = await supabaseAdmin
      .from('skills')
      .insert([skillData])
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
        { success: false, error: 'Failed to create skill' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: skill,
      message: 'Skill created successfully',
    });

  } catch (error) {
    console.error('Create skill error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create skill' 
      },
      { status: 500 }
    );
  }
}