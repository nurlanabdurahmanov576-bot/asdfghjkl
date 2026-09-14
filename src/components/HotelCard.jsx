import React, { useState } from 'react';
import { Star, MapPin, Plus, Check, Heart, Eye } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import Button from './Button';

export default function HotelCard({ hotel, onAddToTrip, onViewDetails }) {
  const { favorites, toggleFavorite, currentTrip } = useTrips();
  const isFav = favorites.includes(hotel.id);
  const [selectedDay, setSelectedDay] = useState(1);
  const [showDaySelect, setShowDaySelect] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToTrip(hotel, selectedDay);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setShowDaySelect(false);
  };

  const daysCount = currentTrip?.itinerary?.length || 3;

  return (
    <div className="hotel-card">
      <div className="card-image-wrap">
        <img src={hotel.image} alt={hotel.name} className="card-image" loading="lazy" />
        <span className="card-tag">{hotel.type}</span>
        <button
          type="button"
          className={`card-favorite-btn ${isFav ? 'favorited' : ''}`}
          onClick={() => toggleFavorite(hotel.id, hotel.name)}
          aria-label="Save hotel"
        >
          <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="card-body">
        <div className="stars-line">
          {Array.from({ length: hotel.stars || 5 }).map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dark)', fontWeight: 700, marginLeft: 4 }}>
            {hotel.rating}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({hotel.reviews})</span>
        </div>

        <h3 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
          {hotel.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          <MapPin size={14} />
          <span>{hotel.location}, {hotel.city}</span>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.4 }}>
          {hotel.description}
        </p>

        <div className="amenities-list">
          {hotel.amenities?.slice(0, 3).map((am, i) => (
            <span key={i} className="amenity-chip">{am}</span>
          ))}
          {hotel.amenities?.length > 3 && (
            <span className="amenity-chip">+{hotel.amenities.length - 3} more</span>
          )}
        </div>

        <div className="card-footer-line" style={{ flexDirection: 'column', gap: '10px' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="card-price-wrap">
              <span className="card-price-label">Price per night</span>
              <span className="card-price-value">${hotel.pricePerNight}</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={Eye}
              onClick={() => onViewDetails(hotel)}
            >
              View
            </Button>
          </div>

          {showDaySelect ? (
            <div style={{ width: '100%', display: 'flex', gap: '6px' }}>
              <select
                className="form-select"
                style={{ padding: '6px 8px', fontSize: '0.82rem' }}
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
              >
                {Array.from({ length: daysCount }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>Day {d}</option>
                ))}
              </select>
              <Button variant="primary" size="sm" onClick={handleAdd}>
                Confirm
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDaySelect(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant={added ? 'secondary' : 'primary'}
              size="sm"
              style={{ width: '100%' }}
              onClick={() => setShowDaySelect(true)}
              icon={added ? Check : Plus}
            >
              {added ? 'Reserved in Trip!' : 'Add to trip'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
