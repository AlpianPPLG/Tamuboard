import { NextResponse } from 'next/server';
import { sendFeedbackEmail } from '@/lib/email';

// Disable body parsing for file uploads
// This is important for Vercel's serverless functions
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to parse JSON body
async function parseJsonBody(request: Request) {
  try {
    return await request.json();
  } catch (error) {
    console.error('Error parsing JSON body:', error);
    return null;
  }
}

export async function POST(request: Request) {
  // Log the request for debugging
  console.log('Feedback request received');

  try {
    // Parse the JSON body
    const body = await parseJsonBody(request);
    if (!body) {
      console.error('Invalid JSON body');
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { guestName, feedback } = body;
    console.log('Parsed feedback data:', { guestName, hasFeedback: !!feedback });

    // Validate required fields
    if (!guestName || !feedback) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Nama tamu dan feedback harus diisi' },
        { status: 400 }
      );
    }

    // Send the feedback email
    console.log('Sending feedback email...');
    await sendFeedbackEmail(guestName, feedback);
    console.log('Feedback email sent successfully');

    return NextResponse.json({ 
      success: true,
      message: 'Feedback berhasil dikirim' 
    });

  } catch (error) {
    console.error('Error in feedback API:', error);
    
    // More detailed error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error details:', { errorMessage, errorStack });
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Gagal mengirim feedback',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
