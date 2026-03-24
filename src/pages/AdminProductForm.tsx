import { useState, useEffect, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { getProduct, adminCreateProduct, adminUpdateProduct } from "@/lib/api";

interface ProductForm {
  title: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  stock: number;
}

const AdminProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAppSelector((s) => s.auth);

  const [form, setForm] = useState<ProductForm>({
    title: "",
    brand: "",
    category: "",
    price: 0,
    description: "",
    images: [],
    stock: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProduct(id)
        .then((data) => setForm(data))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      if (id) {
        await adminUpdateProduct(id, form, token);
      } else {
        await adminCreateProduct(form, token);
      }
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
    }
  };

  if (!user?.isAdmin) return <p className="p-6 text-center">Access denied.</p>;

  return (
    <main className="max-w-[600px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit' : 'New'} Product</h1>
      {loading ? <p>Loading…</p> : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input type="text" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="w-full border border-border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border border-border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} className="w-full border border-border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input type="number" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} className="w-full border border-border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full border border-border rounded px-3 py-2" />
          </div>
          <button type="submit" className="bg-primary-brand text-white px-4 py-2 rounded">Save</button>
        </form>
      )}
    </main>
  );
};

export default AdminProductForm;