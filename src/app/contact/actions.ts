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
  console.log('Form submission started');
  
  try {
    // Extract form data
    const rawFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    console.log('Raw form data received:', { 
      hasName: !!rawFormData.name,
      hasEmail: !!rawFormData.email,
      hasSubject: !!rawFormData.subject,
      hasMessage: !!rawFormData.message,
      env: {
        emailUser: process.env.EMAIL_USER ? 'Set' : 'Not Set',
        nodeEnv: process.env.NODE_ENV || 'development'
      }
    });

    // Validate form data
    const validatedData = contactSchema.safeParse(rawFormData);
    
    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;
      const errorMessages = Object.values(errors).flat();
      
      console.error('Validation failed:', { errors: errorMessages });
      
      return { 
        success: false, 
        message: 'Validasi gagal',
        errors: errorMessages
      };
    }

    console.log('Form data validated successfully');
    
    try {
      // Send email
      console.log('Attempting to send contact email...');
      await sendContactEmail(validatedData.data);
      console.log('Contact email sent successfully');
      
      return { 
        success: true, 
        message: 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.' 
      };
    } catch (emailError) {
      console.error('Error sending contact email:', emailError);
      
      // Check if it's a known error from the email service
      const errorMessage = emailError instanceof Error 
        ? emailError.message 
        : 'Gagal mengirim email';
      
      return { 
        success: false, 
        message: `Gagal mengirim pesan: ${errorMessage}`,
        errors: []
      };
    }
  } catch (error) {
    console.error('Unexpected error in submitContactForm:', error);
    
    return { 
      success: false, 
      message: 'Terjadi kesalahan tak terduga. Silakan coba lagi nanti.',
      errors: []
    };
  }
}
