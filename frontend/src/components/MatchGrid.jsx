import React from 'react';
import MatchCard from './MatchCard.jsx';

const MatchGrid = ({ activeTab, filter, liveData, isLoaded, onMatchSelect }) => {
  const categoryData = liveData[activeTab] || { live: [], upcoming: [], finished: [] };
  const matches = categoryData[filter] || [];

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-slate-400">
        <span className="relative flex h-8 w-8 mb-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-600 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-8 w-8 bg-slate-700"></span>
        </span>
        <p className="text-lg">Synchronizing data...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-slate-400 glass p-10 max-w-lg mx-auto rounded-3xl border border-white/5">
        <p className="text-2xl font-black text-white mb-2 uppercase tracking-wide">No {filter} Matches</p>
        <p className="text-base text-center mb-4">There are currently no {filter} matches in this sport for today's schedule.</p>
        <div className="h-0.5 w-12 bg-white/10 my-1"></div>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4`}>
      {matches.map(match => (
        <MatchCard key={match.id} match={match} statusFilter={filter} onClick={() => onMatchSelect(match)} />
      ))}
    </div>
  );
};

export default MatchGrid;
