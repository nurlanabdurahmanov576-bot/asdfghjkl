import React from 'react';
import { Calendar, Users, DollarSign, ExternalLink, Edit3, Trash2, MapPin } from 'lucide-react';
import Button from './Button';

export default function TripCard({ trip, onOpen, onEdit, onDelete }) {
  return (
    <div className="my-trip-card">
      <div className="trip-card-thumb">
        <img src={trip.coverImage} alt={trip.title} loading="lazy" />
        <span className={`trip-status-tag ${trip.status === 'Upcoming' ? 'active' : ''}`}>
          {trip.status || 'Active'}
        </span>
      </div>

      <div className="trip-card-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
          <MapPin size={13} />
          <span>{trip.destination}, {trip.country}</span>
        </div>

        <h3 className="trip-card-title">{trip.title}</h3>

        <div className="trip-card-dates">
          <Calendar size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
          {trip.datesDisplay || `${trip.startDate} — ${trip.endDate}`}
        </div>

        <div className="trip-card-details-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-dark)' }}>
            <Users size={15} style={{ color: 'var(--text-muted)' }} />
            <span>{trip.travelersDisplay || `${trip.travelers} Travelers`}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669' }}>
            <DollarSign size={15} />
            <span>${trip.budget?.toLocaleString() || '2,500'}</span>
          </div>
        </div>

        <div className="trip-card-actions">
          <Button
            variant="primary"
            size="sm"
            style={{ flex: 1 }}
            onClick={() => onOpen(trip)}
            icon={ExternalLink}
          >
            Open
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(trip)}
            icon={Edit3}
            title="Edit trip"
          >
            Edit
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(trip.id)}
            icon={Trash2}
            title="Delete trip"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
