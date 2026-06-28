import { ShoppingBag, User, LogOut, Store } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

type HeaderProps = {
  onNavigate: (view: 'home' | 'products' | 'auth' | 'orders') => void;
  currentView: string;
};

export function Header({ onNavigate, currentView }: HeaderProps) {
  const { totalItems, openCart } = useCart();
  const { user, fullName, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-900 text-white">
            <Store className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-stone-900">Maison</span>
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          <button
            onClick={() => onNavigate('home')}
            className={`text-sm font-medium transition-colors ${
              currentView === 'home' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('products')}
            className={`text-sm font-medium transition-colors ${
              currentView === 'products' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Shop All
          </button>
          {user && (
            <button
              onClick={() => onNavigate('orders')}
              className={`text-sm font-medium transition-colors ${
                currentView === 'orders' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Orders
            </button>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white">
                  {(fullName ?? user.email ?? '?')[0].toUpperCase()}
                </div>
                <span className="hidden max-w-[120px] truncate sm:inline">
                  {fullName ?? 'Account'}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-lg">
                  <div className="border-b border-stone-100 px-4 py-3">
                    <p className="truncate text-sm font-medium text-stone-900">{fullName ?? 'Account'}</p>
                    <p className="truncate text-xs text-stone-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigate('orders');
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-stone-700 transition-colors hover:bg-stone-50"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-stone-700 transition-colors hover:bg-stone-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Sign in</span>
            </button>
          )}

          <button
            onClick={openCart}
            className="relative flex items-center gap-1.5 rounded-full bg-stone-900 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-bold text-stone-900">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
