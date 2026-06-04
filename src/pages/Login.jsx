const Login = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 min-h-[70vh]">
      <div className="border border-gray-200 p-8 rounded-3xl shadow-sm bg-white">
        <h1 className="text-3xl font-black text-center mb-8 uppercase tracking-widest">Login</h1>
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input type="email" required className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-black transition-colors" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input type="password" required className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-black transition-colors" placeholder="••••••••" />
          </div>
          <button type="button" className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-red-600 transition-colors rounded-xl mt-4">
            Sign In
          </button>
        </form>
        <div className="text-center mt-6">
          <a href="#" className="text-sm text-gray-500 hover:text-black font-medium">Forgot your password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;