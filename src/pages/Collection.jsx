import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const Collection = () => {
  const { category } = useParams(); 
  const location = useLocation(); // Homepage-la irunthu anupuna state-a eduka
  const { products } = useProducts();

  // Read the sub-category passed from the Homepage (if any)
  const initialSub = location.state?.initialSub || 'All';
  const [activeSubCategory, setActiveSubCategory] = useState(initialSub);

  // URL text-a namma Database Category name-ku maathuram
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

  // Reset filter when URL category changes (e.g. clicking Men then Women in navbar)
  useEffect(() => {
    setActiveSubCategory(location.state?.initialSub || 'All');
  }, [category, location.state]);

  // Exact Main category products-a mattum filter pandrom
  const mainCategoryProducts = filterCategory === 'All' 
    ? products 
    : products.filter(p => p.category === filterCategory);

  // Filter products based on selected sub-category
  const displayedProducts = activeSubCategory === 'All' 
    ? mainCategoryProducts 
    : mainCategoryProducts.filter(p => p.sub_category === activeSubCategory);

  // Dynamic Title based on selection (e.g. "PLAIN T-SHIRT" or "MEN'S COLLECTION")
  const pageHeading = activeSubCategory === 'All' ? displayTitle : activeSubCategory;

  return (
    <div className="w-full min-h-screen bg-[#fafafa] pt-10 pb-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= PAGE HEADER ================= */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-widest">{pageHeading}</h1>
          <div className="w-16 h-1 bg-red-600 mx-auto mt-4 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
          <p className="mt-4 text-gray-500 font-bold tracking-widest uppercase text-xs">
            Showing {displayedProducts.length} Items
          </p>
        </div>

        {/* ================= PRODUCT GRID (CLEAN VIEW) ================= */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mt-8">
            {displayedProducts.map((item, index) => {
              const displayImage = (item.images && item.images.length > 0) ? item.images[0] : (item.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80');
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
                    <h3 className="text-sm text-gray-900 font-black mb-1 truncate w-full group-hover:text-red-600 transition-colors uppercase tracking-tight">{item.name}</h3>
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
            <p className="text-gray-400 mt-2 font-medium">Products for this collection will be added soon.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Collection;