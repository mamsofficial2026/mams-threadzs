import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 min-h-[60vh] text-center flex flex-col items-center justify-center">
      <Heart size={60} className="text-gray-300 mb-6" />
      <h1 className="text-3xl md:text-4xl font-black mb-6 uppercase tracking-widest">Your Wishlist</h1>
      <div className="bg-gray-50 p-10 rounded-2xl max-w-2xl mx-auto w-full border border-gray-100">
        <p className="text-gray-500 mb-8 font-medium">Your wishlist is currently empty. Save your favorite items here!</p>
        <Link to="/" className="bg-black text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-red-600 transition-colors inline-block rounded-full">
          Explore Products
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;