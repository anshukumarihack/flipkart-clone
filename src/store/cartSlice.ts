import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  seller: string;
  stock: number;
  savedForLater?: boolean;
}

interface CartState {
  items: CartItem[];
  savedItems: CartItem[];
}

// Load from localStorage
const loadCart = (): CartState => {
  try {
    const saved = localStorage.getItem("fk_cart");
    if (saved) return JSON.parse(saved);
  } catch {}
  return { items: [], savedItems: [] };
};

const saveCart = (state: CartState) => {
  try {
    localStorage.setItem("fk_cart", JSON.stringify(state));
  } catch {}
};

const initialState: CartState = loadCart();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartState>) {
      state.items = action.payload.items;
      state.savedItems = action.payload.savedItems;
      saveCart(state);
    },
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.productId === action.payload.productId);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, existing.stock);
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCart(state);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      saveCart(state);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.productId !== action.payload.productId);
        } else {
          item.quantity = Math.min(action.payload.quantity, item.stock);
        }
      }
      saveCart(state);
    },
    saveForLater(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) {
        state.savedItems.push({ ...item, savedForLater: true });
        state.items = state.items.filter((i) => i.productId !== action.payload);
      }
      saveCart(state);
    },
    moveToCart(state, action: PayloadAction<string>) {
      const item = state.savedItems.find((i) => i.productId === action.payload);
      if (item) {
        state.items.push({ ...item, savedForLater: false });
        state.savedItems = state.savedItems.filter((i) => i.productId !== action.payload);
      }
      saveCart(state);
    },
    removeSaved(state, action: PayloadAction<string>) {
      state.savedItems = state.savedItems.filter((i) => i.productId !== action.payload);
      saveCart(state);
    },
    clearCart(state) {
      state.items = [];
      saveCart(state);
    },
  },
});

export const { setCart, addToCart, removeFromCart, updateQuantity, saveForLater, moveToCart, removeSaved, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
