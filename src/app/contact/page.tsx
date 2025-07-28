"use client";

import { PageHeader } from '@/components/navigation/page-header';
import dynamic from 'next/dynamic';

// Dynamically import the ContactForm component with SSR disabled
const ContactForm = dynamic(() => import('./contact-form'), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center">Memuat formulir...</div>,
});

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PageHeader showForwardButton={false} />
      
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Hubungi Kami</h1>
        <p className="text-muted-foreground">Kirim pesan untuk pertanyaan atau masukan Anda</p>
      </div>
      
      <div className="bg-card p-6 sm:p-8 rounded-lg shadow-sm border">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Kirim Pesan</h2>
            <p className="text-muted-foreground">
              Ada pertanyaan atau masukan? Isi formulir di bawah ini dan kami akan segera menghubungi Anda.
            </p>
          </div>
          
          <ContactForm />
          
          <div className="pt-8 mt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Informasi Kontak</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.3l2-2.6c.4-.5 1-.8 1.7-.8h4c.7 0 1.3.3 1.7.8l2 2.6H20a2 2 0 0 1 1.2.4z"/>
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alamat</p>
                  <p className="font-medium">Samarinda, Kalimantan Timur, Indonesia</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telepon</p>
                  <p className="font-medium">+62 823 5487 7197</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">Nova07pplg@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
