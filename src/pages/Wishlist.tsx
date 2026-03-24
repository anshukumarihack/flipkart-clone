import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getWishlist, updateWishlist } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/mockData";
import { setWishlist, removeFromWishlist } from "@/store/authSlice";

const Wishlist = () => {
  const { user, token } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getWishlist(user.id, token || undefined)
      .then((data) => {
        setItems(data);
        dispatch(setWishlist(data.map((p:any) => p._id || p.id)));
      })
      .catch(() => {
        setItems([]);
        dispatch(setWishlist([]));
      })
      .finally(() => setLoading(false));
  }, [user, token, dispatch]);

  const remove = async (productId: string) => {
    if (!user) return;
    const newList = items.filter((p) => p._id !== productId && p.id !== productId);
    setItems(newList);
    dispatch(removeFromWishlist(productId));
    try {
      await updateWishlist(user.id, newList.map((p) => p._id || p.id), token || undefined);
    } catch {} // ignore
  };

  if (!user) {
    return <p className="p-6 text-center">Please <Link to="/auth" className="text-primary font-semibold">log in</Link> to view your wishlist.</p>;
  }

  return (
    <main className="max-w-[800px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
      {loading && <p>Loading…</p>}
      {!loading && items.length === 0 && <p>Your wishlist is empty.</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p._id || p.id} className="relative">
            <ProductCard product={p as any} />
            <button
              onClick={() => remove(p._id || p.id)}
              className="absolute top-2 right-2 text-red-500 bg-white rounded-full p-1 shadow"
              title="Remove from wishlist"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Wishlist;