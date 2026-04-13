import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Music, Disc, Loader } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const [posters, setPosters] = useState([]);
  
  React.useEffect(() => {
    const fetchPosters = async () => {
      let uniquePosters = [];
      let coverSet = new Set();
      
      try {
        const popularArtists = ['Arijit Singh', 'Diljit Dosanjh', 'Shreya Ghoshal', 'Badshah', 'Sidhu Moose Wala', 'A. R. Rahman', 'Khasa Aala Chahar'];
        for (const artist of popularArtists) {
           const res = await fetch(`https://theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(artist)}`);
           const data = await res.json();
           if (data.artists && data.artists[0]?.strArtistThumb) {
             uniquePosters.push(data.artists[0].strArtistThumb);
             coverSet.add(data.artists[0].strArtistThumb);
           }
        }
      } catch (e) {
        console.error("AudioDB fetch issue", e);
      }
      
      try {
        const res = await fetch('https://itunes.apple.com/search?term=bollywood+hits&country=in&entity=song&limit=150');
        const data = await res.json();
        if (data.results) {
          for (const t of data.results) {
            const url = t.artworkUrl100?.replace('100x100', '300x300');
            if (url && !coverSet.has(url)) {
              coverSet.add(url);
              uniquePosters.push(url);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
      
      // Limit to 45 perfectly unique posters
      setPosters(uniquePosters.slice(0, 45));
    };
    
    fetchPosters();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      // Using iTunes Search API for general music data
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=12`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const msToMinutes = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  };

  return (
    <div className="home-page">
      <div className="bg-glow"></div>
      
      <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        {posters.length > 0 && (
          <div className="marquee-wrapper">
             <div className="marquee-track">
               {[...posters, ...posters, ...posters].map((url, i) => (
                 <img key={i} src={url} className="marquee-poster" alt="" />
               ))}
             </div>
             <div className="marquee-track track-reverse">
               {[...posters, ...posters, ...posters].reverse().map((url, i) => (
                 <img key={i} src={url} className="marquee-poster" alt="" />
               ))}
             </div>
          </div>
        )}
        <div className="container hero-container" style={{ position: 'relative', zIndex: 10 }}>
          <h1 className="hero-title">
            Discover Every Detail <br />
            <span className="text-gradient-primary">About Your Favorite Music</span>
          </h1>
          <p className="hero-subtitle">
            Search for any song to instantly explore its origin, duration, label, movie details, and complete lyrics.
          </p>

          <form onSubmit={handleSearch} className="search-form glass-panel">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search for a song, artist, or movie..." 
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <div className="loader"></div> : 'Search'}
            </button>
          </form>
        </div>
      </section>

      {hasSearched && (
        <section className="results-section">
          <div className="container">
            <h2 className="section-title">Search Results</h2>
            <div className="results-grid">
              {loading ? (
                <div className="loading-state">
                  <div className="loader" style={{ width: '40px', height: '40px' }}></div>
                  <p>Searching worldwide databases...</p>
                </div>
              ) : results.length > 0 ? (
                results.map((track) => (
                  <div 
                    key={track.trackId} 
                    className="track-card glass-panel"
                    onClick={() => navigate(`/song/${track.trackId}`, { state: { track } })}
                  >
                    <div className="track-art">
                      <img src={track.artworkUrl100?.replace('100x100', '300x300')} alt={track.trackName} />
                      <div className="track-play-overlay">
                        <Music className="overlay-icon" />
                      </div>
                    </div>
                    <div className="track-info">
                      <h3 className="track-title">{track.trackName}</h3>
                      <p className="track-artist">{track.artistName}</p>
                      
                      <div className="track-meta">
                        <span className="meta-item">
                          <Disc size={14} />
                          {track.collectionName || 'Unknown Album'}
                        </span>
                        <span className="meta-duration">
                          {msToMinutes(track.trackTimeMillis)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results glass-panel">
                  <Music size={40} className="no-results-icon" />
                  <h3>No songs found</h3>
                  <p>Try searching with different keywords.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
