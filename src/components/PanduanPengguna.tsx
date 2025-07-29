"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft } from 'lucide-react';

export default function PanduanPengguna() {
  const router = useRouter();
  const panduanList = [
    {
      id: "pendahuluan",
      title: "Pendahuluan",
      content: "Selamat datang di TamuBoard, aplikasi manajemen buku tamu digital. Panduan ini akan membantu Anda memahami cara menggunakan aplikasi dengan efektif."
    },
    {
      id: "fitur-utama",
      title: "Fitur Utama",
      content: [
        "1. Pendaftaran Tamu - Daftarkan tamu dengan mudah melalui form online",
        "2. Pencarian Tamu - Temukan data tamu dengan cepat menggunakan fitur pencarian",
        "3. Ekspor Data - Ekspor data tamu dalam format Excel atau PDF",
        "4. Notifikasi - Dapatkan notifikasi untuk kunjungan tamu"
      ]
    },
    {
      id: "panduan-penggunaan",
      title: "Panduan Penggunaan",
      content: [
        "1. Buka halaman dashboard untuk melihat ringkasan aktivitas",
        "2. Gunakan menu navigasi untuk mengakses fitur yang diinginkan",
        "3. Untuk menambahkan tamu baru, klik tombol 'Tambah Tamu' dan isi formulir",
        "4. Gunakan fitur pencarian untuk menemukan data tamu dengan cepat"
      ]
    },
    {
      id: "bantuan",
      title: "Butuh Bantuan?",
      content: "Jika Anda mengalami kesulitan atau memiliki pertanyaan, jangan ragu untuk menghubungi tim dukungan kami melalui halaman kontak yang tersedia."
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Panduan Penggunaan Aplikasi</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {panduanList.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left">
                {item.title}
              </AccordionTrigger>
              <AccordionContent>
                {Array.isArray(item.content) ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {item.content.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{item.content}</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    <CardFooter className="flex justify-end">
      <Button 
        variant="outline" 
        onClick={() => router.push('/')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Beranda
      </Button>
    </CardFooter>
    </Card>
  );
}
