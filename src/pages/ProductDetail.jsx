import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Check, Plus, Minus, Copy, MessageCircle, Star, ChevronDown, ChevronUp, Share2
} from 'lucide-react'; 
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { supabase } from '../supabaseClient'; 

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const { products } = useProducts();

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(null);
  
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState('details');

  const [mainImage, setMainImage] = useState('');
  const [fade, setFade] = useState(false); 

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', parseInt(id))
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const formattedReviews = (data || []).map(r => ({
          ...r,
          date: new Date(r.created_at).toLocaleDateString('en-GB')
        }));
        setReviews(formattedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [id]);

  const product = products.find(p => p.id === parseInt(id));

  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) {
        const initialColor = product.colors[0];
        setSelectedColor(initialColor);
        const initialImg = (initialColor.images && initialColor.images.length > 0) 
            ? initialColor.images[0] 
            : (product.image || product.images?.[0]);
        setMainImage(initialImg);
      } else {
        const initialImg = (product.images && product.images.length > 0) ? product.images[0] : product.image;
        setMainImage(initialImg);
      }

      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product]);

  let galleryImages = [];
  if (product) {
    if (selectedColor && selectedColor.images && selectedColor.images.length > 0) {
      galleryImages = selectedColor.images; 
    } else if (product.images && product.images.length > 0) {
      galleryImages = product.images; 
    } else {
      galleryImages = [
        product.image, 
        "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&q=80", 
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80", 
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"  
      ].filter(Boolean);
    }
  }

  const availableSizes = product && product.sizes && product.sizes.length > 0 
    ? product.sizes 
    : ['XS', 'S', 'M', 'L', 'XL', '2XL'];

  const changeImage = (img) => {
    if (mainImage === img) return;
    setFade(true); 
    setTimeout(() => {
      setMainImage(img);
      setFade(false); 
    }, 200);
  };

  const handleColorSwitch = (colorVariant) => {
    if (selectedColor?.name === colorVariant.name) return;
    setFade(true);
    setTimeout(() => {
      setSelectedColor(colorVariant);
      const newMain = (colorVariant.images && colorVariant.images.length > 0) 
          ? colorVariant.images[0] 
          : mainImage;
      setMainImage(newMain);
      setFade(false);
    }, 200);
  };

  if (!product) return <div className="text-center py-32 text-2xl font-black uppercase tracking-widest text-gray-400">Product not found in Drop</div>;

  const handleQuantity = (type) => {
    if (type === 'minus' && quantity > 1) setQuantity(quantity - 1);
    if (type === 'plus') setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    const productToAdd = { ...product, selected_color: selectedColor?.name };
    for(let i=0; i<quantity; i++) {
      addToCart(productToAdd, selectedSize);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    const buyNowItem = { ...product, size: selectedSize, color: selectedColor?.name, quantity: quantity, cartId: 'buynow-' + Date.now() };
    navigate('/checkout', { state: { directItem: buyNowItem } });
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewerName || !reviewText) return;

    try {
      const newReviewData = {
        product_id: parseInt(id),
        name: reviewerName,
        rating: rating,
        comment: reviewText
      };

      const { data, error } = await supabase
        .from('reviews')
        .insert([newReviewData])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const newlyAddedReview = {
          ...data[0],
          date: new Date(data[0].created_at).toLocaleDateString('en-GB')
        };
        setReviews([newlyAddedReview, ...reviews]);
        setShowReviewForm(false);
        setReviewerName('');
        setReviewText('');
        setRating(5);
      }
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Failed to submit review. Try again!");
    }
  };

  // ================= FIXED: PROPER LINK FORMAT SHARE LOGIC =================
  const shareUrl = window.location.href;
  const shareTitle = `Hey! Check out this ${product.name} at THREADZS! 🔥`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'THREADZS Drop',
          text: shareTitle,
          url: shareUrl, // The OS automatically formats this as a rich link
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    // 🔥 \n\n separates the text from the link so WhatsApp creates a preview card!
    const whatsappText = `${shareTitle}\n\n${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`, '_blank');
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleTwitterShare = () => {
    const twitterText = `${shareTitle}\n\n`;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(twitterText)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-white select-none">
      
      <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
        
        {/* ================= LEFT: AMAZON STYLE IMAGE GALLERY ================= */}
        <div className="flex-[1.2] flex flex-col-reverse md:flex-row gap-4 h-fit lg:sticky lg:top-24 mb-6 lg:mb-0 relative z-10">
          
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible scrollbar-hide py-2 md:py-0">
            {galleryImages.map((img, idx) => (
              <button 
                key={idx}
                onMouseEnter={() => changeImage(img)}
                onClick={() => changeImage(img)}      
                onTouchStart={() => changeImage(img)} 
                className={`w-20 h-24 md:w-24 md:h-32 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  mainImage === img ? 'border-black shadow-md scale-105 opacity-100' : 'border-gray-200 hover:border-gray-400 opacity-60'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="flex-1 bg-[#f5f5f5] rounded-[2rem] overflow-hidden aspect-[4/5] md:aspect-auto md:h-[600px] lg:h-[700px] relative shadow-inner border border-gray-100">
            <img 
              src={mainImage} 
              alt={product.name} 
              className={`w-full h-full object-cover transition-opacity duration-200 ${fade ? 'opacity-0' : 'opacity-100'}`} 
            />
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold shadow-sm text-gray-600 border border-gray-200 hidden md:block">
              Hover over thumbnails
            </div>
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold shadow-sm text-gray-600 border border-gray-200 md:hidden">
              Tap thumbnails
            </div>
          </div>
          
        </div>

        {/* ================= RIGHT: PRODUCT DETAILS ================= */}
        <div className="flex-1 h-fit">
          
          <nav className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-1.5">
            <Link to="/" className="hover:text-red-600 transition-colors border-b-2 border-transparent hover:border-red-600 pb-0.5">Home</Link> 
            <span className="text-gray-300">/</span> 
            <span className="text-gray-400">Clothing</span> 
            <span className="text-gray-300">/</span> 
            <span className="text-black truncate max-w-[200px]">{product.name}</span>
          </nav>

          <h1 className="text-2xl md:text-4xl font-black mb-4 tracking-tighter uppercase leading-tight text-gray-900">{product.name}</h1>
          
          <div className="inline-flex items-center gap-4 mb-8 bg-gray-50 border border-gray-100 px-5 py-3 rounded-2xl shadow-sm">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-0.5">Drop Price</span>
              <span className="text-3xl font-black text-black tracking-tight">₹{product.price}</span>
            </div>
            
            {product.original_price && (
              <div className="flex flex-col border-l border-gray-200 pl-4 h-10 justify-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">M.R.P</span>
                <span className="text-base text-gray-400 line-through font-bold decoration-red-500/80 decoration-2">₹{product.original_price}</span>
              </div>
            )}

            {product.original_price && !isNaN(product.original_price - product.price) && (
              <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xl ml-2 shadow-md shadow-red-100 animate-pulse">
                {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
              </span>
            )}
          </div>

          <div className="mb-8">
            <h3 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
              Color: <span className="text-black">{selectedColor ? selectedColor.name : 'Standard Base'}</span>
            </h3>
            
            {product.colors && product.colors.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color, idx) => {
                  const isActive = selectedColor?.name === color.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleColorSwitch(color)}
                      className={`w-10 h-10 rounded-full transition-all duration-300 relative flex items-center justify-center
                        ${isActive ? 'ring-2 ring-offset-2 ring-black scale-110' : 'ring-1 ring-gray-200 hover:ring-gray-400 opacity-80'}
                      `}
                      style={{ backgroundColor: color.hex || '#000000' }}
                      title={color.name}
                    >
                       <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none"></div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-start">
                <div className="w-10 h-10 rounded-full border border-gray-200 cursor-pointer overflow-hidden shadow-sm ring-2 ring-offset-2 ring-black">
                  <img src={mainImage} className="w-full h-full object-cover" alt="Color preview" />
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-black text-xs uppercase tracking-widest text-gray-500">Select Size:</h3>
              <button className="text-xs underline font-black text-gray-400 hover:text-black uppercase tracking-wider">SIZE CHART</button>
            </div>
            <div className="flex gap-3 flex-wrap">
              {availableSizes.map(size => (
                <button 
                  key={size} 
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xs font-black transition-all ${
                    selectedSize === size ? 'border-black bg-black text-white shadow-md scale-105' : 'border-gray-200 hover:border-gray-400 text-gray-800 bg-white'
                  }`}
                >{size}</button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-3">Quantity:</h3>
            <div className="inline-flex border-2 border-gray-200 h-12 rounded-xl overflow-hidden bg-white shadow-sm">
              <button onClick={() => handleQuantity('minus')} className="w-12 flex items-center justify-center bg-gray-50 text-black hover:bg-gray-100 transition-colors">
                <Minus size={16} />
              </button>
              <div className="w-14 flex items-center justify-center font-black text-base border-x-2 border-gray-200 bg-white">
                {quantity}
              </div>
              <button onClick={() => handleQuantity('plus')} className="w-12 flex items-center justify-center bg-gray-50 text-black hover:bg-gray-100 transition-colors">
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button 
              onClick={handleAddToCart} 
              disabled={isAdded}
              className={`flex-1 py-4 font-black tracking-widest uppercase rounded-2xl transition-all duration-300 flex justify-center items-center gap-2 shadow-lg text-sm ${
                isAdded ? 'bg-green-600 text-white shadow-green-200' : 'bg-red-600 text-white hover:bg-red-700 shadow-red-200 hover:-translate-y-0.5'
              }`}
            >
              {isAdded ? <><Check size={18} /> Added to Cart</> : 'Add to Cart'}
            </button>
            <button onClick={handleBuyNow} className="flex-1 bg-black text-white py-4 font-black tracking-widest uppercase rounded-2xl hover:bg-gray-950 transition-all shadow-lg hover:-translate-y-0.5 flex justify-center items-center text-sm">
              Buy Now
            </button>
          </div>

          <div className="text-center mb-8 border-b border-gray-100 pb-8">
            <p className="text-xs text-gray-400 mb-4 font-black uppercase tracking-widest">100% Pre-paid Orders • Free Shipping India</p>
            <div className="flex justify-center items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-wider flex-wrap">
              <span className="px-2.5 py-1 border border-gray-200 rounded-md">GPay</span>
              <span className="px-2.5 py-1 border border-gray-200 rounded-md">PhonePe</span>
              <span className="px-2.5 py-1 border border-gray-200 rounded-md">Paytm</span>
              <span className="px-2.5 py-1 border border-gray-200 rounded-md">VISA</span>
              <span className="px-2.5 py-1 border border-gray-200 rounded-md">RuPay</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-10">
            <h3 className="font-black text-xs uppercase tracking-widest text-gray-500">Share:</h3>
            <div className="flex gap-4 items-center">
              
              <button onClick={handleNativeShare} className="bg-gray-100 hover:bg-red-50 text-gray-800 hover:text-red-600 p-2 rounded-full transition-colors flex items-center justify-center shadow-sm border border-gray-200" title="Share via Mobile Options">
                <Share2 size={16} />
              </button>

              <MessageCircle onClick={handleWhatsAppShare} size={22} className="cursor-pointer text-gray-400 hover:text-[#25D366] transition-colors" title="Share on WhatsApp" />
              
              <svg onClick={handleFacebookShare} className="cursor-pointer text-gray-400 hover:text-[#1877F2] transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" title="Share on Facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              
              <svg onClick={handleTwitterShare} className="cursor-pointer text-gray-400 hover:text-black transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" title="Share on X"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
              
              <div className="relative flex items-center">
                <Copy onClick={handleCopyLink} size={20} className={`cursor-pointer transition-colors ${copied ? 'text-green-500' : 'text-gray-400 hover:text-black'}`} title="Copy Link" />
                {copied && <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap z-10 animate-in slide-in-from-bottom-1">Copied!</span>}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100">
            <div className="border-b border-gray-100">
              <button onClick={() => toggleAccordion('details')} className="w-full py-4 flex justify-between items-center font-black uppercase tracking-widest text-left text-xs text-gray-900">
                Product Details
                {activeAccordion === 'details' ? <ChevronUp size={18} /> : <Plus size={18} />}
              </button>
              {activeAccordion === 'details' && (
                <div className="pb-5 text-gray-500 text-sm leading-relaxed font-medium">
                  {product.description} <br/><br/>
                  <strong className="text-black uppercase text-xs font-black tracking-wider">Category:</strong> {product.category}<br/>
                  <strong className="text-black uppercase text-xs font-black tracking-wider">Stock Status:</strong> {product.stock > 0 ? `${product.stock} Units Available` : 'Out of Stock'}<br/>
                  Designed exclusively by THREADZS.
                </div>
              )}
            </div>
            <div className="border-b border-gray-100">
              <button onClick={() => toggleAccordion('shipping')} className="w-full py-4 flex justify-between items-center font-black uppercase tracking-widest text-left text-xs text-gray-900">
                Shipping & Returns
                {activeAccordion === 'shipping' ? <ChevronUp size={18} /> : <Plus size={18} />}
              </button>
              {activeAccordion === 'shipping' && (
                <div className="pb-5 text-gray-500 text-sm leading-relaxed font-medium">
                  We provide free shipping on all orders. Deliveries usually take 3-5 business days. 
                  Returns are accepted within 7 days of delivery for unworn items with tags intact.
                </div>
              )}
            </div>
            <div className="border-b border-gray-100">
              <button onClick={() => toggleAccordion('care')} className="w-full py-4 flex justify-between items-center font-black uppercase tracking-widest text-left text-xs text-gray-900">
                Care Instructions
                {activeAccordion === 'care' ? <ChevronUp size={18} /> : <Plus size={18} />}
              </button>
              {activeAccordion === 'care' && (
                <div className="pb-5 text-gray-500 text-sm leading-relaxed font-medium">
                  Machine wash cold with like colors. Do not bleach. Tumble dry low. Iron inside out if needed. Do not iron directly on print.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM: CUSTOMER REVIEWS DYNAMIC SECTION ================= */}
      <div className="mt-20 pt-16 border-t border-gray-100 max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-black mb-8 text-center uppercase tracking-widest text-gray-900">Customer Reviews</h2>
        
        <div className="flex flex-col items-center mb-12">
          <div className="flex justify-center items-center gap-1 mb-2 text-yellow-400">
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} size={26} fill="currentColor" />
            ))}
          </div>
          <p className="text-gray-500 mb-6 font-black text-sm uppercase tracking-wider">{reviews.length} Verified Review{reviews.length !== 1 && 's'}</p>
          
          {!showReviewForm && (
            <button 
              onClick={() => setShowReviewForm(true)}
              className="bg-black text-white px-10 py-4 font-black uppercase tracking-widest hover:bg-red-600 hover:shadow-lg hover:shadow-red-100 transition-all duration-300 rounded-xl text-xs"
            >
              Write a Review
            </button>
          )}
        </div>

        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 md:p-8 rounded-3xl mb-12 border border-gray-200 shadow-sm transition-all animate-in fade-in slide-in-from-top-4">
            <h3 className="font-black text-lg mb-6 uppercase tracking-wider border-b border-gray-200 pb-4">Leave a Review</h3>
            
            <div className="mb-6">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={30} 
                    className={`cursor-pointer transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                    fill={rating >= star ? "currentColor" : "none"}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Your Name</label>
              <input 
                type="text" 
                required 
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-bold text-sm" 
                placeholder="Enter your name" 
              />
            </div>

            <div className="mb-8">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Your Review</label>
              <textarea 
                required 
                rows="4" 
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black font-medium text-sm" 
                placeholder="How was the fit and fabric quality?"
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button type="submit" className="flex-1 bg-red-600 text-white px-8 py-4 font-black uppercase tracking-widest hover:bg-red-700 transition-colors rounded-xl text-xs">
                Submit Review
              </button>
              <button type="button" onClick={() => setShowReviewForm(false)} className="flex-1 bg-white border-2 border-gray-200 text-gray-500 px-8 py-4 font-black uppercase tracking-widest hover:border-black hover:text-black transition-colors rounded-xl text-xs">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-8">
          {reviews.length === 0 ? (
            <p className="text-center text-gray-400 font-bold uppercase tracking-wider text-xs bg-gray-50 py-10 rounded-2xl border border-dashed border-gray-200">No reviews yet. Be the first to drop a review! 👕</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-8 animate-in fade-in">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-black text-base uppercase text-gray-900 tracking-tight">{review.name}</h4>
                    <div className="flex text-yellow-400 gap-1 mt-1.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          size={14} 
                          fill={review.rating >= star ? "currentColor" : "none"} 
                          className={review.rating >= star ? "" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-black tracking-wider">{review.date}</span>
                </div>
                <p className="text-gray-700 mt-3 leading-relaxed text-sm font-medium">{review.comment}</p>
              </div>
            ))
          )}
        </div>
        
      </div>

    </div>
  );
};

export default ProductDetail;