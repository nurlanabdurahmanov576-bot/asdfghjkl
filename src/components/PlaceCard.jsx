import React, { useState } from 'react';
import { Star, Clock, Plus, Check, Heart, MapPin } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import Button from './Button';

export default function PlaceCard({ place, onAddToTrip }) {
  const { favorites, toggleFavorite, currentTrip } = useTrips();
  const isFav = favorites.includes(place.id);
  const [selectedDay, setSelectedDay] = useState(1);
  const [showDaySelect, setShowDaySelect] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToTrip(place, selectedDay);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setShowDaySelect(false);
  };

  const daysCount = currentTrip?.itinerary?.length || 3;

  return (
    <div className="place-card">
      <div className="card-image-wrap">
        <img src={place.image} alt={place.name} className="card-image" loading="lazy" />
        <span className="card-tag">{place.category}</span>
        <button
          type="button"
          className={`card-favorite-btn ${isFav ? 'favorited' : ''}`}
          onClick={() => toggleFavorite(place.id, place.name)}
          aria-label="Favorite"
        >
          <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="card-body">
        <div className="card-header-line">
          <h3 className="card-title" style={{ fontSize: '1.15rem' }}>{place.name}</h3>
          <span style={{ fontWeight: 800, color: place.numericPrice === 0 ? '#059669' : 'var(--primary)' }}>
            {place.price}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div className="card-rating-line" style={{ margin: 0 }}>
            <Star size={14} className="rating-star-icon" />
            <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{place.rating}</span>
            <span>({place.reviews})</span>
          </div>
          <span className="place-hours-tag">
            <Clock size={13} />
            {place.hours}
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px', flex: 1 }}>
          {place.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <MapPin size={13} />
          <span>{place.city}</span>
          <span>•</span>
          <span>Duration: {place.recommendedDuration}</span>
        </div>

        <div className="card-footer-line" style={{ flexDirection: 'column', gap: '10px' }}>
          {showDaySelect ? (
            <div style={{ width: '100%', display: 'flex', gap: '8px' }}>
              <select
                className="form-select"
                style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
              >
                {Array.from({ length: daysCount }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    Day {d} {currentTrip?.itinerary?.[d-1]?.title ? `(${currentTrip.itinerary[d-1].title})` : ''}
                  </option>
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
            <div style={{ width: '100%', display: 'flex', gap: '8px' }}>
              <Button
                variant={added ? 'secondary' : 'primary'}
                size="sm"
                style={{ flex: 1 }}
                onClick={() => setShowDaySelect(true)}
                icon={added ? Check : Plus}
              >
                {added ? 'Added to Trip!' : 'Add to trip'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
