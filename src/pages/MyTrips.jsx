import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import TripCard from '../components/TripCard';
import Button from '../components/Button';
import CreateTripModal from '../components/modals/CreateTripModal';
import EditTripModal from '../components/modals/EditTripModal';
import { Plus, Map, Compass } from 'lucide-react';

export default function MyTrips() {
  const { trips, setActiveTripId, deleteTrip } = useTrips();
  const navigate = useNavigate();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);

  const handleOpenTrip = (trip) => {
    setActiveTripId(trip.id);
    navigate('/planner');
  };

  const handleEditTrip = (trip) => {
    setEditingTrip(trip);
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container-wide">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-badge">
              <Map size={16} />
              Your Travel Itineraries
            </span>
            <h1 className="section-title">My Trips</h1>
            <p className="section-description">
              Manage your upcoming, active, and past personalized travel itineraries.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => setCreateModalOpen(true)}
            icon={Plus}
          >
            Create New Trip
          </Button>
        </div>

        {trips.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border)',
              maxWidth: '560px',
              margin: '40px auto'
            }}
          >
            <Compass size={48} style={{ color: 'var(--primary)', marginBottom: 16 }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>
              No trips planned yet
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: 24 }}>
              Start planning your next unforgettable journey to Tokyo, Paris, Dubai, Rome, or anywhere in the world.
            </p>
            <Button
              variant="primary"
              onClick={() => setCreateModalOpen(true)}
              icon={Plus}
            >
              Create Trip
            </Button>
          </div>
        ) : (
          <div className="trips-page-grid">
            {trips.map(trip => (
              <TripCard
                key={trip.id}
                trip={trip}
                onOpen={handleOpenTrip}
                onEdit={handleEditTrip}
                onDelete={deleteTrip}
              />
            ))}
          </div>
        )}
      </div>

      <CreateTripModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {editingTrip && (
        <EditTripModal
          isOpen={Boolean(editingTrip)}
          onClose={() => setEditingTrip(null)}
          trip={editingTrip}
        />
      )}
    </div>
  );
}
