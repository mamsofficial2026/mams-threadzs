import { Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800 select-none">
      <nav className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6"><Link to="/" className="hover:text-black">Home</Link> / Terms & Conditions</nav>
      <h1 className="text-3xl font-black text-gray-900 uppercase tracking-wide mb-8 border-b pb-4">Terms & Conditions</h1>

      <div className="space-y-6 text-sm leading-relaxed font-medium">
        <p>Welcome to THREADZS. By accessing <strong>www.threadzs.com</strong>, you agree to be bound by the following terms:</p>
        
        <section className="space-y-2">
          <h2 className="text-base font-black text-black uppercase tracking-wider">1. Brand Ownership & Intellectual Property</h2>
          <p>All clothing graphics, custom prints, logos, website designs, and artwork are the sole intellectual property of THREADZS. Unauthorized reproduction or commercial copying is strictly prohibited under Indian Copyright laws.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-black uppercase tracking-wider">2. Product Accuracy</h2>
          <p>We strive to display fabric colors and oversized fits as accurately as possible. However, due to varying mobile screen brightness and resolutions, actual fabric shade may slightly vary by 3-5%.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-black uppercase tracking-wider">3. Governing Law & Jurisdiction</h2>
          <p>Any commercial dispute or legal claim arising out of transactions on this website shall be governed strictly by the laws of India and subject to the exclusive jurisdiction of the competent courts in <strong>Madurai, Tamil Nadu</strong>.</p>
        </section>
      </div>
    </div>
  );
};
export default Terms;