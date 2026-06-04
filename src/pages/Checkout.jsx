import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, ShieldCheck, CreditCard, Smartphone, Loader2 } from 'lucide-react';
// --- NEW: Import Supabase ---
import { supabase } from '../supabaseClient'; 

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart(); 
  
  const [isProcessing, setIsProcessing] = useState(false);

  // --- State to hold form data temporarily ---
  const [shippingData, setShippingData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    pincode: ''
  });

  const directItem = location.state?.directItem;
  const checkoutItems = directItem ? [directItem] : cartItems;
  
  const subtotal = checkoutItems ? checkoutItems.reduce((acc, item) => acc + (parseInt(item.price) * (item.quantity || 1)), 0) : 0;

  // --- PAYU CREDENTIALS (Keep these safe!) ---
  const PAYU_MERCHANT_KEY = "Ke4bD7";
  const PAYU_MERCHANT_SALT = "IjE2WJgknHCInBe40BRk89wVrpKtoiuv";
  // Change to 'https://secure.payu.in/_payment' for live production
  const PAYU_BASE_URL = "https://secure.payu.in/_payment"; 

  const handleInputChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  // --- Function to generate SHA-512 Hash securely in browser ---
  const generateHash = async (hashString) => {
    const utf8 = new TextEncoder().encode(hashString);
    const hashBuffer = await crypto.subtle.digest('SHA-512', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // --- UPDATED: Save to Supabase and Redirect to PayU ---
  const handleProceedToPay = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Create a unique Order ID / Transaction ID
      const txnid = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const amountStr = parseFloat(subtotal).toFixed(2); // PayU strictly needs decimals (e.g., 399.00)
      const productInfo = "THREADZS_Custom_Order";
      
      // 2. Save Initial Order to Supabase as "Pending Payment"
      const orderPayload = {
        id: txnid,
        customer: shippingData.fullName,
        email: shippingData.email,
        phone: shippingData.mobile,
        address: shippingData.address,
        city: shippingData.city,
        pincode: shippingData.pincode,
        items: checkoutItems, 
        amount: `₹${subtotal.toLocaleString('en-IN')}`,
        status: 'Pending Payment' // Will be updated to 'Paid' after PayU success
      };

      const { error } = await supabase.from('orders').insert([orderPayload]);
      if (error) throw error;

      // 3. Construct PayU Hash String 
      // Formula: key|txnid|amount|productinfo|firstname|email|||||||||||salt
      const hashString = `${PAYU_MERCHANT_KEY}|${txnid}|${amountStr}|${productInfo}|${shippingData.fullName}|${shippingData.email}|||||||||||${PAYU_MERCHANT_SALT}`;
      const hash = await generateHash(hashString);

      // 4. Create a dynamic hidden form to POST data to PayU
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = PAYU_BASE_URL;

      // URL where PayU will send the user after payment (You need to create these pages next bro!)
      const successUrl = "http://localhost:5173/payment-success";
      const failureUrl = "http://localhost:5173/payment-failed";

      const payuParams = {
        key: PAYU_MERCHANT_KEY,
        txnid: txnid,
        amount: amountStr,
        productinfo: productInfo,
        firstname: shippingData.fullName,
        email: shippingData.email,
        phone: shippingData.mobile,
        surl: successUrl,
        furl: failureUrl,
        hash: hash
      };

      // Append all inputs to form
      Object.keys(payuParams).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = payuParams[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      
      // Clear cart before redirecting so it's empty when they return
      if (!directItem && clearCart) {
        clearCart();
      }

      // 5. Submit form to PayU Gateway
      form.submit();

    } catch (error) {
      console.error("Payment Initiation Error:", error);
      alert("Something went wrong while initiating payment. Please contact support.");
      setIsProcessing(false);
    }
  };

  if (!checkoutItems || checkoutItems.length === 0) {
    return <div className="text-center py-32 font-black text-2xl">Nothing to checkout.</div>;
  }

  // ================= UI: CHECKOUT FORM =================
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 bg-white min-h-screen relative">
      
      {/* Loading Overlay when redirecting to PayU */}
      {isProcessing && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl">
          <Loader2 size={60} className="text-red-600 animate-spin mb-4" />
          <h2 className="text-2xl font-black uppercase tracking-widest text-gray-900 animate-pulse">Redirecting to Secure Gateway...</h2>
          <p className="text-sm font-bold text-gray-500 mt-2 uppercase">Please do not refresh the page</p>
        </div>
      )}

      <div className="flex items-center gap-3 mb-10 border-b border-gray-200 pb-6">
        <ShieldCheck size={32} className="text-green-600" />
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-gray-900">Secure Checkout</h1>
      </div>

      <div className="flex flex-col-reverse lg:flex-row gap-10">
        
        {/* Left: Shipping Form */}
        <div className="flex-[2]">
          <form onSubmit={handleProceedToPay} className="bg-gray-50 border border-gray-100 rounded-3xl p-6 md:p-10 shadow-sm">
            <h2 className="text-xl font-black uppercase tracking-wider text-gray-900 mb-6">Shipping Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                <input type="text" name="fullName" value={shippingData.fullName} onChange={handleInputChange} required className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900" placeholder="Madhavan N" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Mobile Number</label>
                <input type="tel" name="mobile" value={shippingData.mobile} onChange={handleInputChange} required className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900" placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
              <input type="email" name="email" value={shippingData.email} onChange={handleInputChange} required className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900" placeholder="maddy@example.com" />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Complete Address</label>
              <textarea name="address" value={shippingData.address} onChange={handleInputChange} required rows="3" className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900" placeholder="Door No, Street, Area..."></textarea>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">City</label>
                <input type="text" name="city" value={shippingData.city} onChange={handleInputChange} required className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900" placeholder="Madurai" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Pincode</label>
                <input type="text" name="pincode" value={shippingData.pincode} onChange={handleInputChange} required className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900" placeholder="625001" />
              </div>
            </div>

            <h2 className="text-xl font-black uppercase tracking-wider text-gray-900 mb-6 border-t border-gray-200 pt-8">Payment Method</h2>
            <div className="space-y-4 mb-8">
              <label className="flex items-center gap-4 p-4 border-2 border-black bg-white rounded-xl cursor-pointer shadow-sm">
                <input type="radio" name="payment" defaultChecked className="w-5 h-5 accent-black" />
                <CreditCard size={24} className="text-gray-900" />
                <div>
                  <span className="block font-black text-gray-900 tracking-wider">PayU Secure Gateway</span>
                  <span className="block text-xs font-bold text-green-600 mt-0.5">UPI, Cards, Netbanking & Wallets</span>
                </div>
              </label>
            </div>

            <button type="submit" disabled={isProcessing} className="w-full bg-red-600 text-white py-5 rounded-xl font-black text-lg uppercase tracking-widest hover:bg-black transition-all shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
              {isProcessing ? "Connecting to PayU..." : "Proceed to Secure Pay"}
            </button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 sticky top-24 shadow-lg shadow-gray-100">
            <h2 className="text-lg font-black uppercase tracking-wider text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
            
            <div className="space-y-6 mb-6 max-h-[400px] overflow-y-auto scrollbar-hide pr-2">
              {checkoutItems.map((item, index) => {
                const displayImage = (item.images && item.images.length > 0) ? item.images[0] : item.image;
                return (
                  <div key={index} className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                      <img src={displayImage} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-black text-gray-900 leading-tight">{item.name}</h3>
                      <p className="text-xs font-bold text-gray-500 mt-1">Size: {item.size || 'M'} | Qty: {item.quantity || 1}</p>
                      <p className="text-sm font-black text-red-600 mt-1">₹{parseInt(item.price) * (item.quantity || 1)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t border-gray-200 pt-6 space-y-3 mb-6">
              <div className="flex justify-between text-sm font-bold text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center border-t border-black pt-4">
              <span className="text-base font-black text-gray-900 uppercase">To Pay</span>
              <span className="text-2xl font-black text-black">₹{subtotal}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;