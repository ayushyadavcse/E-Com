import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AuthPage } from './pages/AuthPage';
import { CheckoutPage, OrderConfirmation } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import type { Product } from './lib/supabase';

type View = 'home' | 'products' | 'product' | 'auth' | 'checkout' | 'orders' | 'confirmation';

function AppContent() {
  const { user, loading } = useAuth();
  const { closeCart } = useCart();
  const [view, setView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view, selectedProduct]);

  const navigate = (v: 'home' | 'products' | 'auth' | 'orders') => {
    closeCart();
    setView(v);
  };

  const selectProduct = (product: Product) => {
    setSelectedProduct(product);
    setView('product');
  };

  const goToCheckout = () => {
    closeCart();
    if (!user) {
      setView('auth');
    } else {
      setView('checkout');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header onNavigate={navigate} currentView={view} />

      <main className="flex-1">
        {view === 'home' && <HomePage onNavigate={navigate} onSelectProduct={selectProduct} />}
        {view === 'products' && <ProductsPage onSelectProduct={selectProduct} />}
        {view === 'product' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setView('products')}
            onSelectProduct={selectProduct}
          />
        )}
        {view === 'auth' && (
          <AuthPage
            onSuccess={() => {
              setView(user ? 'home' : 'checkout');
            }}
          />
        )}
        {view === 'checkout' && (
          <CheckoutPage
            onBack={() => setView('products')}
            onOrderComplete={(id) => {
              setOrderId(id);
              setView('confirmation');
            }}
            onRequireAuth={() => setView('auth')}
          />
        )}
        {view === 'confirmation' && orderId && <OrderConfirmation orderId={orderId} />}
        {view === 'orders' && <OrdersPage />}
      </main>

      <Footer />
      <CartDrawer onCheckout={goToCheckout} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
