import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { NewProfile } from '@/types/database';

// GET latest profile (single row)
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Failed to fetch profile' }, { status: 500 });
  }
}

// POST create profile
export async function POST(request: NextRequest) {
  try {
    const body: NewProfile = await request.json();
    if (!body.full_name) {
      return NextResponse.json({ success: false, error: 'full_name is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert([body])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: 'Failed to create profile' }, { status: 500 });
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Failed to create profile' }, { status: 500 });
  }
}

// PATCH update latest profile by id optionally
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id as string | undefined;

    let targetId = id;
    if (!targetId) {
      const { data: latest, error: latestErr } = await supabase
        .from('profiles')
        .select('id')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
      if (latestErr || !latest) {
        return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
      }
      targetId = latest.id;
    }

    delete body.id;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(body)
      .eq('id', targetId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Failed to update profile' }, { status: 500 });
  }
}


