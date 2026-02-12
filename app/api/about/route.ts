import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Get about data (education, experience, skills)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section'); // education, experience, skills

    if (section === 'education') {
      const { data: education, error } = await supabaseAdmin
        .from('education')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('start_date', { ascending: false });

      if (error) {
        return NextResponse.json(
          { success: false, error: 'Failed to fetch education data' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: education,
      });
    }

    if (section === 'experience') {
      const { data: experience, error } = await supabaseAdmin
        .from('experience')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('start_date', { ascending: false });

      if (error) {
        return NextResponse.json(
          { success: false, error: 'Failed to fetch experience data' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: experience,
      });
    }

    if (section === 'skills') {
      const { data: skills, error } = await supabaseAdmin
        .from('skills')
        .select(`
          *,
          category:skill_categories(*)
        `)
        .order('sort_order', { ascending: true });

      if (error) {
        return NextResponse.json(
          { success: false, error: 'Failed to fetch skills data' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: skills,
      });
    }

    // Get all about data
    const [educationResult, experienceResult, skillsResult] = await Promise.all([
      supabaseAdmin
        .from('education')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('start_date', { ascending: false }),
      
      supabaseAdmin
        .from('experience')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('start_date', { ascending: false }),
      
      supabaseAdmin
        .from('skills')
        .select(`
          *,
          category:skill_categories(*)
        `)
        .order('sort_order', { ascending: true })
    ]);

    if (educationResult.error || experienceResult.error || skillsResult.error) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch about data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        education: educationResult.data,
        experience: experienceResult.data,
        skills: skillsResult.data,
      },
    });

  } catch (error) {
    console.error('Get about data error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch about data' 
      },
      { status: 500 }
    );
  }
}