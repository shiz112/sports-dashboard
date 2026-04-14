import React, { useEffect, useState } from 'react';
import { Trophy, Clock, X, ChevronRight, Activity, TrendingUp } from 'lucide-react';
import { fetchMatchDetails } from '../api/sportsApi';

const MatchDetailsModal = ({ match, onClose }) => {
  const [data, setData] = useState({ statistics: [], incidents: [], h2h: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetails = async () => {
    try {
      const details = await fetchMatchDetails(match.id);
      setData(details);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching match data:", err);
      setError("Failed to sync match data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    fetchDetails();
    
    let interval;
    if (match.status.includes('\'') || match.status.toLowerCase().includes('live')) {
      interval = setInterval(fetchDetails, 30000);
    }

    return () => {
      document.body.style.overflow = 'unset';
      if (interval) clearInterval(interval);
    };
  }, [match.id]);

  const accentColor = match.sport === 'football' ? 'text-blue-400' : 'text-orange-400';
  const accentBg = match.sport === 'football' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-orange-500/10 border-orange-500/20';

  const isUpcoming = match.status.includes('Today') || match.status.includes('Tomorrow') || match.status.toLowerCase().includes('not started');

  const mainStats = data.statistics?.[0]?.groups?.find(g => g.groupName === 'Basic') || 
                    data.statistics?.[0]?.groups?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl max-h-[90vh] glass rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
        
        <div className={`p-8 border-b border-white/5 relative overflow-hidden bg-gradient-to-br ${match.sport === 'football' ? 'from-blue-600/10' : 'from-orange-600/10'} to-transparent`}>
          <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-all hover:rotate-90">
            <X size={24} />
          </button>

          <div className="flex flex-col items-center">
            <div className={`flex items-center space-x-2 mb-6 px-4 py-1 rounded-full border ${accentBg}`}>
              <Activity size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{match.league || match.sport} • {isUpcoming ? 'Pre-Match Analysis' : 'Live Feed'}</span>
            </div>

            <div className="flex items-center justify-between w-full max-w-2xl px-8">
              <div className="flex-1 text-right">
                <h2 className="text-3xl font-black text-white leading-tight">{match.home}</h2>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 block">Home Team</span>
              </div>

              <div className="flex flex-col items-center px-10">
                <div className="flex items-center space-x-6">
                  {isUpcoming ? (
                    <span className="text-6xl font-black text-slate-800 tracking-tighter">VS</span>
                  ) : (
                    <>
                      <span className="text-6xl font-black tabular-nums text-white drop-shadow-2xl">{match.homeScore}</span>
                      <div className="flex flex-col items-center">
                        <div className="w-1 h-12 bg-white/10 rounded-full animate-pulse transition-all duration-1000"></div>
                      </div>
                      <span className="text-6xl font-black tabular-nums text-white drop-shadow-2xl">{match.awayScore}</span>
                    </>
                  )}
                </div>
                <div className={`mt-4 px-3 py-1 rounded-lg ${isUpcoming ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-green-500/10 border-green-500/20 text-green-500'}`}>
                  <span className="text-[11px] font-black uppercase tracking-tighter">{match.status}</span>
                </div>
              </div>

              <div className="flex-1 text-left">
                <h2 className="text-3xl font-black text-white leading-tight">{match.away}</h2>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 block">Away Team</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-10 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-6">
              <div className="relative w-16 h-16">
                 <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-t-green-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              
              <div className="lg:col-span-3 space-y-10">
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                      <TrendingUp size={16} className={accentColor} />
                      {isUpcoming ? 'Head To Head' : 'Match Analytics'}
                    </h3>
                  </div>

                  {isUpcoming && data.h2h ? (
                    <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] space-y-8">
                      <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-500">
                        <span>{match.home} Wins</span>
                        <span>Draws</span>
                        <span>{match.away} Wins</span>
                      </div>
                      <div className="h-4 w-full flex rounded-full overflow-hidden bg-slate-800 shadow-inner">
                        <div className="bg-blue-500" style={{ width: `${(data.h2h.homeWins / (data.h2h.homeWins + data.h2h.awayWins + data.h2h.draws)) * 100}%` }}></div>
                        <div className="bg-slate-600" style={{ width: `${(data.h2h.draws / (data.h2h.homeWins + data.h2h.awayWins + data.h2h.draws)) * 100}%` }}></div>
                        <div className="bg-orange-500" style={{ width: `${(data.h2h.awayWins / (data.h2h.homeWins + data.h2h.awayWins + data.h2h.draws)) * 100}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center tabular-nums">
                        <span className="text-2xl font-black text-blue-400">{data.h2h.homeWins}</span>
                        <span className="text-2xl font-black text-slate-400">{data.h2h.draws}</span>
                        <span className="text-2xl font-black text-orange-400">{data.h2h.awayWins}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 text-center font-bold uppercase tracking-widest pt-4 border-t border-white/5">
                        Historical Record ({data.h2h.homeWins + data.h2h.awayWins + data.h2h.draws} matches)
                      </p>
                    </div>
                  ) : mainStats ? (
                    <div className="space-y-6">
                      {mainStats.statisticsItems.map((stat, idx) => (
                        <div key={idx} className="group">
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.name}</span>
                            <div className="flex space-x-4">
                              <span className="text-sm font-black text-white">{stat.home}</span>
                              <span className="text-sm font-black text-slate-500">/</span>
                              <span className="text-sm font-black text-white">{stat.away}</span>
                            </div>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800/50 rounded-full flex p-[1px] overflow-hidden">
                            <div className={`h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000`} style={{ width: `${stat.homeValue}%` }}></div>
                            <div className="flex-grow"></div>
                            <div className={`h-full bg-gradient-to-l from-orange-500 to-orange-400 rounded-full transition-all duration-1000`} style={{ width: `${stat.awayValue}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                       <p className="text-slate-600 font-bold uppercase text-[10px] tracking-widest">
                         {isUpcoming ? 'Detailed analytics available at match start' : 'Standby for Match Data...'}
                       </p>
                    </div>
                  )}
                </section>
              </div>

              <div className="lg:col-span-2 space-y-10">
                <section>
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                    <Clock size={16} className="text-green-500" />
                    Important Events
                  </h3>

                  <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
                    {data.incidents?.length > 0 ? (
                      data.incidents.slice().reverse().map((incident, idx) => (
                        <div key={idx} className="relative pl-10 flex items-start group">
                          <div className={`absolute left-0 w-6 h-6 rounded-lg ${incident.incidentClass === 'goal' ? 'bg-green-500' : incident.incidentClass === 'card' ? 'bg-yellow-500' : 'bg-slate-800'} border border-white/10 flex items-center justify-center z-10 shadow-lg group-hover:scale-110 transition-transform`}>
                            {incident.incidentClass === 'goal' ? <Trophy size={10} className="text-white" /> : <ChevronRight size={10} className="text-white" />}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-black text-white leading-none">{incident.playerName || incident.text}</span>
                              <span className="text-[10px] font-black text-slate-600 bg-white/5 px-2 rounded-full tabular-nums">{incident.time}'</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                              {incident.incidentType === 'goal' ? `Goal by ${incident.playerName}` : incident.incidentType}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2rem]">
                        <p className="text-slate-600 font-bold uppercase text-[10px] tracking-widest">No match events recorded</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetailsModal;
