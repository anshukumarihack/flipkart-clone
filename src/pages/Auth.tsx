import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/store/authSlice";
import { loginUser, registerUser } from "@/lib/api";
import { Eye, EyeOff, ShoppingBag, Copy } from "lucide-react";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) { setError("Please fill all fields"); return; }
    if (mode === "signup" && !name) { setError("Please enter your name"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }

    setLoading(true);
    try {
      let res;
      if (mode === "login") {
        res = await loginUser({ email, password });
      } else {
        res = await registerUser({ name, email, password });
      }
      
      // For login: res has accessToken and user data
      // For signup: res has id and message
      const accessToken = res.accessToken;
      const user = {
        id: res.id || res.id,
        email: res.email,
        username: res.username,
        isAdmin: res.isAdmin || false,
      };

      dispatch(login({ user, token: accessToken }));
      setSuccess(mode === "login" ? "Login successful!" : "Account created! Please login.");
      
      if (mode === "signup") {
        setMode("login");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const fillTestCredentials = (isAdmin: boolean = false) => {
    setEmail(isAdmin ? "admin@ecommerce.com" : "john@example.com");
    setPassword(isAdmin ? "admin123" : "user123");
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex flex-col justify-center gradient-primary p-16 w-96 shrink-0">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag size={40} className="text-yellow-300" />
          <span className="text-white font-extrabold text-3xl">eShop</span>
        </div>
        <h2 className="text-white text-2xl font-bold leading-snug mb-4">
          Login to access your account, orders & wishlist
        </h2>
        <p className="text-white/70 text-sm leading-relaxed">
          Your trusted e-commerce platform. Shop from thousands of products across all categories.
        </p>
        <div className="mt-8 space-y-3">
          {["Fast & Secure", "Wide Selection", "Easy Returns"].map((t) => (
            <div key={t} className="flex items-center gap-2 text-white/80 text-sm">
              <span className="w-2 h-2 rounded-full bg-yellow-300 shrink-0" />
              {t}
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-white/70 text-xs font-semibold mb-3">TEST CREDENTIALS</p>
          <div className="space-y-2">
            <div className="bg-white/10 rounded p-3">
              <p className="text-white/70 text-xs">Admin:</p>
              <p className="text-white font-mono text-xs">admin@ecommerce.com</p>
              <p className="text-white font-mono text-xs">admin123</p>
            </div>
            <div className="bg-white/10 rounded p-3">
              <p className="text-white/70 text-xs">User:</p>
              <p className="text-white font-mono text-xs">john@example.com</p>
              <p className="text-white font-mono text-xs">user123</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm">
          <div className="bg-card rounded-lg shadow-lg p-8">
            <h1 className="text-xl font-bold text-foreground mb-1">
              {mode === "login" ? "Welcome back!" : "Create Account"}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {mode === "login" ? "Sign in to continue shopping" : "Join millions of happy shoppers"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full border border-border rounded px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-border rounded px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full border border-border rounded px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pr-10"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-destructive text-xs bg-destructive/10 px-3 py-2 rounded">{error}</p>}
              {success && <p className="text-green-600 text-xs bg-green-50 px-3 py-2 rounded">{success}</p>}

              <button type="submit" disabled={loading}
                className="w-full gradient-primary text-white py-3 rounded font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50">
                {loading ? "Processing..." : (mode === "login" ? "LOGIN" : "CREATE ACCOUNT")}
              </button>

              {mode === "login" && (
                <>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button type="button" onClick={() => fillTestCredentials(false)}
                      className="text-xs bg-muted px-2 py-2 rounded hover:bg-muted/80 transition-all">
                      Test User
                    </button>
                    <button type="button" onClick={() => fillTestCredentials(true)}
                      className="text-xs bg-muted px-2 py-2 rounded hover:bg-muted/80 transition-all">
                      Test Admin
                    </button>
                  </div>
                  <p className="text-xs text-center text-primary-brand hover:underline cursor-pointer pt-2">Forgot Password?</p>
                </>
              )}
            </form>

            <div className="mt-6 pt-5 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                {mode === "login" ? "New to eShop?" : "Already have an account?"}{" "}
                <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
                  className="text-primary-brand font-semibold hover:underline">
                  {mode === "login" ? "Create Account" : "Login"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
