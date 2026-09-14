import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, DollarSign, ArrowRight, Sparkles } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import Button from './Button';

export default function Hero({ onExploreClick }) {
  const { createTrip, destinations } = useTrips();
  const navigate = useNavigate();

  const [destination, setDestination] = useState('Tokyo');
  const [startDate, setStartDate] = useState('2026-10-12');
  const [endDate, setEndDate] = useState('2026-10-20');
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(2500);

  const handleCreateTrip = (e) => {
    e.preventDefault();
    const dest = destinations.find(d => d.name.toLowerCase() === destination.toLowerCase());

    createTrip({
      title: `${destination} Adventure`,
      destination,
      startDate,
      endDate,
      travelers,
      budget,
      coverImage: dest?.image || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'
    });

    navigate('/planner');
  };

  return (
    <section className="hero-section">
      <div className="hero-background">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=85"
          alt="Breathtaking travel landscape"
          className="hero-bg-img"
        />
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        <div className="hero-tag">
          <Sparkles size={16} />
          <span>Next-Gen Smart Trip Planning</span>
        </div>

        <h1 className="hero-title">Plan your perfect trip</h1>

        <p className="hero-subtitle">
          Create unforgettable journeys with your personal trip planner.
        </p>

        {/* Big Search / Trip Creation Form */}
        <form className="hero-search-form" onSubmit={handleCreateTrip}>
          {/* Destination */}
          <div className="search-field">
            <span className="search-label">Where do you want to go?</span>
            <div className="search-input-wrapper">
              <MapPin size={18} className="search-icon" />
              <select
                className="search-select"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              >
                {destinations.map(d => (
                  <option key={d.id} value={d.name}>
                    {d.name}, {d.country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="search-divider" />

          {/* When */}
          <div className="search-field">
            <span className="search-label">When?</span>
            <div className="search-input-wrapper">
              <Calendar size={18} className="search-icon" />
              <div className="search-dates-group">
                <input
                  type="date"
                  className="search-date-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <span className="search-date-separator">—</span>
                <input
                  type="date"
                  className="search-date-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="search-divider" />

          {/* Travelers */}
          <div className="search-field">
            <span className="search-label">Travelers</span>
            <div className="search-input-wrapper">
              <Users size={18} className="search-icon" />
              <select
                className="search-select"
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
              >
                <option value={1}>1 traveler</option>
                <option value={2}>2 travelers</option>
                <option value={3}>3 travelers</option>
                <option value={4}>4 travelers</option>
                <option value={6}>6+ group</option>
              </select>
            </div>
          </div>

          <div className="search-divider" />

          {/* Budget */}
          <div className="search-field">
            <span className="search-label">Budget</span>
            <div className="search-input-wrapper">
              <DollarSign size={18} className="search-icon" />
              <input
                type="number"
                className="search-input"
                min="200"
                step="50"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                placeholder="$2500"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={ArrowRight}
            style={{ height: '54px', padding: '0 28px' }}
          >
            Create Trip
          </Button>
        </form>
      </div>
    </section>
  );
}
