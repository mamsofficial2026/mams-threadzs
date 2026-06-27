import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ================= 🔥 UPDATED: TEXT CAROUSEL LOGIC WITH TRUST SIGNALS =================
  const topBannerTexts = [
    "⚡ GET FLAT 10% OFF ON ALL PREPAID ORDERS ⚡",
    "📦 FREE SHIPPING ACROSS INDIA 📦",
    "💯 240 GSM PREMIUM HEAVYWEIGHT COTTON 💯",
    "✅ 7-DAY EASY RETURNS & EXCHANGES ✅",
    "🔒 100% SECURE PAYMENTS 🔒"
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

  // Instant Search Filter Matrix
  const filteredProducts = products ? products.filter(item => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    const nameMatch = item.name?.toLowerCase().includes(query);
    const catMatch = item.category?.toLowerCase().includes(query);
    const subMatch = item.sub_category?.toLowerCase().includes(query);
    const priceMatch = item.price?.toString().includes(query);
    return nameMatch || catMatch || subMatch || priceMatch;
  }).slice(0, 6) : [];

  const handleProductSelect = (id) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    navigate(`/product/${id}`);
  };

  return (
    <>
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
          <div className="hidden lg:flex items-center justify-center gap-5 xl:gap-8 flex-shrink-0">
            <Link to="/collections/men" className="text-sm font-black uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors">Men</Link>
            <Link to="/collections/women" className="text-sm font-black uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors">Women</Link>
            <Link to="/collections/genz" className="text-sm font-black uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors">Gen Z</Link>
            <Link to="/about" className="text-sm font-black uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors">Our Story</Link>
            <Link to="/contact" className="text-sm font-black uppercase tracking-widest text-gray-900 hover:text-red-600 transition-colors">Contact</Link>
            <Link to="/customize" className="text-sm font-black text-red-600 uppercase tracking-widest hover:text-black transition-colors flex items-center gap-1">
              <span className="bg-red-100 px-2 py-0.5 rounded text-[10px] animate-pulse">NEW</span>
              Customize
            </Link>
          </div>

          {/* RIGHT: ICONS */}
          <div className="flex items-center justify-end gap-3 sm:gap-5 flex-1">
            <button onClick={() => setIsSearchOpen(true)} className="text-gray-900 hover:text-red-600 transition-colors block"><Search size={22} /></button>
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

      {/* ================= 🔥 MYNTRA / AJIO STYLE LIVE SEARCH MODAL ================= */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/60 backdrop-blur-md animate-fade-in">
          
          <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
            
            {/* Search Input Bar */}
            <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center gap-4 relative">
              <Search className="text-red-600 flex-shrink-0" size={26} />
              <input 
                type="text" 
                autoFocus
                placeholder="Search by T-shirt Name, Category (Crop, Oversized), or Price..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-base sm:text-lg font-bold text-gray-900 placeholder-gray-400 outline-none bg-transparent"
              />
              <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="p-2 bg-gray-100 hover:bg-red-600 hover:text-white rounded-full text-gray-600 transition-all flex-shrink-0">
                <X size={20} />
              </button>
            </div>

            {/* Live Filter Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 divide-y divide-gray-50">
              {searchQuery.trim() === "" ? (
                <div className="py-8 text-center text-gray-400 font-medium text-sm">
                  💡 Type at least 2 letters to search our live drops...
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((item) => {
                  let imgUrl = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80';
                  if (item.colors?.[0]?.images?.[0]) imgUrl = item.colors[0].images[0];
                  else if (item.images?.[0]) imgUrl = item.images[0];
                  else if (item.image) imgUrl = item.image;

                  return (
                    <div 
                      key={item.id} 
                      onClick={() => handleProductSelect(item.id)}
                      className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 px-3 rounded-2xl transition-all group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <img src={imgUrl} alt={item.name} className="w-12 h-14 object-cover rounded-xl bg-gray-100 flex-shrink-0 group-hover:scale-105 transition-transform" />
                        <div className="min-w-0">
                          <h4 className="text-sm font-black text-gray-900 uppercase truncate group-hover:text-red-600 transition-colors">{item.name}</h4>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.category} • {item.sub_category || 'Plain'}</span>
                        </div>
                      </div>
                      
                      {/* Search Cards Price & Rating */}
                      <div className="text-right flex-shrink-0 flex flex-col items-end justify-center gap-1">
                        <span className="text-base font-black text-black block">₹{item.price}</span>
                        <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-600">
                          <Star size={10} className="fill-yellow-400 text-yellow-400" />
                          <span>4.8</span>
                        </div>
                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-900 font-black text-lg mb-1">No drip found! 😔</p>
                  <p className="text-gray-400 text-xs font-medium">We couldn't find anything matching "{searchQuery}"</p>
                </div>
              )}
            </div>

            {/* Modal Footer Strip */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400 flex justify-between">
              <span>⚡ THREADZS LIVE SEARCH</span>
              <span>ESC TO CLOSE</span>
            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default Navbar;