import axios from 'axios';

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const API_HOST = 'sofascore.p.rapidapi.com';

const rapidApiHeaders = {
  'x-rapidapi-key': RAPIDAPI_KEY,
  'x-rapidapi-host': API_HOST
};

const tournamentMap = {
  pl: { id: 17, season: 76986, name: 'Premier League' },
  laliga: { id: 8, season: 77559, name: 'LaLiga' },
  bundesliga: { id: 35, season: 77333, name: 'Bundesliga' },
  seriea: { id: 23, season: 76457, name: 'Serie A' },
  ligue1: { id: 34, season: 77356, name: 'Ligue 1' },
  ucl: { id: 7, season: 76953, name: 'Champions League' },
  ipl: { id: 11165, season: 91185, name: 'IPL', sport: 'cricket' },
  psl: { id: 11170, season: 91151, name: 'PSL', sport: 'cricket' }
};

const formatApiMatches = (events) => {
  if (!events || !Array.isArray(events)) return { live: [], upcoming: [], finished: [] };
  
  const live = [];
  const upcoming = [];
  const finished = [];

  events.forEach(event => {
    const tName = event.tournament?.name || 'League';
    const cName = event.tournament?.category?.name || '';
    const outputLeague = tName.includes('Indian Premier League') || cName.includes('IPL') ? 'IPL' : tName;

    const obj = {
      id: event.id,
      home: event.homeTeam?.name || 'Home',
      away: event.awayTeam?.name || 'Away',
      homeLogo: `https://api.sofascore.app/api/v1/team/${event.homeTeam?.id}/image`,
      awayLogo: `https://api.sofascore.app/api/v1/team/${event.awayTeam?.id}/image`,
      homeScore: event.homeScore?.display && /[^\d]/.test(event.homeScore?.display) ? event.homeScore.display : (event.homeScore?.current ?? 0),
      awayScore: event.awayScore?.display && /[^\d]/.test(event.awayScore?.display) ? event.awayScore.display : (event.awayScore?.current ?? 0),
      status: event.status?.description || 'Unknown',
      startTime: event.startTimestamp ? new Date(event.startTimestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : null,
      startDate: event.startTimestamp ? new Date(event.startTimestamp * 1000).toLocaleDateString([], { month: 'short', day: '2-digit' }) : null,
      sport: event.tournament?.category?.sport?.name?.toLowerCase() || 'unknown',
      league: outputLeague
    };

    const type = event.status?.type || 'notstarted';
    if (type === 'inprogress') live.push(obj);
    else if (type === 'finished') finished.push(obj);
    else upcoming.push(obj);
  });

  return { live, upcoming, finished };
};

export const fetchSchedules = async () => {
  const today = new Date().toISOString().split('T')[0];
  const results = {
    football: { live: [], upcoming: [], finished: [] },
    cricket: { live: [], upcoming: [], finished: [] }
  };

  try {
    const fbRes = await axios.get(`https://api.sofascore.com/api/v1/sport/football/scheduled-events/${today}`);
    if (fbRes.data?.events) {
      results.football = formatApiMatches(fbRes.data.events);
    }
  } catch (e) {
    console.error("Football Schedule Fetch Error:", e.message);
  }

  try {
    const crkRes = await axios.get(`https://api.sofascore.com/api/v1/sport/cricket/scheduled-events/${today}`);
    if (crkRes.data?.events) {
      results.cricket = formatApiMatches(crkRes.data.events);
    }
  } catch (e) {
    console.error("Cricket Schedule Fetch Error:", e.message);
  }

  return results;
};

export const fetchStandingsData = async () => {
  const standingsCache = {};
  
  for (const [key, mapping] of Object.entries(tournamentMap)) {
    try {
      const res = await axios.get(`https://${API_HOST}/tournaments/get-standings?tournamentId=${mapping.id}&seasonId=${mapping.season}`, { headers: rapidApiHeaders });
      const tableRows = res.data?.standings?.[0]?.rows || [];
      
      const formatted = tableRows.map(row => ({
        pos: row.position,
        team: row.team?.name,
        p: row.matches,
        w: row.wins,
        d: row.draws || 0,
        l: row.losses,
        pts: row.points,
        nrr: row.netRunRate,
        form: (row.form || '').split('').filter(char => ['W','L','D'].includes(char)).slice(-5) || ['-']
      }));
      
      standingsCache[key] = {
        name: mapping.name,
        sport: mapping.sport || 'football',
        standings: formatted
      };
    } catch (e) {
      console.error(`Standings Error for ${key}:`, e.message);
    }
  }
  
  return standingsCache;
};

export const fetchMatchDetails = async (eventId) => {
  try {
    const results = await Promise.allSettled([
      axios.get(`https://${API_HOST}/events/get-statistics?eventId=${eventId}`, { headers: rapidApiHeaders }),
      axios.get(`https://${API_HOST}/events/get-incidents?eventId=${eventId}`, { headers: rapidApiHeaders }),
      axios.get(`https://${API_HOST}/events/get-h2h?eventId=${eventId}`, { headers: rapidApiHeaders })
    ]);

    const stats = results[0].status === 'fulfilled' ? results[0].value.data?.statistics : [];
    const incidents = results[1].status === 'fulfilled' ? results[1].value.data?.incidents : [];
    const h2h = results[2].status === 'fulfilled' ? results[2].value.data : null;

    return {
      statistics: stats || [],
      incidents: incidents || [],
      h2h: h2h
    };
  } catch (e) {
    console.error(`Match Details Error for ${eventId}:`, e.message);
    throw e;
  }
};
