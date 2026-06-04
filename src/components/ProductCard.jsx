import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="group cursor-pointer">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Hover pandrappa varum "Quick Add" Button */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full bg-black text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg">
            Quick Add
          </button>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="text-left">
        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{product.category}</p>
        <h3 className="text-sm md:text-base font-bold text-gray-900 truncate">{product.name}</h3>
        <p className="text-sm font-medium text-gray-900 mt-1">₹{product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;