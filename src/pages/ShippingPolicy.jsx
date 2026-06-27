import { Truck, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShippingPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800 select-none">
      <nav className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6"><Link to="/" className="hover:text-black">Home</Link> / Shipping Policy</nav>
      <h1 className="text-3xl font-black text-gray-900 uppercase tracking-wide mb-8 border-b pb-4">Shipping & Delivery Policy</h1>
      
      <div className="space-y-6 text-sm leading-relaxed font-medium">
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex gap-4 items-start">
          <Truck className="text-red-600 flex-shrink-0 mt-1" size={24}/>
          <div>
            <h3 className="font-bold text-black uppercase tracking-wider mb-1">Free Shipping Across India</h3>
            <p className="text-gray-600">We proudly offer 100% free standard shipping on all pre-paid orders across every state and union territory in India.</p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-black uppercase tracking-wider">1. Order Processing & Timelines</h2>
          <p>All orders placed on THREADZS are processed within <strong>24 to 48 hours</strong>. Orders are not shipped or delivered on Sundays or national holidays.</p>
          <p>Once dispatched, your order will be delivered to your doorstep within <strong>3 to 5 business days</strong> depending on your location.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-black uppercase tracking-wider">2. Shipment Tracking</h2>
          <p>Once your order is handed over to our delivery partners, you will receive a direct WhatsApp notification and email containing your live tracking link and Courier AWB number.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-black uppercase tracking-wider">3. Dispatch Origin</h2>
          <p>All premium THREADZS merchandises are inspected, packed, and dispatched directly from our official fulfillment hub: <em>South Veli Street, Madurai - 625001, Tamil Nadu, India.</em></p>
        </section>
      </div>
    </div>
  );
};
export default ShippingPolicy;