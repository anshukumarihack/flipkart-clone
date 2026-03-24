import heroBanner from "@/assets/hero-banner.jpg";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES, Product } from "@/data/mockData"; 
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Zap, Shield, Truck, RotateCcw } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface APIProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  brand?: string;
  category?: string;
  subcategory?: string;
  isFeatured?: boolean;
  discount?: number;
  originalPrice?: number;
  stock?: number;
  description?: string;
  rating?: number;
  reviewCount?: number;
  seller?: string;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts({ limit: 20 }) // Increased limit to ensure categories have enough items
      .then((data) => {
        // DATA NORMALIZATION:
        // This ensures that if the API returns 'image' (string), 
        // it gets converted into 'images' (array) which your UI expects.
        const normalizedProducts: Product[] = data.products.map((p: APIProduct) => ({
          // Set defaults for all required fields in the 'Product' type
          id: p.id,
          name: p.name,
          price: p.price,
          brand: p.brand || "Generic",
          category: p.category || "Uncategorized",
          subcategory: p.subcategory || "",
          stock: p.stock ?? 10,
          description: p.description || "",
          // Handle the Image Mismatch: Convert string to array
          images: Array.isArray(p.images) 
            ? p.images 
            : (p.image ? [p.image] : ["/placeholder.jpg"]),
          // Optional fields
          originalPrice: p.originalPrice || p.price,
          discount: p.discount || 0,
          isFeatured: p.isFeatured || false,
          highlights: [], // Required by Product interface
          tags: [],       // Required by Product interface
          rating: p.rating || 0,        // Added missing field
          reviewCount: p.reviewCount || 0, // Added missing field
          seller: p.seller || "Seller",    // Added missing field
          specs: {}
        }));

        setProducts(normalizedProducts as Product[]);
      })
      .catch((err) => console.error("Home Load Error:", err))
      .finally(() => setLoading(false));
  }, []);

  const featured = products.filter((p) => p.isFeatured);
  const topDeals = [...products].sort((a, b) => (b.discount || 0) - (a.discount || 0)).slice(0, 4);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-[280px] sm:h-[380px] md:h-[460px]">
          <img src={heroBanner} alt="Sale Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex items-center">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
              <p className="text-yellow-300 text-sm font-semibold tracking-widest uppercase mb-2">Limited Time Event</p>
              <h1 className="text-white text-3xl sm:text-5xl font-extrabold leading-tight mb-3">
                Big Billion<br />Days Sale
              </h1>
              <p className="text-white/80 text-sm sm:text-base mb-6">Up to 80% off on top electronics, fashion & more</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="bg-blue-600 text-white px-6 py-2.5 rounded font-semibold text-sm hover:bg-blue-700 transition-all shadow-md">
                  Shop Now →
                </Link>
                <Link to="/products?discount=50" className="bg-white/15 border border-white/30 text-white px-6 py-2.5 rounded font-semibold text-sm hover:bg-white/25 transition-all backdrop-blur-sm">
                  Top Deals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-b border-border shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, title: "Free Delivery", sub: "On orders above ₹500" },
              { icon: RotateCcw, title: "Easy Returns", sub: "10-day return policy" },
              { icon: Shield, title: "Secure Payments", sub: "100% protected" },
              { icon: Zap, title: "Fast Shipping", sub: "2-day delivery available" },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{title}</p>
                  <p className="text-[11px] text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-10">
        {loading && (
          <p className="text-center py-10 text-muted-foreground">Loading products…</p>
        )}

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Shop by Category</h2>
            <Link to="/products" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => (
              <Link key={cat.id} to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-50 flex items-center justify-center text-2xl transition-all duration-200 group-hover:shadow-md group-hover:scale-105">
                  {cat.icon}
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-center leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Top Deals */}
        {!loading && topDeals.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-orange-500" fill="currentColor" />
                <h2 className="text-lg font-bold">Today's Top Deals</h2>
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">LIVE</span>
              </div>
              <Link to="/products?sort=discount" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {topDeals.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* Category sections */}
        {['Electronics','Fashion','Home & Kitchen','Sports'].map(cat => {
          const items = products.filter(p => p.category === cat);
          if (!items.length) return null;
          return (
            <section key={cat}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">{cat}</h2>
                <Link to={`/products?category=${encodeURIComponent(cat)}`} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              <Carousel>
                <CarouselContent className="pb-4">
                  {items.map(p => (
                    <CarouselItem key={p.id} className="basis-1/2 md:basis-1/4 lg:basis-1/5">
                      <div className="p-1">
                        <ProductCard product={p} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            </section>
          );
        })}

        {/* Featured Products */}
        {!loading && featured.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Featured Products</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>

      <footer className="bg-slate-900 text-white mt-10">
        <div className="max-w-[1400px] mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            { title: "About", links: ["About Us", "Careers", "Press"] },
            { title: "Help", links: ["Payments", "Shipping", "Returns"] },
            { title: "Policy", links: ["Privacy", "Terms", "Security"] },
            { title: "Social", links: ["Facebook", "Twitter", "YouTube"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-semibold text-slate-400 uppercase text-xs tracking-widest mb-3">{title}</h4>
              <ul className="space-y-1.5 text-sm text-slate-300">
                {links.map((l) => <li key={l}><a href="#" className="hover:text-white">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 text-center py-4 text-slate-500 text-xs">
          © 2026 Flipkart Clone — Built with React + Redux Toolkit.
        </div>
      </footer>
    </main>
  );
};

export default Home;