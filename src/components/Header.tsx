import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, User, ChevronDown, Menu, X, Heart } from "lucide-react";
import { Product, PRODUCTS } from "@/data/mockData";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { searchProducts } from "@/lib/api";

const Header = () => {

  const cartCount = useAppSelector((s) =>
    (s.cart?.items ?? []).reduce((sum, i) => sum + i.quantity, 0)
  );

  const wishlistCount = useAppSelector((s) =>
    s.auth?.wishlist?.length ?? 0
  );

  const auth = useAppSelector((s) => s.auth);
const isAuthenticated = auth?.isAuthenticated ?? false;
const user = auth?.user ?? null;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const categories = ["Electronics", "Fashion", "Home & Kitchen", "Sports", "Books", "Grocery"];

  useEffect(() => {

    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const handle = setTimeout(async () => {
      try {
        const res = await searchProducts(searchQuery);
        setSearchResults((res ?? []).slice(0, 5));
      } catch {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(handle);

  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery) return;

    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);

    setSearchQuery("");
    setShowSearch(false);
  };

  return (
    <header className="fk-header sticky top-0 z-50 shadow-md">

      {/* MAIN NAV */}
      <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-4">

        {/* LOGO */}
        <Link to="/" className="flex flex-col min-w-fit">
          <span className="text-white font-extrabold text-xl">Flipkart</span>
          <span className="text-[10px] text-yellow-300 italic">
            Explore <span className="underline">Plus</span> ✦
          </span>
        </Link>

        {/* SEARCH */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative hidden md:block">

          <div className="flex items-center bg-white rounded overflow-hidden">

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              placeholder="Search for products..."
              className="flex-1 px-4 py-2 text-sm outline-none"
            />

            <button type="submit" className="px-4 py-2">
              <Search size={18} />
            </button>

          </div>

          {showSearch && searchResults.length > 0 && (

            <div className="absolute top-full left-0 right-0 bg-white shadow border rounded">

              {searchResults.map((p) => (

                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <Search size={14} />
                  <span className="text-sm">{p.name}</span>
                </Link>

              ))}

            </div>

          )}

        </form>

        {/* RIGHT MENU */}
        <div className="flex items-center gap-3 ml-auto">

          {/* WISHLIST */}
          <Link to="/wishlist" className="relative text-white">

            <Heart size={18} />

            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}

          </Link>

          {/* ADMIN */}
          {isAuthenticated && user?.isAdmin && (
            <Link to="/admin" className="text-white font-semibold">
              Admin
            </Link>
          )}

          {/* ACCOUNT */}
          <div className="relative group">

            <button className="flex items-center gap-1 text-white">

              <User size={18} />

              <span className="hidden sm:block text-sm">
                {isAuthenticated ? user?.email?.split("@")[0] : "Login"}
              </span>

              <ChevronDown size={14} className="hidden sm:block" />

            </button>

            <div className="absolute right-0 top-full mt-2 w-52 bg-white shadow rounded opacity-0 invisible group-hover:visible group-hover:opacity-100">

              {!isAuthenticated ? (

                <Link to="/auth" className="block px-4 py-2 hover:bg-gray-100">
                  Login
                </Link>

              ) : (

                <>
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-semibold">{user?.email}</p>
                  </div>

                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">My Orders</Link>
                  <Link to="/wishlist" className="block px-4 py-2 hover:bg-gray-100">Wishlist</Link>

                  <button
                    onClick={() => dispatch(logout())}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>

              )}

            </div>

          </div>

          {/* CART */}
          <Link to="/cart" className="flex items-center gap-1 text-white relative">

            <ShoppingCart size={20} />

            {cartCount > 0 && (

              <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">

                {cartCount > 9 ? "9+" : cartCount}

              </span>

            )}

          </Link>

          {/* MOBILE MENU */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden text-white"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>

      </div>

      {/* CATEGORY BAR */}
      <div className="border-t hidden md:block">

        <div className="max-w-[1400px] mx-auto px-4">

          <nav className="flex items-center gap-6 py-2">

            {categories.map((cat) => (

              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="text-white text-xs hover:text-yellow-200"
              >
                {cat}
              </Link>

            ))}

            <Link
              to="/products"
              className="ml-auto text-yellow-300 text-xs font-semibold"
            >
              View All →
            </Link>

          </nav>

        </div>

      </div>

    </header>
  );
};

export default Header;