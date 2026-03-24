import { useState, useEffect, FormEvent } from "react";
import { useAppSelector } from "@/store/hooks";
import { getCategories, createCategory } from "@/lib/api";

interface Category {
  _id?: string;
  id?: string;
  name: string;
  parentId?: string | null;
}

const AdminCategories = () => {
  const { user, token } = useAppSelector((s) => s.auth);
  const [cats, setCats] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then((data) => setCats(data))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !name) return;
    try {
      const newCat = await createCategory({ name }, token);
      setCats([...cats, newCat]);
      setName("");
    } catch (err) {
      console.error("Failed to add category", err);
    }
  };

  if (!user?.isAdmin) return <p className="p-6 text-center">Access denied.</p>;

  return (
    <main className="max-w-[600px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="New category" className="flex-1 border border-border rounded px-3 py-2" />
        <button type="submit" className="bg-primary-brand text-white px-4 py-2 rounded">Add</button>
      </form>
      {loading && <p>Loading…</p>}
      {!loading && (
        <ul className="space-y-1">
          {cats.map(c => <li key={c._id || c.id}>{c.name}</li>)}
        </ul>
      )}
    </main>
  );
};

export default AdminCategories;