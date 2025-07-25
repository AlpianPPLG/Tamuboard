import React from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

export function TermService() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-muted-foreground hover:text-foreground text-sm p-0 h-auto">
          Terms & Service
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Last updated: {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 text-sm">
          <section>
            <h3 className="font-semibold mb-2">1. Acceptance of Terms</h3>
            <p className="text-muted-foreground">
              By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">2. User Responsibilities</h3>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>You are responsible for maintaining the confidentiality of your account information</li>
              <li>You agree to use this service only for lawful purposes</li>
              <li>You must not misuse or disrupt the services</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">3. Privacy Policy</h3>
            <p className="text-muted-foreground">
              Your use of this service is also governed by our Privacy Policy. Please review our Privacy Policy, which is incorporated into these Terms of Service by this reference.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">4. Changes to Terms</h3>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. We will provide notice of any significant changes through our website or by other means.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
