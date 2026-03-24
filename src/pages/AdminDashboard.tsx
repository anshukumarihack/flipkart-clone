import { Link, Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return (
    <main className="max-w-[800px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <ul className="space-y-3">
        <li><Link to="/admin/products" className="text-primary-brand hover:underline">Manage Products</Link></li>
        <li><Link to="/admin/orders" className="text-primary-brand hover:underline">View Orders</Link></li>
        <li><Link to="/admin/categories" className="text-primary-brand hover:underline">Categories</Link></li>
      </ul>
    </main>
  );
};

export default AdminDashboard;