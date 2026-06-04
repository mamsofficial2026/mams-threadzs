import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

// Ithu thaan antha missing export! Itha add panniten.
export const CartProvider = ({ children }) => {
  
  // Load Cart from Local Storage
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('threadzs_cart');
    return localData ? JSON.parse(localData) : [];
  });

  // Save Cart to Local Storage
  useEffect(() => {
    localStorage.setItem('threadzs_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add Item to Cart Logic
  const addToCart = (product, size) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id && item.size === size);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
  };

  // Clear Cart Logic
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Ithu namma useCart export
export const useCart = () => useContext(CartContext);