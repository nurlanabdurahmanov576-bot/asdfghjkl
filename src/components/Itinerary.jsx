import React, { useState } from 'react';
import { Calendar, Plus, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import ActivityCard from './ActivityCard';
import Button from './Button';
import AddActivityModal from './modals/AddActivityModal';

export default function Itinerary({ trip }) {
  const { deleteActivity, addDay } = useTrips();
  const [collapsedDays, setCollapsedDays] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDayForAdd, setSelectedDayForAdd] = useState(1);
  const [editingActivity, setEditingActivity] = useState(null);

  const toggleDayCollapse = (dayNumber) => {
    setCollapsedDays(prev => ({
      ...prev,
      [dayNumber]: !prev[dayNumber]
    }));
  };

  const handleOpenAddModal = (dayNumber) => {
    setSelectedDayForAdd(dayNumber);
    setEditingActivity(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (dayNumber, activity) => {
    setSelectedDayForAdd(dayNumber);
    setEditingActivity(activity);
    setModalOpen(true);
  };

  const itineraryDays = trip?.itinerary || [];

  return (
    <div className="itinerary-container">
      <div className="itinerary-top-bar">
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Trip Itinerary Schedule</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {itineraryDays.length} Days Planned in {trip?.destination || 'Destination'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => addDay(trip.id)}
            icon={Plus}
          >
            Add Day
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenAddModal(1)}
            icon={Plus}
          >
            Add Activity
          </Button>
        </div>
      </div>

      {itineraryDays.map((day) => {
        const isCollapsed = collapsedDays[day.dayNumber];
        const activities = day.activities || [];

        return (
          <div key={day.dayNumber} className="day-timeline-card">
            <div className="day-timeline-header">
              <div className="day-badge-title">
                <span className="day-number-pill">DAY {day.dayNumber}</span>
                <div>
                  <h4 className="day-title-text">{day.title || `Day ${day.dayNumber}`}</h4>
                  {day.date && (
                    <span className="day-date-text">
                      <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />
                      {day.date}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenAddModal(day.dayNumber)}
                  icon={Plus}
                >
                  Add activity
                </Button>
                <button
                  type="button"
                  className="navbar-icon-btn"
                  style={{ width: '34px', height: '34px' }}
                  onClick={() => toggleDayCollapse(day.dayNumber)}
                >
                  {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>
              </div>
            </div>

            {!isCollapsed && (
              <div className="day-activities-list">
                {activities.length === 0 ? (
                  <div
                    style={{
                      padding: '32px 16px',
                      textAlign: 'center',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px dashed var(--border)'
                    }}
                  >
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>
                      No activities scheduled for this day yet.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenAddModal(day.dayNumber)}
                      icon={Plus}
                    >
                      + Add activity
                    </Button>
                  </div>
                ) : (
                  activities.map((act) => (
                    <ActivityCard
                      key={act.id}
                      activity={act}
                      onEdit={(a) => handleOpenEditModal(day.dayNumber, a)}
                      onDelete={(id) => deleteActivity(trip.id, day.dayNumber, id)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Add / Edit Activity Modal */}
      <AddActivityModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingActivity(null);
        }}
        trip={trip}
        defaultDayNumber={selectedDayForAdd}
        initialActivity={editingActivity}
      />
    </div>
  );
}
