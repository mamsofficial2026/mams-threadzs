import { Link } from 'react-router-dom';
// Removed Instagram and Twitter from here to fix the crash
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'; // 🔥 NEW: Added ShieldCheck for Trust Badge

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t-4 border-red-600 mt-auto print:hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div>
            <h2 className="font-black text-3xl tracking-widest text-white mb-4">
              THREADZS<span className="text-red-600">.</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed font-medium mb-6">
              Premium oversized & plain t-shirts crafted for the modern lifestyle. Redefine your drip with our exclusive collection.
            </p>
            <div className="flex gap-4">
              {/* Native SVG for Instagram (No Lucide dependency) */}
              <a href="https://www.instagram.com/threadzs_official/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* Native SVG for Twitter/X (No Lucide dependency) */}
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-black uppercase tracking-widest text-sm mb-6">Quick Links</h3>
            <ul className="space-y-3 text-gray-400 text-sm font-medium">
              <li><Link to="/" className="hover:text-red-500 transition-colors">Home</Link></li>
              <li><Link to="/collections/men" className="hover:text-red-500 transition-colors">Men's Collection</Link></li>
              <li><Link to="/collections/women" className="hover:text-red-500 transition-colors">Women's Collection</Link></li>
              <li><Link to="/collections/genz" className="hover:text-red-500 transition-colors">Gen Z Collection</Link></li>
            </ul>
          </div>

          {/* Support / Policies */}
          <div>
            <h3 className="font-black uppercase tracking-widest text-sm mb-6">Policies</h3>
            <ul className="space-y-3 text-gray-400 text-sm font-medium">
              <li><Link to="/terms-conditions" className="hover:text-red-500 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-red-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-red-500 transition-colors">Shipping Policy</Link></li>
              <li><Link to="/cancellation-refund" className="hover:text-red-500 transition-colors">Cancellation & Refund</Link></li>
            </ul>
          </div>

          {/* Contact Details & Trust Signals */}
          <div>
            <h3 className="font-black uppercase tracking-widest text-sm mb-6">Contact Us</h3>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <span>THREADZS, 1/1A Shop no.4 Eswaran complex Gate lock road ,<br/>Madurai - 625001, Tamil Nadu.</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-red-600 flex-shrink-0" />
                <span>+91 90432 41335</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-red-600 flex-shrink-0" />
                {/* 🔥 UPDATED: Replaced Gmail with professional domain email */}
                <span>hello@threadzs.com</span>
              </li>
            </ul>
            
            {/* 🔥 NEW: Legal Trust Badge (GSTIN) */}
            <div className="mt-6 p-3 bg-white/5 border border-gray-800 rounded-lg flex items-center gap-3">
              <ShieldCheck className="text-green-500" size={24} />
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Registered Business</p>
                <p className="text-xs text-gray-300 font-medium tracking-wide">GSTIN: 33CYQPN5015G1ZD</p>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
            &copy; {new Date().getFullYear()} THREADZS. All Rights Reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-gray-600 text-2xl">💳</span>
            <span className="text-gray-600 text-2xl">🏦</span>
            <span className="text-gray-600 text-2xl">📱</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;