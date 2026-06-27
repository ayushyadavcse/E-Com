import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check .env for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  currency: string;
  image_url: string | null;
  gallery: string[];
  category: string;
  tags: string[];
  rating: number;
  stock: number;
  featured: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  status: 'pending' | 'paid' | 'fulfilled' | 'cancelled';
  total_cents: number;
  currency: string;
  shipping_address: ShippingAddress | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  price_cents: number;
  quantity: number;
  created_at: string;
};

export type ShippingAddress = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export function formatPrice(cents: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}
