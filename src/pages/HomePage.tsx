import { ArrowRight, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, type Product } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';

type HomePageProps = {
  onNavigate: (view: 'products') => void;
  onSelectProduct: (product: Product) => void;
};

export function HomePage({ onNavigate, onSelectProduct }: HomePageProps) {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('rating', { ascending: false })
      .limit(4)
      .then(({ data, error }) => {
        if (!error && data) setFeatured(data as Product[]);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-50 via-stone-100 to-amber-50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-stone-300 bg-white/60 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-stone-600 backdrop-blur">
              New season collection
            </span>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Thoughtfully designed objects for everyday living.
            </h1>
            <p className="max-w-md text-lg text-stone-600">
              Curated essentials from independent makers. Built to last, designed to delight —
              shipped to your door.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('products')}
                className="group flex items-center gap-2 rounded-full bg-stone-900 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-stone-800"
              >
                Shop the collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => onNavigate('products')}
                className="rounded-full border border-stone-300 bg-white/60 px-7 py-3.5 text-sm font-semibold text-stone-800 backdrop-blur transition-colors hover:bg-white"
              >
                Browse all
              </button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {featured.slice(0, 4).map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className={`overflow-hidden rounded-2xl bg-white shadow-lg transition-transform hover:-translate-y-1 ${
                    i % 2 === 0 ? 'translate-y-6' : ''
                  }`}
                >
                  <img
                    src={p.image_url ?? ''}
                    alt={p.name}
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { icon: Truck, title: 'Free shipping', desc: 'On all orders over $75' },
            { icon: RotateCcw, title: '30-day returns', desc: 'No-questions-asked policy' },
            { icon: ShieldCheck, title: '2-year warranty', desc: 'On every product we sell' },
          ].map((v) => (
            <div key={v.title} className="flex items-center gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-stone-100">
                <v.icon className="h-5 w-5 text-stone-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">{v.title}</p>
                <p className="text-sm text-stone-500">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Featured products
            </h2>
            <p className="mt-1 text-stone-500">Our most-loved pieces this season.</p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="hidden items-center gap-1.5 text-sm font-semibold text-stone-900 transition-colors hover:text-stone-600 sm:flex"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-stone-200 bg-white p-4">
                <div className="aspect-square rounded-xl bg-stone-200" />
                <div className="mt-4 h-4 w-2/3 rounded bg-stone-200" />
                <div className="mt-2 h-3 w-1/3 rounded bg-stone-200" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
            ))}
          </div>
        )}
      </section>

      {/* Editorial banner */}
      <section className="bg-stone-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            The Maison promise
          </p>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Quality you can feel, design you'll love for years.
          </h2>
          <p className="max-w-xl text-stone-400">
            Every product is selected for craftsmanship, durability, and timeless design —
            so it earns its place in your life.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="group flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-stone-900 transition-all hover:bg-stone-100"
          >
            Explore the shop
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
