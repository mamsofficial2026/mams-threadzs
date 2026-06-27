import { Lock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800 select-none">
      <nav className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6"><Link to="/" className="hover:text-black">Home</Link> / Privacy Policy</nav>
      <h1 className="text-3xl font-black text-gray-900 uppercase tracking-wide mb-8 border-b pb-4">Privacy Policy</h1>

      <div className="space-y-6 text-sm leading-relaxed font-medium">
        <p>At THREADZS (<strong>www.threadzs.com</strong>), your privacy is our extreme priority. This document outlines how we handle your data.</p>
        
        <section className="space-y-2">
          <h2 className="text-base font-black text-black uppercase tracking-wider">1. Information We Collect</h2>
          <p>When you make a purchase, we collect your Name, Shipping Address, Phone Number, and Email Address solely to fulfill your order and send live shipping updates.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-black uppercase tracking-wider">2. Payment Security (PCI-DSS)</h2>
          <p>We **never** store your Credit Card numbers, UPI PINs, or Bank passwords. All monetary transactions are processed via 100% encrypted, RBI-compliant payment gateways (PayU India).</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-black uppercase tracking-wider">3. Third-Party Sharing</h2>
          <p>We do not sell or rent your personal data. We only share necessary delivery details with our trusted courier logistics and printing partners (Qikink) to ship your drip.</p>
        </section>
      </div>
    </div>
  );
};
export default PrivacyPolicy;