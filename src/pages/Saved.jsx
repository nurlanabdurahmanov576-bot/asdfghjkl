import React, { useState } from 'react';
import { Heart, Compass, MapPin, Hotel, Utensils } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import DestinationCard from '../components/DestinationCard';
import PlaceCard from '../components/PlaceCard';
import HotelCard from '../components/HotelCard';
import RestaurantCard from '../components/RestaurantCard';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

export default function Saved() {
  const {
    favorites,
    destinations,
    places,
    hotels,
    restaurants,
    addPlaceToTrip,
    addHotelToTrip,
    addRestaurantToTrip
  } = useTrips();
  const navigate = useNavigate();

  const [activeType, setActiveType] = useState('all');

  const savedDestinations = destinations.filter(d => favorites.includes(d.id));
  const savedPlaces = places.filter(p => favorites.includes(p.id));
  const savedHotels = hotels.filter(h => favorites.includes(h.id));
  const savedRestaurants = restaurants.filter(r => favorites.includes(r.id));

  const totalSaved = savedDestinations.length + savedPlaces.length + savedHotels.length + savedRestaurants.length;

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container-wide">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-badge">
              <Heart size={16} />
              Bookmarked Gems
            </span>
            <h1 className="section-title">Saved Items</h1>
            <p className="section-description">
              Your favorite dream destinations, sights, luxury hotels, and culinary hotspots.
            </p>
          </div>

          <div className="filter-pills">
            <button
              type="button"
              className={`filter-chip ${activeType === 'all' ? 'active' : ''}`}
              onClick={() => setActiveType('all')}
            >
              All ({totalSaved})
            </button>
            <button
              type="button"
              className={`filter-chip ${activeType === 'destinations' ? 'active' : ''}`}
              onClick={() => setActiveType('destinations')}
            >
              Destinations ({savedDestinations.length})
            </button>
            <button
              type="button"
              className={`filter-chip ${activeType === 'places' ? 'active' : ''}`}
              onClick={() => setActiveType('places')}
            >
              Places ({savedPlaces.length})
            </button>
            <button
              type="button"
              className={`filter-chip ${activeType === 'hotels' ? 'active' : ''}`}
              onClick={() => setActiveType('hotels')}
            >
              Hotels ({savedHotels.length})
            </button>
            <button
              type="button"
              className={`filter-chip ${activeType === 'restaurants' ? 'active' : ''}`}
              onClick={() => setActiveType('restaurants')}
            >
              Restaurants ({savedRestaurants.length})
            </button>
          </div>
        </div>

        {totalSaved === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border)',
              maxWidth: '540px',
              margin: '40px auto'
            }}
          >
            <Heart size={44} style={{ color: 'var(--accent-rose)', marginBottom: 16 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>
              No favorites saved yet
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
              Click the heart icon on any destination, attraction, hotel, or restaurant to save it here for later.
            </p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Explore Destinations
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {(activeType === 'all' || activeType === 'destinations') && savedDestinations.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>
                  Saved Destinations ({savedDestinations.length})
                </h3>
                <div className="destinations-grid">
                  {savedDestinations.map(dest => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      onExplore={() => navigate('/planner')}
                    />
                  ))}
                </div>
              </div>
            )}

            {(activeType === 'all' || activeType === 'places') && savedPlaces.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>
                  Saved Places & Attractions ({savedPlaces.length})
                </h3>
                <div className="cards-grid-3">
                  {savedPlaces.map(place => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onAddToTrip={(p, day) => addPlaceToTrip(p, day)}
                    />
                  ))}
                </div>
              </div>
            )}

            {(activeType === 'all' || activeType === 'hotels') && savedHotels.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>
                  Saved Accommodations ({savedHotels.length})
                </h3>
                <div className="cards-grid-3">
                  {savedHotels.map(hotel => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      onAddToTrip={(h, day) => addHotelToTrip(h, day)}
                      onViewDetails={() => {}}
                    />
                  ))}
                </div>
              </div>
            )}

            {(activeType === 'all' || activeType === 'restaurants') && savedRestaurants.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>
                  Saved Restaurants & Dining ({savedRestaurants.length})
                </h3>
                <div className="cards-grid-3">
                  {savedRestaurants.map(restaurant => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onAddToTrip={(r, day) => addRestaurantToTrip(r, day)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
