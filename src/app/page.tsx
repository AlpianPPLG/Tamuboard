"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const features = [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Manajemen Tamu Mudah",
      description: "Kelola data tamu dengan cepat dan efisien dalam satu platform terintegrasi."
    },
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: "Jadwal Kunjungan",
      description: "Atur jadwal kunjungan tamu dan dapatkan notifikasi sebelum kedatangan."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Keamanan Terjamin",
      description: "Data tamu tersimpan aman dengan sistem keamanan tingkat tinggi."
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Waktu Efisien",
      description: "Proses pendaftaran tamu yang cepat dan tanpa ribet."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Selamat Datang di Buku Tamu Digital
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Solusi modern untuk manajemen tamu yang efisien dan profesional. 
            Dapatkan pengalaman mengelola tamu yang lebih baik mulai sekarang.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/dashboard" className="gap-2">
                Mulai Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">
                Pelajari Lebih Lanjut
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Mengapa Memilih Kami?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Solusi lengkap untuk manajemen tamu yang lebih baik dan efisien
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="h-full transition-all hover:shadow-lg">
              <CardHeader>
                <div className="p-2 rounded-lg bg-primary/10 w-fit mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Siap Meningkatkan Pengelolaan Tamu Anda?</h2>
            <p className="text-muted-foreground mb-8">
              Bergabunglah dengan ratusan pengguna yang telah mempercayakan manajemen tamu mereka pada kami.
              Gratis untuk dicoba, mudah digunakan, dan memberikan hasil yang memuaskan.
            </p>
            <Button size="lg" asChild>
              <Link href="/dashboard" className="gap-2">
                Mulai Sekarang - Gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">Buku Tamu Digital</h3>
              <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Kebijakan Privasi
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Syarat & Ketentuan
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Kontak
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
