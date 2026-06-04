import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();

  // Basic total calculation
  const subtotal = cartItems ? cartItems.reduce((acc, item) => acc + (parseInt(item.price) * (item.quantity || 1)), 0) : 0;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-widest text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 font-medium mb-8 text-center">Looks like you haven't added any premium drip to your cart yet.</p>
        <Link to="/" className="bg-black text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg hover:-translate-y-1">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 bg-white min-h-screen">
      <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-gray-900 mb-10">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items List */}
        <div className="flex-[2]">
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">
            {cartItems.map((item, index) => {
              const displayImage = (item.images && item.images.length > 0) ? item.images[0] : item.image;
              return (
                <div key={index} className="flex gap-6 py-6 border-b border-gray-100 last:border-0 items-center">
                  <div className="w-24 h-32 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={displayImage} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-black text-gray-900">{item.name}</h3>
                        <p className="text-sm font-bold text-gray-500 mt-1">Size: <span className="text-black">{item.size || 'M'}</span></p>
                        <p className="text-sm font-bold text-gray-500 mt-1">Qty: <span className="text-black">{item.quantity || 1}</span></p>
                      </div>
                      <p className="text-xl font-black text-gray-900">₹{item.price}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart && removeFromCart(item.cartId || item.id)}
                      className="mt-4 flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="flex-1">
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 sticky top-24">
            <h2 className="text-xl font-black uppercase tracking-wider text-gray-900 mb-6 border-b border-gray-200 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="font-bold text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Shipping</span>
                <span className="font-bold text-green-600 uppercase tracking-wider text-xs">Free</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-200 pt-6 mb-8">
              <span className="text-lg font-bold text-gray-900 uppercase tracking-wider">Total</span>
              <span className="text-3xl font-black text-red-600">₹{subtotal}</span>
            </div>

            <Link 
              to="/checkout" 
              className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200 hover:-translate-y-1 flex justify-center items-center gap-2"
            >
              Checkout Securely <ArrowRight size={20} />
            </Link>
            
            <div className="mt-6 flex justify-center items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
              <span>Encrypted</span> • <span>Secure</span> • <span>100% Safe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;