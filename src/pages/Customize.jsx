import { useState } from 'react';
import { UploadCloud, Check, Plus, Minus, Info, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Customize = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // State Management
  const [selectedColor, setSelectedColor] = useState('White');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  
  // --- Multiple independent states for Front Placements ---
  const [frontDesigns, setFrontDesigns] = useState({
    center: null,
    leftChest: null,
    rightSleeve: null,
    leftSleeve: null
  });
  const [backPreviewUrl, setBackPreviewUrl] = useState(null);
  
  const [viewSide, setViewSide] = useState('front'); // Toggle between 'front' and 'back' view
  const [activePlacement, setActivePlacement] = useState('center'); // Which front area is being edited

  // Real Hanger Mockup Images
  const tshirts = {
    White: {
      front: "/download (1).jpg", 
      back: "/660762576620121640.jpg" 
    },
    Black: {
      front: "/download (2).jpg",
      back: "/790311434617334136.jpg" 
    }
  };

  const availableSizes = ['S', 'M', 'L', 'XL', '2XL'];

  const placementOptions = [
    { id: 'center', label: 'Front Center' },
    { id: 'leftChest', label: 'Left Chest' },
    { id: 'rightSleeve', label: 'Right Sleeve' },
    { id: 'leftSleeve', label: 'Left Sleeve' }
  ];

  // Absolute positioning coordinates for real mockup mapping
  const placementClasses = {
    center: "top-[32%] left-1/2 -translate-x-1/2 w-[40%] h-[40%]",
    leftChest: "top-[30%] left-[64%] -translate-x-1/2 w-[12%] h-[12%]",
    leftSleeve: "top-[43%] left-[82%] -translate-x-1/2 w-[11%] h-[14%] rotate-[12deg]",
    rightSleeve: "top-[43%] left-[18%] -translate-x-1/2 w-[11%] h-[14%] -rotate-[12deg]",
    back: "top-[32%] left-1/2 -translate-x-1/2 w-[40%] h-[40%]"
  };

  // Upload Handler (Maps image to exact active placement)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      if (viewSide === 'front') {
        setFrontDesigns(prev => ({ ...prev, [activePlacement]: localUrl }));
      } else {
        setBackPreviewUrl(localUrl);
      }
    }
  };

  // Remove specific uploaded image
  const handleRemoveDesign = (e) => {
    const file = e.target.files[0];
    e.preventDefault(); 
    e.stopPropagation();
    if (viewSide === 'front') {
      setFrontDesigns(prev => ({ ...prev, [activePlacement]: null }));
    } else {
      setBackPreviewUrl(null);
    }
  };

  const handleQuantity = (type) => {
    if (type === 'minus' && quantity > 1) setQuantity(quantity - 1);
    if (type === 'plus') setQuantity(quantity + 1);
  };

  // --- UPDATED: WhatsApp Integration Logic ---
  const handleWhatsAppOrder = () => {
    const hasFrontDesign = Object.values(frontDesigns).some(url => url !== null);
    
    // Optional: Keep the alert to ensure they at least try the mockup, 
    // but it won't block them if they just want to text you directly.
    if (!hasFrontDesign && !backPreviewUrl) {
      alert("Please upload at least one design (Front or Back) for preview! 👕");
      return;
    }

    // 1. Enter your Mam's business WhatsApp number here (with country code, no + sign)
    const phoneNumber = "919043241335"; 

    // 2. Format the WhatsApp Message exact to your requirements
    const message = `Hello! I want to order a Custom T-Shirt.%0A%0A*Order Details:*%0A- Color: ${selectedColor}%0A- Size: ${selectedSize}%0A- Quantity: ${quantity}%0A%0APlease attach your design images here.`;

    // 3. Create the WhatsApp API URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // UI Loading state
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank'); 
    }, 1000);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full bg-white">
      
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-gray-900 mb-3">Create Your Own Drip</h1>
        <p className="text-gray-500 font-medium max-w-xl mx-auto">Upload your favorite designs or logos. Mix and match placements on our premium oversized fabrics.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 items-start">
        
        {/* ================= LEFT: LIVE REALISTIC MOCKUP PREVIEW ================= */}
        <div className="flex-[1.2] w-full lg:sticky lg:top-24">
          <div className="relative w-full aspect-[4/5] bg-[#f5f5f5] rounded-[2rem] overflow-hidden shadow-inner border border-gray-100 flex items-center justify-center transition-all">
            
            {/* Front/Back View Image Toggle */}
            <div className="absolute top-4 right-4 flex bg-white/90 backdrop-blur-md rounded-xl p-1 shadow-sm z-40 border border-gray-200">
              <button 
                onClick={() => setViewSide('front')} 
                className={`px-4 py-1.5 text-xs font-black uppercase rounded-lg transition-colors ${viewSide === 'front' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                Front View
              </button>
              <button 
                onClick={() => setViewSide('back')} 
                className={`px-4 py-1.5 text-xs font-black uppercase rounded-lg transition-colors ${viewSide === 'back' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                Back View
              </button>
            </div>

            {/* Real Hanger T-Shirt Mockups */}
            <img 
              src={tshirts[selectedColor][viewSide]} 
              key={`${selectedColor}-${viewSide}`} 
              alt={`${viewSide} of T-Shirt`} 
              className="w-full h-full object-cover transition-opacity duration-500 animate-in fade-in mix-blend-multiply" 
            />

            {/* Dynamic Multi-Print Area Overlay Matrix */}
            <div className="absolute inset-0 z-30 pointer-events-none">
              
              {viewSide === 'front' ? (
                <>
                  {/* Render ALL uploaded front designs simultaneously */}
                  {Object.entries(frontDesigns).map(([placement, url]) => {
                    if (!url) return null;
                    return (
                      <div key={placement} className={`absolute flex items-center justify-center transition-all duration-500 ease-in-out ${placementClasses[placement]}`}>
                        <img 
                          src={url} 
                          alt={`${placement} Design`} 
                          className={`max-w-full max-h-full object-contain drop-shadow-md animate-in zoom-in fade-in duration-300 ${selectedColor === 'White' ? 'mix-blend-multiply opacity-90' : 'opacity-95'}`} 
                        />
                      </div>
                    );
                  })}
                  
                  {/* Render dotted border guide ONLY for the currently active empty placement */}
                  {!frontDesigns[activePlacement] && (
                    <div className={`absolute flex items-center justify-center transition-all duration-500 ease-in-out border-2 border-dashed border-gray-400/50 rounded-xl bg-white/5 backdrop-blur-[1px] ${placementClasses[activePlacement]}`}>
                      <span className="text-gray-500 font-bold text-[8px] md:text-[10px] uppercase tracking-wider text-center px-1 drop-shadow-sm leading-tight">
                        {placementOptions.find(p => p.id === activePlacement)?.label}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Render Back Design */}
                  {backPreviewUrl ? (
                    <div className={`absolute flex items-center justify-center transition-all duration-500 ease-in-out ${placementClasses.back}`}>
                      <img 
                        src={backPreviewUrl} 
                        alt="Back Design" 
                        className={`max-w-full max-h-full object-contain drop-shadow-md animate-in zoom-in fade-in duration-300 ${selectedColor === 'White' ? 'mix-blend-multiply opacity-90' : 'opacity-95'}`} 
                      />
                    </div>
                  ) : (
                    <div className={`absolute flex items-center justify-center transition-all duration-500 ease-in-out border-2 border-dashed border-gray-400/50 rounded-xl bg-white/5 backdrop-blur-[1px] ${placementClasses.back}`}>
                      <span className="text-gray-500 font-bold text-xs uppercase tracking-wider text-center px-4 drop-shadow-sm leading-tight">Back View</span>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
          <div className="flex items-start gap-2 mt-4 text-xs font-bold text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <Info size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p>Preview is approximate. You can add multiple designs! Select a placement area on the right and upload.</p>
          </div>
        </div>

        {/* ================= RIGHT: CUSTOMIZATION CONTROLS ================= */}
        <div className="flex-1 w-full bg-gray-50 p-6 md:p-8 rounded-[2rem] border border-gray-100">
          
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-gray-900">Custom T-Shirt</h2>
              <p className="text-sm font-bold text-gray-500 mt-1">Premium 100% Cotton Base</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-red-600">₹399</p>
              <p className="text-xs font-black uppercase tracking-widest text-green-600 mt-1">+ Free Shipping</p>
            </div>
          </div>

          {/* Advanced Multi-Upload Dashboard */}
          <div className="mb-8 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-sm uppercase tracking-wider">Step 1: Upload Designs</h3>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button onClick={() => setViewSide('front')} className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-colors ${viewSide === 'front' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-800'}`}>Front</button>
                <button onClick={() => setViewSide('back')} className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-colors ${viewSide === 'back' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-800'}`}>Back</button>
              </div>
            </div>

            {viewSide === 'front' && (
              <div className="mb-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {placementOptions.map((option) => {
                    const hasDesign = frontDesigns[option.id] !== null;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setActivePlacement(option.id)}
                        className={`py-2 px-1 text-[10px] font-black uppercase tracking-wider rounded-lg border-2 transition-all duration-300 relative ${
                          activePlacement === option.id 
                            ? 'border-black bg-black text-white shadow-md scale-[1.02]' 
                            : hasDesign ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {option.label}
                        {hasDesign && activePlacement !== option.id && <Check size={12} className="absolute top-1 right-1" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Dynamic Master Upload Box */}
            {(() => {
              const currentImageUrl = viewSide === 'front' ? frontDesigns[activePlacement] : backPreviewUrl;
              const currentLabel = viewSide === 'front' ? placementOptions.find(p => p.id === activePlacement)?.label : 'Back View';
              
              return (
                <label className={`w-full flex flex-col items-center justify-center py-8 px-2 bg-gray-50 hover:bg-gray-100 cursor-pointer rounded-xl transition-all border-2 relative ${currentImageUrl ? 'border-green-500' : 'border-dashed border-gray-300'}`}>
                  {currentImageUrl ? (
                    <div className="flex flex-col items-center text-green-600">
                      <Check size={32} className="mb-2" />
                      <span className="font-black text-sm uppercase tracking-widest">{currentLabel} Added</span>
                      <span className="text-[10px] text-gray-500 mt-2 uppercase underline">Click to Change Image</span>
                      
                      {/* Trash Button to Remove Image */}
                      <button 
                        onClick={handleRemoveDesign} 
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-2 bg-white rounded-md shadow-sm border border-red-100 transition-colors z-50"
                        title="Remove Design"
                      >
                         <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <UploadCloud size={32} className="text-gray-400 mb-3" />
                      <span className="font-bold text-sm text-gray-700 text-center">Upload for {currentLabel}</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              );
            })()}

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 text-center">PNG, JPG or JPEG • Add multiple designs to the front!</p>
          </div>

          {/* Step 2: Choose T-Shirt Color */}
          <div className="mb-8">
            <h3 className="font-black mb-3 text-sm uppercase tracking-wider">Step 2: Base Color</h3>
            <div className="flex gap-4">
              {Object.keys(tshirts).map(color => (
                <button 
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-14 h-14 rounded-full border-4 transition-all flex items-center justify-center ${selectedColor === color ? 'border-red-600 scale-110 shadow-lg' : 'border-transparent shadow-sm'}`}
                  style={{ backgroundColor: color === 'White' ? '#f5f5f5' : '#1a1a1a' }}
                >
                  {selectedColor === color && <Check size={20} className={color === 'White' ? 'text-black' : 'text-white'} />}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Choose Size */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-black text-sm uppercase tracking-wider">Step 3: Size</h3>
              <button className="text-xs underline font-bold text-gray-500 hover:text-black">SIZE CHART</button>
            </div>
            <div className="flex gap-3 flex-wrap">
              {availableSizes.map(size => (
                <button 
                  key={size} 
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-sm font-black transition-all ${
                    selectedSize === size ? 'border-black bg-black text-white shadow-md scale-105' : 'border-gray-200 hover:border-black text-gray-800 bg-white'
                  }`}
                >{size}</button>
              ))}
            </div>
          </div>

          {/* Step 4: Quantity */}
          <div className="mb-8">
            <h3 className="font-black mb-3 text-sm uppercase tracking-wider">Quantity</h3>
            <div className="inline-flex border-2 border-gray-200 h-14 rounded-xl overflow-hidden bg-white">
              <button onClick={() => handleQuantity('minus')} className="w-14 flex items-center justify-center text-black hover:bg-gray-100 transition-colors"><Minus size={18} /></button>
              <div className="w-16 flex items-center justify-center font-black text-lg border-x-2 border-gray-200">{quantity}</div>
              <button onClick={() => handleQuantity('plus')} className="w-14 flex items-center justify-center text-black hover:bg-gray-100 transition-colors"><Plus size={18} /></button>
            </div>
          </div>

          {/* UPDATED: Order via WhatsApp Button */}
          <button 
            onClick={handleWhatsAppOrder} 
            disabled={isAdded}
            className={`w-full py-5 font-black tracking-widest uppercase rounded-2xl transition-all duration-300 flex justify-center items-center gap-2 shadow-lg ${
              isAdded ? 'bg-green-500 text-white shadow-green-200' : 'bg-[#25D366] text-white hover:bg-[#128C7E] shadow-green-200 hover:-translate-y-1'
            }`}
          >
            {isAdded ? <><Check size={20} /> Redirecting...</> : 'Order via WhatsApp'}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Customize;