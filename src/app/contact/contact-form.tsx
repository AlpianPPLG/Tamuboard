'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { submitContactForm } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`w-full py-3 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 ${
        pending ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Mengirim...
        </>
      ) : (
        'Kirim Pesan'
      )}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, {
    success: false,
    message: '',
    errors: []
  });

  // Show toast when form is submitted
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else if (state.errors && state.errors.length > 0) {
        toast.error('Terdapat kesalahan dalam pengisian form', {
          description: state.errors.join(', ')
        });
      } else if (!state.success) {
        toast.error(state.message || 'Terjadi kesalahan. Silakan coba lagi.');
      }
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Masukkan nama lengkap"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="contoh@email.com"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">
          Subjek <span className="text-red-500">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="Tentang apa pesan Anda?"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Pesan <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tulis pesan Anda di sini..."
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
          required
        ></textarea>
      </div>
      
      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
