import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { NewEducation } from '@/types/database';

// Create new education
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const educationData: NewEducation = {
      institution: body.institution,
      degree: body.degree,
      field_of_study: body.field_of_study,
      start_date: body.start_date,
      end_date: body.end_date,
      gpa: body.gpa,
      description: body.description,
      logo_url: body.logo_url,
      is_current: body.is_current || false,
      sort_order: body.sort_order || 0,
    };

    const { data: education, error } = await supabaseAdmin
      .from('education')
      .insert([educationData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create education record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: education,
      message: 'Education record created successfully',
    });

  } catch (error) {
    console.error('Create education error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create education record' 
      },
      { status: 500 }
    );
  }
}