'use client';

import { BackButton } from '@/components/ui/back-button';
import { ForwardButton } from '@/components/ui/forward-button';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface PageHeaderProps {
  showForwardButton?: boolean;
  showSettingsButton?: boolean;
}

export function PageHeader({ 
  showForwardButton = false, 
  showSettingsButton = true 
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <BackButton />
      <div className="flex gap-2">
        {showForwardButton && (
          <ForwardButton variant="ghost" className="text-muted-foreground hover:text-foreground" />
        )}
        {showSettingsButton && (
          <Button variant="ghost" size="icon" asChild>
            <a href="/settings">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
