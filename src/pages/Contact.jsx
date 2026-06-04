import { Mail, MessageSquare, ShieldCheck, Clock } from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. Get the values from the form fields
    const name = e.target.customerName.value;
    const phone = e.target.customerPhone.value;
    const email = e.target.customerEmail.value;
    const message = e.target.customerMessage.value;

    // 2. Format the message for WhatsApp (using * for bold text)
    const whatsappMessage = `Hello Mams Official!\n\n*New Customer Inquiry:*\n*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email}\n*Message:* ${message}`;
    
    // 3. Create the WhatsApp API link with your number
    const whatsappUrl = `https://wa.me/919043241335?text=${encodeURIComponent(whatsappMessage)}`;
    
    // 4. Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');

    // 5. Keep your original alert
    alert("Thank you Maddy bro! Message sent successfully. Our team will contact you shortly.");
    
    // Optional: clear the form after submitting
    e.target.reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full min-h-[75vh]">
      <h1 className="text-4xl font-black text-center mb-4 uppercase tracking-widest text-gray-900">Get In Touch</h1>
      <p className="text-center text-gray-500 max-w-md mx-auto mb-16 font-medium">Have questions about your pre-orders or size configurations? Reach out to us!</p>

      <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">
        
        {/* Left Side: Contact Information Cards */}
        <div className="flex-1 space-y-6">
          
          {/* WhatsApp Card */}
          <a 
            href="https://wa.me/919043241335" 
            target="_blank" 
            rel="noreferrer"
            className="block p-8 bg-gray-50 border border-gray-100 rounded-[2rem] hover:border-green-200 hover:shadow-xl hover:shadow-green-50/50 transition-all duration-300 group"
          >
            <div className="flex items-start gap-5">
              <div className="bg-green-100 text-green-600 p-4 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                <MessageSquare size={28} />
              </div>
              <div>
                <h3 className="font-black text-xl text-gray-900 uppercase tracking-wider mb-1">WhatsApp Chat</h3>
                <p className="text-gray-600 font-bold text-lg mb-3">+91 90432 41335</p>
                <span className="text-xs text-green-600 font-bold uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-100">Click to Chat Now</span>
              </div>
            </div>
          </a>

          {/* Email Card */}
          <a 
            href="mailto:mamsofficial2026@gmail.com"
            className="block p-8 bg-gray-50 border border-gray-100 rounded-[2rem] hover:border-red-200 hover:shadow-xl hover:shadow-red-50/50 transition-all duration-300 group"
          >
            <div className="flex items-start gap-5">
              <div className="bg-red-100 text-red-600 p-4 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="font-black text-xl text-gray-900 uppercase tracking-wider mb-1">Official Email</h3>
                <p className="text-gray-600 font-bold text-base md:text-lg mb-3 break-all">mamsofficial2026@gmail.com</p>
                <span className="text-xs text-red-600 font-bold uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-100">Click to Send Mail</span>
              </div>
            </div>
          </a>

          {/* Timings Support */}
          <div className="p-8 bg-black text-white rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 text-white/5 pointer-events-none">
              <Clock size={150} />
            </div>
            <h3 className="font-black text-xl uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock size={20} className="text-red-500" /> Support Hours
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed font-medium">
              Monday to Saturday: <span className="text-white font-bold">10:00 AM – 8:00 PM</span> <br/>
              Our online pre-order processing works 24/7 securely.
            </p>
          </div>

        </div>

        {/* Right Side: Message Form */}
        <div className="flex-[1.3] bg-white border border-gray-200 p-8 md:p-10 rounded-[2.5rem] shadow-sm">
          <h2 className="text-2xl font-black mb-6 uppercase tracking-wider border-b pb-4 flex items-center gap-2">
            Send a Message <ShieldCheck className="text-green-600" size={24} />
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Your Name</label>
                {/* Added name="customerName" */}
                <input name="customerName" type="text" required className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black transition-colors" placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Phone Number</label>
                {/* Added name="customerPhone" */}
                <input name="customerPhone" type="tel" required className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black transition-colors" placeholder="Enter phone number" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
              {/* Added name="customerEmail" */}
              <input name="customerEmail" type="email" required className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black transition-colors" placeholder="youremail@example.com" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Message</label>
              {/* Added name="customerMessage" */}
              <textarea name="customerMessage" required rows="4" className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-black transition-colors" placeholder="Type your message or pre-order queries here..."></textarea>
            </div>

            <button type="submit" className="w-full bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-red-600 hover:shadow-xl hover:shadow-red-200 transition-all duration-300 rounded-xl">
              Submit Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;