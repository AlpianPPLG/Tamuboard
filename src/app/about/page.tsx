"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TeamMemberCard } from "@/components/AboutComponent/TeamMemberCard"
import { MissionSection } from "@/components/AboutComponent/MissionSection"
import { StatsSection } from "@/components/AboutComponent/StatsSection"
import { ArrowRight, Users, Building, Clock, Zap } from "lucide-react"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Alpian",
      role: "Senior Developer",
      image: "/images/team/Alpian.jpg",
      bio: "Memiliki pengalaman lebih dari 5 tahun di bidang pengembangan aplikasi web dan mobile. Ahli dalam teknologi modern seperti Next.js, React, dan Node.js.",
      socials: {
        instagram: "https://instagram.com/_ubermensch7",
        linkedin: "https://www.linkedin.com/in/alpian-%E3%85%A4-7a16522bb/",
        github: "https://github.com/AlpianPPLG",
        whatsapp: "https://wa.me/628125844194",
        facebook: "https://www.facebook.com/Nova%20Pratama.id",
        thread: "https://www.threads.com/@_ubermensch7?xmt=AQF0M12vkH6fP0N0UmW59X0y2oEbeBUvcwGTCbQHZBNJtpA",
      },
    },
    {
      name: "Daffa",
      role: "Tester",
      image: "/images/team/Daffa.jpg",
      bio: "Tester aplikasi dengan kualitas terbaik dan memastikan aplikasi bekerja dengan lancar, serta memberikan feedback yang bermanfaat.",
      socials: {
        instagram: "https://instagram.com/dapp._4",
        whatsapp: "https://wa.me/6281383209729"
      },
    },
  ]

  const stats = [
    { 
      value: "1000+", 
      label: "Pengguna Aktif",
      icon: <Users className="h-6 w-6 text-primary" />
    },
    { 
      value: "50+", 
      label: "Perusahaan",
      icon: <Building className="h-6 w-6 text-primary" />
    },
    { 
      value: "24/7", 
      label: "Dukungan",
      icon: <Clock className="h-6 w-6 text-primary" />
    },
    { 
      value: "99.9%", 
      label: "Uptime",
      icon: <Zap className="h-6 w-6 text-primary" />
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Tentang Kami</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Menyediakan solusi manajemen tamu digital yang inovatif untuk bisnis dan organisasi di era modern.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Mulai Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => {
                const teamSection = document.getElementById('team-section');
                if (teamSection) {
                  teamSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Kenali Tim Kami
            </Button>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <MissionSection />

      {/* Stats */}
      <StatsSection stats={stats} />

      {/* Team Section */}
      <section id="team-section" className="py-16 bg-background scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tim Kami</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kenali tim di balik layar yang berdedikasi untuk memberikan pengalaman terbaik bagi Anda.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="w-full sm:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2.666rem)]">
                <TeamMemberCard {...member} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Siap Meningkatkan Pengelolaan Tamu Anda?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pengguna yang telah mempercayakan manajemen tamu mereka pada kami.
          </p>
          <Button size="lg" asChild>
            <Link href="/dashboard">
              Mulai Gratis Sekarang
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
