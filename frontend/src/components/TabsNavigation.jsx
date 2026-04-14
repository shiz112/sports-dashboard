import React from 'react';

const TabsNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'football', label: 'Football' },
    { id: 'cricket', label: 'Cricket' },
    { id: 'standings', label: 'Standings' }
  ];

  return (
    <div className="flex p-1.5 glass rounded-2xl w-full max-w-md mx-auto relative border border-white/5 shadow-inner">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`relative z-10 flex-1 py-3 text-xs font-black uppercase tracking-[0.1em] transition-all duration-500 rounded-xl ${
            activeTab === tab.id
              ? 'text-white shadow-2xl bg-white/10'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl -z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabsNavigation;
