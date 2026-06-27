import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/supabase';

type CartDrawerProps = {
  onCheckout: () => void;
};

export function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotalCents, totalItems } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Shopping cart"
      >
        <header className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-stone-700" />
            <h2 className="text-lg font-semibold text-stone-900">
              Your Cart {totalItems > 0 && <span className="text-stone-500">({totalItems})</span>}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="rounded-full p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="rounded-full bg-stone-100 p-6">
              <ShoppingBag className="h-10 w-10 text-stone-400" />
            </div>
            <p className="text-lg font-medium text-stone-900">Your cart is empty</p>
            <p className="text-sm text-stone-500">Add some products to get started.</p>
            <button
              onClick={closeCart}
              className="mt-2 rounded-full bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.product.id} className="flex gap-4">
                    <img
                      src={item.product.image_url ?? ''}
                      alt={item.product.name}
                      className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <p className="text-sm font-medium text-stone-900">{item.product.name}</p>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-stone-400 transition-colors hover:text-red-600"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-stone-500">{item.product.category}</p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-stone-200">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="rounded-full p-1.5 text-stone-600 transition-colors hover:bg-stone-100"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="rounded-full p-1.5 text-stone-600 transition-colors hover:bg-stone-100 disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-stone-900">
                          {formatPrice(item.product.price_cents * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-stone-200 px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-stone-600">Subtotal</span>
                <span className="text-xl font-semibold text-stone-900">
                  {formatPrice(subtotalCents)}
                </span>
              </div>
              <p className="mb-4 text-xs text-stone-500">
                Shipping and taxes calculated at checkout.
              </p>
              <button
                onClick={onCheckout}
                className="w-full rounded-full bg-stone-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
              >
                Proceed to Checkout
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
