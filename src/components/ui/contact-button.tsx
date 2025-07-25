"use client";

import { Button } from "./button";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

interface ContactButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost" | "link";
}

export function ContactButton({ className, variant = "default" }: ContactButtonProps) {
  return (
    <Button asChild variant={variant} className={className}>
      <Link href="/contact" className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        <span>Contact Us</span>
      </Link>
    </Button>
  );
}
