import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { getProducts, adminDeleteProduct } from "@/lib/api";
import { Link } from "react-router-dom";

interface ProductSummary {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  price: number;
}

const AdminProducts = () => {
  const { user, token } = useAppSelector((s) => s.auth);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then((data) => setProducts(data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await adminDeleteProduct(id, token);
      setProducts(products.filter(p => p._id !== id && p.id !== id));
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  if (!user?.isAdmin) {
    return <p className="p-6 text-center">Access denied.</p>;
  }

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      <Link to="/admin/products/new" className="inline-block mb-4 text-sm bg-primary-brand text-white px-3 py-1 rounded">Add New Product</Link>
      {loading && <p>Loading…</p>}
      {!loading && (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left">
              <th className="border-b p-2">ID</th>
              <th className="border-b p-2">Title</th>
              <th className="border-b p-2">Price</th>
              <th className="border-b p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id || p.id} className="hover:bg-muted">
                <td className="p-2">{p._id || p.id}</td>
                <td className="p-2">{p.title || p.name}</td>
                <td className="p-2">₹{p.price}</td>
                <td className="p-2">
                  <Link to={`/admin/products/${p._id || p.id}`} className="text-sm text-primary-brand hover:underline mr-2">Edit</Link>
                  <button onClick={() => handleDelete(p._id || p.id)} className="text-sm text-destructive hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default AdminProducts;