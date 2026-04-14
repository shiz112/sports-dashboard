import React from 'react';
import { Trophy, Clock, Zap } from 'lucide-react';

const MatchCard = ({ match, statusFilter, onClick }) => {
  const accentGradient = match.sport === 'football' 
    ? 'from-blue-600/20 to-blue-500/5 hover:border-blue-500/30' 
    : 'from-orange-600/20 to-orange-500/5 hover:border-orange-500/30';
  
  const scoreColor = match.sport === 'football' ? 'text-blue-400' : 'text-orange-400';
  const glowColor = match.sport === 'football' ? 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]';

  const isFinished = statusFilter === 'finished';
  const isUpcoming = statusFilter === 'upcoming';
  const isLive = statusFilter === 'live';

  return (
    <div 
      onClick={onClick}
      className={`glass-card group relative p-4 cursor-pointer transition-all duration-500 rounded-[1.5rem] border border-white/5 bg-gradient-to-br ${accentGradient} ${glowColor} overflow-hidden`}
    >

      <div className="absolute -right-2 -top-2 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700">
        {match.sport === 'football' 
          ? <Trophy size={80} strokeWidth={1} /> 
          : <Zap size={80} strokeWidth={1} />
        }
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
              {match.league || match.sport}
            </span>
            <div className="flex items-center space-x-2">
              {isLive && (
                <div className="flex items-center space-x-1 bg-green-500/10 px-1.5 py-0.5 rounded-full border border-green-500/20">
                  <span className="relative flex h-1 w-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1 w-1 bg-green-500"></span>
                  </span>
                  <span className="text-[8px] font-black text-green-500 uppercase tracking-tighter">Live</span>
                </div>
              )}
              <span className={`text-[9px] font-bold uppercase tracking-widest ${
                isLive ? 'text-green-500' : isUpcoming ? 'text-blue-400' : 'text-slate-500'
              }`}>
                {isUpcoming && match.startTime ? `${match.startDate} • ${match.startTime}` : match.status}
              </span>
            </div>
          </div>
          
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
            {match.sport === 'football' ? <Trophy size={12} /> : <Zap size={12} />}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center group/row">
            <div className="flex items-center space-x-3 truncate pr-4">
              <img src={match.homeLogo} alt="" className="w-5 h-5 object-contain" onError={(e) => e.target.style.display='none'} />
              <span className="text-base font-bold text-white/90 group-hover/row:text-white transition-colors truncate">{match.home}</span>
            </div>
            {!isUpcoming && (
              <span className={`text-2xl font-black tabular-nums ${scoreColor}`}>{match.homeScore}</span>
            )}
          </div>
          
          <div className="flex justify-between items-center group/row">
            <div className="flex items-center space-x-3 truncate pr-4">
              <img src={match.awayLogo} alt="" className="w-5 h-5 object-contain" onError={(e) => e.target.style.display='none'} />
              <span className="text-base font-bold text-white/90 group-hover/row:text-white transition-colors truncate">{match.away}</span>
            </div>
            {!isUpcoming && (
              <span className={`text-2xl font-black tabular-nums ${scoreColor}`}>{match.awayScore}</span>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
          <div className="flex items-center space-x-1">
             <Clock size={10} className="text-slate-500" />
             <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest whitespace-nowrap">
               {match.startTime ? `${match.startDate} • ${match.startTime}` : 'Scheduled'} • Data Ready
             </span>
          </div>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <span className="text-[9px] text-white font-black uppercase tracking-tighter">View</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
