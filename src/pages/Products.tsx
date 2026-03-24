import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import FilterSidebar, { FilterState } from "@/components/FilterSidebar";
import { getProducts, getCategories } from "@/lib/api";
import { Grid, List, SlidersHorizontal, X } from "lucide-react";
// Import the same GlobalProduct we used in ProductDetail
import { Product } from "@/data/mockData"; 

// Define a type for the API Category response to fix line 79
interface CategoryResponse {
  id: string | number;
  name: string;
  slug?: string;
}

const DEFAULT_FILTERS: FilterState = {
  category: "",
  brands: [],
  minPrice: 0,
  maxPrice: 300000,
  minRating: 0,
  inStockOnly: false,
  discount: 0,
  specs: {},
};

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "discount", label: "Biggest Discount" },
  { value: "reviews", label: "Most Reviewed" },
];

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const searchParam = searchParams.get("search") || "";
  const discountParam = searchParams.get("discount") || "";

  // 1. Fixed: Changed any[] to Product[]
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("relevance");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: categoryParam,
    discount: discountParam ? Number(discountParam) : 0,
  });

  useEffect(() => {
    // 2. Fixed: Replaced Record<string, any> with a specific Record type
    const query: Record<string, string | number> = { page, limit };
    
    if (searchParam) query.search = searchParam;
    if (filters.category) query.category = filters.category;
    if (filters.brands.length) query.brands = filters.brands.join(',');
    if (filters.maxPrice < 300000) query.maxPrice = filters.maxPrice;
    if (filters.minRating) query.minRating = filters.minRating;
    if (filters.discount) query.discount = filters.discount;
    if (filters.inStockOnly) {
      query.inStock = "true";
    }
    if (sort && sort !== "relevance") query.sort = sort;

    getProducts(query)
      .then((data) => {
        setProducts(data.products as Product[]);
        setTotal(data.total);
        setPage(data.page);
        setLimit(data.limit);
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
      });
  }, [searchParam, filters, sort, page, limit]);

  const allBrands = [...new Set(products.map((p) => p.brand || "Unknown"))];
  const [allCategories, setAllCategories] = useState<string[]>([]);

  useEffect(() => {
    getCategories()
      // 3. Fixed: Typed the map argument to CategoryResponse to solve Error 2339
      .then((cats) => {
        const categories = cats as CategoryResponse[];
        setAllCategories(categories.map((c) => c.name));
      })
      .catch(() => setAllCategories([]));
  }, []);

  const filtered = useMemo(() => products, [products]);

  const activeFilterCount = [
    filters.category ? 1 : 0,
    filters.brands.length,
    filters.maxPrice < 300000 ? 1 : 0,
    filters.minRating ? 1 : 0,
    filters.discount ? 1 : 0,
    filters.inStockOnly ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      <div className="mb-4">
        {searchParam ? (
          <h1 className="text-lg font-semibold text-foreground">
            Search results for "<span className="text-primary-brand">{searchParam}</span>"
            <span className="ml-2 text-sm text-muted-foreground font-normal">({total} results)</span>
          </h1>
        ) : (
          <h1 className="text-lg font-semibold text-foreground">
            {filters.category || "All Products"}
            <span className="ml-2 text-sm text-muted-foreground font-normal">({total} items)</span>
          </h1>
        )}
      </div>

      <div className="flex gap-4">
        <div className="hidden lg:block w-60 shrink-0">
          <FilterSidebar onFilter={setFilters} filters={filters} categories={allCategories} brands={allBrands} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="bg-card rounded-lg shadow-card px-4 py-2.5 flex items-center gap-4 mb-4 flex-wrap">
            <button onClick={() => setShowMobileFilters(true)} className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-foreground mr-2">
              <SlidersHorizontal size={16} />
              Filters {activeFilterCount > 0 && <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">{activeFilterCount}</span>}
            </button>

            <span className="text-xs text-muted-foreground hidden sm:block">Sort by:</span>
            <div className="flex items-center gap-1 overflow-x-auto">
              {SORT_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setSort(opt.value)}
                  className={`whitespace-nowrap px-3 py-1 text-xs font-medium rounded transition-all ${
                    sort === opt.value ? "text-primary-brand border-b-2 border-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-1">
              <button onClick={() => setView("grid")} className={`p-1.5 rounded transition-colors ${view === "grid" ? "text-primary-brand bg-primary-subtle" : "text-muted-foreground hover:text-foreground"}`}>
                <Grid size={16} />
              </button>
              <button onClick={() => setView("list")} className={`p-1.5 rounded transition-colors ${view === "list" ? "text-primary-brand bg-primary-subtle" : "text-muted-foreground hover:text-foreground"}`}>
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Grid/List Results */}
          {filtered.length === 0 ? (
            <div className="bg-card rounded-lg shadow-card p-12 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <h3 className="font-semibold text-foreground mb-1">No products found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} view="list" />)}
            </div>
          )}

          {/* Pagination */}
          {total > limit && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
              <span className="text-sm text-muted-foreground">Page {page} of {Math.ceil(total / limit)}</span>
              <button disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Drawer Code Logic remains same... */}
    </div>
  );
};

export default Products;