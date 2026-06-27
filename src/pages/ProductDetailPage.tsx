import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Minus, Truck, ShieldCheck, RotateCcw, Check } from 'lucide-react';
import { supabase, type Product, formatPrice } from '../lib/supabase';
import { StarRating } from '../components/StarRating';
import { useCart } from '../context/CartContext';

type ProductDetailPageProps = {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
};

export function ProductDetailPage({ product, onBack, onSelectProduct }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [related, setRelated] = useState<Product[]>([]);
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCart();

  const images = [product.image_url, ...product.gallery].filter(Boolean) as string[];

  useEffect(() => {
    setActiveImage(0);
    setQuantity(1);
    setAdded(false);
    supabase
      .from('products')
      .select('*')
      .eq('category', product.category)
      .neq('id', product.id)
      .limit(4)
      .then(({ data }) => {
        if (data) setRelated(data as Product[]);
      });
  }, [product.id, product.category]);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to shop
      </button>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
            <img
              src={images[activeImage] ?? ''}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors ${
                    activeImage === i ? 'border-stone-900' : 'border-transparent hover:border-stone-300'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-sm font-medium uppercase tracking-wide text-stone-400">
            {product.category}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <StarRating rating={product.rating} size={16} showValue />
            <span className="text-sm text-stone-400">·</span>
            <span className="text-sm text-stone-500">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <p className="mt-6 text-3xl font-bold text-stone-900">
            {formatPrice(product.price_cents, product.currency)}
          </p>

          <p className="mt-5 text-base leading-relaxed text-stone-600">{product.description}</p>

          {product.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium capitalize text-stone-600"
                >
                  {tag.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
          )}

          {/* Quantity + add */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center rounded-full border border-stone-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="rounded-full p-3 text-stone-600 transition-colors hover:bg-stone-100"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-base font-semibold text-stone-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
                className="rounded-full p-3 text-stone-600 transition-colors hover:bg-stone-100 disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-stone-900 py-3.5 text-sm font-semibold text-white transition-all hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" />
                  Added to cart
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add to cart · {formatPrice(product.price_cents * quantity)}
                </>
              )}
            </button>
          </div>

          {added && (
            <button
              onClick={openCart}
              className="mt-3 text-sm font-medium text-stone-900 underline underline-offset-4 transition-colors hover:text-stone-600"
            >
              View cart
            </button>
          )}

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-stone-200 pt-6">
            {[
              { icon: Truck, label: 'Free shipping over $75' },
              { icon: RotateCcw, label: '30-day returns' },
              { icon: ShieldCheck, label: '2-year warranty' },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-2 text-center">
                <b.icon className="h-5 w-5 text-stone-700" />
                <span className="text-xs text-stone-500">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-stone-900">
            You might also like
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="group overflow-hidden rounded-2xl border border-stone-200 bg-white text-left transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-square overflow-hidden bg-stone-100">
                  <img
                    src={p.image_url ?? ''}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-stone-900">{p.name}</p>
                  <p className="mt-1 text-sm font-bold text-stone-900">{formatPrice(p.price_cents)}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
