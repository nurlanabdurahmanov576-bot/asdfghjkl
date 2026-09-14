import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Map,
  Calendar,
  Heart,
  Sparkles,
  Bell,
  Menu,
  X,
  Plus,
  User,
  Check,
  Plane
} from 'lucide-react';
import { useTrips } from '../context/TripContext';
import Button from './Button';
import CreateTripModal from './modals/CreateTripModal';
import AuthModal from './modals/AuthModal';

export default function Navbar() {
  const { user, notifications, markNotificationsRead } = useTrips();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleOpenNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen && unreadCount > 0) {
      // Keep badge visible until user dismisses or clicks
    }
  };

  return (
    <>
      <header className="navbar-wrapper">
        <div className="container-wide">
          <nav className="navbar">
            {/* Brand Logo */}
            <Link to="/" className="navbar-brand">
              <div className="navbar-brand-icon">
                <Plane size={22} style={{ transform: 'rotate(-25deg)' }} />
              </div>
              <div className="navbar-brand-text">
                Trip<span>ly</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="navbar-links">
              <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} end>
                <Compass size={17} />
                <span>Explore</span>
              </NavLink>

              <NavLink to="/trips" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                <Map size={17} />
                <span>My Trips</span>
              </NavLink>

              <NavLink to="/planner" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                <Calendar size={17} />
                <span>Planner</span>
              </NavLink>

              <NavLink to="/saved" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                <Heart size={17} />
                <span>Saved</span>
              </NavLink>

              <NavLink to="/assistant" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                <Sparkles size={17} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>AI Assistant</span>
              </NavLink>
            </div>

            {/* Right Actions */}
            <div className="navbar-actions">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCreateModalOpen(true)}
                icon={Plus}
                className="desktop-only-btn"
              >
                Create Trip
              </Button>

              {/* Notifications Dropdown Toggle */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="navbar-icon-btn"
                  onClick={handleOpenNotifications}
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {notificationsOpen && (
                  <div className="notifications-dropdown">
                    <div className="dropdown-header">
                      <span>Notifications ({unreadCount} new)</span>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markNotificationsRead}
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 600
                          }}
                        >
                          <Check size={14} /> Mark all read
                        </button>
                      )}
                    </div>
                    <div className="dropdown-list">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`dropdown-item ${!n.read ? 'unread' : ''}`}
                          onClick={() => setNotificationsOpen(false)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                              {n.title}
                            </strong>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {n.time}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                            {n.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar / Link */}
              <Link to="/profile" className="profile-avatar-btn" title="View Profile">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="profile-avatar-img"
                />
                <span className="profile-avatar-name desktop-only-text">
                  {user.name.split(' ')[0]}
                </span>
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                className="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer">
            <NavLink
              to="/"
              className="navbar-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Compass size={18} />
              <span>Explore Destinations</span>
            </NavLink>

            <NavLink
              to="/trips"
              className="navbar-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Map size={18} />
              <span>My Trips</span>
            </NavLink>

            <NavLink
              to="/planner"
              className="navbar-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Calendar size={18} />
              <span>Trip Planner</span>
            </NavLink>

            <NavLink
              to="/saved"
              className="navbar-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart size={18} />
              <span>Saved Places</span>
            </NavLink>

            <NavLink
              to="/assistant"
              className="navbar-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles size={18} style={{ color: 'var(--primary)' }} />
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>AI Assistant</span>
            </NavLink>

            <NavLink
              to="/profile"
              className="navbar-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={18} />
              <span>User Profile</span>
            </NavLink>

            <div style={{ marginTop: '12px' }}>
              <Button
                variant="primary"
                style={{ width: '100%' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCreateModalOpen(true);
                }}
                icon={Plus}
              >
                Create New Trip
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Global Modals */}
      <CreateTripModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
