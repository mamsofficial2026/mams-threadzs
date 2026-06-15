import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, ShoppingCart, 
  Users, Settings, LogOut, Menu, X, TrendingUp, Package,
  Plus, Edit, Trash2, Search, XCircle, Eye, Truck, User, MapPin, FileText, Printer, UploadCloud, MessageCircle, AlertTriangle, MonitorPlay, Loader2, ChevronRight, Palette, CheckCircle, Smartphone
} from 'lucide-react';

import { useProducts } from '../context/ProductContext';
import { supabase } from '../supabaseClient'; 

const CLOUDINARY_CLOUD_NAME = "dzpasg4hh"; 
const CLOUDINARY_UPLOAD_PRESET = "threadzs_preset"; 
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isUploading, setIsUploading] = useState(false);
  
  const [orders, setOrders] = useState([]);
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const { products, setProducts, heroBanner, setHeroBanner } = useProducts();

  const [categoryMap, setCategoryMap] = useState({
    'Men': ['T-Shirts', 'Shirts', 'Hoodies', 'Jeans'],
    'Women': ['Tops', 'Dresses', 'Activewear'],
    'Gen Z': ['Oversized Tees', 'Streetwear', 'Cargos'],
    'Accessories': ['Caps', 'Bags', 'Chains']
  });

  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [managingSubCategoryFor, setManagingSubCategoryFor] = useState(null);
  const [newCatInput, setNewCatInput] = useState('');
  const [newSubCatInput, setNewSubCatInput] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', category: 'Men', subCategory: 'T-Shirts', price: '', original_price: '', stock: '', images: [], description: '', sizes: [], colors: []
  });

  const availableSizesList = ["XS", "S", "M", "L", "XL", "XXL"];
  
  const [igFeedData, setIgFeedData] = useState([]);
  const [igFormData, setIgFormData] = useState({ image_url: '', post_link: '', likes: '', is_reel: false });
  const [isSubmittingIg, setIsSubmittingIg] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsFetchingOrders(true);
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsFetchingOrders(false);
      }
    };

    const fetchIgFeed = async () => {
      try {
        const { data, error } = await supabase.from('ig_feed').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (data) setIgFeedData(data);
      } catch (error) {
        console.error("Error fetching IG Feed:", error);
      }
    };

    if (activeTab === 'dashboard' || activeTab === 'orders') fetchOrders();
    if (activeTab === 'instagram') fetchIgFeed();

  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      const firstSub = categoryMap[value] ? categoryMap[value][0] : '';
      setFormData({ ...formData, category: value, subCategory: firstSub || '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSizeToggle = (size) => {
    setFormData((prevData) => {
      const currentSizes = prevData.sizes || [];
      return currentSizes.includes(size) 
        ? { ...prevData, sizes: currentSizes.filter((s) => s !== size) }
        : { ...prevData, sizes: [...currentSizes, size] };
    });
  };

  const addColorVariant = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...(prev.colors || []), { name: '', hex: '#000000', images: [] }]
    }));
  };

  const removeColorVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleColorDetailsChange = (index, field, value) => {
    setFormData(prev => {
      const updatedColors = [...prev.colors];
      updatedColors[index] = { ...updatedColors[index], [field]: value };
      return { ...prev, colors: updatedColors };
    });
  };

  const handleColorImageUpload = async (e, colorIndex) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setIsUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        data.append('cloud_name', CLOUDINARY_CLOUD_NAME);
        const response = await fetch(CLOUDINARY_URL, { method: 'POST', body: data });
        const uploadedImage = await response.json();
        return uploadedImage.secure_url;
      });
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => {
        const updatedColors = [...prev.colors];
        updatedColors[colorIndex].images = [...(updatedColors[colorIndex].images || []), ...uploadedUrls];
        const allFlattenedImages = updatedColors.flatMap(c => c.images || []);
        return { ...prev, colors: updatedColors, images: allFlattenedImages };
      });
    } catch (error) {
      alert("Cloudinary Color Image Upload Failed!");
    } finally {
      setIsUploading(false);
    }
  };

  const removeColorImage = (colorIndex, imgIndexToRemove) => {
    setFormData(prev => {
      const updatedColors = [...prev.colors];
      updatedColors[colorIndex].images = updatedColors[colorIndex].images.filter((_, i) => i !== imgIndexToRemove);
      const allFlattenedImages = updatedColors.flatMap(c => c.images || []);
      return { ...prev, colors: updatedColors, images: allFlattenedImages };
    });
  };

  const handleMultipleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setIsUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        data.append('cloud_name', CLOUDINARY_CLOUD_NAME);
        const response = await fetch(CLOUDINARY_URL, { method: 'POST', body: data });
        const uploadedImage = await response.json();
        return uploadedImage.secure_url;
      });
      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...uploadedUrls] }));
    } catch (error) {
      alert("Cloudinary Upload Failed! Check your internet or config.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (indexToRemove) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, index) => index !== indexToRemove) }));

  const handleAddProduct = () => {
    setEditingId(null);
    const initialCat = Object.keys(categoryMap)[0] || '';
    const initialSubCat = categoryMap[initialCat]?.[0] || '';
    setFormData({ name: '', category: initialCat, subCategory: initialSubCat, price: '', original_price: '', stock: '', images: [], description: '', sizes: [], colors: [] });
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    const productImages = product.images ? product.images : (product.image ? [product.image] : []);
    setFormData({ 
      ...product, 
      sizes: product.sizes || [], 
      images: productImages, 
      original_price: product.original_price || '', 
      subCategory: product.sub_category || '',
      colors: product.colors || []
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        alert("Error deleting product from database.");
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if ((!formData.images || formData.images.length === 0) && (!formData.colors || formData.colors.length === 0)) {
      return alert("Please upload at least one product image or set a color variant!");
    }

    try {
      setIsUploading(true);
      const productData = {
        name: formData.name, 
        category: formData.category, 
        sub_category: formData.subCategory, 
        price: formData.price.toString(), 
        original_price: formData.original_price ? formData.original_price.toString() : '', 
        stock: parseInt(formData.stock), 
        sizes: formData.sizes, 
        description: formData.description, 
        images: formData.images,
        colors: formData.colors || [] 
      };

      if (editingId) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingId);
        if (error) throw error;
        setProducts(products.map(p => p.id === editingId ? { ...formData, sub_category: formData.subCategory, id: editingId } : p));
      } else {
        const { data, error } = await supabase.from('products').insert([productData]).select();
        if (error) throw error;
        if (data && data.length > 0) setProducts([data[0], ...products]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error saving to database! Check console.");
    } finally {
      setIsUploading(false);
    }
  };

  const addCategory = () => { if (newCatInput.trim() && !categoryMap[newCatInput]) { setCategoryMap({ ...categoryMap, [newCatInput.trim()]: [] }); setNewCatInput(''); } };
  const deleteCategory = (cat) => {
    if (window.confirm(`Delete entire '${cat}' category?`)) {
      const newMap = { ...categoryMap }; delete newMap[cat]; setCategoryMap(newMap);
      if (managingSubCategoryFor === cat) setManagingSubCategoryFor(null);
      if (formData.category === cat) {
        const nextCat = Object.keys(newMap)[0] || '';
        setFormData({ ...formData, category: nextCat, subCategory: newMap[nextCat]?.[0] || '' });
      }
    }
  };
  const editCategory = (oldCat) => {
    const newCat = window.prompt("Enter new category name:", oldCat);
    if (newCat && newCat.trim() !== '' && newCat !== oldCat && !categoryMap[newCat]) {
      const newMap = { ...categoryMap }; newMap[newCat] = newMap[oldCat]; delete newMap[oldCat]; setCategoryMap(newMap);
      if (managingSubCategoryFor === oldCat) setManagingSubCategoryFor(newCat);
      if (formData.category === oldCat) setFormData({ ...formData, category: newCat });
    }
  };
  const addSubCategory = () => {
    if (newSubCatInput.trim() && managingSubCategoryFor) {
      const updatedSubs = [...categoryMap[managingSubCategoryFor], newSubCatInput.trim()];
      setCategoryMap({ ...categoryMap, [managingSubCategoryFor]: updatedSubs }); setNewSubCatInput('');
    }
  };
  const deleteSubCategory = (subCat) => {
    if (managingSubCategoryFor) {
      const updatedSubs = categoryMap[managingSubCategoryFor].filter(s => s !== subCat);
      setCategoryMap({ ...categoryMap, [managingSubCategoryFor]: updatedSubs });
      if (formData.subCategory === subCat) setFormData({ ...formData, subCategory: updatedSubs[0] || '' });
    }
  };
  const editSubCategory = (oldSubCat) => {
    const newSubCat = window.prompt("Enter new sub-category name:", oldSubCat);
    if (newSubCat && newSubCat.trim() !== '' && newSubCat !== oldSubCat && managingSubCategoryFor) {
      const updatedSubs = categoryMap[managingSubCategoryFor].map(s => s === oldSubCat ? newSubCat : s);
      setCategoryMap({ ...categoryMap, [managingSubCategoryFor]: updatedSubs });
      if (formData.subCategory === oldSubCat) setFormData({ ...formData, subCategory: newSubCat });
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (error) throw error;
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) setSelectedOrder({ ...selectedOrder, status: newStatus });
    } catch (error) { alert("Failed to update order status."); }
  };
  
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to permanently delete this order?")) {
      try {
        const { error } = await supabase.from('orders').delete().eq('id', orderId);
        if (error) throw error;
        setOrders(orders.filter(o => o.id !== orderId)); alert("Order deleted successfully!");
      } catch (error) { alert("Error deleting order from database."); }
    }
  };
  
  const handlePrint = () => {
    // Hide standard elements before printing
    window.print();
  };
  
  const handleWhatsAppNotify = (order) => {
    const message = `Hi ${order.customer},%0A%0AThanks for choosing *THREADZS*! 👕%0AYour Order ${order.id} is currently: *${order.status}*.%0A%0AWe will keep you updated. Get ready for the drip! ✨`;
    window.open(`https://wa.me/91${order.phone}?text=${message}`, '_blank');
  };

  const handlePushToQikink = async (order) => {
    if (!window.confirm(`Push Order #${order.id} to Qikink for production?`)) return;

    try {
      const orderDataPayload = {
        orderDetails: {
          order_id: order.id.toString(), 
          first_name: order.customer || "Customer",
          phone: order.phone || "9999999999",
          address1: order.address || "Test Address",
          city: order.city || "Madurai",
          zip: order.pincode || "625001",
          country: "India",
          items: (Array.isArray(order.items) ? order.items : []).map(item => ({
            sku: "v-9Rmg3yKEaVZW0sELNBQoubTRrQva9neZ", 
            quantity: item.quantity || 1,
            price: item.price || 449
          }))
        }
      };

      const response = await fetch('http://localhost:8000/api/qikink-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderDataPayload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || result.error || "Backend error");
      }
      
      alert("🔥 Order successfully pushed to Qikink via Python! Production started.");
      updateOrderStatus(order.id, 'Processing');
      setIsOrderModalOpen(false);

    } catch (error) {
      console.error("Qikink Push Error:", error);
      alert(`Failed to push order to Qikink. Error: ${error.message}`);
    }
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setIsUploading(true); const data = new FormData(); data.append('file', file); data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET); data.append('cloud_name', CLOUDINARY_CLOUD_NAME);
    try {
      const response = await fetch(CLOUDINARY_URL, { method: 'POST', body: data });
      const uploadedImage = await response.json(); setHeroBanner({ ...heroBanner, image: uploadedImage.secure_url });
    } catch (error) { alert("Hero Image upload failed!"); } finally { setIsUploading(false); }
  };
  
  const handleHeroBannerChange = (e) => setHeroBanner({ ...heroBanner, [e.target.name]: e.target.value });
  
  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      const { error } = await supabase.from('hero_banner').update({ heading: heroBanner.heading, subtext: heroBanner.subtext, tagline: heroBanner.tagline, image: heroBanner.image }).eq('id', 1);
      if (error) throw error; alert("Hero Section Updated Successfully in Database! 🔥");
    } catch (error) { console.error(error); alert("Error saving hero banner to database."); } finally { setIsUploading(false); }
  };

  const handleIgImageUpload = async (e) => {
    const file = e.target.files[0]; 
    if (!file) return;
    setIsUploading(true); 
    const data = new FormData(); 
    data.append('file', file); 
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET); 
    data.append('cloud_name', CLOUDINARY_CLOUD_NAME);
    try {
      const response = await fetch(CLOUDINARY_URL, { method: 'POST', body: data });
      const uploadedImage = await response.json(); 
      setIgFormData({ ...igFormData, image_url: uploadedImage.secure_url });
    } catch (error) { 
      alert("Image upload failed!"); 
    } finally { 
      setIsUploading(false); 
    }
  };

  const handleIgFormChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setIgFormData({ ...igFormData, [e.target.name]: value });
  };

  const handleIgSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmittingIg(true);
      
      const payload = {
        image_url: igFormData.image_url,
        post_link: igFormData.post_link,
        likes: igFormData.likes,
        is_reel: igFormData.is_reel
      };

      const { data, error } = await supabase.from('ig_feed').insert([payload]).select();
      if (error) throw error;
      if (data && data.length > 0) {
        setIgFeedData([data[0], ...igFeedData]);
        setIgFormData({ image_url: '', post_link: '', likes: '', is_reel: false });
        alert("Instagram Link Added Successfully! 🔥");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding post link to Database.");
    } finally {
      setIsSubmittingIg(false);
    }
  };

  const handleIgDelete = async (id) => {
    if(window.confirm("Delete this post from the homepage feed?")) {
      try {
        const { error } = await supabase.from('ig_feed').delete().eq('id', id);
        if (error) throw error;
        setIgFeedData(igFeedData.filter(post => post.id !== id));
      } catch (error) {
        alert("Error deleting post.");
      }
    }
  };

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      const totalRevenue = orders.reduce((acc, o) => {
        const amountStr = o.amount ? String(o.amount) : "0";
        const numericAmount = parseInt(amountStr.replace(/[^0-9]/g, '')) || 0;
        return acc + numericAmount;
      }, 0);
      
      return (
        <>
          <h1 className="text-2xl font-black mb-8 text-gray-900 uppercase tracking-wider">Overview Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center border border-green-100"><TrendingUp size={24} className="text-green-500" /></div>
              <div><p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Revenue</p><h3 className="text-2xl font-black text-gray-900">₹{totalRevenue.toLocaleString('en-IN')}</h3></div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100"><ShoppingCart size={24} className="text-blue-500" /></div>
              <div><p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Orders</p><h3 className="text-2xl font-black text-gray-900">{orders.length}</h3></div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100"><Package size={24} className="text-purple-500" /></div>
              <div><p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Active Products</p><h3 className="text-2xl font-black text-gray-900">{products.length}</h3></div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-10">
            <h2 className="font-black text-lg text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-red-600"/> Weekly Sales Analytics</h2>
            <div className="flex items-end gap-2 h-48 w-full border-b border-gray-200 pb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const heights = ['h-12', 'h-24', 'h-16', 'h-32', 'h-20', 'h-40', 'h-28'];
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className={`w-full max-w-[40px] bg-red-100 rounded-t-lg relative group-hover:bg-red-200 transition-colors ${heights[idx]}`}>
                      <div className="absolute bottom-0 w-full bg-red-600 rounded-t-lg shadow-[0_-5px_15px_rgba(220,38,38,0.4)] transition-all duration-500 h-[60%] group-hover:h-[80%]"></div>
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-black text-lg text-gray-900 uppercase tracking-wider">Recent Live Orders</h2>
              <button onClick={() => setActiveTab('orders')} className="text-red-600 text-sm font-bold hover:underline">View All & Pack</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                    <th className="p-4 font-bold border-b border-gray-100">Order ID</th>
                    <th className="p-4 font-bold border-b border-gray-100">Customer</th>
                    <th className="p-4 font-bold border-b border-gray-100">Amount</th>
                    <th className="p-4 font-bold border-b border-gray-100">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isFetchingOrders ? (
                    <tr><td colSpan="4" className="p-4 text-center text-gray-500">Loading live orders...</td></tr>
                  ) : orders.length === 0 ? (
                    <tr><td colSpan="4" className="p-4 text-center text-gray-500 font-bold">No recent orders.</td></tr>
                  ) : orders.slice(0, 5).map((order, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-900 border-b border-gray-50">{order.id}</td>
                      <td className="p-4 text-gray-700 font-medium border-b border-gray-50">{order.customer}</td>
                      <td className="p-4 font-bold text-gray-900 border-b border-gray-50">{order.amount}</td>
                      <td className="p-4 border-b border-gray-50">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status || 'Processing'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      );
    }

    if (activeTab === 'products') {
      return (
        <div className="animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-wider">Product Catalog</h1>
            <button onClick={handleAddProduct} className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg shadow-red-200">
              <Plus size={20} /> Add New Product
            </button>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-gray-500 text-xs uppercase tracking-widest border-b border-gray-200">
                    <th className="p-4 font-bold">Image</th><th className="p-4 font-bold">Product Name</th><th className="p-4 font-bold">Category</th>
                    <th className="p-4 font-bold">Price Configuration</th><th className="p-4 font-bold">Stock</th><th className="p-4 font-bold">Sizes</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan="7" className="p-8 text-center text-gray-500 font-bold">Your Drop is empty. Add some fresh drip! 🔥</td></tr>
                  ) : products.map((p) => {
                    const coverImage = (p.images && p.images.length > 0) ? p.images[0] : p.image; 
                    return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-4 border-b border-gray-50"><div className="w-12 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">{coverImage && <img src={coverImage} alt={p.name} className="w-full h-full object-cover" />}</div></td>
                      <td className="p-4 font-bold text-gray-900 border-b border-gray-50"><div><p className="font-black">{p.name}</p><p className="text-xs text-gray-400 font-medium truncate max-w-[250px] mt-0.5">{p.description}</p></div></td>
                      <td className="p-4 border-b border-gray-50">
                        <div className="flex flex-col">
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider w-max">{p.category}</span>
                          {p.sub_category && <span className="text-[10px] font-bold text-gray-400 uppercase mt-1 pl-1 flex items-center"><ChevronRight size={10} className="mr-0.5"/> {p.sub_category}</span>}
                        </div>
                      </td>
                      
                      <td className="p-4 border-b border-gray-50">
                        <div className="flex flex-col">
                          <span className="font-black text-gray-900">₹{p.price}</span>
                          {p.original_price && (
                            <span className="text-xs text-gray-400 line-through font-medium">₹{p.original_price}</span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 border-b border-gray-50">{p.stock > 10 ? <span className="text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-lg text-xs uppercase">{p.stock} units</span> : <span className="text-red-600 font-black bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg text-xs uppercase flex items-center gap-1 w-max"><AlertTriangle size={14}/> Low/Out</span>}</td>
                      <td className="p-4 border-b border-gray-50"><div className="flex flex-wrap gap-1">{(p.sizes && p.sizes.length > 0) ? p.sizes.map(s => <span key={s} className="bg-gray-200 text-gray-800 text-[10px] px-1.5 py-0.5 rounded font-black">{s}</span>) : <span className="text-xs text-gray-400">N/A</span>}</div></td>
                      <td className="p-4 border-b border-gray-50 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'orders') {
      return (
        <div className="animate-in fade-in duration-300">
          <h1 className="text-2xl font-black mb-8 text-gray-900 uppercase tracking-wider">Live Orders & Shipping Workspace</h1>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-200">
                    <th className="p-4 font-bold">Order ID</th>
                    <th className="p-4 font-bold">Customer Name</th>
                    <th className="p-4 font-bold">Items Configured</th>
                    <th className="p-4 font-bold">Total Bill</th>
                    <th className="p-4 font-bold">Shipping Status</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isFetchingOrders ? (
                    <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading Orders from Database...</td></tr>
                  ) : orders.length === 0 ? (
                    <tr><td colSpan="6" className="p-8 text-center text-gray-500 font-bold">No orders found.</td></tr>
                  ) : orders.map((order) => {
                     const itemsArray = Array.isArray(order.items) ? order.items : [];
                     return (
                    <tr key={order.id} className="hover:bg-gray-50 border-b border-gray-100 transition-colors">
                      <td className="p-4 font-black text-gray-900">{order.id}</td>
                      <td className="p-4"><div><p className="font-bold text-gray-900">{order.customer}</p><p className="text-xs text-gray-400 font-medium">{order.phone}</p></div></td>
                      <td className="p-4 font-medium text-sm text-gray-700">
                        {itemsArray.map((item, idx) => (
                          <div key={idx} className="bg-gray-50 border border-gray-100 px-2 py-1 rounded-md mb-1 text-xs font-bold inline-block mr-2 text-gray-800">
                            {item.name} ({item.size}) <span className="text-red-600">x{item.quantity || 1}</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-4 font-black text-gray-900">{order.amount}</td>
                      <td className="p-4">
                        <select 
                          value={order.status || 'Processing'} 
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase cursor-pointer outline-none ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }} className="bg-black text-white px-3 py-2 text-xs font-bold rounded-lg uppercase tracking-wider hover:bg-gray-800 transition-all shadow-sm flex items-center gap-1">
                            <Eye size={14} /> Open
                          </button>
                          <button onClick={() => handleDeleteOrder(order.id)} className="bg-red-50 text-red-600 border border-red-200 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors" title="Delete Order">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'hero') {
      return (
        <div className="animate-in fade-in duration-300">
          <h1 className="text-2xl font-black mb-8 text-gray-900 uppercase tracking-wider">Hero Banner Configuration</h1>
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8 max-w-3xl">
            <form onSubmit={handleHeroSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Hero Spotlight Image</label>
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-40 h-48 bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 flex-shrink-0 flex items-center justify-center relative shadow-sm">
                    {isUploading ? <Loader2 className="w-8 h-8 text-red-600 animate-spin" /> : (heroBanner?.image ? <img src={heroBanner.image} alt="Hero Preview" className="w-full h-full object-cover" /> : <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">No Image</span>)}
                  </div>
                  <div className="flex-1 w-full">
                    <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-2xl transition-all ${isUploading ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'}`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-10 h-10 mb-2 text-gray-400" />
                        <p className="mb-1 text-sm text-gray-600 font-bold">{isUploading ? <span className="text-red-600">Uploading to Cloudinary...</span> : <><span className="text-red-600">Click to replace</span> hero image</>}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Supports High-Res JPG, PNG</p>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} disabled={isUploading} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div><label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Tagline (Small Text above heading)</label><input type="text" name="tagline" value={heroBanner?.tagline || ''} onChange={handleHeroBannerChange} className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900" /></div>
                <div><label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Main Heading Box</label><input type="text" name="heading" value={heroBanner?.heading || ''} onChange={handleHeroBannerChange} className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-black text-gray-900 text-lg" /></div>
                <div><label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Collection Subtext Description</label><textarea rows="3" name="subtext" value={heroBanner?.subtext || ''} onChange={handleHeroBannerChange} className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-medium text-gray-800 leading-relaxed text-sm"></textarea></div>
              </div>

              <button type="submit" disabled={isUploading} className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-red-600 transition-all duration-300 shadow-md disabled:opacity-50">
                {isUploading ? "Saving to Database..." : "Publish Changes To Store Hero"}
              </button>
            </form>
          </div>
        </div>
      );
    }

    if (activeTab === 'instagram') {
      return (
        <div className="animate-in fade-in duration-300">
          <h1 className="text-2xl font-black mb-8 text-gray-900 uppercase tracking-wider">Instagram Feed Manager</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">
              <h2 className="font-black text-lg text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-wider">
                <Plus size={20} className="text-pink-600" /> Add New IG Post
              </h2>
              <form onSubmit={handleIgSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Upload Instagram Image</label>
                  <div className="flex gap-4 items-center">
                    {igFormData.image_url ? (
                      <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0 relative shadow-sm">
                        <img src={igFormData.image_url} alt="IG Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setIgFormData({...igFormData, image_url: ''})} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700 transition-colors"><X size={12} /></button>
                      </div>
                    ) : (
                      <label className={`flex-1 flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-xl transition-all ${isUploading ? 'bg-gray-100 cursor-not-allowed' : 'bg-pink-50 hover:bg-pink-100 cursor-pointer'}`}>
                        {isUploading ? <Loader2 className="w-6 h-6 text-pink-600 animate-spin mb-2" /> : <UploadCloud className="w-6 h-6 text-pink-500 mb-2" />}
                        <span className="text-xs font-bold text-gray-600">{isUploading ? "Uploading..." : "Click to Upload Image"}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleIgImageUpload} disabled={isUploading} />
                      </label>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Instagram Post Link</label>
                  <input type="url" name="post_link" required value={igFormData.post_link} onChange={handleIgFormChange} placeholder="https://www.instagram.com/p/..." className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-pink-500 font-medium text-gray-900 text-sm" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Likes Count (e.g. 1.2k)</label>
                  <input type="text" name="likes" value={igFormData.likes} onChange={handleIgFormChange} placeholder="500" className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-pink-500 font-bold text-gray-900 text-sm" />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <input type="checkbox" id="is_reel" name="is_reel" checked={igFormData.is_reel} onChange={handleIgFormChange} className="w-5 h-5 accent-pink-600 cursor-pointer" />
                  <label htmlFor="is_reel" className="text-sm font-bold text-gray-700 cursor-pointer">Is this a Reel? (Adds play icon)</label>
                </div>
                <button type="submit" disabled={isSubmittingIg || isUploading} className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:opacity-90 transition-opacity mt-4 shadow-md disabled:opacity-50">
                  {isSubmittingIg ? "Adding Post..." : "Publish to Homepage"}
                </button>
              </form>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 overflow-hidden flex flex-col h-full">
              <h2 className="font-black text-lg text-gray-900 mb-6 uppercase tracking-wider">Live Homepage Feed</h2>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {igFeedData.length === 0 ? (
                  <p className="text-center text-gray-400 font-bold py-10 border-2 border-dashed rounded-xl border-gray-200">No posts added yet.</p>
                ) : (
                  igFeedData.map(post => (
                    <div key={post.id} className="flex gap-4 p-3 border border-gray-200 rounded-2xl items-center bg-gray-50">
                      
                      <div className="w-16 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 relative flex flex-col items-center justify-center border border-gray-200">
                        {post.image_url ? (
                          <img src={post.image_url} alt="IG Post" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400 text-[10px] font-bold">No Img</span>
                        )}
                        {post.is_reel && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute top-1 right-1 drop-shadow-md"><polygon points="6 3 20 12 6 21 6 3"/></svg>}
                      </div>
                      
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-black text-gray-900 truncate">Likes: {post.likes || 0}</p>
                        <a href={post.post_link} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-500 hover:text-blue-700 hover:underline truncate block w-full">View Link</a>
                      </div>
                      <button onClick={() => handleIgDelete(post.id)} className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <div className="text-gray-500 font-medium text-center py-20">Module Under Development</div>;
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans print:h-auto print:block">
      
      {/* ---------------- NORMAL ADMIN DASHBOARD UI (HIDDEN IN PRINT) ---------------- */}
      <div className="print:hidden flex w-full h-full">
        <aside className={`bg-black text-white w-64 flex-shrink-0 transition-all duration-300 z-30 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute md:relative md:w-20 md:translate-x-0'}`}>
          <div className="h-20 flex items-center justify-between px-6 border-b border-gray-800">
            <h2 className={`font-black text-xl tracking-widest text-red-500 overflow-hidden whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>THREADZS<span className="text-white text-sm block tracking-normal">ADMIN</span></h2>
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
          </div>
          <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
            <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold w-full transition-colors ${activeTab === 'dashboard' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}><LayoutDashboard size={20} className="flex-shrink-0" /><span className={`whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>Dashboard</span></button>
            <button onClick={() => setActiveTab('products')} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold w-full transition-colors ${activeTab === 'products' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}><ShoppingBag size={20} className="flex-shrink-0" /><span className={`whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>Products</span></button>
            <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold w-full transition-colors ${activeTab === 'orders' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}><ShoppingCart size={20} className="flex-shrink-0" /><span className={`whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>Orders</span></button>
            <button onClick={() => setActiveTab('hero')} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold w-full transition-colors ${activeTab === 'hero' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}><MonitorPlay size={20} className="flex-shrink-0" /><span className={`whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>Hero Banner</span></button>
            <button onClick={() => setActiveTab('instagram')} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold w-full transition-colors ${activeTab === 'instagram' ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}>
              <LayoutDashboard size={20} className="flex-shrink-0" />
              <span className={`whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>IG Manager</span>
            </button>
          </nav>
          <div className="p-4 border-t border-gray-800 flex-shrink-0"><button className="flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-gray-900 hover:text-red-300 rounded-xl font-bold w-full transition-colors overflow-hidden"><LogOut size={20} className="flex-shrink-0" /><span className={`whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>Logout</span></button></div>
        </aside>

        <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
          {isSidebarOpen && <div className="absolute inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
          <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 flex-shrink-0 z-10">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600 hover:text-black transition-colors"><Menu size={28} /></button>
            <div className="flex items-center gap-4"><span className="font-bold text-gray-700 hidden sm:block">Admin Portal</span><div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center border-2 border-red-600"><span className="font-black text-red-600">A</span></div></div>
          </header>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10">{renderContent()}</div>
        </main>
      </div>

      {/* --- ADD/EDIT MODAL (HIDDEN IN PRINT) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in print:hidden">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-600 transition-colors p-1 bg-gray-100 rounded-full"><XCircle size={24} /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-gray-800 flex items-center gap-2">
                    <Palette size={18} className="text-red-600" /> Color Variants & Mockup Trays
                  </h3>
                  <button type="button" onClick={addColorVariant} className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-800 flex items-center gap-1">
                    <Plus size={14} /> Add Color
                  </button>
                </div>

                {(!formData.colors || formData.colors.length === 0) ? (
                  <p className="text-xs text-gray-400 font-bold italic text-center py-2">No color variants added yet.</p>
                ) : (
                  formData.colors.map((color, colorIdx) => (
                    <div key={colorIdx} className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 relative group">
                      <button type="button" onClick={() => removeColorVariant(colorIdx)} className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors" title="Delete Color Variant">
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black tracking-wider text-gray-400 uppercase mb-1">Color Display Name</label>
                          <input type="text" required value={color.name || ''} onChange={(e) => handleColorDetailsChange(colorIdx, 'name', e.target.value)} placeholder="E.g. Vintage Black" className="w-full border border-gray-200 p-2.5 rounded-lg font-bold text-xs focus:outline-none focus:border-black text-gray-900" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black tracking-wider text-gray-400 uppercase mb-1">Hex Code (Circle Color)</label>
                          <div className="flex gap-2 items-center">
                            <input type="color" value={color.hex || '#000000'} onChange={(e) => handleColorDetailsChange(colorIdx, 'hex', e.target.value)} className="w-8 h-8 rounded cursor-pointer border border-gray-200 bg-transparent" />
                            <input type="text" value={color.hex || '#000000'} onChange={(e) => handleColorDetailsChange(colorIdx, 'hex', e.target.value)} placeholder="#000000" className="flex-1 border border-gray-200 p-2 rounded-lg font-mono text-xs focus:outline-none focus:border-black text-gray-900" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black tracking-wider text-gray-400 uppercase mb-1.5">Images for {color.name || `Color #${colorIdx + 1}`}</label>
                        <div className="flex gap-3 overflow-x-auto pb-1 items-center">
                          {color.images && color.images.map((imgSrc, imgIdx) => (
                            <div key={imgIdx} className="w-16 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 relative group/img border border-gray-200 shadow-sm">
                              <img src={imgSrc} alt="Variant element" className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removeColorImage(colorIdx, imgIdx)} className="absolute top-0.5 right-0.5 bg-red-600 text-white p-0.5 rounded-full shadow opacity-100 sm:opacity-0 sm:group-hover/img:opacity-100 transition-opacity"><X size={10} /></button>
                            </div>
                          ))}
                          <div className="w-16 h-20 flex-shrink-0">
                            <label className={`flex flex-col items-center justify-center w-full h-full border border-dashed border-gray-300 rounded-lg transition-colors ${isUploading ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'}`}>
                              {isUploading ? <Loader2 className="w-4 h-4 text-red-600 animate-spin mb-0.5" /> : <UploadCloud className="w-4 h-4 mb-0.5 text-gray-400" />}
                              <span className="text-[8px] font-black text-gray-500 text-center px-1 uppercase tracking-wider">{isUploading ? "..." : "Add"}</span>
                              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleColorImageUpload(e, colorIdx)} disabled={isUploading} />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">General Backup Photos (Flat List)</label>
                <div className="flex gap-4 overflow-x-auto pb-2 items-center">
                  {formData.images && formData.images.map((imgSrc, index) => (
                    <div key={index} className="w-24 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative group border-2 border-gray-200">
                      <img src={imgSrc} alt={`preview-${index}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"><X size={12} /></button>
                    </div>
                  ))}
                  <div className="w-24 h-32 flex-shrink-0">
                    <label className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-xl transition-colors ${isUploading ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'}`}>
                      {isUploading ? <Loader2 className="w-6 h-6 text-red-600 animate-spin mb-1" /> : <UploadCloud className="w-6 h-6 mb-1 text-gray-400" />}
                      <span className="text-[10px] font-bold text-gray-500 text-center px-1">{isUploading ? "Uploading" : "Add Photos"}</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleMultipleImageUpload} disabled={isUploading} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Product Name</label><input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="E.g. Oversized Drop Tee" className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900" /></div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
                    <div className="flex gap-2">
                      <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900 bg-white appearance-none">
                        {Object.keys(categoryMap).map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <button type="button" onClick={() => setIsCategoryManagerOpen(true)} className="bg-gray-100 text-gray-600 px-4 rounded-xl hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <Settings size={20} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Sub-Category</label>
                    <select name="subCategory" value={formData.subCategory} onChange={handleInputChange} className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900 bg-white appearance-none">
                      {categoryMap[formData.category]?.length ? (
                        categoryMap[formData.category].map((sub) => <option key={sub} value={sub}>{sub}</option>)
                      ) : (
                        <option value="">No Sub-Cats</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Real Price (₹)</label>
                  <input type="number" name="price" required value={formData.price} onChange={handleInputChange} placeholder="399" min="0" className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Dummy slash Price (₹)</label>
                  <input type="number" name="original_price" required value={formData.original_price} onChange={handleInputChange} placeholder="899" min="0" className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Stock Quantity</label>
                  <input type="number" name="stock" required value={formData.stock} onChange={handleInputChange} placeholder="50" min="0" className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Available Sizes</label>
                <div className="flex flex-wrap gap-3">
                  {availableSizesList.map((size) => (
                    <label key={size} className={`cursor-pointer px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all select-none ${(formData.sizes || []).includes(size) ? 'bg-black border-black text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                      <input type="checkbox" className="hidden" checked={(formData.sizes || []).includes(size)} onChange={() => handleSizeToggle(size)} />{size}
                    </label>
                  ))}
                </div>
              </div>

              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Product Description</label><textarea name="description" required rows="4" value={formData.description} onChange={handleInputChange} placeholder="Enter detailed description here..." className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-medium text-gray-800 leading-relaxed"></textarea></div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                <button type="submit" disabled={isUploading} className="flex-1 bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50">
                  {isUploading ? "Saving..." : (editingId ? 'Update Product' : 'Publish Product')}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border-2 border-gray-200 text-gray-600 py-4 rounded-xl font-bold uppercase tracking-widest">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCategoryManagerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in print:hidden">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black uppercase tracking-wider text-lg text-gray-900">Category Manager</h3>
              <button onClick={() => { setIsCategoryManagerOpen(false); setManagingSubCategoryFor(null); }} className="text-gray-400 hover:text-red-600 transition-colors p-1 bg-gray-100 rounded-full"><XCircle size={24} /></button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto mb-6 pr-2">
              {Object.keys(categoryMap).map(cat => (
                <div key={cat} className={`flex justify-between items-center p-3 rounded-xl border transition-all ${managingSubCategoryFor === cat ? 'bg-black text-white border-black' : 'bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-800'}`}>
                  <span className="font-bold cursor-pointer flex-1" onClick={() => setManagingSubCategoryFor(cat)}>{cat}</span>
                  <div className="flex gap-2">
                    <button onClick={() => editCategory(cat)} className={`p-1.5 rounded-md ${managingSubCategoryFor === cat ? 'bg-gray-800 text-white hover:text-blue-400' : 'bg-white text-blue-500 hover:bg-blue-50'}`}><Edit size={14}/></button>
                    <button onClick={() => deleteCategory(cat)} className={`p-1.5 rounded-md ${managingSubCategoryFor === cat ? 'bg-gray-800 text-white hover:text-red-400' : 'bg-white text-red-500 hover:bg-red-50'}`}><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mb-6 border-b border-gray-100 pb-6">
              <input type="text" value={newCatInput} onChange={e => setNewCatInput(e.target.value)} placeholder="New Main Category..." className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900 text-sm" />
              <button onClick={addCategory} className="bg-black text-white px-4 rounded-xl hover:bg-gray-800 transition-colors"><Plus size={20}/></button>
            </div>

            {managingSubCategoryFor ? (
              <div className="animate-in slide-in-from-bottom-2">
                <h4 className="font-black text-xs text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1">Sub-Categories for <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-md">{managingSubCategoryFor}</span></h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {categoryMap[managingSubCategoryFor].length === 0 && <span className="text-xs text-gray-400 font-bold">No sub-categories yet.</span>}
                  {categoryMap[managingSubCategoryFor].map(sub => (
                    <div key={sub} className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 border border-gray-200">
                      {sub}
                      <button onClick={() => editSubCategory(sub)} className="text-blue-500 hover:text-blue-700"><Edit size={12}/></button>
                      <button onClick={() => deleteSubCategory(sub)} className="text-red-500 hover:text-red-700"><X size={14}/></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={newSubCatInput} onChange={e => setNewSubCatInput(e.target.value)} placeholder={`Add to ${managingSubCategoryFor}...`} className="flex-1 border-2 border-gray-200 p-2.5 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900 text-sm" />
                  <button onClick={addSubCategory} className="bg-gray-200 text-gray-800 px-4 rounded-xl hover:bg-gray-300 font-bold text-sm">Add</button>
                </div>
              </div>
            ) : (
              <p className="text-center text-xs font-bold text-gray-400 italic">Click on a category above to manage its sub-categories.</p>
            )}
          </div>
        </div>
      )}

      {/* ---------------- 🖨️ A4 PRINTABLE GST INVOICE LAYOUT (ONLY VISIBLE ON SCREEN IN MODAL, EXPANDS IN PRINT) ---------------- */}
      {isOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in print:static print:bg-white print:p-0 print:block">
          
          {/* Controls for Admin (Hidden in Print) */}
          <div className="absolute top-4 right-4 flex gap-3 print:hidden z-50">
            <button onClick={() => handlePushToQikink(selectedOrder)} className="bg-orange-500 text-white px-4 py-2 text-xs font-black rounded-xl uppercase flex items-center gap-2 shadow-md hover:bg-orange-600 transition-colors">
              <Package size={14} /> Push to Qikink
            </button>
            <button onClick={() => handleWhatsAppNotify(selectedOrder)} className="bg-[#25D366] text-white px-4 py-2 text-xs font-black rounded-xl uppercase flex items-center gap-2 shadow-md hover:bg-green-500 transition-colors">
              <MessageCircle size={14} /> WhatsApp
            </button>
            <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 text-xs font-black rounded-xl uppercase flex items-center gap-2 shadow-md hover:bg-blue-700 transition-colors">
              <Printer size={14} /> Print Bill
            </button>
            <button onClick={() => setIsOrderModalOpen(false)} className="bg-white text-gray-900 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Actual A4 Sheet Container */}
          <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-2xl relative print:shadow-none print:w-full print:m-0 mx-auto overflow-y-auto max-h-[90vh] print:max-h-none print:overflow-visible">
            
            {/* Header Box */}
            <div className="border-b-2 border-black p-8 text-center relative">
              <div className="absolute top-0 right-8 bg-black text-white px-4 py-1 rounded-b-lg font-black tracking-widest text-[10px]">
                GST TAX INVOICE
              </div>
              <h1 className="text-6xl font-black tracking-tighter mt-4" style={{ fontFamily: 'sans-serif' }}>TZ</h1>
              <h2 className="text-2xl font-black tracking-[0.5em] mt-2 mb-2">THREADZS</h2>
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Premium Fashion. Timeless Style.</p>
              
              <div className="flex justify-between items-center border-t border-gray-200 mt-6 pt-4 text-[9px] font-bold text-gray-600">
                <span className="flex items-center gap-1"><span className="text-black">GSTIN:</span> 33CYQPN5015G1ZD</span>
                <span className="flex items-center gap-1"><span className="text-black">Email:</span> Threadzsofficial@gmail.com</span>
                <span className="flex items-center gap-1"><span className="text-black">Web:</span> www.threadzs.com</span>
              </div>
            </div>

            {/* Meta Info & QR */}
            <div className="p-8 border-b-2 border-black flex justify-between items-center bg-gray-50/50 print:bg-white">
              <div className="space-y-2">
                <div className="grid grid-cols-[120px_1fr] text-xs font-bold text-gray-600">
                  <span className="flex justify-between pr-2 text-black">Invoice Number <span>:</span></span>
                  <span>INV-{new Date().getFullYear()}-{selectedOrder.id.slice(-4)}</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] text-xs font-bold text-gray-600">
                  <span className="flex justify-between pr-2 text-black">Invoice Date <span>:</span></span>
                  <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] text-xs font-bold text-gray-600">
                  <span className="flex justify-between pr-2 text-black">Order ID <span>:</span></span>
                  <span>{selectedOrder.id}</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] text-xs font-bold text-gray-600">
                  <span className="flex justify-between pr-2 text-black">Payment Method <span>:</span></span>
                  <span>Online Payment (Prepaid)</span>
                </div>
              </div>

              {/* Dummy QR Code representation */}
             
            </div>

            {/* Billing & Shipping Split */}
            <div className="flex border-b-2 border-black">
              {/* BILL TO */}
              <div className="flex-1 p-8 border-r-2 border-black relative">
                <div className="absolute top-0 left-0 bg-black text-white px-6 py-1 font-black text-[10px] tracking-widest rounded-br-lg">BILL TO</div>
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-[100px_1fr] text-xs font-bold text-gray-600">
                    <span className="flex justify-between pr-2 text-black">Customer Name <span>:</span></span>
                    <span className="font-black text-black">{selectedOrder.customer}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] text-xs font-bold text-gray-600">
                    <span className="flex justify-between pr-2 text-black">Phone Number <span>:</span></span>
                    <span>{selectedOrder.phone}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] text-xs font-bold text-gray-600">
                    <span className="flex justify-between pr-2 text-black">Email <span>:</span></span>
                    <span>{selectedOrder.email || "Not Provided"}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] text-xs font-bold text-gray-600 items-start">
                    <span className="flex justify-between pr-2 text-black mt-1">Billing Address <span>:</span></span>
                    <span className="leading-tight mt-1">{selectedOrder.address},<br/>{selectedOrder.city} - {selectedOrder.pincode},<br/>Tamil Nadu, India.</span>
                  </div>
                </div>
              </div>
              
              {/* SHIP TO */}
              <div className="flex-1 p-8 relative">
                <div className="absolute top-0 left-0 bg-black text-white px-6 py-1 font-black text-[10px] tracking-widest rounded-br-lg">SHIP TO</div>
                <div className="mt-4">
                  <div className="grid grid-cols-[110px_1fr] text-xs font-bold text-gray-600 items-start">
                    <span className="flex justify-between pr-2 text-black mt-1">Shipping Address <span>:</span></span>
                    <span className="leading-tight mt-1 text-black font-medium">{selectedOrder.address},<br/>{selectedOrder.city} - {selectedOrder.pincode},<br/>Tamil Nadu, India.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="px-8 pt-8">
              <table className="w-full text-left text-xs mb-8">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="py-2 px-3 font-bold uppercase tracking-wider w-[40%]">Product Name</th>
                    <th className="py-2 px-3 font-bold uppercase tracking-wider text-center">Size</th>
                    <th className="py-2 px-3 font-bold uppercase tracking-wider text-center">Color</th>
                    <th className="py-2 px-3 font-bold uppercase tracking-wider text-center">Quantity</th>
                    <th className="py-2 px-3 font-bold uppercase tracking-wider text-right">Unit Price</th>
                    <th className="py-2 px-3 font-bold uppercase tracking-wider text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="border-b-2 border-black">
                  {(Array.isArray(selectedOrder.items) ? selectedOrder.items : []).map((item, idx) => {
                    // Extract numeric value from item price (fallback to 0 if NaN)
                    const itemPriceNum = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
                    const itemQty = item.quantity || 1;
                    
                    // Backward calculation from total price to get pure base unit price before 5% GST
                    // Formula: Base Price = Total Price / 1.05
                    const baseUnitPrice = itemPriceNum / 1.05;
                    const itemRowTotal = baseUnitPrice * itemQty;

                    return (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="py-3 px-3 font-bold text-black">{item.name}</td>
                        <td className="py-3 px-3 text-center text-gray-700 font-bold">{item.size || '-'}</td>
                        <td className="py-3 px-3 text-center text-gray-700 font-bold">{item.color || item.selected_color || 'Standard'}</td>
                        <td className="py-3 px-3 text-center text-gray-700 font-bold">{itemQty}</td>
                        <td className="py-3 px-3 text-right text-gray-700 font-bold">₹{baseUnitPrice.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right font-black text-black">₹{itemRowTotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Calculations Area */}
              <div className="flex justify-between items-start mb-8">
                
                {/* Left side message */}
                <div className="flex gap-4 items-center w-1/2 p-4 border border-dashed border-gray-300 rounded-xl">
                  <ShoppingBag size={40} strokeWidth={1} className="text-gray-400" />
                  <div>
                    <h3 className="font-black text-sm text-black">Thank You for Shopping<br/>with THREADZS!</h3>
                    <p className="text-[9px] font-bold text-gray-500 mt-2 leading-tight">We truly appreciate your trust in us.<br/>Your style journey means the world to us.</p>
                  </div>
                </div>

                {/* Right side Math */}
                <div className="w-[40%] space-y-2 text-xs font-bold">
                  {(() => {
                    // Total Grand Bill value extraction
                    const grandTotal = parseFloat(String(selectedOrder.amount).replace(/[^0-9.]/g, '')) || 0;
                    
                    // Overall Base calculation
                    const subTotalBase = grandTotal / 1.05;
                    const totalGST = grandTotal - subTotalBase;
                    const halfGST = totalGST / 2;

                    return (
                      <>
                        <div className="flex justify-between text-gray-600 px-3"><span>Subtotal</span><span>₹{subTotalBase.toFixed(2)}</span></div>
                        <div className="flex justify-between text-gray-600 px-3"><span>CGST (2.5%)</span><span>₹{halfGST.toFixed(2)}</span></div>
                        <div className="flex justify-between text-gray-600 px-3 border-b border-gray-200 pb-2"><span>SGST (2.5%)</span><span>₹{halfGST.toFixed(2)}</span></div>
                        <div className="flex justify-between text-gray-800 px-3 pt-1"><span>Total GST (5%)</span><span>₹{totalGST.toFixed(2)}</span></div>
                        <div className="flex justify-between text-gray-800 px-3 pb-2"><span>Shipping Charges</span><span>₹0.00</span></div>
                        <div className="flex justify-between items-center bg-black text-white px-3 py-2 font-black text-sm uppercase tracking-widest mt-2">
                          <span>Grand Total</span>
                          <span>₹{grandTotal.toFixed(2)}</span>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>

            {/* Footer Area */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-6 p-8 border-t-2 border-black bg-gray-50/30 print:bg-white text-[9px] mt-auto">
              
              <div>
                <h4 className="font-black uppercase tracking-widest mb-2 flex items-center gap-1 text-black"><CheckCircle size={12}/> Return & Exchange Policy</h4>
                <p className="text-gray-600 font-bold leading-relaxed pr-4">
                  We offer easy returns & exchanges within 7 days of delivery. 
                  Items must be unused, unwashed, and returned with original tags and packaging.<br/><br/>
                  For more details, please visit our website: www.threadzs.com/returns
                </p>
              </div>

              <div>
                <h4 className="font-black uppercase tracking-widest mb-2 flex items-center gap-1 text-black"><MessageCircle size={12}/> Need Help?</h4>
                <p className="text-gray-500 font-bold mb-2">Our customer support team<br/>is here for you.</p>
                <div className="space-y-1 font-bold text-gray-800">
                  <p className="flex items-center gap-1"><Smartphone size={10}/> 9043241335</p>
                  <p className="flex items-center gap-1"><FileText size={10}/> Threadzsofficial@gmail.com</p>
                  <p className="flex items-center gap-1"><MonitorPlay size={10}/> Mon - Sat | 10:00 AM - 7:00 PM</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-end border-l border-gray-300 pl-6">
                <p className="font-black text-gray-400 uppercase tracking-widest mb-4">Authorized Signature</p>
                {/* Handwritten style font simulation */}
                <h2 className="text-2xl text-black -rotate-3 mb-2" style={{ fontFamily: "'Brush Script MT', cursive, signature" }}>Threadzs</h2>
                <div className="w-full border-t border-gray-400 pt-1 text-center font-bold text-gray-600 uppercase tracking-wider">
                  For THREADZS
                </div>
              </div>

            </div>
            
            {/* Absolute bottom black strip */}
            <div className="bg-black text-white text-center py-2 text-[9px] font-black tracking-[0.3em] uppercase w-full">
              THREADZS — Wear Beyond Ordinary
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;