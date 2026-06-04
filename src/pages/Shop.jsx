import { useState } from 'react';
import ProductCard from '../components/ProductCard';

// Dummy T-Shirts Data - Neenga unga T-shirt photos edutha udane, Google Drive links-a inga mathikalam.
const DUMMY_PRODUCTS = [
  { id: 1, name: "Premium Oversized Tee - Black", price: "999", category: "Men's Oversized", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
  { id: 2, name: "Classic Plain T-Shirt - White", price: "799", category: "Men's Plain", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "Urban Oversized Tee - Beige", price: "999", category: "Women's Oversized", image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
  { id: 4, name: "Everyday Plain Tee - Olive", price: "799", category: "Women's Plain", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
  { id: 5, name: "Streetwear Oversized - Navy", price: "999", category: "Men's Oversized", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" }
];

// Categories button list
const CATEGORIES = ["All", "Men's Oversized", "Men's Plain", "Women's Oversized", "Women's Plain"];

const Shop = () => {
  // Entha category click pannirukanga nu gyabagam vechuka
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter pandra logic
  const filteredProducts = activeCategory === "All" 
    ? DUMMY_PRODUCTS 
    : DUMMY_PRODUCTS.filter(product => product.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 tracking-widest uppercase">
        Collections
      </h1>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2 text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 border rounded-full ${
              activeCategory === category
                ? "bg-black text-white border-black shadow-md"
                : "bg-white text-gray-600 border-gray-300 hover:border-black hover:text-black"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid - Mobile la 2 items, Laptop la 4 items kaatum */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Empty State warning */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No products found in this category.
        </div>
      )}
    </div>
  );
};

export default Shop;