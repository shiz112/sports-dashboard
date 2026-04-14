import React from 'react';

const StatusSubNav = ({ filter, setFilter }) => {
  const options = [
    { id: 'live', label: 'Live Now', color: 'text-green-500', dot: 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]' },
    { id: 'upcoming', label: 'Upcoming', color: 'text-blue-400', dot: 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]' },
    { id: 'finished', label: 'Finished', color: 'text-slate-400', dot: 'bg-slate-500' }
  ];

  return (
    <div className="flex justify-center mt-6">
      <div className="inline-flex glass rounded-full p-1.5 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-orange-500/5"></div>
        
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setFilter(opt.id)}
            className={`relative z-10 flex items-center space-x-2.5 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition-all duration-500 ${
              filter === opt.id
                ? 'bg-white/10 text-white shadow-lg border border-white/10'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`}></span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusSubNav;
