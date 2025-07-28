import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hubungi Kami - Buku Tamu Digital',
  description: 'Hubungi kami untuk pertanyaan lebih lanjut',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
