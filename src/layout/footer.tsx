"use client"

import { Heart } from "lucide-react";
import { TermService } from "@/components/Term&ServiceComponent/term-service";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span> 2025 Made with</span>
              <Heart className="h-3 w-3 text-red-500 fill-current" />
              <span>by</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-foreground">Alpian</span>
              <span>•</span>
              <span>All rights reserved</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs sm:text-sm">
            <TermService />
            <a 
              href="/Term&ServicePage" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Full Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}