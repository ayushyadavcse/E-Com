import { Plus } from 'lucide-react';
import type { Product } from '../lib/supabase';
import { formatPrice } from '../lib/supabase';
import { StarRating } from './StarRating';
import { useCart } from '../context/CartContext';

type ProductCardProps = {
  product: Product;
  onSelect: (product: Product) => void;
};

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <button
        onClick={() => onSelect(product)}
        className="relative aspect-square overflow-hidden bg-stone-100"
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.image_url ?? ''}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-stone-900/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            Featured
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-full bg-stone-900 px-4 py-1.5 text-sm font-semibold text-white">
              Sold out
            </span>
          </div>
        )}
      </button>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
          {product.category}
        </p>
        <button
          onClick={() => onSelect(product)}
          className="mt-1 text-left text-base font-semibold text-stone-900 transition-colors hover:text-stone-600"
        >
          {product.name}
        </button>
        <div className="mt-1.5">
          <StarRating rating={product.rating} showValue />
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-stone-500">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-stone-900">
            {formatPrice(product.price_cents, product.currency)}
          </span>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="flex items-center gap-1.5 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
