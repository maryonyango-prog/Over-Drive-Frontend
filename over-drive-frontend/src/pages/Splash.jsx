import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Splash() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-blue-950 flex flex-col items-center justify-center px-6 relative">
      <div className={`flex flex-col items-center text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        {/* Transparent Flash Logo with Gradients */}
        <div className="mb-12 relative">
          <div className="relative w-80 h-80 mx-auto flex items-center justify-center">
            {/* Glow effect behind the logo */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 blur-3xl rounded-full"></div>
            {/* Flash SVG Logo */}
            <svg 
              viewBox="0 0 200 200" 
              className="w-full h-full drop-shadow-2xl"
              style={{ 
                filter: 'drop-shadow(0 0 40px rgba(34, 211, 238, 0.4)) drop-shadow(0 0 80px rgba(59, 130, 246, 0.2))'
              }}
            >
              <defs>
                <linearGradient id="flashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <polygon 
                points="110,10 30,110 85,110 70,190 150,80 100,80" 
                fill="url(#flashGradient)" 
                filter="url(#glow)"
                className="animate-pulse"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-2 tracking-tight text-white">
          <span className="text-cyan-400">Over</span>
          <span className="text-white">Drive</span>
        </h1>
        <p className="text-cyan-300 text-lg mb-2 font-medium">AI Vehicle Valuation Platform</p>
        <p className="text-gray-400 text-sm mb-12 max-w-md">Know your vehicle's true market value — instantly.</p>

        <button onClick={() => navigate("/login")} className="group relative px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
          Get Started
          <svg className="inline-block ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </button>

        <p className="mt-6 text-gray-400 text-sm">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-cyan-400 hover:text-cyan-300 font-medium transition">Sign in</button>
        </p>

      </div>

      <p className="absolute bottom-6 text-gray-400 text-xs">v1.0.0</p>

    </div>
  );
}

export default Splash;