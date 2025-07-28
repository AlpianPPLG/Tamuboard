"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">Syarat dan Ketentuan</h1>
        <p className="text-muted-foreground mb-8">
          Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Penggunaan Layanan</h2>
          <p className="mb-4">
            Dengan mengakses dan menggunakan Buku Tamu Digital, Anda menyetujui untuk terikat dengan syarat dan ketentuan yang ditetapkan di sini.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Akun Pengguna</h2>
          <p className="mb-4">Untuk menggunakan layanan kami, Anda mungkin perlu membuat akun. Anda bertanggung jawab untuk:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Menjaga kerahasiaan informasi akun Anda</li>
            <li>Segera memberi tahu kami tentang penggunaan yang tidak sah atas akun Anda</li>
            <li>Menerima tanggung jawab penuh atas semua aktivitas yang terjadi di bawah akun Anda</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Konten Pengguna</h2>
          <p className="mb-4">
            Anda bertanggung jawab penuh atas konten yang Anda unggah atau bagikan melalui layanan kami. Anda setuju untuk tidak mengunggah konten yang:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Melanggar hak kekayaan intelektual orang lain</li>
            <li>Bersifat menghasut, memfitnah, atau melanggar privasi</li>
            <li>Mengandung virus atau kode berbahaya lainnya</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Pembatasan Tanggung Jawab</h2>
          <p className="mb-4">
            Layanan ini disediakan apa adanya tanpa jaminan apa pun. Kami tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan layanan ini.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Perubahan pada Syarat dan Ketentuan</h2>
          <p className="mb-4">
            Kami berhak untuk memodifikasi syarat dan ketentuan ini kapan saja. Perubahan akan berlaku segera setelah diposting di halaman ini.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Hukum yang Berlaku</h2>
          <p>
            Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia.
          </p>
        </section>
      </div>
    </div>
  );
}
