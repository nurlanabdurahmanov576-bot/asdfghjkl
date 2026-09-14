import React from 'react';
import { Clock, MapPin, Edit3, Trash2, Tag } from 'lucide-react';

export default function ActivityCard({ activity, onEdit, onDelete }) {
  const getCategoryColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'hotel': return { bg: '#e0e7ff', text: '#3730a3' };
      case 'food': return { bg: '#fee2e2', text: '#991b1b' };
      case 'transport': return { bg: '#e0f2fe', text: '#0369a1' };
      case 'activities': return { bg: '#f3e8ff', text: '#6b21a8' };
      case 'shopping': return { bg: '#fef3c7', text: '#92400e' };
      default: return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  const catStyle = getCategoryColor(activity.category);

  return (
    <div className="activity-card">
      <div className="activity-time-pill">
        <Clock size={13} />
        <span>{activity.time || '12:00'}</span>
      </div>

      <div className="activity-main-info">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <h4 className="activity-title">{activity.title}</h4>
          {activity.cost > 0 ? (
            <span className="activity-cost-badge">${activity.cost}</span>
          ) : (
            <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>Free</span>
          )}
        </div>

        {activity.notes && (
          <p className="activity-notes">{activity.notes}</p>
        )}

        <div className="activity-meta-line">
          {activity.category && (
            <span
              className="activity-tag"
              style={{ background: catStyle.bg, color: catStyle.text }}
            >
              <Tag size={11} />
              {activity.category}
            </span>
          )}

          {activity.location && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <MapPin size={12} />
              {activity.location}
            </span>
          )}
        </div>
      </div>

      <div className="activity-actions">
        <button
          type="button"
          className="navbar-icon-btn"
          style={{ width: '32px', height: '32px' }}
          onClick={() => onEdit(activity)}
          title="Edit Activity"
        >
          <Edit3 size={15} />
        </button>
        <button
          type="button"
          className="navbar-icon-btn"
          style={{ width: '32px', height: '32px', color: '#ef4444' }}
          onClick={() => onDelete(activity.id)}
          title="Delete Activity"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
