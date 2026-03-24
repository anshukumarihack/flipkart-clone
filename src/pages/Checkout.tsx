import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/store/cartSlice";
import { placeOrder } from "@/store/authSlice";
import { createOrder } from "@/lib/api";
import { Check, ChevronRight, CreditCard, Smartphone, Building2, Wallet } from "lucide-react";
import type { Order } from "@/store/authSlice";

const STEPS = ["Cart", "Address", "Order Summary", "Payment", "Confirmation"];

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.cart);
  const { addresses, user, token } = useAppSelector((s) => s.auth);

  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");
  const [orderId] = useState("OD" + Date.now().toString().slice(-10));
  const [processing, setProcessing] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const originalTotal = items.reduce((sum, i) => sum + i.originalPrice * i.quantity, 0);
  const discount = originalTotal - subtotal;
  const total = subtotal;

  const handlePlaceOrder = async () => {
    if (!user || !user._id) return;
    setProcessing(true);
    try {
      const orderPayload = {
        userId: user._id,
        products: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        amount: total,
        address: addresses[selectedAddress],
        status: "pending",
      };
      // call backend
      const created = await createOrder(orderPayload, token || undefined);

      const order: Order = {
        id: created._id || orderId,
        items: items.map((i) => ({ productId: i.productId, name: i.name, image: i.image, price: i.price, quantity: i.quantity })),
        total,
        status: created.status || "Confirmed",
        placedAt: new Date().toISOString(),
        deliveryAddress: addresses[selectedAddress],
        paymentMethod,
      };

      dispatch(placeOrder(order));
      dispatch(clearCart());
      setStep(4);
    } catch (err) {
      console.error(err);
      // show error fallback
    }
    setProcessing(false);
  };

  const StepHeader = () => (
    <div className="bg-card rounded-lg shadow-card p-4 mb-4">
      <div className="flex items-center gap-0">
        {["Address", "Order Summary", "Payment"].map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center gap-2 ${i + 1 <= step ? "text-primary-brand" : "text-muted-foreground"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                i + 1 < step ? "step-complete" : i + 1 === step ? "step-active" : "step-inactive"
              }`}>
                {i + 1 < step ? <Check size={12} /> : i + 1}
              </div>
              <span className="text-xs font-semibold hidden sm:block">{s}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 mx-2 ${i + 1 < step ? "bg-success" : "bg-muted"}`} />}
          </div>
        ))}
      </div>
    </div>
  );

  if (step === 4) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
        <div className="bg-card rounded-lg shadow-card p-10">
          <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center mx-auto mb-5">
            <Check size={36} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground mb-2">Order Placed! 🎉</h1>
          <p className="text-muted-foreground mb-4">Your order has been confirmed and is being processed.</p>
          <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono font-semibold text-foreground">{orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Paid</span>
              <span className="font-bold text-foreground">₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment</span>
              <span className="font-semibold text-foreground">{paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Expected Delivery</span>
              <span className="font-semibold text-success">3-5 Mar 2025</span>
            </div>
          </div>
          <button onClick={() => navigate("/")} className="gradient-primary text-white px-8 py-3 rounded font-bold hover:opacity-90 transition-all">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      <StepHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-card rounded-lg shadow-card p-5 animate-fade-in">
              <h2 className="font-bold text-foreground mb-4">Select Delivery Address</h2>
              {addresses.map((addr, i) => (
                <label key={addr.id} className={`flex gap-3 p-4 border-2 rounded-lg cursor-pointer mb-3 transition-all ${
                  selectedAddress === i ? "border-primary bg-primary-subtle" : "border-border hover:border-primary/40"
                }`}>
                  <input type="radio" name="address" checked={selectedAddress === i} onChange={() => setSelectedAddress(i)} className="accent-primary mt-1" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-foreground">{addr.name}</span>
                      <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded font-medium">{addr.type}</span>
                    </div>
                    <p className="text-sm text-foreground">{addr.line1}{addr.line2 ? ", " + addr.line2 : ""}</p>
                    <p className="text-sm text-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-sm text-muted-foreground">Phone: {addr.phone}</p>
                  </div>
                </label>
              ))}
              <button onClick={() => setStep(2)} className="w-full gradient-primary text-white py-3 rounded font-bold hover:opacity-90 transition-all">
                DELIVER HERE <ChevronRight className="inline" size={16} />
              </button>
            </div>
          )}

          {/* Step 2: Order Summary */}
          {step === 2 && (
            <div className="bg-card rounded-lg shadow-card p-5 animate-fade-in">
              <h2 className="font-bold text-foreground mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 py-3 border-b border-border last:border-0">
                    <div className="w-16 h-16 bg-muted rounded shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground line-clamp-2">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-foreground">₹{item.price.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">× {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-foreground">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(3)} className="w-full gradient-primary text-white py-3 rounded font-bold hover:opacity-90 transition-all">
                CONTINUE TO PAYMENT <ChevronRight className="inline" size={16} />
              </button>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="bg-card rounded-lg shadow-card p-5 animate-fade-in">
              <h2 className="font-bold text-foreground mb-4">Payment Method</h2>
              <div className="space-y-3 mb-6">
                {[
                  { id: "UPI", label: "UPI", icon: Smartphone, sub: "Google Pay, PhonePe, Paytm" },
                  { id: "Card", label: "Credit / Debit Card", icon: CreditCard, sub: "Visa, Mastercard, RuPay" },
                  { id: "NetBanking", label: "Net Banking", icon: Building2, sub: "All major banks" },
                  { id: "Wallet", label: "Flipkart Wallet", icon: Wallet, sub: "Balance: ₹0" },
                  { id: "COD", label: "Cash on Delivery", icon: CreditCard, sub: "Pay when delivered" },
                ].map(({ id, label, icon: Icon, sub }) => (
                  <label key={id} className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === id ? "border-primary bg-primary-subtle" : "border-border hover:border-primary/40"
                  }`}>
                    <input type="radio" name="payment" checked={paymentMethod === id} onChange={() => setPaymentMethod(id)} className="accent-primary" />
                    <Icon size={18} className={paymentMethod === id ? "text-primary-brand" : "text-muted-foreground"} />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                  </label>
                ))}
              </div>
              {paymentMethod === "UPI" && (
                <div className="mb-4">
                  <input type="text" placeholder="Enter UPI ID (e.g. name@upi)" value={upiId} onChange={(e) => setUpiId(e.target.value)}
                    className="w-full border border-border rounded px-3 py-2.5 text-sm outline-none focus:border-primary transition-all" />
                </div>
              )}
              <button onClick={handlePlaceOrder} disabled={processing}
                className="w-full gradient-accent text-white py-3.5 rounded font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                {processing ? (
                  <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Processing...</>
                ) : (
                  <>PAY ₹{total.toLocaleString()} <ChevronRight size={16} /></>
                )}
              </button>
              <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
                🔒 Your payment is 100% secure and encrypted
              </p>
            </div>
          )}
        </div>

        {/* Price Summary Sidebar */}
        <div className="bg-card rounded-lg shadow-card p-5 h-fit sticky top-20">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Price Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-foreground">
              <span>MRP ({items.length} items)</span>
              <span>₹{originalTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-success">
              <span>Product Discount</span>
              <span>− ₹{discount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-success">
              <span>Delivery</span>
              <span>FREE</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold text-base text-foreground">
              <span>Total Amount</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
          {discount > 0 && (
            <p className="mt-3 text-success text-sm font-semibold text-center bg-success/10 rounded py-2">
              You save ₹{discount.toLocaleString()}!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
