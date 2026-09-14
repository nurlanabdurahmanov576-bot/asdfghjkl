import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Compass, Layers, Info } from 'lucide-react';
import L from 'leaflet';

export default function InteractiveMap({ trip, places = [], hotels = [], restaurants = [] }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [filterType, setFilterType] = useState('all'); // all, hotel, attraction, restaurant, airport
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [useLeaflet, setUseLeaflet] = useState(true);

  // Derive points from trip destination & activities
  const destinationName = trip?.destination || 'Tokyo';

  // Gather markers for this destination
  const getPoints = () => {
    const list = [];

    // Airport
    if (destinationName.toLowerCase() === 'tokyo') {
      list.push({
        id: 'pt-airport',
        name: 'Haneda International Airport (HND)',
        category: 'airport',
        typeLabel: 'Airport',
        lat: 35.5494,
        lng: 139.7798,
        description: 'Gateway arrival for Tokyo international flights'
      });
      list.push({
        id: 'pt-hotel',
        name: 'Cerulean Tower Tokyu Hotel',
        category: 'hotel',
        typeLabel: 'Hotel',
        lat: 35.6560,
        lng: 139.6998,
        description: '5-star Luxury stay in Shibuya'
      });
      list.push({
        id: 'pt-sensoji',
        name: 'Senso-ji Temple',
        category: 'attraction',
        typeLabel: 'Attraction',
        lat: 35.7148,
        lng: 139.7967,
        description: 'Tokyo’s oldest historical temple'
      });
      list.push({
        id: 'pt-skytree',
        name: 'Tokyo Skytree',
        category: 'attraction',
        typeLabel: 'Attraction',
        lat: 35.7100,
        lng: 139.8107,
        description: 'Iconic observation tower and skyline view'
      });
      list.push({
        id: 'pt-jiro',
        name: 'Sukiyabashi Jiro Ginza',
        category: 'restaurant',
        typeLabel: 'Restaurant',
        lat: 35.6719,
        lng: 139.7645,
        description: 'Legendary Edomae sushi'
      });
      list.push({
        id: 'pt-ichiran',
        name: 'Ichiran Shibuya Ramen',
        category: 'restaurant',
        typeLabel: 'Restaurant',
        lat: 35.6612,
        lng: 139.6995,
        description: 'Specialty tonkotsu ramen dining'
      });
    } else if (destinationName.toLowerCase() === 'paris') {
      list.push({
        id: 'pt-cdg',
        name: 'Paris Charles de Gaulle Airport (CDG)',
        category: 'airport',
        typeLabel: 'Airport',
        lat: 49.0097,
        lng: 2.5479,
        description: 'Main international airport'
      });
      list.push({
        id: 'pt-hotel-paris',
        name: 'Hôtel Plaza Athénée',
        category: 'hotel',
        typeLabel: 'Hotel',
        lat: 48.8661,
        lng: 2.3045,
        description: 'Iconic luxury hotel near Champs-Élysées'
      });
      list.push({
        id: 'pt-eiffel',
        name: 'Eiffel Tower',
        category: 'attraction',
        typeLabel: 'Attraction',
        lat: 48.8584,
        lng: 2.2945,
        description: 'Champ de Mars landmark'
      });
      list.push({
        id: 'pt-louvre',
        name: 'Louvre Museum',
        category: 'attraction',
        typeLabel: 'Attraction',
        lat: 48.8606,
        lng: 2.3376,
        description: 'World-famous fine arts museum'
      });
      list.push({
        id: 'pt-comptoir',
        name: 'Le Comptoir du Relais',
        category: 'restaurant',
        typeLabel: 'Restaurant',
        lat: 48.8524,
        lng: 2.3385,
        description: 'Bistro classics in Saint-Germain'
      });
    } else {
      // Generic points around destination coordinates or center
      const centerLat = 35.6762;
      const centerLng = 139.6503;
      list.push({ id: 'pt-1', name: `${destinationName} Airport`, category: 'airport', typeLabel: 'Airport', lat: centerLat - 0.08, lng: centerLng + 0.05, description: 'Primary airport' });
      list.push({ id: 'pt-2', name: 'Grand Luxury Hotel', category: 'hotel', typeLabel: 'Hotel', lat: centerLat + 0.01, lng: centerLng - 0.01, description: 'Main accommodation' });
      list.push({ id: 'pt-3', name: 'Historic City Center', category: 'attraction', typeLabel: 'Attraction', lat: centerLat + 0.03, lng: centerLng + 0.02, description: 'Top rated sightseeing' });
      list.push({ id: 'pt-4', name: 'Gourmet Local Restaurant', category: 'restaurant', typeLabel: 'Restaurant', lat: centerLat - 0.02, lng: centerLng + 0.01, description: 'Authentic regional dishes' });
    }

    return list;
  };

  const points = getPoints();
  const filteredPoints = filterType === 'all'
    ? points
    : points.filter(p => p.category === filterType);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      if (!mapInstanceRef.current) {
        const centerLat = points[0]?.lat || 35.6762;
        const centerLng = points[0]?.lng || 139.6503;

        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: 12,
          zoomControl: true
        });

        // OpenStreetMap Tile Layer with clean light style
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear existing markers & layers
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          map.removeLayer(layer);
        }
      });

      // Marker color mapping
      const getMarkerColor = (cat) => {
        switch (cat) {
          case 'hotel': return '#3b82f6';
          case 'attraction': return '#8b5cf6';
          case 'restaurant': return '#ec4899';
          case 'airport': return '#10b981';
          default: return '#4f46e5';
        }
      };

      const latLngs = [];

      filteredPoints.forEach((pt) => {
        const color = getMarkerColor(pt.category);
        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="
              background-color: ${color};
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 3px solid #ffffff;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 14px;
              font-weight: bold;
              cursor: pointer;
            ">
              ${pt.category === 'hotel' ? '🏨' : (pt.category === 'restaurant' ? '🍽️' : (pt.category === 'airport' ? '✈️' : '📍'))}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([pt.lat, pt.lng], { icon: customIcon }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: system-ui; padding: 4px;">
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: ${color};">
              ${pt.typeLabel}
            </span>
            <h4 style="margin: 4px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${pt.name}</h4>
            <p style="margin: 0; font-size: 12px; color: #64748b;">${pt.description}</p>
          </div>
        `);

        marker.on('click', () => {
          setSelectedPoint(pt);
        });

        latLngs.push([pt.lat, pt.lng]);
      });

      // Add connecting route polyline if more than 1 point
      if (latLngs.length > 1 && filterType === 'all') {
        L.polyline(latLngs, {
          color: '#4f46e5',
          weight: 4,
          opacity: 0.75,
          dashArray: '8, 8',
          lineCap: 'round'
        }).addTo(map);
      }

      // Auto fit bounds
      if (latLngs.length > 0) {
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }

    } catch (err) {
      console.warn('Leaflet initialization skipped, fallback mode active:', err);
      setUseLeaflet(false);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [filterType, trip]);

  return (
    <div className="map-container-wrap">
      {/* Top Filter Bar */}
      <div className="map-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={20} style={{ color: 'var(--primary)' }} />
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Trip Route & Map Explorer</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Interactive stops and travel path in {destinationName}
            </span>
          </div>
        </div>

        <div className="map-layer-filters">
          <button
            type="button"
            className={`filter-chip ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Places ({points.length})
          </button>
          <button
            type="button"
            className={`filter-chip ${filterType === 'hotel' ? 'active' : ''}`}
            onClick={() => setFilterType('hotel')}
          >
            🏨 Hotels
          </button>
          <button
            type="button"
            className={`filter-chip ${filterType === 'attraction' ? 'active' : ''}`}
            onClick={() => setFilterType('attraction')}
          >
            📍 Attractions
          </button>
          <button
            type="button"
            className={`filter-chip ${filterType === 'restaurant' ? 'active' : ''}`}
            onClick={() => setFilterType('restaurant')}
          >
            🍽️ Restaurants
          </button>
          <button
            type="button"
            className={`filter-chip ${filterType === 'airport' ? 'active' : ''}`}
            onClick={() => setFilterType('airport')}
          >
            ✈️ Airport
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="map-canvas-area">
        <div ref={mapContainerRef} className="leaflet-map-element" />

        {/* Selected Point Overlay Card */}
        {selectedPoint && (
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              zIndex: 1000,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              padding: '16px 20px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              maxWidth: '320px',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: 'var(--primary)'
                }}
              >
                {selectedPoint.typeLabel}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPoint(null)}
                style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 4 }}>
              {selectedPoint.name}
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              {selectedPoint.description}
            </p>
          </div>
        )}
      </div>

      {/* Route Legend */}
      <div className="map-route-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#10b981' }} />
          <span>Airport Point</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#3b82f6' }} />
          <span>Hotel Stay</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#8b5cf6' }} />
          <span>Attractions & Sightseeing</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#ec4899' }} />
          <span>Dining & Restaurants</span>
        </div>
        <div className="legend-item">
          <span style={{ color: 'var(--primary)', fontWeight: 800 }}>- - -</span>
          <span>Optimized Route Waypoints</span>
        </div>
      </div>
    </div>
  );
}
