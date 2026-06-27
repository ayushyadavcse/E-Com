import { Store } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-white">
                <Store className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-stone-900">Vanshika-Mart</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-stone-500">
              Thoughtfully designed objects for everyday living, from independent makers.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Shop</h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-500">
              <li><span className="cursor-pointer transition-colors hover:text-stone-900">All products</span></li>
              <li><span className="cursor-pointer transition-colors hover:text-stone-900">Featured</span></li>
              <li><span className="cursor-pointer transition-colors hover:text-stone-900">New arrivals</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Support</h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-500">
              <li><span className="cursor-pointer transition-colors hover:text-stone-900">Shipping</span></li>
              <li><span className="cursor-pointer transition-colors hover:text-stone-900">Returns</span></li>
              <li><span className="cursor-pointer transition-colors hover:text-stone-900">Warranty</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Company</h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-500">
              <li><span className="cursor-pointer transition-colors hover:text-stone-900">About</span></li>
              <li><span className="cursor-pointer transition-colors hover:text-stone-900">Makers</span></li>
              <li><span className="cursor-pointer transition-colors hover:text-stone-900">Contact</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-stone-200 pt-6 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} Vanshika-Mart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
