import { createContext, useState, useContext, useEffect } from 'react';
// --- NEW: Import Supabase client ---
import { supabase } from '../supabaseClient'; 

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // --- 100% REAL STATE (No Dummy Data, No Local Storage) ---
  const [products, setProducts] = useState([]);
  const [heroBanner, setHeroBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH DIRECTLY FROM SUPABASE AND SYNC LIVE ---
  useEffect(() => {
    const fetchDatabaseData = async () => {
      try {
        // Fetch all products from 'products' table
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        
        // Fetch Hero Banner from 'hero_banner' table
        const { data: heroData, error: heroError } = await supabase
          .from('hero_banner')
          .select('*')
          .single();

        if (heroError && heroError.code !== 'PGRST116') throw heroError;

        // Set exact database state, overriding completely
        if (productsData) setProducts(productsData);
        if (heroData) setHeroBanner(heroData);

      } catch (error) {
        console.error("Supabase Fetch Error:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatabaseData();
  }, []);

  return (
    <ProductContext.Provider value={{ products, setProducts, heroBanner, setHeroBanner, isLoading }}>
      {children}
    </ProductContext.Provider>
  );
};

// --- CORRECT EXPORT: Only useProducts goes here ---
export const useProducts = () => useContext(ProductContext);