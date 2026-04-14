import React from 'react';
import { Activity } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex items-center justify-between py-6 border-b border-white/5 max-w-7xl mx-auto w-full px-4 md:px-0">
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 shadow-inner group">
          <Activity className="w-6 h-6 text-green-400 relative z-10 transition-transform group-hover:scale-110" />
          <div className="absolute inset-2 rounded-xl bg-green-500/20 animate-live-pulse"></div>
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
            Sports<span className="text-green-500 non-italic">Pulse</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] -mt-1">Real-time Analytics</p>
        </div>
      </div>
      
      <div className="hidden md:flex items-center space-x-6">
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Updates</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
