export const BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

/* ==============================
   TYPES
================================ */

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  stock?: number
  brand?: string
  rating?: number
  reviewCount?: number
}

export interface ProductResponse {
  products: Product[]
  total: number
  page: number
  limit: number
}

export interface Review {
  productId: string
  rating: number
  comment: string
  userName: string
  date: string
  newReview?: boolean
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface Cart {
  items: CartItem[]
}

export interface OrderProduct {
  productId: string
  quantity: number
}

export interface Order {
  userId: string
  products: OrderProduct[]
  total: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterUser {
  name: string
  email: string
  password: string
}

export interface UserUpdate {
  name?: string
  email?: string
  password?: string
}

/* ==============================
   RESPONSE HANDLER
================================ */

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.message || "Request failed")
  }

  return data
}

export const postReview = async (reviewData: Review) => {
  const response = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  });
  return response.json();
};

/* ==============================
   PRODUCTS
================================ */

// Ensure your API functions are strictly typed
export const getProduct = async (id: string): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error("Product not found");
  return response.json();
};


export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products`)
  return handleResponse<Product[]>(res)
}

export async function getProducts(
  params: Record<string, string | number> = {}
): Promise<ProductResponse> {

  const qs = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      qs.set(key, String(value))
    }
  })

  const res = await fetch(`${BASE_URL}/products?${qs.toString()}`)

  const data = await handleResponse<Product[] | ProductResponse>(res)

  if (Array.isArray(data)) {
    return {
      products: data,
      total: data.length,
      page: 1,
      limit: data.length
    }
  }

  return data
}


/* ==============================
   AUTH
================================ */

export async function loginUser(credentials: LoginCredentials) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  })

  return handleResponse(res)
}

export async function registerUser(user: RegisterUser) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  })

  return handleResponse(res)
}

/* ==============================
   CATEGORIES
================================ */

export async function getCategories(token?: string) {
  const headers: Record<string, string> = {}

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}/categories`, { headers })

  return handleResponse(res)
}

export async function createCategory(
  data: { name: string; description?: string },
  token?: string
) {

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers,
    body: JSON.stringify(data)
  })

  return handleResponse(res)
}

/* ==============================
   REVIEWS
================================ */
export const getReviews = async (productId: string): Promise<Review[]> => {
  const response = await fetch(`${BASE_URL}/reviews?productId=${productId}`);
  if (!response.ok) return []; // Return empty array if no reviews
  return response.json();
};


/* ==============================
   CART
================================ */

export async function getCart(userId: string, token?: string) {

  const headers: Record<string, string> = {}

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}/cart/${userId}`, { headers })

  return handleResponse(res)
}

export async function updateCart(
  userId: string,
  cart: Cart,
  token?: string
) {

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}/cart/${userId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(cart)
  })

  return handleResponse(res)
}

/* ==============================
   ORDERS
================================ */

export async function createOrder(order: Order, token?: string) {

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(order)
  })

  return handleResponse(res)
}

export async function getUserOrders(userId: string, token?: string) {

  const headers: Record<string, string> = {}

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}/orders/find/${userId}`, { headers })

  return handleResponse(res)
}

/* ==============================
   USERS
================================ */

export async function getUser(userId: string, token?: string) {

  const headers: Record<string, string> = {}

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}/users/${userId}`, { headers })

  return handleResponse(res)
}

export async function updateUser(
  userId: string,
  data: UserUpdate,
  token?: string
) {

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data)
  })

  return handleResponse(res)
}

/* ==============================
   WISHLIST
================================ */

export async function getWishlist(userId: string, token?: string) {

  const headers: Record<string, string> = {}

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}/users/${userId}/wishlist`, { headers })

  return handleResponse(res)
}

export async function updateWishlist(
  userId: string,
  wishlist: string[],
  token?: string
) {

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}/users/${userId}/wishlist`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ wishlist })
  })

  return handleResponse(res)
}

export const searchProducts = async (query: string) => {
  const response = await fetch(
    `http://localhost:5000/api/products/search?q=${query}`
  );

  if (!response.ok) {
    throw new Error("Failed to search products");
  }

  const data = await response.json();

  return data.products || [];
};

export const adminDeleteProduct = async (productId: number) => {
  const response = await fetch(
    `http://localhost:5000/api/admin/products/${productId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }

  return await response.json();
};
// ADMIN PRODUCT APIs

export const adminCreateProduct = async (product: unknown) => {
  const response = await fetch("http://localhost:5000/api/admin/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  return await response.json();
};

export const adminUpdateProduct = async (id: number, product: unknown) => {
  const response = await fetch(
    `http://localhost:5000/api/admin/products/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  return await response.json();
};

