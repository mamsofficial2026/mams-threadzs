import { useParams, Link } from 'react-router-dom';

const Category = () => {
  // URL-la irunthu 'men', 'women' illana 'genz' nu edukka
  const { type } = useParams(); 

  // URL-la enna iruko athuku yetha maari Title maarum
  const title = type === 'women' ? "Women's Collection" : type === 'genz' ? "Gen Z Collection" : "Men's Collection";

  // 1. Men's Products Data
  const menProducts = [
    { id: 1, name: "Men's Gym Oversized", price: "999", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80" },
    { id: 2, name: "Acid Washed T-Shirt", price: "899", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80" },
    { id: 3, name: "Men's Polo", price: "1099", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80" },
    { id: 4, name: "Men's Hoodie", price: "1299", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80" }
  ];

  // 2. Women's Products Data
  const womenProducts = [
    { id: 6, name: "Women's Oversized Tee", price: "999", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80" },
    { id: 7, name: "Classic Plain Top", price: "799", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" },
    { id: 8, name: "Women's Hoodie", price: "1199", image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&q=80" },
    { id: 9, name: "Urban Streetwear", price: "899", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80" }
  ];

  // 3. (PUTHUSA ADD PANNATHU) Gen Z Products Data
  const genZProducts = [
    { id: 11, name: "Anime Print Oversized", price: "1099", image: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800&q=80" },
    { id: 12, name: "Vintage Graphic Tee", price: "999", image: "https://images.unsplash.com/photo-1503341504253-d2df9baec96b?w=800&q=80" },
    { id: 13, name: "Baggy Parachute Pants", price: "1499", image: "https://images.unsplash.com/photo-1628704205851-f3b145d65427?w=800&q=80" },
    { id: 14, name: "Neon Vibe Hoodie", price: "1299", image: "https://images.unsplash.com/photo-1614251059954-35e67566ca14?w=800&q=80" }
  ];

  // Logic Update: Ippo 3 category-kum thani thani collections varum
  const displayProducts = type === 'women' ? womenProducts : type === 'genz' ? genZProducts : menProducts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full min-h-[70vh]">
      <h1 className="text-3xl md:text-4xl font-black text-center mb-12 uppercase tracking-tight">{title}</h1>
      
      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {displayProducts.map(p => (
          <Link to={`/product/${p.id}`} key={p.id} className="cursor-pointer group">
            <div className="aspect-[4/5] bg-[#f5f5f5] rounded-2xl overflow-hidden mb-4 relative">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="font-bold text-gray-900 truncate">{p.name}</h3>
            <p className="text-red-600 font-bold mt-1">₹{p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;