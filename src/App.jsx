import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { TripProvider, useTrips } from './context/TripContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Planner from './pages/Planner';
import MyTrips from './pages/MyTrips';
import Saved from './pages/Saved';
import AIAssistant from './pages/AIAssistant';
import ProfilePage from './pages/ProfilePage';
import { Plane, Heart, Shield, Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';

function ToastContainer() {
  const { toast } = useTrips();
  if (!toast) return null;

  return (
    <div className={`toast-popup ${toast.type || 'success'}`}>
      {toast.type === 'error' ? (
        <AlertCircle size={18} style={{ color: '#ef4444' }} />
      ) : toast.type === 'info' ? (
        <Info size={18} style={{ color: '#818cf8' }} />
      ) : (
        <CheckCircle2 size={18} style={{ color: '#10b981' }} />
      )}
      <span>{toast.message}</span>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ background: '#ffffff', borderTop: '1px solid var(--border)', padding: '48px 0 32px' }}>
      <div className="container-wide">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div className="navbar-brand-icon" style={{ width: '32px', height: '32px' }}>
                <Plane size={18} style={{ transform: 'rotate(-25deg)' }} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                Trip<span style={{ color: 'var(--primary)' }}>ly</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '380px' }}>
              Next-generation smart trip planner. Plan unforgettable journeys, budget transparently, and explore with AI intelligence.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <Link to="/" style={{ fontWeight: 600 }}>Explore</Link>
            <Link to="/planner" style={{ fontWeight: 600 }}>Planner</Link>
            <Link to="/trips" style={{ fontWeight: 600 }}>My Trips</Link>
            <Link to="/saved" style={{ fontWeight: 600 }}>Saved</Link>
            <Link to="/assistant" style={{ fontWeight: 600 }}>AI Concierge</Link>
            <Link to="/profile" style={{ fontWeight: 600 }}>Profile</Link>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>© {new Date().getFullYear()} Triply Inc. All rights reserved.</span>
          <span>Designed with precision for modern travelers worldwide.</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <TripProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/trips" element={<MyTrips />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/assistant" element={<AIAssistant />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </BrowserRouter>
    </TripProvider>
  );
}
