import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CATEGORIES } from '../data/categories';

// Category color map
const CATEGORY_COLORS = {
  nature: '#059669',
  spa: '#0d9488',
  country: '#b45309',
  active: '#2563eb',
  gastro: '#ea580c',
  culture: '#7c3aed'
};

// Custom SVG icon generator for places
function createPlaceIcon(color = '#0d9488', title = '') {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(0,0,0,0.3);
        border: 2px solid #ffffff;
      ">
        <div style="
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ffffff;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32]
  });
}

// Custom SVG icon generator for airports
function createAirportIcon() {
  return L.divIcon({
    className: 'custom-airport-marker',
    html: `
      <div style="
        background-color: #0284c7;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);
        border: 2.5px solid #ffffff;
        color: white;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });
}

export default function MapView({
  places = [],
  singlePlace = null,
  airport = null,
  showRoute = false,
  className = 'h-[500px] w-full',
  center = [55.7558, 37.6173],
  zoom = 5
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Determine initial center
    let initialCenter = center;
    let initialZoom = zoom;

    if (singlePlace) {
      initialCenter = [singlePlace.lat, singlePlace.lng];
      initialZoom = 11;
    } else if (places.length > 0) {
      initialCenter = [places[0].lat, places[0].lng];
      initialZoom = 5;
    }

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      scrollWheelZoom: false
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);

    const bounds = L.latLngBounds([]);

    // Mode 1: Multiple places
    if (places.length > 0 && !singlePlace) {
      places.forEach((place) => {
        if (!place.lat || !place.lng) return;

        const color = CATEGORY_COLORS[place.category] || '#0d9488';
        const icon = createPlaceIcon(color, place.title);
        const marker = L.marker([place.lat, place.lng], { icon }).addTo(map);

        bounds.extend([place.lat, place.lng]);

        const popupContent = `
          <div style="width: 220px; font-family: 'Plus Jakarta Sans', sans-serif;">
            <img src="${place.images[0]}" alt="${place.title}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 12px 12px 0 0;" />
            <div style="padding: 10px 12px;">
              <span style="font-size: 11px; font-weight: 700; color: ${color}; text-transform: uppercase;">${place.city}</span>
              <h4 style="margin: 2px 0 4px; font-size: 13px; font-weight: 700; color: #0f172a; line-height: 1.2;">${place.title}</h4>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
                <span style="font-size: 12px; font-weight: 800; color: #0f172a;">${place.price.toLocaleString('ru-RU')} ₽</span>
                <a href="/place/${place.id}" style="font-size: 11px; font-weight: 700; color: #0d9488; text-decoration: none;">Подробнее &rarr;</a>
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      }
    }

    // Mode 2: Single Place (and optional Airport + Route)
    if (singlePlace) {
      const color = CATEGORY_COLORS[singlePlace.category] || '#0d9488';
      const placeIcon = createPlaceIcon(color, singlePlace.title);
      const placeMarker = L.marker([singlePlace.lat, singlePlace.lng], { icon: placeIcon }).addTo(map);

      bounds.extend([singlePlace.lat, singlePlace.lng]);

      const placePopup = `
        <div style="padding: 10px 12px; font-family: 'Plus Jakarta Sans', sans-serif;">
          <span style="font-size: 11px; font-weight: 700; color: ${color};">${singlePlace.city}</span>
          <h4 style="margin: 4px 0; font-size: 13px; font-weight: 700; color: #0f172a;">${singlePlace.title}</h4>
          <p style="margin: 0; font-size: 11px; color: #64748b;">${singlePlace.address}</p>
        </div>
      `;
      placeMarker.bindPopup(placePopup).openPopup();

      // If airport is provided
      if (airport && airport.lat && airport.lng) {
        const airportIcon = createAirportIcon();
        const airportMarker = L.marker([airport.lat, airport.lng], { icon: airportIcon }).addTo(map);

        bounds.extend([airport.lat, airport.lng]);

        const airportPopup = `
          <div style="padding: 10px 12px; font-family: 'Plus Jakarta Sans', sans-serif;">
            <span style="font-size: 10px; font-weight: 800; color: #0284c7; text-transform: uppercase;">Ближайший аэропорт</span>
            <h4 style="margin: 4px 0; font-size: 13px; font-weight: 700; color: #0f172a;">${airport.airportName} (${airport.iata})</h4>
            <p style="margin: 0; font-size: 11px; color: #64748b;">${airport.distanceKm} км от места отдыха &middot; ${airport.driveTime}</p>
          </div>
        `;
        airportMarker.bindPopup(airportPopup);

        // Draw route polyline
        if (showRoute) {
          const latlngs = [
            [airport.lat, airport.lng],
            [singlePlace.lat, singlePlace.lng]
          ];

          L.polyline(latlngs, {
            color: '#0d9488',
            weight: 4,
            dashArray: '8, 8',
            opacity: 0.85
          }).addTo(map);
        }
      }

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13 });
      }
    }

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [places, singlePlace, airport, showRoute]);

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-slate-200 shadow-soft ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
