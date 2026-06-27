import { AlertTriangle, Video, RefreshCw, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800 select-none">
      <nav className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6"><Link to="/" className="hover:text-black">Home</Link> / Cancellation & Refund</nav>
      <h1 className="text-3xl font-black text-gray-900 uppercase tracking-wide mb-8 border-b pb-4">Cancellation & Refund Policy</h1>

      <div className="space-y-8 text-sm leading-relaxed font-medium">
        
        {/* 🔥 ZERO TOLERANCE CANCELLATION BOX */}
        <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl text-red-900 space-y-2">
          <h3 className="font-black uppercase tracking-wider flex items-center gap-2"><XCircle size={20} className="text-red-600"/> Strict Cancellation Window</h3>
          <p className="font-bold">Once a payment is successfully processed, orders CANNOT be cancelled randomly. Cancellations are strictly permitted ONLY BEFORE the order is dispatched from our warehouse.</p>
          <p className="text-xs text-red-700">Once an order status changes to "Shipped" / "Dispatched", the cancellation gateway is permanently locked. No requests will be entertained thereafter.</p>
        </div>

        {/* 🔥 COMPULSORY VIDEO EVIDENCE BOX */}
        <div className="bg-black text-white p-6 rounded-2xl space-y-3 shadow-xl">
          <h3 className="font-black text-yellow-400 uppercase tracking-wider flex items-center gap-2"><Video size={20}/> Mandatory Unboxing Video Evidence</h3>
          <p className="text-gray-200 text-xs leading-relaxed">
            To protect our homegrown brand against transit frauds, **a continuous, single-take, unedited 360° unboxing video** starting clearly from the sealed parcel showing the THREADZS shipping label is **strictly compulsory**. 
            Any damage, defect, or missing item claims submitted without an authentic unboxing video will be summarily rejected.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-black uppercase tracking-wider">1. Return & Exchange Window</h2>
          <p>We accept return or size exchange requests within <strong>7 days from the date of delivery</strong>. The item must be absolutely unworn, unwashed, and packed in its original packaging with all THREADZS tags intact.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-black uppercase tracking-wider">2. Refund Processing</h2>
          <p>Once your returned parcel reaches our Madurai warehouse and passes our physical quality check, your refund will be initiated.</p>
          <p>The approved amount will be credited back to your original source of payment (Bank Account / UPI / Card) within <strong>5 to 7 working days</strong>.</p>
        </section>
      </div>
    </div>
  );
};
export default RefundPolicy;