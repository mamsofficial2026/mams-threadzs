import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full bg-white">
      
      {/* Top Banner Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <span className="text-red-600 font-black tracking-[0.3em] uppercase mb-3 block text-sm">Our Aesthetics</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter text-black uppercase">
            The Story Behind <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">THREADZS</span>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed font-medium mb-6">
            THREADZS was born out of a desire to create top-tier minimalist streetwear for individuals who appreciate premium quality and comfort. We specialise in drop-shoulder oversized tees and clean plain apparel that fits seamlessly into your daily wardrobe.
          </p>
          <p className="text-gray-500 text-base leading-relaxed">
            Every garment we manufacture undergoes strict bio-washing protocols using 100% heavy cotton fabric to provide maximum longevity and heavy drapery drip.
          </p>
        </div>
        <div className="aspect-[4/3] bg-gray-100 rounded-[3rem] overflow-hidden shadow-2xl relative border-4 border-white">
          <img 
            src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80" 
            alt="THREADZS Workshop Design" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Core Philosophies */}
      <div className="bg-gray-50 rounded-[3rem] p-8 md:p-12 border border-gray-100 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider mb-6">Why We Only Do Pre-Orders</h2>
        <p className="text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto mb-8 text-base md:text-lg">
          To maintain zero-waste operations and ensure unmatched attention to detail on every single piece, THREADZS functions exclusively on a pre-order model. No bulk clearance, no fast fashion pollution—just custom premium garments handled specifically for you.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-xs md:text-sm font-black uppercase tracking-widest text-red-600">
          <span className="px-4 py-2 border border-red-200 rounded-full bg-white">✓ 100% Cotton Fabric</span>
          <span className="px-4 py-2 border border-red-200 rounded-full bg-white">✓ Eco-Friendly Production</span>
          <span className="px-4 py-2 border border-red-200 rounded-full bg-white">✓ Free Direct Shipping</span>
        </div>
      </div>

      {/* Bottom Call to action */}
      <div className="text-center mt-20">
        <h3 className="text-xl font-black mb-6 uppercase tracking-widest">Ready to Elevate Your Drip?</h3>
        <Link to="/" className="bg-black text-white px-10 py-4 font-black uppercase tracking-widest hover:bg-red-600 hover:shadow-xl hover:shadow-red-200 transition-all duration-300 rounded-full inline-block">
          Explore Collections
        </Link>
      </div>

    </div>
  );
};

export default About;