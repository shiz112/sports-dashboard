import React, { useState } from 'react';
import { Activity, Shield } from 'lucide-react';

const StandingsTable = ({ liveStandings, isLoaded }) => {
  const [activeLeague, setActiveLeague] = useState('pl');

  if (!isLoaded || !liveStandings || !liveStandings[activeLeague]) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-slate-500">
        <div className="relative w-12 h-12 mb-6">
           <div className="absolute inset-0 border-2 border-slate-800 rounded-full"></div>
           <div className="absolute inset-0 border-2 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">Synchronizing Standings...</p>
      </div>
    );
  }

  const leagueData = liveStandings[activeLeague];
  const currentStandings = leagueData.standings || [];
  const currentTitle = leagueData.name;
  const isCricket = leagueData.sport === 'cricket';

  return (
    <div className="space-y-10">
      <div className="flex overflow-x-auto p-1.5 space-x-3 scrollbar-none pb-4">
        {Object.keys(liveStandings).map(key => (
          <button
            key={key}
            onClick={() => setActiveLeague(key)}
            className={`whitespace-nowrap px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex-shrink-0 border ${
              activeLeague === key 
                ? 'bg-white/10 border-white/20 text-white shadow-2xl' 
                : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'
            }`}
          >
            {liveStandings[key].name}
          </button>
        ))}
      </div>

      <div className="glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-blue-600/5 via-transparent to-transparent flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">{currentTitle}</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
              Season 2025/26 • League Table
            </p>
          </div>
          
          <div className="flex items-center space-x-3 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
            <Activity size={14} className="text-green-500" />
            <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Live Sync</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {currentStandings.length === 0 ? (
            <div className="p-20 text-center">
              <Shield size={48} className="mx-auto text-slate-800 mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Awaiting data fetch...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-900/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.25em]">
                  <th className="p-6 text-center w-16">Pos</th>
                  <th className="p-6">Team</th>
                  <th className="p-6 text-center w-16">P</th>
                  <th className="p-6 text-center w-16">W</th>
                  {!isCricket && <th className="p-6 text-center w-16">D</th>}
                  <th className="p-6 text-center w-16">L</th>
                  {isCricket ? (
                    <th className="p-6 text-center w-32">NRR</th>
                  ) : (
                    <th className="p-6 text-center w-48">Form</th>
                  )}
                  <th className="p-6 text-center w-24 text-white">Pts</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {currentStandings.map((row, index) => {
                  let qualColor = '';
                  if (activeLeague === 'ucl') {
                    if (index < 2) qualColor = 'bg-blue-500';
                    else if (index === 2) qualColor = 'bg-orange-500';
                  } else if (!isCricket) {
                    if (index < 4) qualColor = 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]';
                    else if (index === 4) qualColor = 'bg-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]';
                  } else {
                    if (index < 4) qualColor = 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]';
                  }

                  return (
                    <tr 
                      key={row.team} 
                      className="border-b border-white/5 transition-all duration-300 hover:bg-white/[0.03] group"
                    >
                      <td className="p-6 font-black text-center text-slate-400 relative">
                        {qualColor && <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-3/5 rounded-r-full ${qualColor}`}></div>}
                        <span className="group-hover:text-white transition-colors">{row.pos}</span>
                      </td>
                      <td className="p-6">
                        <span className="text-lg font-bold text-white tracking-tight group-hover:translate-x-1 inline-block transition-transform">{row.team}</span>
                      </td>
                      <td className="p-6 text-center text-slate-400 font-bold tabular-nums">{row.p}</td>
                      <td className="p-6 text-center text-slate-400 font-bold tabular-nums">{row.w}</td>
                      {!isCricket && <td className="p-6 text-center text-slate-400 font-bold tabular-nums">{row.d}</td>}
                      <td className="p-6 text-center text-slate-400 font-bold tabular-nums">{row.l}</td>
                      <td className="p-6 text-center">
                        {isCricket ? (
                          <span className={`font-bold tabular-nums ${parseFloat(row.nrr) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {row.nrr > 0 ? `+${row.nrr}` : row.nrr}
                          </span>
                        ) : (
                          <div className="flex items-center justify-center space-x-1.5">
                            {row.form.map((f, i) => (
                              <span key={i} className={`flex items-center justify-center w-7 h-7 rounded-lg text-[10px] font-black ${
                                f === 'W' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                f === 'L' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                'bg-slate-500/10 text-slate-500 border border-slate-500/10'
                              }`}>
                                {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        <span className="text-2xl font-black text-white tabular-nums">{row.pts}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StandingsTable;
