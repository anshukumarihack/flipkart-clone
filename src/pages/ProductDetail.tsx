import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/authSlice";
import { getProduct, updateWishlist, getReviews, postReview } from "@/lib/api";
import { PINCODES, Product} from "@/data/mockData";
import { Star, ChevronRight, MapPin, ShoppingCart, Zap, Truck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { RootState } from "@/store/store";

// --- Comprehensive Interface to match ProductCard requirements ---

interface Review {
  id?: string;
  productId: string;
  rating: number;
  comment: string;
  userName: string;
  date: string;
}

interface ExtendedUser {
  id: string | number;
  name: string;
  email?: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get data from Redux
  const cartItems = useAppSelector((s) => s.cart.items);
  const { user, wishlist = [], isAuthenticated } = useAppSelector((s) => s.auth);
  
  // Safely access products from the global state
  const allProducts = useAppSelector((state: RootState) => state.products.items || []); 
  
  const currentUser = user as ExtendedUser | null;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState<{ deliveryDate: string; available: boolean } | null>(null);
  const [pincodeError, setPincodeError] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewBody, setReviewBody] = useState("");

  const inWishlist = wishlist?.includes(id || '') || false;
  const inCart = cartItems.some((i) => i.productId === id);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    Promise.all([getProduct(id), getReviews(id)])
      .then(([pData, rData]) => {
        setProduct(pData as Product);
        setReviews((rData as Review[]) || []);
      })
      .catch((err) => console.error("Fetch failed", err))
      .finally(() => setLoading(false));
  }, [id]);

  // Logic for Related Products (Filtering by Category)
  const relatedProducts = allProducts
    .filter((p: Product) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  const handleCheckPincode = () => {
    if (pincode.length < 6) {
      setPincodeError("Please enter a valid 6-digit pincode");
      setPincodeResult(null);
      return;
    }
    const result = PINCODES[pincode];
    if (result) {
      setPincodeResult(result);
      setPincodeError("");
    } else {
      setPincodeResult(null);
      setPincodeError("Delivery not available for this location");
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewBody.trim() || !id) return;

    const newReview: Review = {
      productId: id,
      rating: reviewRating,
      comment: reviewBody,
      userName: currentUser?.name || "Anonymous",
      date: new Date().toISOString().split('T')[0],
      id: Date.now().toString(),
    };

    try {
      await postReview(newReview); 
      setReviews((prev) => [newReview, ...prev]);
      setReviewBody("");
      setReviewRating(5);
    } catch (err) {
      console.error("Failed to post review:", err);
    }
  };

  const toggleWishlist = async () => {
    if (!currentUser || !product) {
      if (!isAuthenticated) navigate("/auth");
      return;
    }

    const updatedList = inWishlist 
      ? wishlist.filter((itemId) => itemId !== product.id)
      : [...wishlist, product.id];

    if (inWishlist) dispatch(removeFromWishlist(product.id));
    else dispatch(addToWishlist(product.id));

    try {
      await updateWishlist(String(currentUser.id), updatedList);
    } catch (err) {
      console.error("Wishlist sync failed", err);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({
      id: `ci_${product.id}`,
      productId: product.id,
      name: product.name,
      brand: product.brand || "Brand",
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      image: product.images?.[0] || "",
      quantity: 1,
      seller: product.seller || "Seller",
      stock: product.stock,
    }));
  };

  if (loading) return <div className="p-20 text-center text-gray-500">Loading...</div>;
  if (!product) return <div className="p-20 text-center font-bold text-red-500">Product not found.</div>;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      <nav className="flex items-center gap-1 text-xs text-gray-400 mb-6">
        <span className="hover:text-black cursor-pointer" onClick={() => navigate("/")}>Home</span>
        <ChevronRight size={12} />
        <span className="text-black font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gallery */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <div className="border rounded-xl bg-white p-6 aspect-square flex items-center justify-center overflow-hidden mb-4">
              <img src={product.images[activeImage]} alt={product.name} className="max-h-full object-contain" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`w-16 h-16 border-2 rounded-lg shrink-0 ${i === activeImage ? 'border-blue-600' : 'border-transparent'}`}>
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAddToCart} className={`flex-1 py-4 rounded-xl font-bold ${inCart ? 'bg-green-100 text-green-700' : 'bg-orange-500 text-white'}`}>
                <ShoppingCart size={18} className="inline mr-2" /> {inCart ? "IN CART" : "ADD TO CART"}
              </button>
              <button onClick={() => { handleAddToCart(); navigate("/cart"); }} className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold">
                <Zap size={18} className="inline mr-2" /> BUY NOW
              </button>
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-b pb-6">
            <p className="text-blue-600 font-bold text-sm tracking-widest uppercase">{product.brand}</p>
            <h1 className="text-2xl font-bold mt-1 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4 mt-3">
              <span className="bg-green-700 text-white text-sm px-2 py-0.5 rounded font-bold flex items-center gap-1">
                {product.rating || 0} <Star size={12} fill="currentColor" />
              </span>
              <button onClick={toggleWishlist} className={`text-sm font-bold ${inWishlist ? 'text-red-500' : 'text-gray-400'}`}>
                {inWishlist ? '❤ Saved' : '♡ Add to Wishlist'}
              </button>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>}
            {product.discount && <span className="text-green-600 font-bold">{product.discount}% Off</span>}
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">Specifications</h3>
            <div className="border rounded-xl divide-y bg-white">
              {product.specs && Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="grid grid-cols-3 p-4 text-sm">
                  <span className="text-gray-500">{key}</span>
                  <span className="col-span-2 font-medium text-gray-900">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products Section */}
          <div className="mt-12 border-t pt-8">
            <h3 className="text-xl font-bold mb-6">More from this Category</h3>
            <div className="grid grid-cols-2 gap-4">
               {relatedProducts.map((p: Product) => (
                 <ProductCard key={p.id} product={p} />
               ))}
               {relatedProducts.length === 0 && <p className="text-gray-400 italic text-sm">No related products found.</p>}
            </div>
          </div>

          {/* Review Section */}
          <div className="mt-12 border-t pt-8">
            <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>
            <div className="space-y-4 mb-10">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id || Math.random()} className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-green-700 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                        {rev.rating} <Star size={10} fill="currentColor" />
                      </span>
                      <span className="text-sm font-bold text-gray-800">{rev.userName}</span>
                      <span className="text-[10px] text-gray-400 ml-auto">{rev.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm italic">No reviews yet.</p>
              )}
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl">
              <h4 className="font-bold mb-4 text-gray-800">Rate this product</h4>
              {isAuthenticated ? (
                <div className="space-y-4">
                  <select 
                    value={reviewRating} 
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="p-2 border rounded-lg text-sm bg-white"
                  >
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                  <textarea 
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    className="w-full border p-4 rounded-xl text-sm min-h-[100px]"
                    placeholder="What did you like or dislike?"
                  />
                  <button 
                    onClick={handleReviewSubmit} 
                    disabled={!reviewBody.trim()}
                    className="px-8 py-3 bg-black text-white rounded-xl font-bold"
                  >
                    Post Review
                  </button>
                </div>
              ) : (
                <button onClick={() => navigate("/auth")} className="text-blue-600 font-bold">
                  Login to Review
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-3">
          <div className="border rounded-xl p-5 bg-gray-50 sticky top-24">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4"><MapPin size={16}/> Delivery Check</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                maxLength={6} 
                value={pincode} 
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))} 
                className="w-full border p-2 rounded-lg text-sm" 
                placeholder="Pincode" 
              />
              <button onClick={handleCheckPincode} className="bg-white border px-3 rounded-lg text-sm font-bold">Check</button>
            </div>
            {pincodeError && <p className="text-red-500 text-[10px] mt-1">{pincodeError}</p>}
            {pincodeResult && (
              <p className="text-green-700 text-xs font-bold mt-4 flex items-center gap-2">
                <Truck size={14} /> Expected Delivery: {pincodeResult.deliveryDate}
              </p>
            )}
          </div>
        </div>
      </div> 
    </div>
  );
};

export default ProductDetail;