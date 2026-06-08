import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; 
import { ProductProvider } from './context/ProductContext'; 
// --- NEW: Imported useEffect for Scroll to Top logic ---
import { useEffect } from 'react';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import Customize from './pages/Customize';
import Collection from './pages/Collection'; 
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';

// Layout Component to handle conditional Navbar rendering
const AppLayout = () => {
  const location = useLocation();
  
  // --- NEW: Auto Scroll to Top Logic ---
  // Ovvoru thadavayum page (pathname) maarum pothu ithu trigger aagi window-va top-ku kondu pogum
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  const isAdminRoute = location.pathname.startsWith('/puppy');

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Admin route illana mattum Navbar kaatum */}
      {!isAdminRoute && <Navbar />}
      
      <main className="flex-grow bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections/:category" element={<Collection />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/customize" element={<Customize />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/puppy" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Admin route illana mattum Footer kaatum */}
      {!isAdminRoute && <Footer />}

    </div>
  );
};

function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <Router>
          <AppLayout />
        </Router>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;