import { useState } from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react";

interface FilterSidebarProps {
  onFilter: (filters: FilterState) => void;
  filters: FilterState;
  categories: string[];
  brands: string[];
}

export interface FilterState {
  category: string;
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  discount: number;
  specs: Record<string, string[]>;
}

const FilterSection = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-sm font-semibold text-foreground mb-1">
        {title}
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
};

const FilterSidebar = ({ onFilter, filters, categories, brands }: FilterSidebarProps) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const update = (patch: Partial<FilterState>) => {
    const updated = { ...localFilters, ...patch };
    setLocalFilters(updated);
    onFilter(updated);
  };

  const toggleBrand = (brand: string) => {
    const newBrands = localFilters.brands.includes(brand)
      ? localFilters.brands.filter((b) => b !== brand)
      : [...localFilters.brands, brand];
    update({ brands: newBrands });
  };

  const toggleCategory = (cat: string) => {
    update({ category: localFilters.category === cat ? "" : cat });
  };

  const ratings = [4, 3, 2, 1];
  const discounts = [10, 20, 30, 40, 50];

  return (
    <aside className="bg-card rounded-lg shadow-card p-4 sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-foreground">Filters</h2>
        <button onClick={() => { const reset: FilterState = { category: "", brands: [], minPrice: 0, maxPrice: 300000, minRating: 0, inStockOnly: false, discount: 0, specs: {} }; setLocalFilters(reset); onFilter(reset); }} className="text-xs text-primary-brand font-medium hover:underline">
          Clear All
        </button>
      </div>

      {/* Category */}
      <FilterSection title="Category">
        {categories.map((cat) => (
          <label key={cat} className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={localFilters.category === cat} onChange={() => toggleCategory(cat)} className="accent-primary w-3.5 h-3.5 rounded" />
            <span className="text-sm text-foreground group-hover:text-primary-brand transition-colors">{cat}</span>
          </label>
        ))}
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brand">
        {brands.map((brand) => (
          <label key={brand} className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={localFilters.brands.includes(brand)} onChange={() => toggleBrand(brand)} className="accent-primary w-3.5 h-3.5 rounded" />
            <span className="text-sm text-foreground group-hover:text-primary-brand transition-colors">{brand}</span>
          </label>
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="px-1">
          <input type="range" min={0} max={300000} step={1000} value={localFilters.maxPrice}
            onChange={(e) => update({ maxPrice: Number(e.target.value) })}
            className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>₹0</span>
            <span className="font-semibold text-foreground">Up to ₹{localFilters.maxPrice.toLocaleString()}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[10000, 25000, 50000, 100000].map((price) => (
            <button key={price} onClick={() => update({ maxPrice: price })}
              className={`filter-chip text-center py-1 text-xs ${localFilters.maxPrice === price ? "filter-chip-active" : ""}`}>
              Under ₹{(price / 1000).toFixed(0)}K
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Customer Ratings">
        {ratings.map((r) => (
          <label key={r} className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" name="rating" checked={localFilters.minRating === r} onChange={() => update({ minRating: r })} className="accent-primary w-3.5 h-3.5" />
            <span className="flex items-center gap-1 text-sm text-foreground group-hover:text-primary-brand">
              {r} <Star size={11} fill="currentColor" className="text-warning" /> & above
            </span>
          </label>
        ))}
        {localFilters.minRating > 0 && (
          <button onClick={() => update({ minRating: 0 })} className="text-xs text-primary-brand hover:underline mt-1">Clear</button>
        )}
      </FilterSection>

      {/* Discount */}
      <FilterSection title="Discount" defaultOpen={false}>
        {discounts.map((d) => (
          <label key={d} className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" name="discount" checked={localFilters.discount === d} onChange={() => update({ discount: d })} className="accent-primary w-3.5 h-3.5" />
            <span className="text-sm text-foreground group-hover:text-primary-brand">{d}% or more</span>
          </label>
        ))}
        {localFilters.discount > 0 && (
          <button onClick={() => update({ discount: 0 })} className="text-xs text-primary-brand hover:underline mt-1">Clear</button>
        )}
      </FilterSection>

      {/* In Stock */}
      <div className="py-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={localFilters.inStockOnly} onChange={(e) => update({ inStockOnly: e.target.checked })} className="accent-primary w-3.5 h-3.5" />
          <span className="text-sm font-semibold text-foreground">In Stock Only</span>
        </label>
      </div>
    </aside>
  );
};

export default FilterSidebar;
