'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

type ForwardButtonProps = {
  className?: string;
  variant?: 'default' | 'ghost' | 'outline' | 'link' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
};

export function ForwardButton({
  className = '',
  variant = 'ghost',
  size = 'default',
  showText = true,
}: ForwardButtonProps) {
  return (
    <Link href="/FAQPage">
      <Button 
        variant={variant}
        size={size}
        className={`flex items-center gap-2 ${className}`}
      >
        {showText && <span>FAQ</span>}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </Link>
  );
}