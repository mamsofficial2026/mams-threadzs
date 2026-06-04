import { Link } from 'react-router-dom';
import { XCircle, RefreshCcw, Home } from 'lucide-react';

const PaymentFailed = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4 animate-in fade-in slide-in-from-bottom-8">
      
      {/* Failure Icon */}
      <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-100">
        <XCircle size={50} />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter text-center uppercase">
        Payment Failed
      </h1>
      
      <p className="text-gray-500 font-bold mb-8 text-center max-w-md">
        We couldn't process your payment. Don't worry, if any amount was deducted, it will be refunded to your account within 3-5 business days.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link 
          to="/cart" 
          className="flex-[2] bg-red-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl hover:-translate-y-1 flex justify-center items-center gap-2"
        >
          <RefreshCcw size={18} /> Try Payment Again
        </Link>
        
        <Link 
          to="/" 
          className="flex-1 bg-white border-2 border-gray-200 text-gray-900 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:border-black transition-all flex justify-center items-center gap-2"
        >
          <Home size={18} /> Home
        </Link>
      </div>
      
    </div>
  );
};

export default PaymentFailed;