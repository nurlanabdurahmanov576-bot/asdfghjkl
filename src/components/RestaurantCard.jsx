import React, { useState } from 'react';
import { Star, MapPin, Plus, Check, Heart, Utensils } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import Button from './Button';

export default function RestaurantCard({ restaurant, onAddToTrip }) {
  const { favorites, toggleFavorite, currentTrip } = useTrips();
  const isFav = favorites.includes(restaurant.id);
  const [selectedDay, setSelectedDay] = useState(1);
  const [showDaySelect, setShowDaySelect] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToTrip(restaurant, selectedDay);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setShowDaySelect(false);
  };

  const daysCount = currentTrip?.itinerary?.length || 3;

  return (
    <div className="restaurant-card">
      <div className="card-image-wrap">
        <img src={restaurant.image} alt={restaurant.name} className="card-image" loading="lazy" />
        <span className="card-tag" style={{ background: '#ec4899' }}>{restaurant.cuisine}</span>
        <button
          type="button"
          className={`card-favorite-btn ${isFav ? 'favorited' : ''}`}
          onClick={() => toggleFavorite(restaurant.id, restaurant.name)}
          aria-label="Save restaurant"
        >
          <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="card-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span className="cuisine-badge">{restaurant.cuisine}</span>
          <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {restaurant.priceLevel} ({restaurant.priceDisplay})
          </span>
        </div>

        <h3 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
          {restaurant.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div className="card-rating-line" style={{ margin: 0 }}>
            <Star size={14} className="rating-star-icon" />
            <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{restaurant.rating}</span>
            <span>({restaurant.reviews})</span>
          </div>
          <span style={{ color: 'var(--text-light)' }}>•</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <MapPin size={13} style={{ display: 'inline', marginRight: 2 }} />
            {restaurant.location}
          </span>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: 1.4 }}>
          {restaurant.description}
        </p>

        <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '14px' }}>
          <Utensils size={13} style={{ display: 'inline', marginRight: 4 }} />
          Must try: {restaurant.specialty}
        </div>

        <div className="card-footer-line" style={{ flexDirection: 'column', gap: '10px' }}>
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
              {added ? 'Table Added to Trip!' : 'Add to trip'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
