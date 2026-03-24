import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";

interface OrderRecord {
  _id?: string;
  id?: string;
  userId: string;
  total: number;
  status: string;
}

const AdminOrders = () => {
  const { user, token } = useAppSelector((s) => s.auth);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    // for simplicity fetch all orders; in real API would have admin endpoint
    fetch(`${process.env.VITE_API_URL || 'http://localhost:5000/api'}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setOrders(data))
      .catch((err) => { console.error("Failed to load orders", err); setOrders([]); })
      .finally(() => setLoading(false));
  }, [token]);

  if (!user?.isAdmin) return <p className="p-6 text-center">Access denied.</p>;

  return (
    <main className="max-w-[1000px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      {loading && <p>Loading…</p>}
      {!loading && (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left">
              <th className="border-b p-2">ID</th>
              <th className="border-b p-2">User</th>
              <th className="border-b p-2">Total</th>
              <th className="border-b p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id || o.id} className="hover:bg-muted">
                <td className="p-2">{o._id || o.id}</td>
                <td className="p-2">{o.userId}</td>
                <td className="p-2">₹{o.total}</td>
                <td className="p-2">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default AdminOrders;