"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">Kebijakan Privasi</h1>
        <p className="text-muted-foreground mb-8">
          Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Pendahuluan</h2>
          <p className="mb-4">
            Selamat datang di Buku Tamu Digital. Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Data yang Kami Kumpulkan</h2>
          <p className="mb-4">Kami mengumpulkan beberapa jenis data, termasuk:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Informasi yang Anda berikan saat mendaftar (nama, email, nomor telepon)</li>
            <li>Data kunjungan (tanggal, waktu, tujuan)</li>
            <li>Informasi perangkat yang digunakan untuk mengakses layanan kami</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Penggunaan Data</h2>
          <p className="mb-4">Data yang kami kumpulkan digunakan untuk:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Menyediakan dan memelihara layanan kami</li>
            <li>Memperbaiki dan menganalisis penggunaan layanan</li>
            <li>Mendeteksi dan mencegah penipuan</li>
            <li>Memenuhi kewajiban hukum</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Perlindungan Data</h2>
          <p className="mb-4">
            Kami menerapkan langkah-langkah keamanan yang sesuai untuk melindungi data pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Perubahan pada Kebijakan Privasi</h2>
          <p className="mb-4">
            Kami dapat memperbarui Kebijakan Privasi kami dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan apa pun dengan memposting Kebijakan Privasi baru di halaman ini.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Hubungi Kami</h2>
          <p>
            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di:
          </p>
          <p className="mt-2">
            Email: privasi@bukutamudigital.com<br />
            Telepon: (021) 1234-5678
          </p>
        </section>
      </div>
    </div>
  );
}
