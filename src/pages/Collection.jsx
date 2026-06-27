import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { Star, SlidersHorizontal, ChevronDown } from 'lucide-react'; // 🔥 NEW: Added icons for filters

const Collection = () => {
  const { category } = useParams(); 
  const location = useLocation(); 
  const { products } = useProducts();

  const initialSub = location.state?.initialSub || 'All';
  const [activeSubCategory, setActiveSubCategory] = useState(initialSub);

  // 🔥 NEW: Filter & Sort State
  const [sortBy, setSortBy] = useState('newest');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  let filterCategory = '';
  let displayTitle = '';

  if (category === 'men') {
    filterCategory = 'Men'; displayTitle = "Men's Collection";
  } else if (category === 'women') {
    filterCategory = 'Women'; displayTitle = "Women's Collection";
  } else if (category === 'gen-z') {
    filterCategory = 'Gen Z'; displayTitle = "Gen Z Exclusives";
  } else {
    filterCategory = 'All'; displayTitle = "All Products";
  }

  // Reset filter when URL category changes
  useEffect(() => {
    setActiveSubCategory(location.state?.initialSub || 'All');
    setSelectedSize('All');
    setSelectedColor('All');
    setSortBy('newest');
  }, [category, location.state]);

  const mainCategoryProducts = filterCategory === 'All' 
    ? products 
    : products.filter(p => p.category === filterCategory);

  // 🔥 NEW: Dynamically extract available sizes and colors for the filter dropdowns
  const availableSizes = useMemo(() => {
    const sizes = new Set();
    mainCategoryProducts.forEach(p => p.sizes?.forEach(s => sizes.add(s)));
    return ['All', ...Array.from(sizes)];
  }, [mainCategoryProducts]);

  const availableColors = useMemo(() => {
    const colors = new Set();
    mainCategoryProducts.forEach(p => p.colors?.forEach(c => colors.add(c.name)));
    return ['All', ...Array.from(colors)];
  }, [mainCategoryProducts]);

  // 🔥 UPDATED: Apply Sub-Category, Size, Color, and Sorting to displayedProducts
  let displayedProducts = activeSubCategory === 'All' 
    ? mainCategoryProducts 
    : mainCategoryProducts.filter(p => p.sub_category === activeSubCategory);

  if (selectedSize !== 'All') {
    displayedProducts = displayedProducts.filter(p => p.sizes?.includes(selectedSize));
  }

  if (selectedColor !== 'All') {
    displayedProducts = displayedProducts.filter(p => p.colors?.some(c => c.name === selectedColor));
  }

  if (sortBy === 'price-low') {
    displayedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (sortBy === 'price-high') {
    displayedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  }

  const pageHeading = activeSubCategory === 'All' ? displayTitle : activeSubCategory;

  return (
    <div className="w-full min-h-screen bg-[#fafafa] pt-10 pb-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= PAGE HEADER ================= */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-widest">{pageHeading}</h1>
          <div className="w-16 h-1 bg-red-600 mx-auto mt-4 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
          <p className="mt-4 text-gray-500 font-bold tracking-widest uppercase text-xs">
            Showing {displayedProducts.length} Items
          </p>
        </div>

        {/* ================= 🔥 NEW: FILTER & SORT BAR ================= */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className="md:hidden w-full flex justify-center items-center gap-2 font-black uppercase tracking-widest text-xs py-3 border border-gray-200 rounded-xl"
          >
            <SlidersHorizontal size={16} /> Filters & Sort
          </button>

          <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row w-full md:w-auto gap-4 items-center w-full`}>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Size:</span>
              <div className="relative w-full md:w-32">
                <select 
                  value={selectedSize} 
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-xs font-bold py-2.5 pl-3 pr-8 rounded-lg outline-none focus:border-black uppercase tracking-wider"
                >
                  {availableSizes.map(size => <option key={size} value={size}>{size}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Color:</span>
              <div className="relative w-full md:w-36">
                <select 
                  value={selectedColor} 
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-xs font-bold py-2.5 pl-3 pr-8 rounded-lg outline-none focus:border-black uppercase tracking-wider"
                >
                  {availableColors.map(color => <option key={color} value={color}>{color}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>

          <div className={`${showFilters ? 'flex' : 'hidden'} md:flex items-center gap-2 w-full md:w-auto`}>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">Sort By:</span>
            <div className="relative w-full md:w-48">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-xs font-bold py-2.5 pl-3 pr-8 rounded-lg outline-none focus:border-black uppercase tracking-wider"
              >
                <option value="newest">Latest Drops</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>
        </div>

        {/* ================= PRODUCT GRID (CLEAN VIEW) ================= */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mt-8">
            {displayedProducts.map((item, index) => {
              
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

              return (
                <Link 
                  to={`/product/${item.id}`} 
                  key={item.id} 
                  className="group relative bg-white border border-gray-100 shadow-sm rounded-2xl p-3 hover:-translate-y-2 hover:shadow-xl hover:border-red-100 transition-all duration-500 z-10 animate-in fade-in slide-in-from-bottom-8"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-full aspect-[4/5] bg-[#f5f5f5] rounded-xl overflow-hidden relative">
                    <img src={displayImage} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-30">
                      <span className="bg-black/90 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg whitespace-nowrap">
                        View Details
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 pb-2 px-2 text-center flex flex-col items-center">
                    <h3 className="text-sm text-gray-900 font-black mb-1.5 truncate w-full group-hover:text-red-600 transition-colors uppercase tracking-tight">{item.name}</h3>
                    
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 text-[10px] font-bold text-gray-600 mb-2">
                      <span>4.8</span>
                      <Star size={10} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-gray-300 mx-0.5">|</span>
                      <span>12+</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-base text-black font-black">₹{item.price}</p>
                      {item.original_price && (
                        <p className="text-xs text-gray-400 line-through font-medium">₹{item.original_price}</p>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">No Drops Yet</h3>
            <p className="text-gray-400 mt-2 font-medium">Try clearing your filters or check back later.</p>
            <button 
              onClick={() => { setSelectedSize('All'); setSelectedColor('All'); }}
              className="mt-6 bg-black text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-red-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Collection;