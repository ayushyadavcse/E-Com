import { useState } from 'react';
import { ArrowLeft, Lock, Loader2, CreditCard, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase, formatPrice, type ShippingAddress } from '../lib/supabase';

type CheckoutPageProps = {
  onBack: () => void;
  onOrderComplete: (orderId: string) => void;
  onRequireAuth: () => void;
};

export function CheckoutPage({ onBack, onOrderComplete, onRequireAuth }: CheckoutPageProps) {
  const { items, subtotalCents, clearCart } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState<ShippingAddress>({
    fullName: '',
    email: user?.email ?? '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingCents = subtotalCents >= 7500 || subtotalCents === 0 ? 0 : 795;
  const taxCents = Math.round(subtotalCents * 0.08);
  const totalCents = subtotalCents + shippingCents + taxCents;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      onRequireAuth();
      return;
    }
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          total_cents: totalCents,
          currency: 'usd',
          shipping_address: form,
        })
        .select('id')
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        name: item.product.name,
        price_cents: item.product.price_cents,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      onOrderComplete(order.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-stone-900">Your cart is empty</h1>
        <p className="mt-2 text-stone-500">Add products before checking out.</p>
        <button
          onClick={onBack}
          className="mt-6 rounded-full bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800"
        >
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <h1 className="mb-8 text-3xl font-bold tracking-tight text-stone-900">Checkout</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {!user && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-900">Sign in required</p>
                <p className="text-sm text-amber-700">
                  You'll need an account to complete your purchase.{' '}
                  <button
                    type="button"
                    onClick={onRequireAuth}
                    className="font-semibold underline underline-offset-2"
                  >
                    Sign in or create an account
                  </button>
                </p>
              </div>
            </div>
          )}

          <section>
            <h2 className="mb-4 text-lg font-semibold text-stone-900">Shipping address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                value={form.fullName}
                onChange={(v) => setForm({ ...form, fullName: v })}
                required
                className="sm:col-span-2"
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                required
                className="sm:col-span-2"
              />
              <Field
                label="Street address"
                value={form.address}
                onChange={(v) => setForm({ ...form, address: v })}
                required
                className="sm:col-span-2"
              />
              <Field
                label="City"
                value={form.city}
                onChange={(v) => setForm({ ...form, city: v })}
                required
              />
              <Field
                label="State / Province"
                value={form.state}
                onChange={(v) => setForm({ ...form, state: v })}
                required
              />
              <Field
                label="ZIP / Postal code"
                value={form.zip}
                onChange={(v) => setForm({ ...form, zip: v })}
                required
              />
              <Field
                label="Country"
                value={form.country}
                onChange={(v) => setForm({ ...form, country: v })}
                required
              />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-stone-900">Payment</h2>
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-200">
                  <CreditCard className="h-5 w-5 text-stone-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">Secure payment via Stripe</p>
                  <p className="text-xs text-stone-500">
                    Payment integration is ready to activate — see the note below.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 py-4 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            Place order · {formatPrice(totalCents)}
          </button>
        </form>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-stone-900">Order summary</h2>
            <ul className="mb-4 space-y-3">
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-3">
                  <div className="relative">
                    <img
                      src={item.product.image_url ?? ''}
                      alt={item.product.name}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-stone-900 px-1 text-xs font-bold text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-sm font-medium text-stone-900">{item.product.name}</p>
                    <p className="text-xs text-stone-500">{item.product.category}</p>
                  </div>
                  <p className="self-center text-sm font-medium text-stone-900">
                    {formatPrice(item.product.price_cents * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-stone-200 pt-4 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotalCents)} />
              <Row
                label="Shipping"
                value={shippingCents === 0 ? 'Free' : formatPrice(shippingCents)}
              />
              <Row label="Estimated tax" value={formatPrice(taxCents)} />
              <div className="flex items-center justify-between border-t border-stone-200 pt-3 text-base font-semibold text-stone-900">
                <span>Total</span>
                <span>{formatPrice(totalCents)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  className = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-stone-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-900 outline-none transition-colors focus:border-stone-400"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-stone-600">
      <span>{label}</span>
      <span className="font-medium text-stone-900">{value}</span>
    </div>
  );
}

export function OrderConfirmation({ orderId }: { orderId: string }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-stone-900">Order placed!</h1>
      <p className="mt-3 max-w-md text-stone-500">
        Thank you for your purchase. Your order has been received and is now pending payment
        confirmation. You can track its status from your orders page.
      </p>
      <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 px-6 py-4">
        <p className="text-sm text-stone-500">Order number</p>
        <p className="mt-1 font-mono text-sm font-semibold text-stone-900">
          {orderId.slice(0, 8).toUpperCase()}
        </p>
      </div>
    </div>
  );
}
