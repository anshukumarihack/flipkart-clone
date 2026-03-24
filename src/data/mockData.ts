export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  stock: number;
  seller: string;
  description: string;
  specs: Record<string, string>;
  highlights: string[];
  tags: string[];
  isFeatured?: boolean;
  badge?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  helpful: number;
  date: string;
  images?: string[];
}

// High-quality, product-specific images from Unsplash
const PRODUCT_IMAGES = {
  phone1: [
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80", // Samsung S24-like
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&q=80",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80"
  ],
  phone2: [
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80", // iPhone 15 Pro
    "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500&q=80"
  ],
  laptop1: [
    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80", // Dell XPS style
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80"
  ],
  laptop2: [
    "https://images.unsplash.com/photo-1517336714460-4c50d917805d?w=500&q=80", // MacBook Pro
    "https://images.unsplash.com/photo-1611186871348-b1ec696e52c9?w=500&q=80"
  ],
  tv1: [
    "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80", // Smart TV
    "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&q=80"
  ],
  headphones1: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", // Sony Style ANC
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80"
  ],
  watch1: [
    "https://images.unsplash.com/photo-1544117518-30dd5ff7a9bd?w=500&q=80", // Smartwatch
    "https://images.unsplash.com/photo-1508685096489-7aac296839c8?w=500&q=80"
  ],
  tablet1: [
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80", // Tablet
    "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80"
  ],
  camera1: [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80", // Mirrorless Camera
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80"
  ],
  shoe1: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", // Nike Shoes
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80"
  ],
  mixer: ["https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800&q=80"],
  ball: ["https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80"],
  book: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80"],
  dal: ["https://images.unsplash.com/photo-1585994192731-89a19d9703f2?w=800&q=80"],
};

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Samsung Galaxy S24 Ultra 5G (256GB, Titanium Black)",
    brand: "Samsung",
    category: "Electronics",
    subcategory: "Smartphones",
    price: 109999,
    originalPrice: 134999,
    discount: 19,
    rating: 4.6,
    reviewCount: 12847,
    images: PRODUCT_IMAGES.phone1,
    stock: 14,
    seller: "RetailNet Pvt. Ltd.",
    description: "Samsung Galaxy S24 Ultra is the ultimate AI smartphone. With the built-in S Pen, you get the power to work and create wherever you are.",
    specs: { RAM: "12 GB", Storage: "256 GB", Processor: "Snapdragon 8 Gen 3", Display: "6.8 inch QHD+ AMOLED", Battery: "5000 mAh", Camera: "200 MP Quad" },
    highlights: ["200MP Zoom Camera with AI Photo Assist", "Snapdragon 8 Gen 3 for Galaxy", "17.2 cm QHD+ Display", "Built-in S Pen"],
    tags: ["5G", "AMOLED", "S Pen"],
    isFeatured: true,
    badge: "Best Seller",
  },
  {
    id: "2",
    name: "Apple iPhone 15 Pro Max (256GB, Natural Titanium)",
    brand: "Apple",
    category: "Electronics",
    subcategory: "Smartphones",
    price: 134900,
    originalPrice: 159900,
    discount: 16,
    rating: 4.7,
    reviewCount: 9312,
    images: PRODUCT_IMAGES.phone2,
    stock: 3,
    seller: "Apple Authorized Store",
    description: "iPhone 15 Pro Max. Forged in titanium. The first iPhone to feature a customizable Action button and the most powerful iPhone camera system ever.",
    specs: { RAM: "8 GB", Storage: "256 GB", Processor: "A17 Pro Chip", Display: "6.7 inch Super Retina XDR", Battery: "4422 mAh", Camera: "48 MP Triple" },
    highlights: ["Titanium design, lightweight and strong", "A17 Pro chip with 6-core GPU", "48MP Main: 24 MP, ƒ/1.78 aperture", "USB 3 speeds, up to 20x faster transfers"],
    tags: ["5G", "OLED", "ProMotion"],
    isFeatured: true,
    badge: "Only 3 Left!",
  },
  {
    id: "3",
    name: "Dell XPS 15 (2024) Intel Core i7 RTX 4070 Laptop",
    brand: "Dell",
    category: "Electronics",
    subcategory: "Laptops",
    price: 149999,
    originalPrice: 179999,
    discount: 17,
    rating: 4.5,
    reviewCount: 3241,
    images: PRODUCT_IMAGES.laptop1,
    stock: 8,
    seller: "TechZone India",
    description: "Dell XPS 15 features a stunning InfinityEdge display and exceptional performance in a compact chassis.",
    specs: { RAM: "32 GB DDR5", Storage: "1 TB NVMe SSD", Processor: "Intel Core i7-14700H", Display: "15.6 inch 3.5K OLED", GPU: "NVIDIA RTX 4070 8GB", Battery: "86 WHr" },
    highlights: ["15.6 inch 3.5K OLED Touch Display", "14th Gen Intel Core i7", "RTX 4070 for Pro Graphics", "Thunderbolt 4 connectivity"],
    tags: ["OLED", "Gaming", "Creator"],
    isFeatured: true,
    badge: "Top Rated",
  },
  {
    id: "4",
    name: "Apple MacBook Pro 14\" M3 Pro Chip (18GB/512GB)",
    brand: "Apple",
    category: "Electronics",
    subcategory: "Laptops",
    price: 188900,
    originalPrice: 214900,
    discount: 12,
    rating: 4.8,
    reviewCount: 5612,
    images: PRODUCT_IMAGES.laptop2,
    stock: 5,
    seller: "Apple Authorized Store",
    description: "MacBook Pro supercharged by M3 Pro. The most advanced chip ever in a laptop delivers exceptional performance.",
    specs: { RAM: "18 GB Unified", Storage: "512 GB SSD", Processor: "Apple M3 Pro 11-core", Display: "14.2 inch Liquid Retina XDR", GPU: "14-core GPU", Battery: "Up to 18 hrs" },
    highlights: ["M3 Pro chip — game changing performance", "Up to 18 hours battery life", "Liquid Retina XDR display", "Three Thunderbolt 4 ports"],
    tags: ["M3", "Retina", "Pro"],
    isFeatured: false,
  },
  {
    id: "5",
    name: "Sony Bravia 4K OLED 55\" Smart Google TV (2024)",
    brand: "Sony",
    category: "Electronics",
    subcategory: "Televisions",
    price: 109990,
    originalPrice: 149990,
    discount: 27,
    rating: 4.4,
    reviewCount: 2103,
    images: PRODUCT_IMAGES.tv1,
    stock: 6,
    seller: "Croma Retail",
    description: "Experience stunning 4K OLED picture quality with Sony's Cognitive Processor XR for breathtaking realism.",
    specs: { "Screen Size": "55 inch", Resolution: "4K Ultra HD", "Panel Type": "OLED", "Refresh Rate": "120Hz", HDR: "Dolby Vision, HDR10", OS: "Google TV" },
    highlights: ["Cognitive Processor XR for lifelike picture", "OLED panel for perfect blacks", "Dolby Atmos & 360 Spatial Sound", "Google TV with voice remote"],
    tags: ["OLED", "4K", "Google TV"],
    badge: "27% Off",
  },
  {
    id: "6",
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    brand: "Sony",
    category: "Electronics",
    subcategory: "Audio",
    price: 24990,
    originalPrice: 34990,
    discount: 29,
    rating: 4.6,
    reviewCount: 8921,
    images: PRODUCT_IMAGES.headphones1,
    stock: 22,
    seller: "SoundZone",
    description: "Industry-leading noise cancellation with 30 hours battery life. Designed for exceptional comfort.",
    specs: { Type: "Over-ear", Connectivity: "Bluetooth 5.2", "Battery Life": "30 hours", "Noise Cancellation": "Industry-leading ANC", Weight: "250g", Mic: "4 microphones" },
    highlights: ["Best-in-class noise cancellation", "Speak-to-Chat technology", "30 hr battery with quick charge", "Multipoint connection (2 devices)"],
    tags: ["ANC", "Wireless", "Premium"],
    isFeatured: true,
    badge: "29% Off",
  },
  {
    id: "7",
    name: "Apple Watch Series 9 GPS 45mm (Midnight Aluminum)",
    brand: "Apple",
    category: "Electronics",
    subcategory: "Wearables",
    price: 41900,
    originalPrice: 48900,
    discount: 14,
    rating: 4.5,
    reviewCount: 4231,
    images: PRODUCT_IMAGES.watch1,
    stock: 18,
    seller: "iStore Official",
    description: "Apple Watch Series 9 features the new S9 chip for faster performance and new ways to interact with your watch.",
    specs: { Case: "45mm Aluminum", Display: "Always-On Retina", "Battery Life": "18 hours", OS: "watchOS 10", Water: "50m water resistant", Sensors: "Blood Oxygen, ECG, Heart Rate" },
    highlights: ["New S9 chip — fastest Apple Watch ever", "Double tap gesture to control Watch", "18-hour battery life", "Carbon neutral"],
    tags: ["Health", "GPS", "Series 9"],
  },
  {
    id: "8",
    name: "Samsung Galaxy Tab S9 FE 5G (256GB, Lavender)",
    brand: "Samsung",
    category: "Electronics",
    subcategory: "Tablets",
    price: 36999,
    originalPrice: 46999,
    discount: 21,
    rating: 4.3,
    reviewCount: 1847,
    images: PRODUCT_IMAGES.tablet1,
    stock: 11,
    seller: "RetailNet Pvt. Ltd.",
    description: "Galaxy Tab S9 FE brings you the Galaxy experience with IP68 rating and S Pen included.",
    specs: { RAM: "8 GB", Storage: "256 GB", Processor: "Exynos 1380", Display: "10.9 inch TFT LCD", Battery: "10090 mAh", Camera: "8 MP + 10 MP" },
    highlights: ["IP68 water and dust resistance", "S Pen included in the box", "10090 mAh battery", "5G connectivity"],
    tags: ["5G", "S Pen", "IP68"],
  },
  {
    id: "9",
    name: "Canon EOS R50 Mirrorless Camera (Body + 18-45mm Lens)",
    brand: "Canon",
    category: "Electronics",
    subcategory: "Cameras",
    price: 64995,
    originalPrice: 79995,
    discount: 19,
    rating: 4.5,
    reviewCount: 987,
    images: PRODUCT_IMAGES.camera1,
    stock: 4,
    seller: "PhotoWorld",
    description: "Canon EOS R50 is designed for content creators seeking premium image quality in a compact body.",
    specs: { Sensor: "24.2 MP APS-C CMOS", Processor: "DIGIC X", AF: "Dual Pixel CMOS AF II", Video: "4K 30fps, 1080p 120fps", Stabilization: "In-lens", Mount: "RF Mount" },
    highlights: ["24.2MP APS-C sensor", "Eye detection AF for people and animals", "4K 30fps video", "Compact and lightweight 375g"],
    tags: ["Mirrorless", "4K", "Content Creator"],
  },
  {
    id: "10",
    name: "Nike Air Max 270 Running Shoes (Size 9, Black/White)",
    brand: "Nike",
    category: "Fashion",
    subcategory: "Footwear",
    price: 12995,
    originalPrice: 15995,
    discount: 19,
    rating: 4.4,
    reviewCount: 3421,
    images: PRODUCT_IMAGES.shoe1,
    stock: 30,
    seller: "Nike India Official",
    description: "The Nike Air Max 270 delivers unrivaled comfort with a large Air unit heel for all-day wearability.",
    specs: { Type: "Running / Lifestyle", Upper: "Mesh and synthetic", Midsole: "Foam with Air-Sole unit", Outsole: "Rubber", Weight: "298g (per shoe)", Closure: "Lace-up" },
    highlights: ["Largest Air unit heel for max cushioning", "Lightweight mesh upper", "Foam midsole for comfort", "Rubber outsole for durability"],
    tags: ["Running", "Lifestyle", "Air Max"],
  },
  // extra categories
  {
    id: "11",
    name: "Prestige 750W Mixer Grinder",
    brand: "Prestige",
    category: "Home & Kitchen",
    subcategory: "Appliances",
    price: 4999,
    originalPrice: 5999,
    discount: 16,
    rating: 4.2,
    reviewCount: 1820,
    images: PRODUCT_IMAGES.mixer,
    stock: 50,
    seller: "Home Essentials",
    description: "A powerful 750W mixer grinder with 3 jars for grinding, blending and chutney making.",
    specs: { Power: "750 W", Jars: "3 Stainless Steel", Warranty: "2 years" },
    highlights: ["450W motor", "Three stainless steel jars", "Easy to clean"],
    tags: ["Kitchen", "Blender"],
  },
  {
    id: "p012",
    name: "Adidas Predator Soccer Ball",
    brand: "Adidas",
    category: "Sports",
    subcategory: "Football",
    price: 2599,
    originalPrice: 3500,
    discount: 25,
    rating: 4.5,
    reviewCount: 760,
    images: PRODUCT_IMAGES.ball,
    stock: 120,
    seller: "Sports World",
    description: "FIFA-approved professional soccer ball suitable for turf and grass.",
    specs: { Size: "5", Material: "PU" },
    highlights: ["FIFA Quality Pro", "Machine-stitched"],
    tags: ["Football", "Sports"],
  },
  {
    id: "p013",
    name: "The Alchemist by Paulo Coelho (Paperback)",
    brand: "HarperCollins",
    category: "Books",
    subcategory: "Fiction",
    price: 199,
    originalPrice: 299,
    discount: 33,
    rating: 4.7,
    reviewCount: 15800,
    images: PRODUCT_IMAGES.book,
    stock: 200,
    seller: "BookStore Online",
    description: "A philosophical book about following your dreams and listening to your heart.",
    specs: { Pages: "208", Language: "English", Dimensions: "20 x 13 cm" },
    highlights: ["Bestseller", "Global phenomenon"],
    tags: ["Fiction", "Philosophy"],
  },
  {
    id: "p014",
    name: "Tata Sampann Toor Dal (1kg)",
    brand: "Tata Sampann",
    category: "Grocery",
    subcategory: "Pulses",
    price: 180,
    originalPrice: 200,
    discount: 10,
    rating: 4.3,
    reviewCount: 430,
    images: PRODUCT_IMAGES.dal,
    stock: 500,
    seller: "Grocery Bazaar",
    description: "Premium quality toor dal with no adulterants, rich in protein.",
    specs: { Weight: "1 kg", Pack: "Pouch" },
    highlights: ["Rich in protein", "Handpicked"],
    tags: ["Food", "Staple"],
  },
];

export const REVIEWS: Review[] = [
  { id: "r1", productId: "1", userId: "u1", userName: "Rajesh K.", rating: 5, title: "Absolutely fantastic phone!", body: "The camera quality is out of this world. I've been using Samsung phones for years and this is by far the best. The S Pen is a game changer for note taking. Battery lasts easily a day and a half with heavy use.", verifiedPurchase: true, helpful: 234, date: "2024-12-15" },
  { id: "r2", productId: "1", userId: "u2", userName: "Priya M.", rating: 4, title: "Great but very expensive", body: "Performance is top notch. The zoom capabilities are incredible. Docked one star because the price is steep. But if you can afford it, it's worth every rupee.", verifiedPurchase: true, helpful: 112, date: "2024-11-22" },
  { id: "r3", productId: "1", userId: "u3", userName: "Arun S.", rating: 5, title: "Best Android phone in 2024", body: "Switched from iPhone and couldn't be happier. The customization options are endless. S Pen integration in apps is seamless.", verifiedPurchase: false, helpful: 67, date: "2025-01-03" },
  { id: "r4", productId: "3", userId: "u4", userName: "Sneha T.", rating: 5, title: "Perfect for video editing!", body: "The OLED display is stunning. Colors are so accurate. The RTX 4070 handles my Premiere Pro and DaVinci Resolve projects effortlessly. Build quality is premium.", verifiedPurchase: true, helpful: 189, date: "2024-10-14" },
  { id: "r5", productId: "6", userId: "u5", userName: "Vikram P.", rating: 5, title: "Best ANC headphones period", body: "I travel a lot for work. These have literally changed my life. ANC is so good that I can work in airports without distraction. Sound quality is phenomenal.", verifiedPurchase: true, helpful: 341, date: "2024-09-20" },
];

export const CATEGORIES = [
  { id: "c1", name: "Smartphones", icon: "📱", count: 4 },
  { id: "c2", name: "Laptops", icon: "💻", count: 2 },
  { id: "c3", name: "Televisions", icon: "📺", count: 1 },
  { id: "c4", name: "Audio", icon: "🎧", count: 1 },
  { id: "c5", name: "Wearables", icon: "⌚", count: 1 },
  { id: "c6", name: "Tablets", icon: "📱", count: 1 },
  { id: "c7", name: "Cameras", icon: "📷", count: 1 },
  { id: "c8", name: "Fashion", icon: "�", count: 1 },
  // new high-level categories
  { id: "c9", name: "Home & Kitchen", icon: "🏠", count: 1 },
  { id: "c10", name: "Sports", icon: "🏅", count: 1 },
  { id: "c11", name: "Books", icon: "📚", count: 1 },
  { id: "c12", name: "Grocery", icon: "🛒", count: 1 },
];

export const OFFERS = [
  { id: "o1", icon: "🏦", title: "Bank Offer", description: "10% off on SBI Credit Cards, up to ₹5,000 off. Min spend ₹30,000", code: "SBIOFF10" },
  { id: "o2", icon: "💳", title: "EMI Offer", description: "No cost EMI from ₹2,749/month. 6 month plan with HDFC Cards", code: null },
  { id: "o3", icon: "🎁", title: "Partner Offer", description: "Get ₹1,000 off on Flipkart Pay Later orders above ₹15,000", code: "FPL1000" },
  { id: "o4", icon: "🔄", title: "Exchange Offer", description: "Up to ₹22,000 off on exchange. Check exchange value online", code: null },
];

export const PINCODES: Record<string, { deliveryDate: string; available: boolean }> = {
  "110001": { deliveryDate: "Tomorrow", available: true },
  "400001": { deliveryDate: "In 2 Days", available: true },
  "560001": { deliveryDate: "19 Mar", available: true },
  "700001": { deliveryDate: "20 Mar", available: true },
  "500001": { deliveryDate: "23 Mar", available: true },
};
