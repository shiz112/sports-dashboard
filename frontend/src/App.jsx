import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import TabsNavigation from './components/TabsNavigation.jsx';
import StatusSubNav from './components/StatusSubNav.jsx';
import MatchGrid from './components/MatchGrid.jsx';
import StandingsTable from './components/StandingsTable.jsx';
import MatchDetailsModal from './components/MatchDetailsModal.jsx';
import { fetchSchedules, fetchStandingsData } from './api/sportsApi';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('football');
  const [matchStatus, setMatchStatus] = useState('upcoming');
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  
  const [liveData, setLiveData] = useState({
    matches: {
      football: { live: [], upcoming: [], finished: [] },
      cricket: { live: [], upcoming: [], finished: [] }
    },
    standings: null
  });
  
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const updateAllData = async () => {
      try {
        const [matches, standings] = await Promise.all([
          fetchSchedules(),
          fetchStandingsData()
        ]);
        
        setLiveData({ matches, standings });
        setIsLoaded(true);
      } catch (error) {
        console.error("Data synchronization error:", error);
      }
    };

    updateAllData();
    
    const matchesInterval = setInterval(async () => {
      const matches = await fetchSchedules();
      setLiveData(prev => ({ ...prev, matches }));
    }, 60000);

    const standingsInterval = setInterval(async () => {
      const standings = await fetchStandingsData();
      setLiveData(prev => ({ ...prev, standings }));
    }, 3600000);

    return () => {
      clearInterval(matchesInterval);
      clearInterval(standingsInterval);
    };
  }, []);

  const selectedMatch = selectedMatchId 
    ? [...liveData.matches.football.live, ...liveData.matches.football.upcoming, ...liveData.matches.football.finished, 
       ...liveData.matches.cricket.live, ...liveData.matches.cricket.upcoming, ...liveData.matches.cricket.finished].find(m => m.id === selectedMatchId)
    : null;

  return (
    <div className="min-h-screen text-slate-100 flex flex-col p-4 md:p-8 relative">
      <Header />
      
      <main className="max-w-7xl mx-auto w-full flex-grow mt-8">
        <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab !== 'standings' && (
          <StatusSubNav filter={matchStatus} setFilter={setMatchStatus} />
        )}

        <div key={activeTab} className="mt-12">
          {activeTab === 'standings' ? (
            <StandingsTable liveStandings={liveData.standings} isLoaded={isLoaded} />
          ) : (
            <MatchGrid 
              activeTab={activeTab} 
              filter={matchStatus} 
              liveData={liveData.matches} 
              isLoaded={isLoaded}
              onMatchSelect={(match) => setSelectedMatchId(match.id)}
            />
          )}
        </div>
      </main>

      {selectedMatch && (
        <MatchDetailsModal 
          match={selectedMatch} 
          onClose={() => setSelectedMatchId(null)} 
        />
      )}
    </div>
  );
}

export default App;
