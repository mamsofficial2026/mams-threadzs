import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const Collection = () => {
  // URL-la irunthu category name-a edukkurom (e.g., 'men', 'women', 'gen-z')
  const { category } = useParams(); 
  const { products } = useProducts();

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

  // Exact category products-a mattum filter pandrom
  const filteredProducts = filterCategory === 'All' 
    ? products 
    : products.filter(p => p.category === filterCategory);

  return (
    <div className="w-full min-h-screen bg-[#fafafa] pt-10 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= PAGE HEADER ================= */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-gray-900">{displayTitle}</h1>
          <div className="w-24 h-1.5 bg-red-600 mx-auto mt-6 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
          <p className="mt-4 text-gray-500 font-bold tracking-widest uppercase text-xs">Showing {filteredProducts.length} Exclusive Items</p>
        </div>

        {/* ================= PRODUCT GRID ================= */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((item, index) => {
              const displayImage = (item.images && item.images.length > 0) ? item.images[0] : item.image;
              return (
                <Link 
                  to={`/product/${item.id}`} 
                  key={item.id} 
                  className="group relative bg-white/70 backdrop-blur-xl border border-white shadow-sm rounded-[2rem] p-3 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(220,38,38,0.15)] hover:border-red-100 transition-all duration-500 z-10 animate-in fade-in slide-in-from-bottom-8"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-full aspect-[4/5] bg-[#f5f5f5] rounded-[1.5rem] overflow-hidden relative shadow-inner">
                    <img src={displayImage} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-30">
                      <span className="bg-black/80 backdrop-blur-md text-white text-xs font-bold px-5 py-2.5 rounded-full uppercase tracking-widest shadow-lg border border-white/20 whitespace-nowrap">
                        View Details
                      </span>
                    </div>
                  </div>
                  <div className="pt-5 pb-3 px-2 text-center flex flex-col items-center">
                    <h3 className="text-sm md:text-base text-gray-900 font-black mb-1 truncate w-full group-hover:text-red-600 transition-colors">{item.name}</h3>
                    <p className="text-lg text-black font-black tracking-wider">₹{item.price}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-300">
            <h3 className="text-2xl font-black text-gray-400 uppercase tracking-widest">No Drops Yet</h3>
            <p className="text-gray-400 mt-2 font-medium">We are cooking something special for this collection.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Collection;