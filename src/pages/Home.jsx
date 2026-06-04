import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useRef, useState, useEffect } from 'react'; 
import { supabase } from '../supabaseClient'; 

const Home = () => {
  const { products, heroBanner } = useProducts();

  // DYNAMIC CATEGORY FILTERING
  const menCollections = products.filter(p => p.category === 'Men');
  const womenCollections = products.filter(p => p.category === 'Women');
  const genZCollections = products.filter(p => p.category === 'Gen Z');

  const menRef = useRef(null);
  const womenRef = useRef(null);
  const genZRef = useRef(null);
  const reviewRef = useRef(null);

  // --- State to hold REAL reviews from database ---
  const [realReviews, setRealReviews] = useState([]);

  // --- Fetch reviews from Supabase ---
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10); 

        if (error) throw error;
        
        if (data) {
          setRealReviews(data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error.message);
      }
    };

    fetchReviews();
  }, []);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 320; 
      ref.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  // ================= STANDARD CLEAN PRODUCT CARDS COMPONENT =================
  const renderPremiumCard = (item) => {
    const displayImage = (item.images && item.images.length > 0) ? item.images[0] : item.image;
    
    // Auto calculate off percentage based on real database columns
    const hasDiscount = item.original_price && !isNaN(item.original_price - item.price);
    const discountPercentage = hasDiscount 
      ? Math.round(((item.original_price - item.price) / item.original_price) * 100) 
      : 0;

    return (
      <Link 
        to={`/product/${item.id}`} 
        key={item.id} 
        className="w-[260px] md:w-[300px] flex-shrink-0 snap-start flex flex-col cursor-pointer group bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-md transition-all duration-300 z-10"
      >
        {/* Image Container */}
        <div className="w-full aspect-[4/5] bg-[#f9f9f9] rounded-[1.5rem] overflow-hidden relative">
          <img 
            src={displayImage || null} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          
          {/* Discount Tag */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-red-600 text-white font-black uppercase text-[9px] tracking-widest px-2.5 py-1.5 rounded-lg shadow-sm z-30">
              🔥 {discountPercentage}% OFF
            </div>
          )}

          {/* View Details Button */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
            <span className="bg-black text-white text-[10px] font-black px-5 py-2.5 rounded-lg uppercase tracking-widest whitespace-nowrap block">
              View Details
            </span>
          </div>
        </div>
        
        {/* Text Area */}
        <div className="pt-4 pb-2 px-1 text-left flex flex-col relative z-20">
          <h3 className="text-sm text-gray-900 font-black tracking-tight uppercase truncate w-full group-hover:text-red-600 transition-colors duration-200">
            {item.name}
          </h3>
          
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base font-black text-black">₹{item.price}</span>
            {item.original_price && (
              <span className="text-xs text-gray-400 line-through font-bold">₹{item.original_price}</span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="w-full pb-20 relative overflow-hidden bg-white">
      
      {/* ================= ORIGINAL RED GRADIENT HERO SECTION ================= */}
      {heroBanner && (
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <div className="relative max-w-7xl mx-auto rounded-[2.5rem] md:rounded-[3.5rem] bg-gradient-to-br from-red-600 via-red-700 to-red-900 shadow-[0_30px_60px_-15px_rgba(220,38,38,0.5)] overflow-hidden border border-red-500/30">
            <div className="absolute -top-[50%] -left-[10%] w-[70%] h-[150%] bg-gradient-to-r from-white/10 to-transparent -rotate-12 transform origin-top-left pointer-events-none"></div>
            
            <div className="relative flex flex-col-reverse md:flex-row items-center justify-between py-12 md:py-20 px-6 md:px-16 gap-12">
              <div className="flex-1 text-center md:text-left z-10">
                <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 text-white text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-6 backdrop-blur-md border border-white/20 shadow-lg">
                  {heroBanner.tagline || "🔥 New Drop • Limited Edition"}
                </span>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tighter text-white drop-shadow-xl whitespace-pre-line">
                  {heroBanner.heading || "REDEFINE \n YOUR DRIP."}
                </h1>
                
                <p className="max-w-md mx-auto md:mx-0 text-white/90 text-base md:text-lg mb-10 font-medium leading-relaxed">
                  {heroBanner.subtext || "Premium oversized & plain t-shirts crafted for the modern lifestyle. Stand out from the crowd with our exclusive THREADZS collection."}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link to="/collections/men" className="bg-black text-white px-8 py-4 font-black uppercase tracking-widest hover:bg-white hover:text-black hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-300 rounded-full flex items-center justify-center gap-2">
                    Shop Men
                  </Link>
                  <Link to="/collections/women" className="bg-white/10 backdrop-blur-md border-2 border-white/50 text-white px-8 py-4 font-black uppercase tracking-widest hover:bg-white hover:text-black hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,255,255,0.2)] transition-all duration-300 rounded-full flex items-center justify-center">
                    Shop Women
                  </Link>
                </div>
              </div>
              
              <div className="flex-1 relative w-full flex justify-center md:justify-end z-10">
                <div className="relative w-full max-w-sm aspect-[3/4] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-4 border-white/20 transform md:rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 group">
                  <img 
                    src={heroBanner.image || null} 
                    alt="Hero Drop" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md px-5 py-3 rounded-2xl font-bold shadow-2xl flex flex-col items-center border border-white/10">
                    <span className="text-white text-xl">100%</span>
                    <span className="text-[10px] uppercase tracking-widest text-red-400 mt-1">Premium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MEN'S COLLECTION ================= */}
      {menCollections.length > 0 && (
        <>
          <div className="text-center pb-10 relative z-20">
            <h2 className="text-2xl font-black tracking-widest uppercase text-black">Men's Collection</h2>
            <div className="w-16 h-1 bg-red-600 mx-auto mt-3 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 relative group mb-20">
            <button 
              onClick={() => scroll(menRef, 'left')} 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black text-white p-4 rounded-xl hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl ml-2 hover:bg-red-600 hover:scale-105 border border-gray-800"
            >
              <ChevronLeft size={22} />
            </button>

            <div ref={menRef} className="flex overflow-x-auto gap-6 md:gap-8 pb-12 scrollbar-hide snap-x px-2 pt-4">
              {menCollections.map(renderPremiumCard)}
            </div>

            <button 
              onClick={() => scroll(menRef, 'right')} 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black text-white p-4 rounded-xl hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl mr-2 hover:bg-red-600 hover:scale-105 border border-gray-800"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </>
      )}

      {/* ================= WOMEN'S COLLECTION ================= */}
      {womenCollections.length > 0 && (
        <>
          <div className="text-center pt-8 pb-10 relative z-20">
            <h2 className="text-2xl font-black tracking-widest uppercase text-black">Women's Collection</h2>
            <div className="w-16 h-1 bg-red-600 mx-auto mt-3 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 relative group mb-20">
            <button 
              onClick={() => scroll(womenRef, 'left')} 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black text-white p-4 rounded-xl hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl ml-2 hover:bg-red-600 hover:scale-105 border border-gray-800"
            >
              <ChevronLeft size={22} />
            </button>

            <div ref={womenRef} className="flex overflow-x-auto gap-6 md:gap-8 pb-12 scrollbar-hide snap-x px-2 pt-4">
              {womenCollections.map(renderPremiumCard)}
            </div>

            <button 
              onClick={() => scroll(womenRef, 'right')} 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black text-white p-4 rounded-xl hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl mr-2 hover:bg-red-600 hover:scale-105 border border-gray-800"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </>
      )}

      {/* ================= GEN Z COLLECTION ================= */}
      {genZCollections.length > 0 && (
        <>
          <div className="text-center pt-8 pb-10 relative z-20">
            <h2 className="text-2xl font-black tracking-widest uppercase text-black">Gen Z Collection</h2>
            <div className="w-16 h-1 bg-red-600 mx-auto mt-3 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 relative group mb-10">
            <button 
              onClick={() => scroll(genZRef, 'left')} 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black text-white p-4 rounded-xl hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl ml-2 hover:bg-red-600 hover:scale-105 border border-gray-800"
            >
              <ChevronLeft size={22} />
            </button>

            <div ref={genZRef} className="flex overflow-x-auto gap-6 md:gap-8 pb-12 scrollbar-hide snap-x px-2 pt-4">
              {genZCollections.map(renderPremiumCard)}
            </div>

            <button 
              onClick={() => scroll(genZRef, 'right')} 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black text-white p-4 rounded-xl hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl mr-2 hover:bg-red-600 hover:scale-105 border border-gray-800"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </>
      )}

      {/* ================= DYNAMIC CUSTOMER REVIEWS SECTION ================= */}
      {realReviews.length > 0 && (
        <div className="w-full pt-16 pb-16 bg-white border-t border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-4">Let customers speak for us</h2>
            <div className="flex justify-center items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#000" className="text-black" />
              ))}
            </div>
            <p className="text-sm text-gray-600">from {realReviews.length} reviews <span className="text-green-600 ml-1">✅</span></p>
          </div>

          <div className="max-w-[1200px] mx-auto px-4 relative group">
            <div ref={reviewRef} className="flex overflow-x-auto gap-6 md:gap-10 pb-8 scrollbar-hide snap-x items-start">
              {realReviews.map((review) => (
                <div key={review.id} className="w-[300px] md:w-[350px] flex-shrink-0 snap-center flex flex-col items-center text-center p-4">
                  
                  {/* Rating Stars from DB */}
                  <div className="flex justify-center items-center gap-1 mb-4">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} size={18} fill="#000" className="text-black" />
                    ))}
                  </div>
                  
                  {/* Review Comment mapped from DB */}
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                  
                  {/* Reviewer Name mapped from DB */}
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">{review.name}</p>
                  
                  {/* Dynamic Avatar based on Name */}
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-black text-gray-500 border border-gray-300">
                    {review.name ? review.name.charAt(0).toUpperCase() : "C"}
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Arrows */}
            {realReviews.length > 3 && (
              <div className="flex justify-center items-center gap-6 mt-4">
                <button 
                  onClick={() => scroll(reviewRef, 'left')} 
                  className="text-gray-300 hover:text-black transition-colors"
                >
                  <ChevronLeft size={32} />
                </button>
                <button 
                  onClick={() => scroll(reviewRef, 'right')} 
                  className="text-gray-300 hover:text-black transition-colors"
                >
                  <ChevronRight size={32} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= FLOATING WHATSAPP BUTTON ================= */}
      <a 
        href="https://wa.me/910000000000" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center"
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
          alt="WhatsApp" 
          className="w-8 h-8 md:w-10 md:h-10" 
        />
      </a>

    </div>
  );
};

export default Home;