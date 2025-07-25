'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BackButton() {
  return (
    <Link href="/">
      <Button 
        variant="ghost" 
        className="mb-6 -ml-2 hover:bg-accent flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </Button>
    </Link>
  );
}
