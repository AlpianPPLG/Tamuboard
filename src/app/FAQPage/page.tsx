import { Metadata } from 'next';
import { FAQ } from '@/components/FAQComponent/faq';
import { ContactButton } from '@/components/ui/contact-button';
import { PageHeader } from '@/components/navigation/page-header';

export const metadata: Metadata = {
  title: 'FAQ - Buku Tamu Digital',
  description: 'Pertanyaan yang sering diajukan tentang Buku Tamu Digital',
};

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PageHeader showForwardButton={false} />
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Temukan jawaban atas pertanyaan yang sering diajukan</p>
      </div>
      
      <div className="mb-16">
        <FAQ />
      </div>
      
      <div className="flex justify-center mb-20">
        <ContactButton />
      </div>
    </div>
  );
}
