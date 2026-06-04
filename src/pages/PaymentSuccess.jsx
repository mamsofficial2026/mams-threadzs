import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';

const PaymentSuccess = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4 animate-in fade-in zoom-in duration-500">
      
      {/* Success Icon */}
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-lg shadow-green-100">
        <CheckCircle size={50} />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter text-center uppercase">
        Payment Successful!
      </h1>
      
      <p className="text-gray-500 font-bold mb-8 text-center max-w-md">
        Thank you for choosing THREADZS. Your premium drip is being packed and will be shipped out soon. 
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Link 
          to="/collections/all" 
          className="flex-1 bg-black text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-900 transition-all shadow-xl hover:-translate-y-1 flex justify-center items-center gap-2"
        >
          <ShoppingBag size={18} /> Continue Shopping
        </Link>
      </div>

      <p className="mt-8 text-xs font-bold text-gray-400 tracking-widest uppercase text-center">
        Order details have been sent to your email.
      </p>

    </div>
  );
};

export default PaymentSuccess;