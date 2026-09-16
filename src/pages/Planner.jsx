import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  DollarSign,
  Edit3,
  MapPin,
  Compass,
  Map as MapIcon,
  Hotel,
  Utensils,
  PieChart,
  ListTodo,
  CheckCircle,
  Plus,
  Eye,
  Filter,
  ArrowRight
} from 'lucide-react';
import { useTrips } from '../context/TripContext';
import Itinerary from '../components/Itinerary';
import PlaceCard from '../components/PlaceCard';
import HotelCard from '../components/HotelCard';
import RestaurantCard from '../components/RestaurantCard';
import BudgetTracker from '../components/BudgetTracker';
import InteractiveMap from '../components/Map';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import EditTripModal from '../components/modals/EditTripModal';

export default function Planner() {
  const {
    currentTrip,
    trips,
    setActiveTripId,
    places,
    hotels,
    restaurants,
    addPlaceToTrip,
    addHotelToTrip,
    addRestaurantToTrip
  } = useTrips();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'overview';
  const setActiveTab = (tab) => setSearchParams({ tab });

  const [editTripModalOpen, setEditTripModalOpen] = useState(false);
  const [viewHotelModal, setViewHotelModal] = useState(null);

  // Filters for Places
  const [placesCategory, setPlacesCategory] = useState('All');
  const [placesCityFilter, setPlacesCityFilter] = useState('current');
  const [placesSearch, setPlacesSearch] = useState('');

  // Filters for Hotels
  const [hotelTypeFilter, setHotelTypeFilter] = useState('All');
  const [hotelCityFilter, setHotelCityFilter] = useState('current');
  const [hotelRatingFilter, setHotelRatingFilter] = useState('All');
  const [hotelSearch, setHotelSearch] = useState('');

  // Filters for Restaurants
  const [restaurantCuisineFilter, setRestaurantCuisineFilter] = useState('All');
  const [restaurantCityFilter, setRestaurantCityFilter] = useState('current');
  const [restaurantSearch, setRestaurantSearch] = useState('');

  if (!currentTrip) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>No trips found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '16px 0' }}>
          Please create a new trip to start planning your adventure.
        </p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Explore Destinations
        </Button>
      </div>
    );
  }

  // Filter items matching current trip destination
  const destLower = (currentTrip.destination || 'Tokyo').toLowerCase();

  // Filtered Places
  const filteredPlaces = places.filter(p => {
    const matchesCity = placesCityFilter === 'all'
      ? true
      : (placesCityFilter === 'current'
          ? (p.destinationId?.toLowerCase() === destLower || p.city?.toLowerCase() === destLower)
          : (p.destinationId?.toLowerCase() === placesCityFilter.toLowerCase() || p.city?.toLowerCase() === placesCityFilter.toLowerCase()));
    const matchesCategory = placesCategory === 'All' || p.category === placesCategory;
    const matchesSearch = !placesSearch || p.name.toLowerCase().includes(placesSearch.toLowerCase()) || p.description.toLowerCase().includes(placesSearch.toLowerCase());
    return matchesCity && matchesCategory && matchesSearch;
  });

  // Filtered Hotels
  const filteredHotels = hotels.filter(h => {
    const matchesCity = hotelCityFilter === 'all'
      ? true
      : (hotelCityFilter === 'current'
          ? (h.destinationId?.toLowerCase() === destLower || h.city?.toLowerCase() === destLower)
          : (h.destinationId?.toLowerCase() === hotelCityFilter.toLowerCase() || h.city?.toLowerCase() === hotelCityFilter.toLowerCase()));
    const matchesType = hotelTypeFilter === 'All' || h.type?.toLowerCase().includes(hotelTypeFilter.toLowerCase());
    const matchesRating = hotelRatingFilter === 'All' || h.rating >= Number(hotelRatingFilter);
    const matchesSearch = !hotelSearch || h.name.toLowerCase().includes(hotelSearch.toLowerCase()) || h.location.toLowerCase().includes(hotelSearch.toLowerCase());
    return matchesCity && matchesType && matchesRating && matchesSearch;
  });

  // Filtered Restaurants
  const filteredRestaurants = restaurants.filter(r => {
    const matchesCity = restaurantCityFilter === 'all'
      ? true
      : (restaurantCityFilter === 'current'
          ? (r.destinationId?.toLowerCase() === destLower || r.city?.toLowerCase() === destLower)
          : (r.destinationId?.toLowerCase() === restaurantCityFilter.toLowerCase() || r.city?.toLowerCase() === restaurantCityFilter.toLowerCase()));
    const matchesCuisine = restaurantCuisineFilter === 'All' || r.cuisine.toLowerCase() === restaurantCuisineFilter.toLowerCase();
    const matchesSearch = !restaurantSearch || r.name.toLowerCase().includes(restaurantSearch.toLowerCase()) || r.specialty?.toLowerCase().includes(restaurantSearch.toLowerCase());
    return matchesCity && matchesCuisine && matchesSearch;
  });

  // Total activities count
  const totalActivities = (currentTrip.itinerary || []).reduce(
    (count, day) => count + (day.activities?.length || 0),
    0
  );

  return (
    <div>
      {/* Planner Top Trip Header */}
      <div className="planner-header">
        <div className="container-wide">
          <div className="planner-trip-banner">
            <div className="planner-trip-meta">
              <img
                src={currentTrip.coverImage}
                alt={currentTrip.title}
                className="planner-cover-thumb"
              />
              <div className="planner-trip-titles">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 2 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                    Active Trip Dashboard
                  </span>
                </div>
                <h1>{currentTrip.title}</h1>
                <div className="trip-badges-line">
                  <span className="meta-chip">
                    <Calendar size={14} style={{ color: 'var(--primary)' }} />
                    {currentTrip.datesDisplay}
                  </span>
                  <span className="meta-chip">
                    <Users size={14} style={{ color: 'var(--primary)' }} />
                    {currentTrip.travelersDisplay}
                  </span>
                  <span className="meta-chip budget">
                    <DollarSign size={14} />
                    ${currentTrip.budget?.toLocaleString()} Budget
                  </span>
                  <span className="meta-chip">
                    <MapPin size={14} style={{ color: 'var(--primary)' }} />
                    {currentTrip.destination}, {currentTrip.country}
                  </span>
                </div>
              </div>
            </div>

            <div className="planner-actions">
              {/* Trip switcher */}
              {trips.length > 1 && (
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
                  value={currentTrip.id}
                  onChange={(e) => setActiveTripId(e.target.value)}
                >
                  {trips.map(t => (
                    <option key={t.id} value={t.id}>
                      Switch: {t.title}
                    </option>
                  ))}
                </select>
              )}

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditTripModalOpen(true)}
                icon={Edit3}
              >
                Edit Trip
              </Button>
            </div>
          </div>

          {/* Navigation Tabs (Overview, Itinerary, Places, Hotels, Restaurants, Map, Budget) */}
          <div className="planner-tabs">
            <button
              type="button"
              className={`planner-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Compass size={17} />
              <span>Overview</span>
            </button>

            <button
              type="button"
              className={`planner-tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
              onClick={() => setActiveTab('itinerary')}
            >
              <ListTodo size={17} />
              <span>Itinerary</span>
              <span className="tab-badge">{currentTrip.itinerary?.length || 0}d</span>
            </button>

            <button
              type="button"
              className={`planner-tab-btn ${activeTab === 'places' ? 'active' : ''}`}
              onClick={() => setActiveTab('places')}
            >
              <MapPin size={17} />
              <span>Places</span>
              <span className="tab-badge">{places.length}</span>
            </button>

            <button
              type="button"
              className={`planner-tab-btn ${activeTab === 'hotels' ? 'active' : ''}`}
              onClick={() => setActiveTab('hotels')}
            >
              <Hotel size={17} />
              <span>Hotels</span>
              <span className="tab-badge">{hotels.length}</span>
            </button>

            <button
              type="button"
              className={`planner-tab-btn ${activeTab === 'restaurants' ? 'active' : ''}`}
              onClick={() => setActiveTab('restaurants')}
            >
              <Utensils size={17} />
              <span>Restaurants</span>
              <span className="tab-badge">{restaurants.length}</span>
            </button>

            <button
              type="button"
              className={`planner-tab-btn ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => setActiveTab('map')}
            >
              <MapIcon size={17} />
              <span>Map</span>
            </button>

            <button
              type="button"
              className={`planner-tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
              onClick={() => setActiveTab('budget')}
            >
              <PieChart size={17} />
              <span>Budget</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="container-wide" style={{ paddingBottom: '60px' }}>
        {/* ================= OVERVIEW TAB ================= */}
        {activeTab === 'overview' && (
          <div>
            <div className="overview-stats-grid">
              <div className="overview-stat-card">
                <div className="stat-icon-wrap blue">
                  <Calendar size={22} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Duration</span>
                  <span className="stat-value">{currentTrip.itinerary?.length || 3} Days</span>
                </div>
              </div>

              <div className="overview-stat-card">
                <div className="stat-icon-wrap purple">
                  <ListTodo size={22} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Activities</span>
                  <span className="stat-value">{totalActivities} Events</span>
                </div>
              </div>

              <div className="overview-stat-card">
                <div className="stat-icon-wrap emerald">
                  <DollarSign size={22} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Trip Budget</span>
                  <span className="stat-value">${currentTrip.budget?.toLocaleString()}</span>
                </div>
              </div>

              <div className="overview-stat-card">
                <div className="stat-icon-wrap amber">
                  <Users size={22} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Travel Party</span>
                  <span className="stat-value">{currentTrip.travelersDisplay}</span>
                </div>
              </div>
            </div>

            <div className="overview-grid">
              <div>
                <div className="overview-banner">
                  <img src={currentTrip.coverImage} alt={currentTrip.title} />
                  <div className="overview-banner-overlay">
                    <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#818cf8', fontWeight: 700 }}>
                      Featured Journey
                    </span>
                    <h2 className="overview-banner-title">{currentTrip.title}</h2>
                    <p style={{ fontSize: '0.95rem', opacity: 0.9 }}>
                      {currentTrip.datesDisplay} • Exploring iconic landmarks, Japanese delicacies, and modern culture.
                    </p>
                  </div>
                </div>

                {/* Day 1 Quick View */}
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Itinerary Highlights Preview</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Day 1 arrival and scheduled activities</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('itinerary')} icon={ArrowRight}>
                      Full Itinerary
                    </Button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {currentTrip.itinerary?.[0]?.activities?.slice(0, 3).map(act => (
                      <div
                        key={act.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '12px 16px',
                          background: 'var(--bg-subtle)',
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.85rem' }}>{act.time}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{act.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{act.location}</div>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#059669' }}>
                          {act.cost > 0 ? `$${act.cost}` : 'Free'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Quick Shortcuts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>Quick Planner Navigation</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Button variant="secondary" style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('places')} icon={MapPin}>
                      Browse Attractions & Places
                    </Button>
                    <Button variant="secondary" style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('hotels')} icon={Hotel}>
                      Find & Reserve Hotels
                    </Button>
                    <Button variant="secondary" style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('restaurants')} icon={Utensils}>
                      Explore Curated Restaurants
                    </Button>
                    <Button variant="secondary" style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('map')} icon={MapIcon}>
                      View Stops on Interactive Map
                    </Button>
                    <Button variant="secondary" style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('budget')} icon={PieChart}>
                      Check Budget Breakdown
                    </Button>
                  </div>
                </div>

                {/* AI Concierge Banner */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: '#ffffff',
                    padding: '24px',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: 'var(--radius-full)' }}>
                    AI Assistant Active
                  </span>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '10px 0 8px', color: '#ffffff' }}>
                    Need tips for {currentTrip.destination}?
                  </h4>
                  <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '16px' }}>
                    Ask about local subway cards, packing weather essentials, and secret photography spots.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    style={{ background: '#ffffff', color: 'var(--primary)', border: 'none' }}
                    onClick={() => navigate('/assistant')}
                  >
                    Open AI Concierge
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ITINERARY TAB ================= */}
        {activeTab === 'itinerary' && (
          <Itinerary trip={currentTrip} />
        )}

        {/* ================= PLACES TAB ================= */}
        {activeTab === 'places' && (
          <div>
            <div className="filter-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '7px 12px', fontSize: '0.85rem', fontWeight: 600 }}
                  value={placesCityFilter}
                  onChange={(e) => setPlacesCityFilter(e.target.value)}
                >
                  <option value="current">📍 {currentTrip.destination} (Active Trip)</option>
                  <option value="all">🌍 All Destinations ({places.length} Places)</option>
                  <option value="tokyo">Tokyo, Japan</option>
                  <option value="paris">Paris, France</option>
                  <option value="dubai">Dubai, UAE</option>
                  <option value="rome">Rome, Italy</option>
                  <option value="london">London, UK</option>
                  <option value="istanbul">Istanbul, Turkey</option>
                  <option value="new-york">New York, USA</option>
                  <option value="tashkent">Tashkent, Uzbekistan</option>
                </select>

                <div className="filter-pills">
                  {['All', 'Culture & Heritage', 'Observation & Views', 'Landmark', 'Art & Experience', 'Parks & Nature', 'Food & Market'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`filter-chip ${placesCategory === cat ? 'active' : ''}`}
                      onClick={() => setPlacesCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {filteredPlaces.length} places found
                </span>
                <SearchBar
                  value={placesSearch}
                  onChange={setPlacesSearch}
                  placeholder="Search sights, temples, towers..."
                />
              </div>
            </div>

            <div className="cards-grid-3">
              {filteredPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onAddToTrip={(p, day) => addPlaceToTrip(p, day)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ================= HOTELS TAB ================= */}
        {activeTab === 'hotels' && (
          <div>
            <div className="filter-bar">
              <div className="filter-pills">
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Type:</span>
                {['All', 'Luxury', 'Boutique', 'Traditional', 'Heritage', 'Resort'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`filter-chip ${hotelTypeFilter === t ? 'active' : ''}`}
                    onClick={() => setHotelTypeFilter(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
                  value={hotelRatingFilter}
                  onChange={(e) => setHotelRatingFilter(e.target.value)}
                >
                  <option value="All">All Ratings</option>
                  <option value="4.8">4.8+ Stars</option>
                  <option value="4.7">4.7+ Stars</option>
                </select>

                <SearchBar
                  value={hotelSearch}
                  onChange={setHotelSearch}
                  placeholder="Search hotel name or area..."
                />
              </div>
            </div>

            <div className="cards-grid-3">
              {filteredHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onAddToTrip={(h, day) => addHotelToTrip(h, day)}
                  onViewDetails={(h) => setViewHotelModal(h)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ================= RESTAURANTS TAB ================= */}
        {activeTab === 'restaurants' && (
          <div>
            <div className="filter-bar">
              <div className="filter-pills">
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Cuisine:</span>
                {['All', 'Japanese', 'Italian', 'Uzbek', 'French', 'American', 'Indian'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`filter-chip ${restaurantCuisineFilter === c ? 'active' : ''}`}
                    onClick={() => setRestaurantCuisineFilter(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <SearchBar
                value={restaurantSearch}
                onChange={setRestaurantSearch}
                placeholder="Search food, ramen, dishes..."
              />
            </div>

            <div className="cards-grid-3">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onAddToTrip={(r, day) => addRestaurantToTrip(r, day)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ================= MAP TAB ================= */}
        {activeTab === 'map' && (
          <InteractiveMap
            trip={currentTrip}
            places={places}
            hotels={hotels}
            restaurants={restaurants}
          />
        )}

        {/* ================= BUDGET TAB ================= */}
        {activeTab === 'budget' && (
          <BudgetTracker trip={currentTrip} />
        )}
      </div>

      {/* Edit Trip Modal */}
      <EditTripModal
        isOpen={editTripModalOpen}
        onClose={() => setEditTripModalOpen(false)}
        trip={currentTrip}
      />

      {/* Hotel View Modal */}
      {viewHotelModal && (
        <Modal
          isOpen={Boolean(viewHotelModal)}
          onClose={() => setViewHotelModal(null)}
          title={viewHotelModal.name}
        >
          <div>
            <img
              src={viewHotelModal.image}
              alt={viewHotelModal.name}
              style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>
                ${viewHotelModal.pricePerNight} / night
              </span>
              <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>
                ★ {viewHotelModal.rating} ({viewHotelModal.reviews} reviews)
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.5 }}>
              {viewHotelModal.description}
            </p>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px' }}>Included Amenities:</h5>
            <div className="amenities-list" style={{ marginBottom: '24px' }}>
              {viewHotelModal.amenities?.map((am, i) => (
                <span key={i} className="amenity-chip">{am}</span>
              ))}
            </div>
            <div className="modal-footer" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
              <Button variant="secondary" onClick={() => setViewHotelModal(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  addHotelToTrip(viewHotelModal, 1);
                  setViewHotelModal(null);
                }}
              >
                Add Hotel to Trip
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
