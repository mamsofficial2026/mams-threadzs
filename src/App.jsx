import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; 
import { ProductProvider } from './context/ProductContext'; 
import { useEffect, useState } from 'react';
import { X, Gift, Copy, ShoppingBag } from 'lucide-react'; 

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import Customize from './pages/Customize';
import Collection from './pages/Collection'; 
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import ShippingPolicy from './pages/ShippingPolicy';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

// Layout Component to handle conditional Navbar rendering
const AppLayout = () => {
  const location = useLocation();
  
  // --- Exit Intent Popup State ---
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- Live Sales Toast State ---
  const [salesToast, setSalesToast] = useState(null);
  
  const isAdminRoute = location.pathname.startsWith('/puppy');

  // --- 🔥 UPDATED: Auto Scroll to Top & Meta Pixel PageView Tracking ---
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Tell Facebook Pixel the user navigated to a new page
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname]);
  
  // --- ZERO-COST EXIT-INTENT LOGIC ---
  useEffect(() => {
    if (isAdminRoute) return;

    const hasTriggered = sessionStorage.getItem('exitTriggered');
    if (hasTriggered) return;

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        setShowExitPopup(true);
        sessionStorage.setItem('exitTriggered', 'true');
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY - 70 && currentScrollY < 150) {
        setShowExitPopup(true);
        sessionStorage.setItem('exitTriggered', 'true');
        window.removeEventListener('scroll', handleScroll);
      }
      lastScrollY = currentScrollY;
    };

    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('scroll', handleScroll);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isAdminRoute]);

  // --- LIVE SALES TOAST LOGIC ---
  useEffect(() => {
    if (isAdminRoute) return;

    const fakeSales = [
      { name: "Rahul", city: "Chennai", product: "Black Oversized Drop", time: "12 mins ago" },
      { name: "Priya", city: "Bangalore", product: "Lavender Premium Tee", time: "24 mins ago" },
      { name: "Karthik", city: "Madurai", product: "White Classic Crop", time: "2 hours ago" },
      { name: "Arun", city: "Coimbatore", product: "Gen-Z Graphic Tee", time: "5 mins ago" },
      { name: "Neha", city: "Mumbai", product: "Red Heavyweight Drop", time: "41 mins ago" },
      { name: "Gokul", city: "Trichy", product: "Custom Print Tee", time: "1 hr ago" }
    ];

    const triggerToast = () => {
      const randomSale = fakeSales[Math.floor(Math.random() * fakeSales.length)];
      setSalesToast(randomSale);
      setTimeout(() => setSalesToast(null), 5000);
    };

    const initialTimer = setTimeout(triggerToast, 10000); 
    const intervalTimer = setInterval(triggerToast, 45000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [isAdminRoute]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("PREPAID10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections/:category" element={<Collection />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/customize" element={<Customize />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/puppy" element={<AdminDashboard />} />
          <Route path="/terms-conditions" element={<Terms />} />
          <Route path="/cancellation-refund" element={<RefundPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}

      {/* LIVE SALES TOAST UI */}
      {salesToast && (
        <div className="fixed bottom-20 md:bottom-8 left-4 md:left-8 z-[150] animate-in slide-in-from-bottom-5 fade-in duration-500 pointer-events-none">
          <div className="bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.12)] rounded-2xl p-3 flex items-center gap-4 pr-10 relative pointer-events-auto">
            <button onClick={() => setSalesToast(null)} className="absolute top-2 right-2 text-gray-400 hover:text-black transition-colors">
              <X size={14} />
            </button>
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 border border-green-100">
              <ShoppingBag size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold mb-0.5"><span className="text-black font-black">{salesToast.name}</span> from {salesToast.city}</p>
              <p className="text-[10px] text-gray-900 font-black uppercase tracking-wider truncate max-w-[180px] md:max-w-[220px]">Purchased {salesToast.product}</p>
              <p className="text-[9px] text-gray-400 font-bold mt-1 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> {salesToast.time}</p>
            </div>
          </div>
        </div>
      )}

      {/* EXIT INTENT POPUP MODAL */}
      {showExitPopup && (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl relative text-center flex flex-col animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowExitPopup(false)} className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-red-600 hover:text-white transition-colors z-10"><X size={20} /></button>
            <div className="bg-red-600 text-white pt-10 pb-8 px-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="w-16 h-16 bg-white text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg"><Gift size={32} /></div>
              <h2 className="text-3xl font-black uppercase tracking-widest relative z-10">Wait! Don't Go.</h2>
              <p className="font-bold text-red-100 mt-2 text-sm relative z-10">You left some premium drip behind!</p>
            </div>
            <div className="p-8">
              <p className="text-gray-600 font-medium mb-6 text-sm">Complete your order right now and use this secret code to get <strong className="text-black">10% OFF</strong> your entire cart.</p>
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-4 flex items-center justify-between mb-6 group hover:border-red-400 transition-colors">
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Promo Code</span>
                  <span className="text-2xl font-black text-black tracking-widest">PREPAID10</span>
                </div>
                <button onClick={handleCopyCode} className={`p-3 rounded-xl flex items-center justify-center transition-all ${copied ? 'bg-green-100 text-green-600' : 'bg-black text-white hover:bg-red-600'}`}>
                  {copied ? <span className="text-xs font-black px-2 uppercase">Copied!</span> : <Copy size={20} />}
                </button>
              </div>
              <button onClick={() => setShowExitPopup(false)} className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 hover:-translate-y-1 transition-all">Claim My Discount</button>
              <button onClick={() => setShowExitPopup(false)} className="mt-4 text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest underline">No thanks, I'll pay full price later</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <Router>
          <AppLayout />
        </Router>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;