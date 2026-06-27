import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { supabase, type Product } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';

type ProductsPageProps = {
  onSelectProduct: (product: Product) => void;
};

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export function ProductsPage({ onSelectProduct }: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [sort, setSort] = useState<SortOption>('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    let query = supabase.from('products').select('*');
    if (category !== 'all') query = query.eq('category', category);
    if (sort === 'price-asc') query = query.order('price_cents', { ascending: true });
    else if (sort === 'price-desc') query = query.order('price_cents', { ascending: false });
    else if (sort === 'rating') query = query.order('rating', { ascending: false });
    else query = query.order('featured', { ascending: false }).order('rating', { ascending: false });

    query.then(({ data, error }) => {
      if (error) setError(error.message);
      else setProducts((data as Product[]) ?? []);
      setLoading(false);
    });
  }, [category, sort]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (p.price_cents > maxPrice) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [products, search, maxPrice]);

  const activeFilterCount = (category !== 'all' ? 1 : 0) + (maxPrice < 100000 ? 1 : 0) + (search ? 1 : 0);

  const clearFilters = () => {
    setCategory('all');
    setMaxPrice(100000);
    setSearch('');
    setSort('featured');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Shop all products
        </h1>
        <p className="mt-2 text-stone-500">
          {loading ? 'Loading…' : `${filtered.length} ${filtered.length === 1 ? 'product' : 'products'}`}
        </p>
      </div>

      {/* Search + sort bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, tags…"
            className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-900 outline-none transition-colors focus:border-stone-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 outline-none transition-colors focus:border-stone-400"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside
          className={`${
            filtersOpen ? 'block' : 'hidden'
          } w-full lg:block lg:w-60 lg:flex-shrink-0`}
        >
          <div className="sticky top-24 space-y-6 rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-900">
                Filters
              </h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs font-medium text-stone-500 transition-colors hover:text-stone-900"
                >
                  <X className="h-3 w-3" />
                  Clear all
                </button>
              )}
            </div>

            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
                Category
              </h3>
              <div className="space-y-1.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm capitalize transition-colors ${
                      category === c
                        ? 'bg-stone-900 font-medium text-white'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {c === 'all' ? 'All categories' : c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
                Max price
              </h3>
              <input
                type="range"
                min={0}
                max={100000}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-stone-900"
              />
              <div className="mt-1 flex justify-between text-xs text-stone-500">
                <span>$0</span>
                <span className="font-medium text-stone-900">
                  ${Math.floor(maxPrice / 100).toLocaleString()}+
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
              {error}
            </div>
          ) : loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-stone-200 bg-white p-4">
                  <div className="aspect-square rounded-xl bg-stone-200" />
                  <div className="mt-4 h-4 w-2/3 rounded bg-stone-200" />
                  <div className="mt-2 h-3 w-1/3 rounded bg-stone-200" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 py-20 text-center">
              <p className="text-lg font-medium text-stone-900">No products found</p>
              <p className="mt-1 text-sm text-stone-500">Try adjusting your filters or search.</p>
              <button
                onClick={clearFilters}
                className="mt-4 rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
