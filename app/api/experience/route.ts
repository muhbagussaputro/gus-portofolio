import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { NewExperience } from '@/types/database';

// Create new experience
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const experienceData: NewExperience = {
      title: body.title,
      company: body.company,
      location: body.location,
      start_date: body.start_date,
      end_date: body.end_date,
      description: body.description,
      company_logo_url: body.company_logo_url,
      is_current: body.is_current || false,
      sort_order: body.sort_order || 0,
    };

    const { data: experience, error } = await supabaseAdmin
      .from('experience')
      .insert([experienceData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create experience record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: experience,
      message: 'Experience record created successfully',
    });

  } catch (error) {
    console.error('Create experience error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create experience record' 
      },
      { status: 500 }
    );
  }
}