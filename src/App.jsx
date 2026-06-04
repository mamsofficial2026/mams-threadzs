import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; 
// --- NEW: Imported our Central Godown (Global State) ---
import { ProductProvider } from './context/ProductContext'; 

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Footer already imported here

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import Customize from './pages/Customize';
// --- NEW: Imported Collection, Cart & Checkout Page ---
import Collection from './pages/Collection'; 
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
// --- NEW: Imported Payment Status Pages ---
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';

// Layout Component to handle conditional Navbar rendering
const AppLayout = () => {
  const location = useLocation();
  
  // --- UPDATED: Simple Secret Route for Admin ---
  const isAdminRoute = location.pathname.startsWith('/puppy');

  return (
    // --- UPDATED: Added flex column layout to ensure footer always stays at the bottom ---
    <div className="flex flex-col min-h-screen">
      
      {/* Admin route illana mattum Navbar kaatum */}
      {!isAdminRoute && <Navbar />}
      
      {/* --- UPDATED: Changed min-h-screen to flex-grow so it pushes the footer down --- */}
      <main className="flex-grow bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* --- NEW: Dynamic Route for Collections --- */}
          <Route path="/collections/:category" element={<Collection />} />
          
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/customize" element={<Customize />} />
          {/* --- NEW: Routes for Cart & Checkout --- */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* --- NEW: Routes for PayU Payment Status --- */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          
          {/* --- UPDATED: Simple Secret Admin Route --- */}
          <Route path="/puppy" element={<AdminDashboard />} />
          
        </Routes>
      </main>

      {/* --- NEW: Admin route illana mattum Footer kaatum --- */}
      {!isAdminRoute && <Footer />}

    </div>
  );
};

function App() {
  return (
    // --- NEW: Wrapped entire app with ProductProvider ---
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