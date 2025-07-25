import { Metadata } from 'next';
import { BackButton } from '@/components/ui/back-button';
import { ForwardButton } from '@/components/ui/forward-button';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read our Terms of Service and understand the terms and conditions for using our services.',
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <BackButton />
        <ForwardButton variant="ghost" className="text-muted-foreground hover:text-foreground" />
      </div>
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-8">
        <section className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. 
            Your use of our services is also subject to our Privacy Policy. Please review our Privacy Policy, which also governs 
            the website and informs users of our data collection practices.
          </p>
        </section>

        <section className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">2. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
            <li>You are responsible for maintaining the confidentiality of your account and password.</li>
            <li>You agree to use this service only for lawful purposes and in accordance with these Terms of Service.</li>
            <li>You must not misuse or disrupt the services (e.g., by accessing the site using a method other than the interface).</li>
            <li>You must not attempt to access any of our services through any automated means.</li>
          </ul>
        </section>

        <section className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Service and its original content, features, and functionality are and will remain the exclusive property of our company 
            and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the 
            prior written consent of our company.
          </p>
        </section>

        <section className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">4. Changes to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any 
            significant changes through our website or by other means. Your continued use of the Service after any such changes 
            constitutes your acceptance of the new Terms.
          </p>
        </section>

        <section className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about these Terms, please contact us at support@example.com.
          </p>
        </section>
      </div>
    </div>
  );
}
