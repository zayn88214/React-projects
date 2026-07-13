import { Link } from 'react-router-dom';
import { Soup, Instagram, Twitter, Youtube, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-900/5 dark:border-cream-100/10 bg-cream-50 dark:bg-surface-darkcard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold mb-3">
            <span className="w-8 h-8 rounded-full bg-saffron-500 flex items-center justify-center text-ink-900">
              <Soup size={18} />
            </span>
            Simmer
          </Link>
          <p className="text-sm text-ink-500 dark:text-cream-300 max-w-xs mb-4">
            Find what to cook tonight — searchable, filterable, and always ready for your next
            grocery run.
          </p>
          <div className="flex gap-3">
            {[Instagram, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="w-9 h-9 rounded-full bg-ink-900/5 dark:bg-cream-100/10 flex items-center justify-center hover:bg-saffron-500 hover:text-ink-900 transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <FooterCol
          title="Discover"
          links={[
            ['Search', '/search'],
            ['Categories', '/categories'],
            ['Cuisines', '/cuisines'],
            ['Meal Planner', '/meal-planner'],
          ]}
        />
        <FooterCol
          title="Your Kitchen"
          links={[
            ['Favorites', '/favorites'],
            ['Collections', '/collections'],
            ['Shopping List', '/shopping-list'],
            ['Create Recipe', '/create-recipe'],
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            ['About', '/about'],
            ['Contact', '/contact'],
            ['Privacy', '/privacy'],
            ['Terms', '/terms'],
          ]}
        />
      </div>

      <div className="border-t border-ink-900/5 dark:border-cream-100/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-500 dark:text-cream-300">
            © {new Date().getFullYear()} Simmer. Recipe data via TheMealDB.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-2 w-full sm:w-auto"
            aria-label="Newsletter signup"
          >
            <div className="relative flex-1 sm:w-64">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
              <input type="email" required placeholder="Your email" className="input !pl-9 !py-2" />
            </div>
            <button className="btn-primary !py-2">Subscribe</button>
          </form>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link to={to} className="text-sm text-ink-500 dark:text-cream-300 hover:text-saffron-600">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
