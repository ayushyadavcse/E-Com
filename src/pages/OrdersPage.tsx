import { useEffect, useState } from 'react';
import { Package, Loader2 } from 'lucide-react';
import { supabase, formatPrice, type Order, type OrderItem } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

type OrderWithItems = Order & { order_items: OrderItem[] };

const statusStyles: Record<Order['status'], string> = {
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-blue-100 text-blue-700',
  fulfilled: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setOrders(data as OrderWithItems[]);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-stone-900">Sign in to view your orders</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-stone-900">Your orders</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 py-20 text-center">
          <div className="rounded-full bg-stone-100 p-6">
            <Package className="h-10 w-10 text-stone-400" />
          </div>
          <p className="mt-4 text-lg font-medium text-stone-900">No orders yet</p>
          <p className="mt-1 text-sm text-stone-500">
            When you place an order, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 bg-stone-50 px-6 py-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-stone-500">Order</p>
                    <p className="font-mono text-sm font-semibold text-stone-900">
                      {order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500">Placed</p>
                    <p className="text-sm font-medium text-stone-900">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-bold text-stone-900">
                    {formatPrice(order.total_cents, order.currency)}
                  </span>
                </div>
              </div>
              <ul className="divide-y divide-stone-100">
                {order.order_items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <p className="text-sm font-medium text-stone-900">{item.name}</p>
                      <p className="text-xs text-stone-500">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-stone-900">
                      {formatPrice(item.price_cents * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
