'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type FAQItem = {
  question: string;
  answer: string;
};

const faqData: FAQItem[] = [
  {
    question: 'Apa itu Buku Tamu Digital?',
    answer: 'Buku Tamu Digital adalah platform digital untuk mencatat kehadiran tamu secara online, menggantikan buku tamu konvensional dengan solasi yang lebih praktis dan efisien.'
  },
  {
    question: 'Bagaimana cara menggunakan Buku Tamu Digital ini?',
    answer: 'Cukup isi formulir yang tersedia dengan data diri Anda, lalu klik tombol submit. Data Anda akan tercatat secara otomatis dalam sistem kami.'
  },
  {
    question: 'Apakah data saya aman?',
    answer: 'Ya, kami menjamin keamanan data pribadi Anda. Data yang dikumpulkan hanya akan digunakan untuk keperluan administrasi dan tidak akan disebarluaskan tanpa izin.'
  },
  {
    question: 'Bagaimana jika saya melakukan kesalahan dalam pengisian data?',
    answer: 'Silakan hubungi petugas yang bertugas untuk memperbaiki data yang salah. Mohon pastikan untuk memeriksa kembali data sebelum mengirimkan formulir.'
  },
  {
    question: 'Apakah ada biaya untuk menggunakan layanan ini?',
    answer: 'Tidak, layanan Buku Tamu Digital ini sepenuhnya gratis untuk digunakan oleh para tamu undangan.'
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-accent/50 transition-colors"
              onClick={() => toggleFAQ(index)}
            >
              <span className="font-medium">{item.question}</span>
              {openIndex === index ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            
            <div 
              className={`px-6 pb-4 pt-0 transition-all duration-300 overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              aria-expanded={openIndex === index}
            >
              <p className="text-muted-foreground">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
