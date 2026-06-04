import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, ShoppingCart, 
  Users, Settings, LogOut, Menu, X, TrendingUp, Package,
  Plus, Edit, Trash2, Search, XCircle, Eye, Truck, User, MapPin, FileText, Printer, UploadCloud, MessageCircle, AlertTriangle, MonitorPlay, Loader2 
} from 'lucide-react';

// --- Imported our Central Godown (Global State) & Supabase ---
import { useProducts } from '../context/ProductContext';
import { supabase } from '../supabaseClient'; 

// =========================================================================
// 🚀 CLOUDINARY CONFIGURATION (YOUR DETAILS)
// =========================================================================
const CLOUDINARY_CLOUD_NAME = "dzpasg4hh"; 
const CLOUDINARY_UPLOAD_PRESET = "threadzs_preset"; 
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isUploading, setIsUploading] = useState(false);

  // ================= 1. DYNAMIC ORDERS STATE (NOW FETCHED FROM SUPABASE) =================
  const [orders, setOrders] = useState([]);
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // ================= 2. DYNAMIC PRODUCTS & HERO STATE =================
  const [categories, setCategories] = useState(['Men', 'Women', 'Gen Z', 'Accessories']);
  const { products, setProducts, heroBanner, setHeroBanner } = useProducts();

  // ================= CRUD LOGIC FOR PRODUCTS =================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', category: 'Men', price: '', original_price: '', stock: '', images: [], description: '', sizes: []
  });
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const availableSizesList = ["XS", "S", "M", "L", "XL", "XXL"];

  // --- NEW: FETCH ORDERS FROM SUPABASE ---
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsFetchingOrders(true);
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsFetchingOrders(false);
      }
    };

    if (activeTab === 'dashboard' || activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);


  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSizeToggle = (size) => {
    setFormData((prevData) => {
      const currentSizes = prevData.sizes || [];
      if (currentSizes.includes(size)) {
        return { ...prevData, sizes: currentSizes.filter((s) => s !== size) };
      } else {
        return { ...prevData, sizes: [...currentSizes, size] };
      }
    });
  };

  // --- CLOUDINARY MULTIPLE IMAGE UPLOAD ---
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

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls]
      }));
    } catch (error) {
      alert("Cloudinary Upload Failed! Check your internet or config.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleAddProduct = () => {
    setEditingId(null);
    setFormData({ name: '', category: categories[0], price: '', original_price: '', stock: '', images: [], description: '', sizes: [] });
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    const productImages = product.images ? product.images : (product.image ? [product.image] : []);
    setFormData({ 
      ...product, 
      sizes: product.sizes || [], 
      images: productImages,
      original_price: product.original_price || '' 
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
    if (!formData.images || formData.images.length === 0) {
      alert("Please upload at least one product image!");
      return;
    }

    try {
      setIsUploading(true);

      const productData = {
        name: formData.name,
        category: formData.category,
        price: formData.price.toString(),
        original_price: formData.original_price ? formData.original_price.toString() : '',
        stock: parseInt(formData.stock),
        sizes: formData.sizes,
        description: formData.description,
        images: formData.images
      };

      if (editingId) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingId);
        if (error) throw error;
        setProducts(products.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
      } else {
        const { data, error } = await supabase.from('products').insert([productData]).select();
        if (error) throw error;
        if (data && data.length > 0) {
           setProducts([data[0], ...products]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error saving to database! Check console.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setFormData({ ...formData, category: newCategory });
      setNewCategory('');
      setIsAddingCategory(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      alert("Failed to update order status.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to permanently delete this order? This action will free up database storage.")) {
      try {
        const { error } = await supabase
          .from('orders')
          .delete()
          .eq('id', orderId);

        if (error) throw error;
        
        setOrders(orders.filter(o => o.id !== orderId));
        alert("Order deleted successfully!");
      } catch (error) {
        alert("Error deleting order from database.");
      }
    }
  };

  const handlePrint = () => window.print();

  const handleWhatsAppNotify = (order) => {
    const message = `Hi ${order.customer},%0A%0AThanks for choosing *THREADZS*! 👕%0AYour Order ${order.id} is currently: *${order.status}*.%0A%0AWe will keep you updated. Get ready for the drip! ✨`;
    window.open(`https://wa.me/91${order.phone}?text=${message}`, '_blank');
  };

  const handleHeroImageUpload = async (e) => {
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
      setHeroBanner({ ...heroBanner, image: uploadedImage.secure_url });
    } catch (error) {
      alert("Hero Image upload failed!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleHeroBannerChange = (e) => {
    setHeroBanner({ ...heroBanner, [e.target.name]: e.target.value });
  };

  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      const { error } = await supabase
        .from('hero_banner')
        .update({
          heading: heroBanner.heading,
          subtext: heroBanner.subtext,
          tagline: heroBanner.tagline,
          image: heroBanner.image
        })
        .eq('id', 1);

      if (error) throw error;
      alert("Hero Section Updated Successfully in Database! 🔥");
    } catch (error) {
      console.error(error);
      alert("Error saving hero banner to database.");
    } finally {
      setIsUploading(false);
    }
  };


  // ================= TAB CONTENT RENDERER =================
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
                      <td className="p-4 border-b border-gray-50"><span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">{p.category}</span></td>
                      
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

    return <div className="text-gray-500 font-medium text-center py-20">Module Under Development</div>;
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans print:h-auto print:block">
      
      {/* ================= SIDEBAR ================= */}
      <aside className={`bg-black text-white w-64 flex-shrink-0 transition-all duration-300 z-30 flex flex-col print:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute md:relative md:w-20 md:translate-x-0'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-800">
          <h2 className={`font-black text-xl tracking-widest text-red-500 overflow-hidden whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>THREADZS<span className="text-white text-sm block tracking-normal">ADMIN</span></h2>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
        </div>
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold w-full transition-colors ${activeTab === 'dashboard' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}><LayoutDashboard size={20} className="flex-shrink-0" /><span className={`whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>Dashboard</span></button>
          <button onClick={() => setActiveTab('products')} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold w-full transition-colors ${activeTab === 'products' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}><ShoppingBag size={20} className="flex-shrink-0" /><span className={`whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>Products</span></button>
          <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold w-full transition-colors ${activeTab === 'orders' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}><ShoppingCart size={20} className="flex-shrink-0" /><span className={`whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>Orders</span></button>
          <button onClick={() => setActiveTab('hero')} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold w-full transition-colors ${activeTab === 'hero' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}><MonitorPlay size={20} className="flex-shrink-0" /><span className={`whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>Hero Banner</span></button>
        </nav>
        <div className="p-4 border-t border-gray-800 flex-shrink-0"><button className="flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-gray-900 hover:text-red-300 rounded-xl font-bold w-full transition-colors overflow-hidden"><LogOut size={20} className="flex-shrink-0" /><span className={`whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>Logout</span></button></div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative print:h-auto print:block">
        {isSidebarOpen && <div className="absolute inset-0 bg-black/50 z-20 md:hidden print:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 flex-shrink-0 z-10 print:hidden">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600 hover:text-black transition-colors"><Menu size={28} /></button>
          <div className="flex items-center gap-4"><span className="font-bold text-gray-700 hidden sm:block">Admin Portal</span><div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center border-2 border-red-600"><span className="font-black text-red-600">A</span></div></div>
        </header>
        <div className={`flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 ${isOrderModalOpen ? 'print:hidden' : ''}`}>{renderContent()}</div>
      </main>

      {/* ================= ADD / EDIT PRODUCT MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in print:hidden">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-600 transition-colors p-1 bg-gray-100 rounded-full"><XCircle size={24} /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Product Images</label>
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
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
                  {!isAddingCategory ? (
                    <div className="flex gap-2"><select name="category" value={formData.category} onChange={handleInputChange} className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-bold text-gray-900 bg-white appearance-none">{categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}</select><button type="button" onClick={() => setIsAddingCategory(true)} className="bg-black text-white px-4 rounded-xl hover:bg-gray-800 flex items-center justify-center"><Plus size={20} /></button></div>
                  ) : (
                    <div className="flex gap-2"><input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New Category" autoFocus className="w-full border-2 border-red-200 bg-red-50 p-4 rounded-xl focus:outline-none focus:border-red-500 font-bold text-gray-900" /><button type="button" onClick={handleAddCategory} className="bg-green-600 text-white px-4 rounded-xl font-bold">Add</button><button type="button" onClick={() => setIsAddingCategory(false)} className="bg-gray-200 text-gray-600 px-4 rounded-xl"><X size={20}/></button></div>
                  )}
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

      {/* LIVE ORDER DETAILED VIEW MODAL */}
      {isOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in print:static print:bg-white print:p-0 print:block">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-100 print:shadow-none print:border-none print:max-h-none print:overflow-visible print:w-full print:max-w-full print:rounded-none">
            
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-3xl sticky top-0 print:static print:bg-white print:border-black print:rounded-none print:pb-4">
              <div>
                <h2 className="text-xl font-black uppercase tracking-wider text-black flex items-center gap-2"><FileText className="text-red-600 print:text-black" size={22} /> Delivery Packing Slip / Invoice</h2>
                <p className="text-xs font-bold text-gray-500 mt-0.5 print:text-black">Order ID: {selectedOrder.id} • Date: {selectedOrder.date}</p>
              </div>
              <button onClick={() => setIsOrderModalOpen(false)} className="text-gray-400 hover:text-red-600 p-1 bg-white shadow-sm rounded-full print:hidden"><XCircle size={24} /></button>
            </div>

            <div className="p-6 md:p-8 space-y-8 print:px-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 print:bg-white print:border-black print:rounded-none">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1 print:text-black"><User size={14} /> Deliver To (Customer)</h3>
                  <p className="font-black text-lg text-black">{selectedOrder.customer}</p>
                  <p className="text-sm font-medium text-black mt-1">📞 {selectedOrder.phone}</p>
                  <p className="text-sm font-bold text-black mt-2 leading-relaxed bg-white p-3 rounded-xl border border-gray-200 shadow-inner print:shadow-none print:border-none print:p-0">{selectedOrder.address}, <br/><span className="font-black text-black">{selectedOrder.city} - {selectedOrder.pincode}</span></p>
                </div>
                <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 print:border-black print:border-l print:pt-0 print:pl-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1 print:text-black"><MapPin size={14} /> Dispatch Origin (From)</h3>
                  <p className="text-sm font-bold text-black leading-relaxed"><span className="font-black text-lg">THREADZS Hub</span><br/>South Veli Street, Madurai - 625001<br/>Tamil Nadu, India.</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 print:text-black">Ordered Items Configuration</h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm print:shadow-none print:border-black print:rounded-none">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 font-bold uppercase text-xs tracking-wider text-gray-600 border-b border-gray-200 print:bg-white print:text-black print:border-black">
                      <tr><th className="p-4">Item Name / Designs</th><th className="p-4 text-center">Size</th><th className="p-4 text-center">Qty</th><th className="p-4 text-right">Price</th></tr>
                    </thead>
                    <tbody>
                      {(Array.isArray(selectedOrder.items) ? selectedOrder.items : []).map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-100 font-medium text-gray-800 print:border-black align-top">
                          <td className="p-4 text-black">
                            <div className="flex flex-col">
                              <span className="font-black text-base">{item.name}</span>
                              
                              {/* --- UPDATED: Dynamic Multi-Design Attachments Downloader Panel for Admin --- */}
                              {item.isCustom && (
                                <div className="mt-4 bg-gray-50 p-3.5 rounded-2xl border border-gray-200 max-w-lg print:border-black print:bg-white">
                                  <p className="text-[10px] font-black uppercase text-red-600 tracking-widest mb-3 print:text-black">🔥 Custom Print Files Attachment</p>
                                  <div className="flex flex-wrap gap-3">
                                    
                                    {/* Map Front independent placements */}
                                    {item.frontDesigns && Object.entries(item.frontDesigns).map(([placement, url]) => (
                                      url && (
                                        <div key={placement} className="flex flex-col items-center bg-white border border-gray-200 rounded-xl p-2 w-24 text-center shadow-sm print:shadow-none print:border-black">
                                          <div className="w-16 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
                                            <img src={url} alt={placement} className="w-full h-full object-contain" />
                                          </div>
                                          <span className="text-[9px] font-black uppercase tracking-wider text-gray-500 mt-2 truncate w-full">
                                            {placement === 'center' ? 'Center' : placement === 'leftChest' ? 'Left Chest' : placement === 'leftSleeve' ? 'L Sleeve' : 'R Sleeve'}
                                          </span>
                                          <a href={url} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline mt-1 print:hidden">Open Img</a>
                                        </div>
                                      )
                                    ))}

                                    {/* Map Back side attachment file */}
                                    {item.backDesign && (
                                      <div className="flex flex-col items-center bg-white border border-gray-200 rounded-xl p-2 w-24 text-center shadow-sm print:shadow-none print:border-black">
                                        <div className="w-16 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
                                          <img src={item.backDesign} alt="Back View" className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-wider text-gray-500 mt-2">Back View</span>
                                        <a href={item.backDesign} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline mt-1 print:hidden">Open Img</a>
                                      </div>
                                    )}

                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-center"><span className="bg-black text-white px-2.5 py-1 rounded-md text-xs font-bold print:border print:border-black print:bg-white print:text-black">{item.size}</span></td>
                          <td className="p-4 text-center font-black text-red-600 print:text-black">x{item.quantity || 1}</td>
                          <td className="p-4 text-right font-bold print:text-black">₹{item.price}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-black text-base text-gray-900 print:bg-white print:border-black print:border-t-2"><td colSpan="3" className="p-4 text-right uppercase tracking-wider text-sm text-gray-500 print:text-black">Grand Total:</td><td className="p-4 text-right text-red-600 print:text-black">{selectedOrder.amount}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-2"><span className="text-sm font-bold text-gray-500">Status:</span><span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{selectedOrder.status || 'Processing'}</span></div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                  <button onClick={() => handleWhatsAppNotify(selectedOrder)} className="bg-[#25D366] text-white px-5 py-3 text-xs font-black rounded-xl uppercase flex items-center gap-2"><MessageCircle size={16} /> WhatsApp</button>
                  <button onClick={handlePrint} className="bg-gray-900 text-white px-5 py-3 text-xs font-black rounded-xl uppercase flex items-center gap-2"><Printer size={16} /> Print</button>
                  <button onClick={() => setIsOrderModalOpen(false)} className="bg-white border-2 border-gray-200 text-gray-600 px-5 py-3 text-xs font-bold rounded-xl uppercase">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;