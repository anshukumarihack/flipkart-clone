import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import Header from "@/components/Header";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Auth from "@/pages/Auth";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import Profile from "@/pages/Profile";
import Wishlist from "@/pages/Wishlist";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminProducts from "@/pages/AdminProducts";
import AdminProductForm from "@/pages/AdminProductForm";
import AdminOrders from "@/pages/AdminOrders";
import AdminCategories from "@/pages/AdminCategories";
import NotFound from "./pages/NotFound";
import OrderConfirmation from "./pages/orderconfirmation";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="*"
              element={
                <>
                  <Header />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/products/new" element={<AdminProductForm />} />
                    <Route path="/admin/products/:id" element={<AdminProductForm />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/categories" element={<AdminCategories />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
