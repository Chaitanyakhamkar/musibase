import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music, LogIn, LogOut } from 'lucide-react';
import { supabase } from '../supabase';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          <div className="logo-circle">
            <Music size={16} strokeWidth={3} />
          </div>
          <span>MusiBase</span>
        </Link>
        <div className="nav-links" style={{ alignItems: 'center' }}>
          <Link to="/" className="nav-link">Home</Link>
          <a href="#" className="nav-link">About</a>
          {user ? (
            <button onClick={handleSignOut} className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '13px' }}>
              <LogOut size={14} style={{marginRight: '6px'}} /> Sign Out
            </button>
          ) : (
            <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
              <LogIn size={14} style={{marginRight: '6px'}} /> Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
