import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { NewCommunityMessage } from '@/types/database';

// Submit community message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get IP address from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    const messageData: NewCommunityMessage = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      message: body.message.trim(),
      message_type: body.message_type || 'inquiry',
      ip_address: ip,
      user_agent: request.headers.get('user-agent'),
    };

    const { data: message, error } = await supabaseAdmin
      .from('community_messages')
      .insert([messageData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to submit message' },
        { status: 500 }
      );
    }

    // TODO: Send email notification to admin
    // TODO: Send auto-reply email to user

    return NextResponse.json({
      success: true,
      data: message,
      message: 'Message submitted successfully! I will get back to you soon.',
    });

  } catch (error) {
    console.error('Submit message error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to submit message' 
      },
      { status: 500 }
    );
  }
}

// Get community messages (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let query = supabaseAdmin
      .from('community_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Filter by status
    if (status) {
      query = query.eq('status', status);
    }

    // Filter by message type
    if (type) {
      query = query.eq('message_type', type);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: messages, count, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      success: true,
      data: messages,
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
    console.error('Get messages error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch messages' 
      },
      { status: 500 }
    );
  }
}