import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string | number;
  name: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  isAdmin?: boolean;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  wishlist?: string[];
}

interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  type: "Home" | "Work" | "Other";
  isDefault: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  addresses: Address[];
  orders: Order[];
  wishlist: string[];
}

export interface Order {
  id: string;
  items: { productId: string; name: string; image: string; price: number; quantity: number }[];
  total: number;
  status: "Confirmed" | "Packed" | "Shipped" | "Out for Delivery" | "Delivered";
  placedAt: string;
  deliveryAddress: Address;
  paymentMethod: string;
}

const loadAuth = (): AuthState => {
  try {
    const saved = localStorage.getItem("fk_auth");
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.error("Auth action failed:", error);
  }
  return { user: null, token: null, isAuthenticated: false, addresses: [], orders: [], wishlist: [] };
};

const saveAuth = (state: AuthState) => {
  try {
    localStorage.setItem("fk_auth", JSON.stringify(state));
  } catch (error) {
    console.error("Auth action failed:", error);
  }
};

const initialState: AuthState = loadAuth();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; token: string }>) {
      
      const userData = action.payload.user; 

  state.user = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
  };
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
      if (action.payload.user.isAdmin) {
        // nothing special on client, just available on state
      }
      if (action.payload.user.wishlist) {
        state.wishlist = action.payload.user.wishlist;
      }
      const userName = action.payload.user.username || action.payload.user.firstName || 'User';
      if (state.addresses.length === 0) {
        state.addresses = [{
          id: "addr1",
          name: userName,
          phone: action.payload.user.phone || "9876543210",
          line1: action.payload.user.address || "123 Main Street",
          line2: "",
          city: action.payload.user.city || "Mumbai",
          state: "Maharashtra",
          pincode: action.payload.user.zipCode || "400001",
          type: "Home",
          isDefault: true,
        }];
      }
      saveAuth(state);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.wishlist = [];
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      saveAuth(state);
    },
    addAddress(state, action: PayloadAction<Address>) {
      state.addresses.push(action.payload);
      saveAuth(state);
    },
    placeOrder(state, action: PayloadAction<Order>) {
      state.orders.unshift(action.payload);
      saveAuth(state);
    },
    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
    },
    setWishlist(state, action: PayloadAction<string[]>) {
      state.wishlist = action.payload;
      saveAuth(state);
    },
    addToWishlist(state, action: PayloadAction<string>) {
      if (!state.wishlist.includes(action.payload)) {
        state.wishlist.push(action.payload);
        saveAuth(state);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.wishlist = state.wishlist.filter((id) => id !== action.payload);
      saveAuth(state);
    },
  },
});

export const { login, logout, addAddress, placeOrder, setOrders, setWishlist, addToWishlist, removeFromWishlist } = authSlice.actions;
export default authSlice.reducer;
