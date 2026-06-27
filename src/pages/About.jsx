import { Link } from 'react-router-dom';
import { MapPin, Leaf, ShieldCheck, Shirt } from 'lucide-react';

const About = () => {
  return (
    <div className="w-full bg-white select-none">
      
      {/* ================= HERO STORY SECTION ================= */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <div className="order-2 lg:order-1">
            <span className="flex items-center gap-2 text-red-600 font-black tracking-[0.2em] uppercase mb-4 text-xs">
              <MapPin size={16} /> Born in Madurai
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter text-gray-900 uppercase leading-[1.1]">
              We couldn't find a tee worth buying.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">So we made one.</span>
            </h1>
            
            <div className="space-y-6 text-gray-600 text-base md:text-lg font-medium leading-relaxed">
              <p>
                We are MCA final year students from Madurai. Like everyone else, we got tired of paying insane markups—₹999 or more—just for a brand logo slapped on a basic, thin t-shirt. 
              </p>
              <p>
                We realized that true luxury isn't in a logo; it's in the fabric, the fall, and the fit. THREADZS was born out of a single obsession: to engineer the ultimate heavy-drape oversized tee without the massive middleman markup.
              </p>
              <p className="text-gray-900 font-bold border-l-4 border-red-600 pl-4">
                "Premium 240 GSM French Terry Cotton, bio-washed twice, priced fairly. No middleman. No logo tax. Just the best basic you'll ever own."
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 aspect-[4/5] md:aspect-square lg:aspect-[4/5] bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl relative border-8 border-gray-50 transform lg:rotate-2 hover:rotate-0 transition-all duration-500">
            {/* Using a premium workshop/fabric image placeholder */}
            <img 
              src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80" 
              alt="THREADZS Workshop Design" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 shadow-xl">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white flex-shrink-0">
                <Shirt size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fabric Quality</p>
                <p className="text-sm font-black text-black tracking-wide">240 GSM Heavyweight</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* ================= CORE PHILOSOPHY & PREPAID MODEL ================= */}
      <div className="bg-[#fafafa] border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
          
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider mb-6 text-gray-900">
              Why We Are <span className="text-red-600">Strictly Prepaid</span>
            </h2>
            <p className="text-gray-600 font-medium leading-relaxed text-base md:text-lg">
              To maintain zero-waste operations and keep our prices incredibly fair at just ₹349 for true 240 GSM cotton, THREADZS functions exclusively on a prepaid and pre-order model. 
              No fake orders, no dead stock, no RTO courier losses—just custom premium garments handled specifically for you and delivered straight to your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="font-black text-lg uppercase tracking-wider mb-3">100% Cotton</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Double bio-washed French Terry cotton. Heavy drapery drip that feels like a hug and lasts wash after wash.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300 delay-100">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf size={32} />
              </div>
              <h3 className="font-black text-lg uppercase tracking-wider mb-3">Eco-Conscious</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                By producing precisely what is ordered, we eliminate fast-fashion pollution and textile waste completely.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300 delay-200">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin size={32} />
              </div>
              <h3 className="font-black text-lg uppercase tracking-wider mb-3">Made Locally</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Inspected, packed, and dispatched directly from our official fulfillment hub in Madurai, Tamil Nadu.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ================= BOTTOM CTA ================= */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h3 className="text-2xl md:text-3xl font-black mb-2 uppercase tracking-widest text-gray-900">
          Ready to Elevate Your Drip?
        </h3>
        <p className="text-gray-500 font-medium mb-10 max-w-xl mx-auto text-sm">
          Join thousands of others who have already switched to the ultimate premium basic.
        </p>
        <Link 
          to="/" 
          className="bg-black text-white px-10 py-5 font-black uppercase tracking-widest hover:bg-red-600 hover:shadow-xl hover:shadow-red-200 transition-all duration-300 rounded-2xl inline-flex items-center justify-center gap-3"
        >
          Explore Collections <Shirt size={18}/>
        </Link>
      </div>

    </div>
  );
};

export default About;