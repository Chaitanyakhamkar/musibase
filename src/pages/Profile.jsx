import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, ListMusic, Heart, PlayCircle } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({ display_name: '', avatar_url: '' });
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('playlists');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileData) {
          setProfile(profileData);
        } else {
          // Auto create profile if missing
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert({ id: user.id, display_name: user.email.split('@')[0], avatar_url: '' })
            .select()
            .single();
          if (newProfile) setProfile(newProfile);
        }

        // Fetch Playlists
        const { data: userPlaylists } = await supabase
          .from('playlists')
          .select('*, playlist_tracks(*)')
          .eq('user_id', user.id);
        if (userPlaylists) setPlaylists(userPlaylists);

        // Fetch Liked Songs
        const { data: userLiked } = await supabase
          .from('liked_songs')
          .select('*')
          .eq('user_id', user.id)
          .order('liked_at', { ascending: false });
        if (userLiked) setLikedSongs(userLiked);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await supabase.from('profiles').update({
        display_name: profile.display_name,
        avatar_url: profile.avatar_url
      }).eq('id', user.id);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="profile-page flex-center container">
        <div className="loader" style={{width: 40, height: 40}}></div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="bg-glow"></div>
      <div className="container profile-container">
        
        {/* Left Sidebar - Profile Overview */}
        <div className="profile-sidebar glass-panel">
          <div className="avatar-section">
            <div className="avatar-wrapper">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="avatar-img" />
              ) : (
                <User size={64} className="avatar-placeholder" />
              )}
            </div>
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="edit-profile-form">
                <input 
                  type="text" 
                  value={profile.display_name || ''} 
                  onChange={(e) => setProfile({...profile, display_name: e.target.value})}
                  placeholder="Display Name"
                  className="input-field"
                />
                <input 
                  type="text" 
                  value={profile.avatar_url || ''} 
                  onChange={(e) => setProfile({...profile, avatar_url: e.target.value})}
                  placeholder="Avatar Image URL (http://...)"
                  className="input-field"
                />
                <div style={{display: 'flex', gap: '8px', marginTop: '8px'}}>
                  <button type="submit" className="btn btn-primary btn-sm">Save</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="profile-name">{profile.display_name || 'Anonymous User'}</h2>
                <p className="profile-email">{user.email}</p>
                <div className="profile-stats">
                  <div className="stat-box">
                    <span className="stat-num">{playlists.length}</span>
                    <span className="stat-label">Playlists</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-num">{likedSongs.length}</span>
                    <span className="stat-label">Liked</span>
                  </div>
                </div>
                <div className="sidebar-actions">
                  <button onClick={() => setIsEditing(true)} className="btn btn-secondary w-full" style={{justifyContent: 'center'}}><Settings size={16}/> Edit Profile</button>
                  <button onClick={handleSignOut} className="btn btn-ghost w-full" style={{justifyContent: 'center', color: '#ef4444'}}><LogOut size={16}/> Sign Out</button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="profile-content glass-panel">
          <div className="content-tabs">
            <button 
              className={`tab-btn ${activeTab === 'playlists' ? 'active' : ''}`}
              onClick={() => setActiveTab('playlists')}
            >
              <ListMusic size={18}/> Your Playlists
            </button>
            <button 
              className={`tab-btn ${activeTab === 'likes' ? 'active' : ''}`}
              onClick={() => setActiveTab('likes')}
            >
              <Heart size={18}/> Liked Songs
            </button>
          </div>

          <div className="tab-pane">
            {activeTab === 'playlists' && (
              <div className="playlists-grid">
                {playlists.length > 0 ? playlists.map(pl => (
                  <div key={pl.id} className="playlist-card glass-panel">
                    <div className="playlist-cover">
                      <Music size={40} className="cover-icon"/>
                      <div className="track-count">{pl.playlist_tracks?.length || 0} Tracks</div>
                    </div>
                    <div className="playlist-info">
                      <h3>{pl.name}</h3>
                    </div>
                  </div>
                )) : (
                  <div className="empty-state">
                    <ListMusic size={48} className="empty-icon" />
                    <p>No playlists created yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'likes' && (
              <div className="tracks-list">
                {likedSongs.length > 0 ? likedSongs.map(song => (
                  <div key={song.id} className="track-row glass-panel" onClick={() => navigate(`/song/${song.track_id}`)}>
                    <img src={song.artwork_url} alt="" className="track-row-art" />
                    <div className="track-row-info">
                      <div className="track-row-title">{song.track_name}</div>
                      <div className="track-row-artist">{song.artist_name}</div>
                    </div>
                    <div className="track-row-genre badge">{song.genre || 'Music'}</div>
                    <button className="btn btn-primary rounded-circle" style={{padding: '8px', borderRadius: '50%'}}><PlayCircle size={20}/></button>
                  </div>
                )) : (
                  <div className="empty-state">
                    <Heart size={48} className="empty-icon" />
                    <p>You haven't liked any songs yet. Go explore!</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
