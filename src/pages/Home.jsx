import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import Hero from '../components/Hero';
import DestinationCard from '../components/DestinationCard';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import Button from '../components/Button';
import {
  Compass,
  Sparkles,
  Map,
  ShieldCheck,
  Zap,
  DollarSign,
  Star,
  ArrowRight,
  Clock,
  Calendar
} from 'lucide-react';

export default function Home() {
  const { destinations, createTrip } = useTrips();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Filter destinations
  const filteredDestinations = destinations.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExploreDestination = (dest) => {
    setSelectedDestination(dest);
  };

  const handleStartTripWithDest = (dest) => {
    createTrip({
      title: `${dest.name} Adventure`,
      destination: dest.name,
      startDate: '2026-10-12',
      endDate: '2026-10-20',
      travelers: 2,
      budget: dest.costValue || 2500,
      coverImage: dest.image
    });
    setSelectedDestination(null);
    navigate('/planner');
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Popular Destinations Section */}
      <section style={{ padding: '80px 0 60px' }}>
        <div className="container-wide">
          <div className="section-header">
            <div className="section-title-wrap">
              <span className="section-badge">
                <Compass size={16} />
                Curated Travel Guides
              </span>
              <h2 className="section-title">Popular destinations</h2>
              <p className="section-description">
                Explore handpicked iconic cities, authentic culture, world-class dining, and tailored itineraries.
              </p>
            </div>

            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Filter cities or countries..."
            />
          </div>

          {/* Destinations Grid */}
          <div className="destinations-grid">
            {filteredDestinations.map(dest => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onExplore={handleExploreDestination}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Triply Section */}
      <section style={{ padding: '60px 0 80px', background: 'var(--bg-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
            <span className="section-badge" style={{ justifyContent: 'center' }}>
              <Sparkles size={16} />
              Intelligent Itinerary Engine
            </span>
            <h2 className="section-title" style={{ marginTop: 8 }}>
              Everything you need for seamless journeys
            </h2>
            <p className="section-description" style={{ margin: '8px auto 0' }}>
              From drag-and-drop daily schedules and smart budget management to curated local attractions and AI tips.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            <div
              style={{
                background: '#ffffff',
                padding: '30px',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div className="stat-icon-wrap purple" style={{ marginBottom: '18px' }}>
                <Calendar size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 800 }}>Day-by-Day Itinerary</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Organize arrival, hotel check-in, temple visits, and dining with exact time slots and custom notes.
              </p>
            </div>

            <div
              style={{
                background: '#ffffff',
                padding: '30px',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div className="stat-icon-wrap emerald" style={{ marginBottom: '18px' }}>
                <DollarSign size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 800 }}>Real-time Budget Tracker</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Track flights, hotels, food, and activities. Know your remaining balance dynamically at every step.
              </p>
            </div>

            <div
              style={{
                background: '#ffffff',
                padding: '30px',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div className="stat-icon-wrap blue" style={{ marginBottom: '18px' }}>
                <Map size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 800 }}>Interactive Waypoint Map</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Visualize attractions, hotels, airports, and eateries on an interactive map with optimized route paths.
              </p>
            </div>

            <div
              style={{
                background: '#ffffff',
                padding: '30px',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div className="stat-icon-wrap amber" style={{ marginBottom: '18px' }}>
                <Sparkles size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 800 }}>AI Travel Concierge</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Get instant packing checklists, hidden gem restaurant recommendations, and 3-day itinerary advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Destination Quick Detail Modal */}
      {selectedDestination && (
        <Modal
          isOpen={Boolean(selectedDestination)}
          onClose={() => setSelectedDestination(null)}
          title={`Explore ${selectedDestination.name}`}
          maxWidth="640px"
        >
          <div>
            <div
              style={{
                position: 'relative',
                height: '240px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                marginBottom: '20px'
              }}
            >
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span className="card-tag" style={{ top: 14, left: 14 }}>
                {selectedDestination.country}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{selectedDestination.name}</h3>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                {selectedDestination.approxCost}
              </span>
            </div>

            <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
              {selectedDestination.description}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                background: 'var(--bg-subtle)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                fontSize: '0.85rem'
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Best Season:</span>
                <strong>{selectedDestination.bestSeason}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Local Currency:</span>
                <strong>{selectedDestination.currency}</strong>
              </div>
            </div>

            <div className="modal-footer" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
              <Button variant="secondary" onClick={() => setSelectedDestination(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => handleStartTripWithDest(selectedDestination)}
                icon={ArrowRight}
              >
                Start Planning Trip
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
