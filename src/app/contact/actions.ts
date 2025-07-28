'use server';

import { sendContactEmail } from '@/lib/email';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Nama terlalu pendek'),
  email: z.string().email('Email tidak valid'),
  subject: z.string().min(5, 'Subjek terlalu pendek'),
  message: z.string().min(10, 'Pesan terlalu pendek'),
});

interface FormState {
  success: boolean;
  message: string;
  errors?: string[];
}

export async function submitContactForm(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const rawFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    // Validate form data
    const validatedData = contactSchema.safeParse(rawFormData);
    
    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;
      return { 
        success: false, 
        message: 'Validasi gagal',
        errors: Object.values(errors).flat()
      };
    }

    // Send email
    await sendContactEmail(validatedData.data);
    
    return { 
      success: true, 
      message: 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.' 
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { 
      success: false, 
      message: 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi nanti.',
      errors: []
    };
  }
}
