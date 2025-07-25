"use client";

import { Button } from "./button";
import { Settings } from "lucide-react";
import Link from "next/link";

interface SettingsButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function SettingsButton({ 
  className, 
  variant = "ghost",
  size = "default"
}: SettingsButtonProps) {
  return (
    <Button 
      asChild 
      variant={variant} 
      size={size}
      className={className}
    >
      <Link href="/settings" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        {size !== "icon" && <span>Settings</span>}
      </Link>
    </Button>
  );
}
