import { useEffect, useState, FormEvent } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { getUser, updateUser } from "@/lib/api";
import { login } from "@/store/authSlice";

interface ProfileForm {
  name: string;
  email: string;
  password?: string;
}

const Profile = () => {
  const { user, token } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<ProfileForm>({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const updated = await updateUser(user.id, form, token || undefined);
      dispatch(login({ user: updated, token: token || "" }));
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="p-6 text-center">Please <a href="/auth" className="text-primary font-semibold">log in</a> to view your profile.</p>;

  return (
    <main className="max-w-[600px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      {message && <p className="mb-4 text-sm text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            value={form.password || ""}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-border rounded px-3 py-2"
            placeholder="Leave blank to keep current"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-primary-brand text-white px-4 py-2 rounded hover:opacity-90"
        >
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </main>
  );
};

export default Profile;