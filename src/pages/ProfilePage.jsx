import React, { useState } from 'react';
import { useTrips } from '../context/TripContext';
import Button from '../components/Button';
import EditProfileModal from '../components/modals/EditProfileModal';
import TripCard from '../components/TripCard';
import {
  User,
  Mail,
  MapPin,
  CheckCircle,
  Globe,
  Award,
  Edit3,
  Calendar,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, trips, setActiveTripId, deleteTrip, showToast } = useTrips();
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        <div className="profile-container">
          {/* Header Card */}
          <div className="profile-card-header">
            <div className="profile-banner" />
            <div className="profile-info-content">
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
                <div className="profile-avatar-large-wrap">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="profile-avatar-large"
                  />
                </div>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{user.name}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Mail size={14} />
                      {user.email}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={14} />
                      {user.favoriteDestination}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setEditModalOpen(true)}
                  icon={Edit3}
                >
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div style={{ padding: '0 32px 28px', color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                <p>{user.bio}</p>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="profile-stats-cards">
            <div className="overview-stat-card">
              <div className="stat-icon-wrap blue">
                <CheckCircle size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Trips Completed</span>
                <span className="stat-value">{user.tripsCompleted || 14}</span>
              </div>
            </div>

            <div className="overview-stat-card">
              <div className="stat-icon-wrap purple">
                <Globe size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Countries Visited</span>
                <span className="stat-value">{user.countriesVisited || 19}</span>
              </div>
            </div>

            <div className="overview-stat-card">
              <div className="stat-icon-wrap amber">
                <Award size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Favorite Destination</span>
                <span className="stat-value" style={{ fontSize: '1.05rem' }}>
                  {user.favoriteDestination || 'Tokyo, Japan'}
                </span>
              </div>
            </div>
          </div>

          {/* User's Itineraries List */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>My Saved Itineraries ({trips.length})</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/trips')}
              >
                Manage All Trips
              </Button>
            </div>

            <div className="trips-page-grid">
              {trips.slice(0, 3).map(trip => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onOpen={(t) => {
                    setActiveTripId(t.id);
                    navigate('/planner');
                  }}
                  onEdit={() => navigate('/planner')}
                  onDelete={deleteTrip}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
    </div>
  );
}
