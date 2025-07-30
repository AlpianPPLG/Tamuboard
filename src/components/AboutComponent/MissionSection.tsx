"use client"

import { cn } from "@/lib/utils"
import { Target, Heart, Shield } from "lucide-react"

export function MissionSection({ className }: { className?: string }) {
  return (
    <div className={cn("py-12 bg-muted/50", className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Misi & Nilai Kami</h2>
          <p className="text-muted-foreground">
            Kami berkomitmen untuk menyediakan solusi manajemen tamu digital yang andal, aman, dan mudah digunakan untuk berbagai kebutuhan bisnis dan organisasi.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-background p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Misi Kami</h3>
            <p className="text-muted-foreground">
              Menyederhanakan proses manajemen tamu dengan solusi digital yang inovatif dan efisien.
            </p>
          </div>
          
          <div className="bg-background p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nilai Inti</h3>
            <p className="text-muted-foreground">
              Integritas, inovasi, dan kepuasan pelanggan adalah fondasi dari setiap keputusan kami.
            </p>
          </div>
          
          <div className="bg-background p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Komitmen</h3>
            <p className="text-muted-foreground">
              Memberikan layanan terbaik dengan dukungan penuh dan pembaruan berkelanjutan.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
