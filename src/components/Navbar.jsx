import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, User, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();

  // ================= TEXT CAROUSEL LOGIC =================
  const topBannerTexts = [
    "🔥 FREE SHIPPING ACROSS INDIA 🔥",
    "✨ NEW TRENDING COLLECTIONS DROPPED ✨",
    "⚡ GET FLAT 10% OFF ON PREPAID ORDERS ⚡",
    "👕 CUSTOMIZE YOUR OWN DRIP NOW 👕"
  ];

  const [textIndex, setTextIndex] = useState(0);
  const [isFading, setIsFading] = useState(true);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setIsFading(false);
      setTimeout(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % topBannerTexts.length);
        setIsFading(true);
      }, 400);
    }, 3000);

    return () => clearInterval(textInterval);
  }, []);

  const cartCount = cartItems ? cartItems.reduce((total, item) => total + (item.quantity || 1), 0) : 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm print:hidden">
      
      {/* ================= TOP TEXT CAROUSEL BANNER ================= */}
      <div className="bg-red-600 text-white text-[11px] sm:text-xs font-black uppercase tracking-widest py-3 text-center overflow-hidden h-10 flex items-center justify-center">
        <div className={`transition-all duration-500 transform ${isFading ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          {topBannerTexts[textIndex]}
        </div>
      </div>

      {/* ================= MAIN NAVBAR ================= */}
      <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-24 sm:h-28 flex items-center justify-between">
        
        {/* LEFT: HAMBURGER & LOGO GROUP */}
        <div className="flex items-center gap-3 md:gap-6 flex-1">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-gray-900 hover:text-red-600 transition-colors"
          >
            <Menu size={30} />
          </button>
          
          <Link to="/" className="ml-1 flex items-center h-full">
            <img 
              src="/logo.png" 
              alt="THREADZS Logo" 
              className="h-20 sm:h-24 md:h-28 object-contain scale-[1.5] md:scale-[1.6] origin-left select-none" 
            />
          </Link>
        </div>

        {/* CENTER: DESKTOP LINKS */}
        {/* --- FIXED: Added Our Story and Contact links directly into Desktop row matrix --- */}
        <div className="hidden lg:flex items-center justify-center gap-5 xl:gap-8 flex-shrink-0">
          <Link to="/collections/men" className="text-sm font-black uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors">Men</Link>
          <Link to="/collections/women" className="text-sm font-black uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors">Women</Link>
          <Link tow="/collections/genz" className="text-sm font-black uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors">Gen Z</Link>
          <Link to="/about" className="text-sm font-black uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors">Our Story</Link>
          <Link to="/contact" className="text-sm font-black uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors">Contact</Link>
          <Link to="/customize" className="text-sm font-black text-red-600 uppercase tracking-widest hover:text-black transition-colors flex items-center gap-1">
            <span className="bg-red-100 px-2 py-0.5 rounded text-[10px] animate-pulse">NEW</span>
            Customize
          </Link>
        </div>

        {/* RIGHT: ICONS */}
        <div className="flex items-center justify-end gap-3 sm:gap-5 flex-1">
          <button className="text-gray-900 hover:text-red-600 transition-colors hidden sm:block"><Search size={22} /></button>
          <button className="text-gray-900 hover:text-red-600 transition-colors hidden sm:block"><User size={22} /></button>
          <button className="text-gray-900 hover:text-red-600 transition-colors hidden sm:block"><Heart size={22} /></button>
          <Link to="/cart" className="relative text-gray-900 hover:text-red-600 transition-colors flex items-center">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* ================= SLIDE-IN DRAWER MENU ================= */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <div 
        className={`fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-[70] transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col border-r border-gray-100 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 h-24">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
             <img 
              src="/logo.png" 
              alt="THREADZS Logo" 
              className="h-20 object-contain scale-[1.4] origin-left" 
            />
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-6">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors">Home</Link>
          <Link to="/collections/men" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors">Men's Collection</Link>
          <Link to="/collections/women" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors">Women's Collection</Link>
          <Link to="/collections/genz" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors">Gen Z Collection</Link>
          
          <div className="h-px bg-gray-100 my-2"></div>
          
          <Link to="/customize" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black uppercase tracking-widest text-red-600 flex items-center gap-2">
            Customize Print <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-[10px] animate-pulse">NEW</span>
          </Link>
          
          <div className="h-px bg-gray-100 my-2"></div>
          
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">Our Story</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">Contact Us</Link>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
           <div className="flex gap-4 justify-center">
              <button className="flex items-center justify-center gap-2 text-sm font-black uppercase tracking-wider text-gray-600 hover:text-red-600 transition-colors">
                <User size={18}/> Login / Account
              </button>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;