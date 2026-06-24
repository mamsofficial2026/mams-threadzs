import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useRef, useState, useEffect } from 'react'; 
import { supabase } from '../supabaseClient'; 

const Home = () => {
  const { products, heroBanner } = useProducts();
  const navigate = useNavigate();

  // DYNAMIC CATEGORY FILTERING
  const menCollections = products.filter(p => p.category?.toLowerCase() === 'men');
  const womenCollections = products.filter(p => p.category?.toLowerCase() === 'women');
  const genZCollections = products.filter(p => p.category?.toLowerCase() === 'gen z' || p.category?.toLowerCase() === 'gen-z');

  // STRICT SUB-CATEGORY EXTRACTION
  const getSubCategories = (categoryProducts) => {
    const validSubs = categoryProducts
      .map(p => p.sub_category)
      .filter(sub => sub && sub.toUpperCase() !== 'NULL' && sub.toUpperCase() !== 'EMPTY' && sub.trim() !== '');
    const uniqueSubs = [...new Set(validSubs)];
    
    return uniqueSubs.map(sub => {
      const firstProduct = categoryProducts.find(p => p.sub_category === sub);
      
      let rawImg = null;
      if (firstProduct) {
        if (firstProduct.colors && firstProduct.colors.length > 0 && firstProduct.colors[0].images && firstProduct.colors[0].images.length > 0) {
          rawImg = firstProduct.colors[0].images[0];
        } else if (firstProduct.images && firstProduct.images.length > 0) {
          rawImg = firstProduct.images[0];
        } else if (firstProduct.image) {
          rawImg = firstProduct.image;
        }
      }

      const isValidWebUrl = typeof rawImg === 'string' && (rawImg.startsWith('http://') || rawImg.startsWith('https://'));
      const safeDisplayImage = isValidWebUrl ? rawImg : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80';

      return {
        name: sub,
        image: safeDisplayImage
      };
    });
  };

  const menSubData = getSubCategories(menCollections);
  const womenSubData = getSubCategories(womenCollections);
  const genZSubData = getSubCategories(genZCollections);

  // REFS
  const menRef = useRef(null);
  const womenRef = useRef(null);
  const genZRef = useRef(null);
  const reviewRef = useRef(null);
  const menSubRef = useRef(null);
  const womenSubRef = useRef(null);
  const genZSubRef = useRef(null);

  // STATE FOR REVIEWS & CUSTOM IG FEED
  const [realReviews, setRealReviews] = useState([]);
  const [customIgFeed, setCustomIgFeed] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10); 
        if (data) setRealReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const fetchIgFeed = async () => {
      try {
        const { data, error } = await supabase
          .from('ig_feed')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5); 
        if (data) setCustomIgFeed(data);
      } catch (error) {
        console.error("Error fetching IG Feed:", error);
      }
    };

    fetchReviews();
    fetchIgFeed();
  }, []);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 350; 
      ref.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const renderPremiumCard = (item) => {
    let rawImg = null;
    if (item.colors && item.colors.length > 0 && item.colors[0].images && item.colors[0].images.length > 0) {
      rawImg = item.colors[0].images[0];
    } else if (item.images && item.images.length > 0) {
      rawImg = item.images[0];
    } else if (item.image) {
      rawImg = item.image;
    }

    const isValidWebUrl = typeof rawImg === 'string' && (rawImg.startsWith('http://') || rawImg.startsWith('https://'));
    const displayImage = isValidWebUrl ? rawImg : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80';

    const hasDiscount = item.original_price && !isNaN(item.original_price - item.price);
    const discountPercentage = hasDiscount ? Math.round(((item.original_price - item.price) / item.original_price) * 100) : 0;

    return (
      <Link to={`/product/${item.id}`} key={item.id} className="w-[260px] md:w-[300px] flex-shrink-0 snap-start flex flex-col cursor-pointer group bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-md transition-all duration-300 z-10">
        <div className="w-full aspect-[4/5] bg-[#f9f9f9] rounded-[1.5rem] overflow-hidden relative">
          <img src={displayImage} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {hasDiscount && <div className="absolute top-3 left-3 bg-red-600 text-white font-black uppercase text-[9px] tracking-widest px-2.5 py-1.5 rounded-lg shadow-sm z-30">🔥 {discountPercentage}% OFF</div>}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
            <span className="bg-black text-white text-[10px] font-black px-5 py-2.5 rounded-lg uppercase tracking-widest whitespace-nowrap block">View Details</span>
          </div>
        </div>
        <div className="pt-4 pb-2 px-1 text-left flex flex-col relative z-20">
          <h3 className="text-sm text-gray-900 font-black tracking-tight uppercase truncate w-full group-hover:text-red-600 transition-colors duration-200">{item.name}</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base font-black text-black">₹{item.price}</span>
            {item.original_price && <span className="text-xs text-gray-400 line-through font-bold">₹{item.original_price}</span>}
          </div>
        </div>
      </Link>
    );
  };

  // 🔥 FIXED: HERO BANNER SAFE URL EXTRACTION (BULLETPROOF FALLBACK)
  const isHeroWebUrl = typeof heroBanner?.image === 'string' && (heroBanner.image.startsWith('http://') || heroBanner.image.startsWith('https://'));
  const safeHeroBannerImg = isHeroWebUrl ? heroBanner.image : "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&q=80";

  return (
    <div className="w-full pb-20 relative overflow-hidden bg-white">
      
      {/* ================= HERO SECTION ================= */}
      {heroBanner && (
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-8 pb-10">
          <div className="relative max-w-7xl mx-auto rounded-[2.5rem] md:rounded-[3.5rem] bg-gradient-to-br from-[#e31e24] via-red-700 to-red-900 shadow-[0_30px_60px_-15px_rgba(220,38,38,0.5)] overflow-hidden">
            <div className="absolute -top-[50%] -left-[10%] w-[70%] h-[150%] bg-gradient-to-r from-white/10 to-transparent -rotate-12 transform origin-top-left pointer-events-none"></div>
            <div className="relative flex flex-col-reverse md:flex-row items-center justify-between py-12 md:py-20 px-6 md:px-16 gap-12">
              <div className="flex-1 text-center md:text-left z-10">
                <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 text-white text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-6 backdrop-blur-md border border-white/20">
                  {heroBanner.tagline || "🔥 New Drop • Limited Edition"}
                </span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tighter text-white drop-shadow-xl whitespace-pre-line">
                  {heroBanner.heading || "REDEFINE \n YOUR DRIP."}
                </h1>
                <p className="max-w-md mx-auto md:mx-0 text-white/90 text-base md:text-lg mb-10 font-medium leading-relaxed">
                  {heroBanner.subtext || "Premium oversized & plain t-shirts crafted for the modern lifestyle. Stand out from the crowd with our exclusive THREADZS collection."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link to="/collections/men" className="bg-black text-white px-8 py-4 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 rounded-full flex items-center justify-center">Shop Men</Link>
                  <Link to="/collections/women" className="bg-white/10 backdrop-blur-md border-2 border-white/50 text-white px-8 py-4 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 rounded-full flex items-center justify-center">Shop Women</Link>
                </div>
              </div>
              <div className="flex-1 relative w-full flex justify-center md:justify-end z-10">
                <div className="relative w-full max-w-sm aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/20 transform md:rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500">
                  {/* 🔥 APPLIED SICK FALLBACK IMAGE HERE */}
                  <img src={safeHeroBannerImg} alt="Hero Drop" className="w-full h-full object-cover"/>
                  
                  <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md px-5 py-3 rounded-2xl font-bold flex flex-col items-center">
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
        <div className="bg-[#fafafa] border-t border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 pt-16 pb-12">
            <div className="text-center pb-10">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-wider uppercase">Men's Collection</h2>
              <div className="w-16 h-1 bg-red-600 mx-auto mt-4 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
            </div>
            {menSubData.length > 0 ? (
              <div className="relative group">
                <button onClick={() => scroll(menSubRef, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 md:-ml-6 z-20 bg-[#e31e24] text-white w-12 h-12 flex items-center justify-center rounded-full shadow-[0_4px_10px_rgba(227,30,36,0.4)] transform transition-transform duration-300 hover:scale-110 hidden md:flex"><ChevronLeft size={26} /></button>
                <div ref={menSubRef} className="flex overflow-x-auto gap-4 md:gap-6 pb-8 pt-2 px-2 scroll-smooth snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <style>{`::-webkit-scrollbar { display: none; }`}</style>
                  {menSubData.map((sub, idx) => (
                    <div key={idx} onClick={() => navigate(`/collections/men`, { state: { initialSub: sub.name } })} className="snap-center flex-shrink-0 w-[280px] md:w-[320px] cursor-pointer rounded-[16px] overflow-hidden bg-white flex flex-col shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-2 border border-gray-100">
                      <div className="w-full h-[360px] md:h-[420px] relative overflow-hidden bg-[#f5f5f5]"><img src={sub.image} alt={sub.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" /></div>
                      <div className="py-5 px-3 text-center bg-white flex-1 flex items-center justify-center border-t border-gray-50"><h3 className="text-lg md:text-xl font-bold text-gray-800 tracking-wide uppercase hover:text-red-600 transition-colors">{sub.name}</h3></div>
                    </div>
                  ))}
                </div>
                <button onClick={() => scroll(menSubRef, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 md:-mr-6 z-20 bg-[#e31e24] text-white w-12 h-12 flex items-center justify-center rounded-full shadow-[0_4px_10px_rgba(227,30,36,0.4)] transform transition-transform duration-300 hover:scale-110 hidden md:flex"><ChevronRight size={26} /></button>
              </div>
            ) : (
              <div className="relative group">
                <button onClick={() => scroll(menRef, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black text-white p-4 rounded-xl hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl ml-2 hover:bg-red-600 hover:scale-105 border border-gray-800"><ChevronLeft size={22} /></button>
                <div ref={menRef} className="flex overflow-x-auto gap-6 md:gap-8 pb-12 scrollbar-hide snap-x px-2 pt-4">{menCollections.map(renderPremiumCard)}</div>
                <button onClick={() => scroll(menRef, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black text-white p-4 rounded-xl hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl mr-2 hover:bg-red-600 hover:scale-105 border border-gray-800"><ChevronRight size={22} /></button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= WOMEN'S COLLECTION ================= */}
      {womenCollections.length > 0 && (
        <div className="bg-white border-t border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 pt-16 pb-12">
            <div className="text-center pb-10">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-wider uppercase">Women's Collection</h2>
              <div className="w-16 h-1 bg-red-600 mx-auto mt-4 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
            </div>
            {womenSubData.length > 0 ? (
              <div className="relative group">
                <button onClick={() => scroll(womenSubRef, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 md:-ml-6 z-20 bg-[#e31e24] text-white w-12 h-12 flex items-center justify-center rounded-full shadow-[0_4px_10px_rgba(227,30,36,0.4)] transform transition-transform duration-300 hover:scale-110 hidden md:flex"><ChevronLeft size={26} /></button>
                <div ref={womenSubRef} className="flex overflow-x-auto gap-4 md:gap-6 pb-8 pt-2 px-2 scroll-smooth snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <style>{`::-webkit-scrollbar { display: none; }`}</style>
                  {womenSubData.map((sub, idx) => (
                    <div key={idx} onClick={() => navigate(`/collections/women`, { state: { initialSub: sub.name } })} className="snap-center flex-shrink-0 w-[280px] md:w-[320px] cursor-pointer rounded-[16px] overflow-hidden bg-white flex flex-col shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-2 border border-gray-100">
                      <div className="w-full h-[360px] md:h-[420px] relative overflow-hidden bg-[#f5f5f5]"><img src={sub.image} alt={sub.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" /></div>
                      <div className="py-5 px-3 text-center bg-white flex-1 flex items-center justify-center border-t border-gray-50"><h3 className="text-lg md:text-xl font-bold text-gray-800 tracking-wide uppercase hover:text-red-600 transition-colors">{sub.name}</h3></div>
                    </div>
                  ))}
                </div>
                <button onClick={() => scroll(womenSubRef, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 md:-mr-6 z-20 bg-[#e31e24] text-white w-12 h-12 flex items-center justify-center rounded-full shadow-[0_4px_10px_rgba(227,30,36,0.4)] transform transition-transform duration-300 hover:scale-110 hidden md:flex"><ChevronRight size={26} /></button>
              </div>
            ) : (
              <div className="relative group">
                <button onClick={() => scroll(womenRef, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black text-white p-4 rounded-xl hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl ml-2 hover:bg-red-600 hover:scale-105 border border-gray-800"><ChevronLeft size={22} /></button>
                <div ref={womenRef} className="flex overflow-x-auto gap-6 md:gap-8 pb-12 scrollbar-hide snap-x px-2 pt-4">{womenCollections.map(renderPremiumCard)}</div>
                <button onClick={() => scroll(womenRef, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black text-white p-4 rounded-xl hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl mr-2 hover:bg-red-600 hover:scale-105 border border-gray-800"><ChevronRight size={22} /></button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= GEN Z COLLECTION ================= */}
      {genZCollections.length > 0 && (
        <div className="bg-[#fafafa] border-t border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 pt-16 pb-12">
            <div className="text-center pb-10">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-wider uppercase">Gen Z Collection</h2>
              <div className="w-16 h-1 bg-red-600 mx-auto mt-4 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
            </div>
            {genZSubData.length > 0 ? (
              <div className="relative group">
                <button onClick={() => scroll(genZSubRef, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 md:-ml-6 z-20 bg-[#e31e24] text-white w-12 h-12 flex items-center justify-center rounded-full shadow-[0_4px_10px_rgba(227,30,36,0.4)] transform transition-transform duration-300 hover:scale-110 hidden md:flex"><ChevronLeft size={26} /></button>
                <div ref={genZSubRef} className="flex overflow-x-auto gap-4 md:gap-6 pb-8 pt-2 px-2 scroll-smooth snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <style>{`::-webkit-scrollbar { display: none; }`}</style>
                  {genZSubData.map((sub, idx) => (
                    <div key={idx} onClick={() => navigate(`/collections/gen-z`, { state: { initialSub: sub.name } })} className="snap-center flex-shrink-0 w-[280px] md:w-[320px] cursor-pointer rounded-[16px] overflow-hidden bg-white flex flex-col shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-2 border border-gray-100">
                      <div className="w-full h-[360px] md:h-[420px] relative overflow-hidden bg-[#f5f5f5]"><img src={sub.image} alt={sub.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" /></div>
                      <div className="py-5 px-3 text-center bg-white flex-1 flex items-center justify-center border-t border-gray-50"><h3 className="text-lg md:text-xl font-bold text-gray-800 tracking-wide uppercase hover:text-red-600 transition-colors">{sub.name}</h3></div>
                    </div>
                  ))}
                </div>
                <button onClick={() => scroll(genZSubRef, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 md:-mr-6 z-20 bg-[#e31e24] text-white w-12 h-12 flex items-center justify-center rounded-full shadow-[0_4px_10px_rgba(227,30,36,0.4)] transform transition-transform duration-300 hover:scale-110 hidden md:flex"><ChevronRight size={26} /></button>
              </div>
            ) : (
              <div className="relative group">
                <button onClick={() => scroll(genZRef, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black text-white p-4 rounded-xl hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl ml-2 hover:bg-red-600 hover:scale-105 border border-gray-800"><ChevronLeft size={22} /></button>
                <div ref={genZRef} className="flex overflow-x-auto gap-6 md:gap-8 pb-12 scrollbar-hide snap-x px-2 pt-4">{genZCollections.map(renderPremiumCard)}</div>
                <button onClick={() => scroll(genZRef, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black text-white p-4 rounded-xl hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl mr-2 hover:bg-red-600 hover:scale-105 border border-gray-800"><ChevronRight size={22} /></button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= THREADZS INSTAGRAM SECTION ================= */}
      <div className="w-full pt-16 pb-12 bg-white border-t border-gray-100">
        <div className="text-center mb-10 px-4">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-widest uppercase flex items-center justify-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16.11 7.5v.01"/><path d="M12 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg> 
             JOIN THE CLUB
          </h2>
          <a href="https://www.instagram.com/threadzs_official/" target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-500 hover:text-[#E1306C] transition-colors mt-2 block">
            @threadzs_official
          </a>
        </div>

        <div className="max-w-[1400px] mx-auto px-4">
           {/* Updated: Dynamically rendering images from Supabase admin panel */}
           <div className="flex flex-wrap justify-center gap-6">
              {customIgFeed && customIgFeed.length > 0 ? (
                customIgFeed.map((feed) => (
                  <a key={feed.id} href={feed.post_url || "https://www.instagram.com/threadzs_official/"} target="_blank" rel="noreferrer">
                     <img 
                       src={feed.image_url || feed.image} 
                       alt="Threadzs Instagram" 
                       className="rounded-3xl shadow-xl w-full max-w-[250px] aspect-square object-cover hover:scale-105 transition-transform duration-500" 
                     />
                  </a>
                ))
              ) : (
                <p className="text-gray-500 text-sm font-medium">Loading Instagram feed...</p>
              )}
           </div>
        </div>
      </div>

      {/* ================= DYNAMIC CUSTOMER REVIEWS SECTION ================= */}
      {realReviews.length > 0 && (
        <div className="w-full pt-16 pb-16 bg-[#fafafa] border-t border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-4">Let customers speak for us</h2>
            <div className="flex justify-center items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="#000" className="text-black" />)}
            </div>
            <p className="text-sm text-gray-600">from {realReviews.length} reviews <span className="text-green-600 ml-1">✅</span></p>
          </div>
          <div className="max-w-[1200px] mx-auto px-4 relative group">
            <div ref={reviewRef} className="flex overflow-x-auto gap-6 md:gap-10 pb-8 scrollbar-hide snap-x items-start">
              {realReviews.map((review) => (
                <div key={review.id} className="w-[300px] md:w-[350px] flex-shrink-0 snap-center flex flex-col items-center text-center p-4">
                  <div className="flex justify-center items-center gap-1 mb-4">
                    {[...Array(review.rating || 5)].map((_, i) => <Star key={i} size={18} fill="#000" className="text-black" />)}
                  </div>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed italic">"{review.comment}"</p>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">{review.name}</p>
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-black text-gray-500 border border-gray-300">
                    {review.name ? review.name.charAt(0).toUpperCase() : "C"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= FLOATING WHATSAPP BUTTON ================= */}
      <a href="https://wa.me/919043241335" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 bg-[#25D366] text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-8 h-8 md:w-10 md:h-10" />
      </a>

    </div>
  );
};

export default Home;