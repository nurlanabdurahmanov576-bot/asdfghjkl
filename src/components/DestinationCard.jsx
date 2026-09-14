import React from 'react';
import { Heart, Star, MapPin, ArrowRight } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import Button from './Button';

export default function DestinationCard({ destination, onExplore }) {
  const { favorites, toggleFavorite } = useTrips();
  const isFav = favorites.includes(destination.id);

  return (
    <div className="destination-card">
      <div className="card-image-wrap">
        <img
          src={destination.image}
          alt={destination.name}
          className="card-image"
          loading="lazy"
        />
        {destination.tag && <span className="card-tag">{destination.tag}</span>}
        <button
          type="button"
          className={`card-favorite-btn ${isFav ? 'favorited' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(destination.id, destination.name);
          }}
          aria-label="Save to favorites"
        >
          <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="card-body">
        <div className="card-header-line">
          <h3 className="card-title">{destination.name}</h3>
          <div className="card-rating-line" style={{ margin: 0 }}>
            <Star size={15} className="rating-star-icon" />
            <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{destination.rating}</span>
            <span>({destination.reviews})</span>
          </div>
        </div>

        <div className="card-country">
          <MapPin size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
          {destination.country}
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.45 }}>
          {destination.description.slice(0, 105)}...
        </p>

        <div className="card-footer-line">
          <div className="card-price-wrap">
            <span className="card-price-label">Avg. Trip Cost</span>
            <span className="card-price-value">{destination.approxCost}</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onExplore(destination)}
            icon={ArrowRight}
          >
            Explore
          </Button>
        </div>
      </div>
    </div>
  );
}
