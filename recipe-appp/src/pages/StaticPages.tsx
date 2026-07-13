import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Home, Mail, Send } from 'lucide-react';
import { useToastStore } from '@/store/toastStore';

function StaticShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="font-display text-4xl font-semibold mb-6">{title}</h1>
      <div className="prose-sm text-ink-700 dark:text-cream-200 space-y-4 leading-relaxed">{children}</div>
    </div>
  );
}

export function AboutPage() {
  return (
    <StaticShell title="About Simmer">
      <p>
        Simmer is a recipe discovery app built for weeknight cooks. Search by ingredient or
        craving, filter down to what fits your diet and your schedule, then step through the
        recipe with a distraction-free cooking mode built for a countertop, not a couch.
      </p>
      <p>
        Recipe data is sourced from TheMealDB's community-contributed collection, with your
        favorites, collections, meal plans, and shopping lists stored locally in your browser —
        no account required.
      </p>
    </StaticShell>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const showToast = useToastStore((s) => s.showToast);

  return (
    <StaticShell title="Contact us">
      <p>Questions, feedback, or a recipe request? Send us a note.</p>
      {sent ? (
        <p className="text-basil-600 font-medium">Thanks — we'll get back to you soon.</p>
      ) : (
        <form
          className="not-prose space-y-3 max-w-md"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            showToast('Message sent', 'success');
          }}
        >
          <input required placeholder="Your name" className="input" />
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input required type="email" placeholder="Your email" className="input !pl-9" />
          </div>
          <textarea required placeholder="Message" className="input min-h-28" />
          <button className="btn-primary" type="submit">
            <Send size={15} /> Send message
          </button>
        </form>
      )}
    </StaticShell>
  );
}

export function PrivacyPage() {
  return (
    <StaticShell title="Privacy policy">
      <p>
        Simmer is a frontend-only demo application. Favorites, collections, shopping lists, meal
        plans, and profile details are stored using your browser's local storage and are never
        transmitted to a server.
      </p>
      <p>Clearing your browser's site data will permanently remove this information.</p>
    </StaticShell>
  );
}

export function TermsPage() {
  return (
    <StaticShell title="Terms of use">
      <p>
        Simmer is provided as a demonstration project. Recipe content is sourced from TheMealDB
        and community contributions, and is provided as-is without warranty.
      </p>
    </StaticShell>
  );
}

export function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
      <p className="font-display text-7xl font-semibold text-saffron-500 mb-4">404</p>
      <h1 className="font-display text-2xl font-semibold mb-2">Recipe not found</h1>
      <p className="text-ink-500 dark:text-cream-300 mb-6">
        The page you're looking for burned on the stove. Let's get you back to the kitchen.
      </p>
      <Link to="/" className="btn-primary">
        <Home size={16} /> Back to home
      </Link>
    </div>
  );
}
