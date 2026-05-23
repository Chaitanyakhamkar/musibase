import React from 'react';
import { usePlayer } from '../PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import './GlobalPlayer.css';

const GlobalPlayer = () => {
  const { currentTrack, isPlaying, progress, togglePlay, seek } = usePlayer();

  if (!currentTrack) return null;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    seek(percentage);
  };

  const previewUrl = currentTrack.previewUrl || currentTrack.preview_url;

  return (
    <div className={`global-player ${currentTrack ? 'visible' : ''}`}>
      <div className="gp-left">
        <img 
          src={currentTrack.artworkUrl100?.replace('100x100', '150x150') || currentTrack.artwork_url || 'https://via.placeholder.com/150'} 
          alt="artwork" 
          className="gp-artwork" 
        />
        <div className="gp-info">
          <div className="gp-title">{currentTrack.trackName || currentTrack.track_name}</div>
          <div className="gp-artist">{currentTrack.artistName || currentTrack.artist_name}</div>
        </div>
        {isPlaying && (
          <div className="visualizer">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        )}
      </div>

      <div className="gp-center">
        <div className="gp-controls">
          <button className="gp-btn"><SkipBack size={20} /></button>
          <button className="gp-btn play-pause" onClick={togglePlay} disabled={!previewUrl}>
            {isPlaying ? <Pause size={20} fill="#000" /> : <Play size={20} fill="#000" style={{ marginLeft: '2px' }} />}
          </button>
          <button className="gp-btn"><SkipForward size={20} /></button>
        </div>
        <div className="gp-progress-container">
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>0:00</span>
          <div className="gp-progress-bar" onClick={handleSeek}>
            <div className="gp-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>0:30</span>
        </div>
      </div>

      <div className="gp-right">
        <button className="gp-btn"><Volume2 size={20} /></button>
      </div>
    </div>
  );
};

export default GlobalPlayer;
