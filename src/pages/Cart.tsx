import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCart, removeFromCart, updateQuantity, saveForLater, moveToCart, removeSaved } from "@/store/cartSlice";
import { addToWishlist } from "@/store/authSlice";
import { Minus, Plus, Trash2, BookmarkPlus, ShoppingBag, ArrowRight, Shield, Truck, Heart } from "lucide-react";
import { getCart, updateCart, updateWishlist } from "@/lib/api";

const Cart = () => {
  const { items, savedItems } = useAppSelector((s) => s.cart);
  const { isAuthenticated, token, user, wishlist } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const userId = user?._id || user?.id;

  // fetch cart on mount / when user logs in
  useEffect(() => {
    if (isAuthenticated && userId && token) {
      getCart(userId, token)
        .then((data) => {
          // expecting fields: userId, products etc. adapt to our state shape
          if (data && data.products) {
            // convert to CartItem[]
            const serverItems = data.products.map((p: any) => ({
              id: `ci_${p.productId}`,
              productId: p.productId,
              name: p.name || '',
              brand: p.brand || '',
              price: p.price || 0,
              originalPrice: p.originalPrice || p.price || 0,
              image: p.image || '',
              quantity: p.quantity || 1,
              seller: p.seller || '',
              stock: p.stock || 0,
            }));
            dispatch(setCart({ items: serverItems, savedItems: [] }));
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, userId, token, dispatch]);

  // sync server whenever local items change
  useEffect(() => {
    if (isAuthenticated && userId && token) {
      updateCart(userId, { userId, products: items.map(i => ({ productId: i.productId, quantity: i.quantity })) }, token)
        .catch(() => {});
    }
  }, [items, isAuthenticated, userId, token]);
  const originalTotal = items.reduce((sum, i) => sum + i.originalPrice * i.quantity, 0);
  const discount = originalTotal - subtotal;
  const delivery = subtotal > 500 ? 0 : 40;
  const total = subtotal + delivery;

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
        <div className="max-w-sm mx-auto">
          <ShoppingBag size={80} className="mx-auto text-muted mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty!</h2>
          <p className="text-muted-foreground text-sm mb-6">Add items to it now.</p>
          <Link to="/products" className="inline-block gradient-primary text-white px-8 py-3 rounded font-semibold hover:opacity-90 transition-all">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      <h1 className="text-lg font-bold text-foreground mb-4">My Cart ({items.length} item{items.length !== 1 ? "s" : ""})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="bg-card rounded-lg shadow-card p-4 animate-fade-in">
              <div className="flex gap-4">
                <Link to={`/product/${item.productId}`} className="shrink-0 w-24 h-24 bg-muted rounded overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.productId}`}>
                    <p className="text-xs text-muted-foreground">{item.brand}</p>
                    <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug hover:text-primary-brand">{item.name}</h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">Seller: {item.seller}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-bold text-foreground">₹{item.price.toLocaleString()}</span>
                    <span className="price-original text-xs">₹{item.originalPrice.toLocaleString()}</span>
                    <span className="price-discount text-xs">{Math.round((1 - item.price / item.originalPrice) * 100)}% off</span>
                  </div>
                </div>
              </div>

              {/* Quantity + Actions */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded overflow-hidden">
                    <button onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}
                      className="px-2.5 py-1.5 text-foreground hover:bg-muted transition-colors" disabled={item.quantity <= 1}>
                      <Minus size={13} />
                    </button>
                    <span className="px-3 py-1.5 text-sm font-semibold text-foreground border-x border-border">{item.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                      className="px-2.5 py-1.5 text-foreground hover:bg-muted transition-colors" disabled={item.quantity >= item.stock}>
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => dispatch(saveForLater(item.productId))}
                    className="flex items-center gap-1 text-xs text-primary-brand hover:underline font-medium">
                    <BookmarkPlus size={13} /> Save for Later
                  </button>
                  <button onClick={() => dispatch(removeFromCart(item.productId))}
                    className="flex items-center gap-1 text-xs text-destructive hover:underline font-medium">
                    <Trash2 size={13} /> Remove
                  </button>
                  <button
                    onClick={async () => {
                      if (user) {
                        dispatch(addToWishlist(item.productId));
                        try {
                          await updateWishlist(userId!, [...(wishlist || []), item.productId], token || undefined);
                        } catch {}
                      }
                      dispatch(removeFromCart(item.productId));
                    }}
                    className="flex items-center gap-1 text-xs text-red-500 hover:underline font-medium">
                    <Heart size={13} /> Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Save for Later */}
          {savedItems.length > 0 && (
            <div className="mt-6">
              <h2 className="text-base font-bold text-foreground mb-3">Saved for Later ({savedItems.length})</h2>
              {savedItems.map((item) => (
                <div key={item.productId} className="bg-card rounded-lg shadow-card p-4 animate-fade-in mb-3 opacity-80">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-20 h-20 bg-muted rounded overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-foreground line-clamp-2">{item.name}</h3>
                      <span className="font-bold text-foreground text-sm">₹{item.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-3 pt-3 border-t border-border">
                    <button onClick={() => dispatch(moveToCart(item.productId))}
                      className="text-xs text-primary-brand font-semibold hover:underline">
                      Move to Cart
                    </button>
                    <button onClick={() => dispatch(removeSaved(item.productId))}
                      className="text-xs text-destructive font-medium hover:underline">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow-card p-5 sticky top-20">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Price Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-foreground">
                <span>Price ({items.length} item{items.length !== 1 ? "s" : ""})</span>
                <span>₹{originalTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>− ₹{discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>Delivery Charges</span>
                <span className={delivery === 0 ? "text-success" : "text-foreground"}>
                  {delivery === 0 ? "FREE" : `₹${delivery}`}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-base text-foreground">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {discount > 0 && (
              <p className="mt-3 text-success text-sm font-semibold text-center bg-success/10 rounded py-2">
                🎉 You save ₹{discount.toLocaleString()} on this order!
              </p>
            )}

            <button
              onClick={() => isAuthenticated ? navigate("/checkout") : navigate("/auth")}
              disabled={items.length === 0}
              className="w-full mt-5 gradient-accent text-white py-3.5 rounded font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {isAuthenticated ? "PLACE ORDER" : "LOGIN TO CHECKOUT"}
              <ArrowRight size={16} />
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield size={12} /> Safe and Secure Payments
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Truck size={12} /> {delivery === 0 ? "Free delivery on this order" : "Add ₹" + (500 - subtotal) + " for free delivery"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
