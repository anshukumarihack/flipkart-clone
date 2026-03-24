import { Product } from "@/data/mockData";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/authSlice";
import { updateWishlist } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  view?: "grid" | "list";
}

const ProductCard = ({ product, view = "grid" }: ProductCardProps) => {
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((s) => s.cart.items);
  const { user, token, wishlist } = useAppSelector((s) => s.auth);

  const inCart = cartItems.some((i) => i.productId === product.id);
  const inWishlist = wishlist?.includes(String(product.id)) ?? false;

  /* SAFE IMAGE */
  const imageUrl =
    product.images?.[0] || "https://via.placeholder.com/300x300?text=No+Image";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addToCart({
        id: `ci_${product.id}`,
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: imageUrl,
        quantity: 1,
        seller: product.seller,
        stock: product.stock,
      })
    );
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

    let newIds: string[];

    if (inWishlist) {
      dispatch(removeFromWishlist(product.id));
      newIds = wishlist.filter((id) => id !== String(product.id));
    } else {
      dispatch(addToWishlist(product.id));
      newIds = [...wishlist, String(product.id)];
    }

    try {
      await updateWishlist(String(user.id), newIds, token ?? undefined);
    } catch (error) {
      console.error("Wishlist update failed:", error);
    }
  };

  const ratingColor =
    product.rating >= 4 ? "rating-badge" : "rating-badge-warn";

  /* ================= LIST VIEW ================= */

  if (view === "list") {
    return (
      <Link
        to={`/product/${product.id}`}
        className="product-card flex gap-4 p-4 animate-fade-in"
      >
        <div className="relative shrink-0 w-40 h-40 bg-muted rounded overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {product.badge && (
            <span className="absolute top-1 left-1 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-0.5">
            {product.brand}
          </p>

          <h3 className="font-medium text-foreground line-clamp-2 text-sm leading-snug mb-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <span className={ratingColor}>
              {product.rating} <Star size={10} fill="currentColor" />
            </span>

            <span className="text-xs text-muted-foreground">
              ({(product.reviewCount ?? 0).toLocaleString()})
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-lg font-bold text-foreground">
              ₹{(product.price ?? 0).toLocaleString()}
            </span>

            <span className="price-original">
              ₹{product.originalPrice.toLocaleString()}
            </span>

            <span className="price-discount">{product.discount}% off</span>
          </div>

          <p className="text-xs text-muted-foreground mb-3">
            Seller: {product.seller}
          </p>

          {product.stock <= 5 && product.stock > 0 && (
            <p className="urgency-tag mb-2">Only {product.stock} left!</p>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold transition-all ${
                inCart
                  ? "bg-success text-white"
                  : "gradient-primary text-white hover:opacity-90"
              }`}
            >
              <ShoppingCart size={15} />
              {inCart ? "Added to Cart" : "Add to Cart"}
            </button>

            <button
              onClick={toggleWishlist}
              className="text-red-500 p-1"
              title={
                inWishlist ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              {inWishlist ? "♥" : "♡"}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  /* ================= GRID VIEW ================= */

  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card flex flex-col animate-fade-in"
    >
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />

        {product.badge && (
          <span className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded">
            {product.badge}
          </span>
        )}

        {product.discount >= 20 && !product.badge && (
          <span className="absolute top-2 left-2 bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded">
            {product.discount}% off
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
          {product.brand}
        </p>

        <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug mt-0.5 mb-2 flex-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-2">
          <span className={ratingColor}>
            {product.rating} <Star size={9} fill="currentColor" />
          </span>

          <span className="text-[11px] text-muted-foreground">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="font-bold text-foreground">
            ₹{(product.price ?? 0).toLocaleString()}
          </span>

          <span className="price-original text-xs">
            ₹{(product.originalPrice ?? 0).toLocaleString()}
          </span>

          <span className="price-discount text-xs">
            {product.discount}% off
          </span>
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <p className="urgency-tag mb-1">Only {product.stock} left!</p>
        )}

        <div className="flex flex-col gap-1.5">
          <button
            onClick={handleAddToCart}
            className={`mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 rounded text-xs font-semibold transition-all ${
              inCart
                ? "bg-success text-white"
                : "gradient-primary text-white hover:opacity-90"
            }`}
          >
            <ShoppingCart size={13} />
            {inCart ? "Added" : "Add to Cart"}
          </button>

          <button
            onClick={toggleWishlist}
            className="text-center text-red-500"
            title={
              inWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            {inWishlist ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;