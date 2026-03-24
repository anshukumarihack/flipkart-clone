import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { getUserOrders } from "@/lib/api";
import { Order, setOrders } from "@/store/authSlice";
import { Link } from "react-router-dom";

const Orders = () => {
  const { user, token } = useAppSelector((s) => s.auth);
  const [orders, setLocalOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getUserOrders(user.id, token || undefined)
      .then((data) => {
        setLocalOrders(data);
        dispatch(setOrders(data));
      })
      .catch(() => setLocalOrders([]))
      .finally(() => setLoading(false));
  }, [user, token, dispatch]);

  if (!user) {
    return <p className="p-6 text-center">Please <Link to="/auth" className="text-primary font-semibold">log in</Link> to view your orders.</p>;
  }

  return (
    <main className="max-w-[800px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {loading && <p>Loading…</p>}
      {!loading && orders.length === 0 && <p>You have not placed any orders yet.</p>}
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="border border-border rounded-sm p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">{new Date(o.placedAt).toLocaleString()}</span>
              <span className="text-sm font-semibold uppercase text-primary-brand">{o.status}</span>
            </div>
            <ul className="space-y-1">
              {o.items.map((i) => (
                <li key={i.productId} className="flex items-center gap-3">
                  <img src={i.image} className="w-12 h-12 object-cover rounded" alt="" />
                  <span className="text-sm flex-1 line-clamp-1">{i.name}</span>
                  <span className="text-sm font-medium">₹{i.price} x {i.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 text-right font-semibold">Total: ₹{o.total}</div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Orders;