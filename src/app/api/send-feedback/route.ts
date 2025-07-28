import { NextResponse } from 'next/server';
import { sendFeedbackEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { guestName, feedback } = await request.json();

    if (!guestName || !feedback) {
      return NextResponse.json(
        { error: 'Nama tamu dan feedback harus diisi' },
        { status: 400 }
      );
    }

    await sendFeedbackEmail(guestName, feedback);

    return NextResponse.json({ message: 'Feedback berhasil dikirim' });
  } catch (error) {
    console.error('Error sending feedback email:', error);
    return NextResponse.json(
      { error: 'Gagal mengirim feedback' },
      { status: 500 }
    );
  }
}
