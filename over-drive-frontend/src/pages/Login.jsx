function Login() {
  return (
    <div className="min-h-screen bg-[#EEF2F5] flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold">
          <span className="text-cyan-400">Over </span>
          <span className="text-cyan-400">Drive</span>
        </h1>

        <p className="mt-2 text-gray-700">
          AI Vehicle Valuation Platform
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white/40 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-white/30">

        <h2 className="text-3xl font-bold text-black mb-2">
          Welcome Back
        </h2>

        <p className="text-gray-800 mb-8">
          Sign in to access your dashboard
        </p>

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">
            Email Address
          </label>

          <input
            type="email"
            placeholder="you@example.com"
            className="w-full p-4 rounded-2xl border border-gray-300 bg-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">
            Password
          </label>

          <input
            type="password"
            placeholder="********"
            className="w-full p-4 rounded-2xl border border-gray-300 bg-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Options */}
        <div className="flex items-center justify-between mb-6 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Remember me
          </label>

          <a
            href="/"
            className="text-cyan-400 hover:text-cyan-500"
          >
            Forgot password?
          </a>
        </div>

        {/* Button */}
        <button className="w-full bg-cyan-400 hover:bg-cyan-500 transition-all duration-300 text-black font-semibold py-4 rounded-2xl text-lg">
          Sign In →
        </button>

        {/* Divider */}
        <div className="border-t border-gray-300 my-8"></div>

        {/* Signup */}
        <p className="text-center text-gray-800">
          Don’t have an account?
          <span className="text-cyan-400 font-semibold cursor-pointer">
            {" "}Sign up for Free
          </span>
        </p>

        {/* Continue */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>

          <span className="text-sm text-gray-600">
            Or continue with
          </span>

          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="border border-gray-300 rounded-2xl py-3 bg-white/50 hover:bg-white transition">
            Google
          </button>

          <button className="border border-gray-300 rounded-2xl py-3 bg-white/50 hover:bg-white transition">
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;