import React, { useState, useEffect } from 'react';
import { useTrips } from '../../context/TripContext';
import Modal from '../Modal';
import Button from '../Button';

export default function AddActivityModal({
  isOpen,
  onClose,
  trip,
  defaultDayNumber = 1,
  initialActivity = null
}) {
  const { addActivity, updateActivity } = useTrips();

  const [dayNumber, setDayNumber] = useState(defaultDayNumber);
  const [formData, setFormData] = useState({
    time: '10:00',
    title: '',
    category: 'Activities',
    location: '',
    notes: '',
    cost: 0
  });

  useEffect(() => {
    if (initialActivity) {
      setFormData({
        time: initialActivity.time || '10:00',
        title: initialActivity.title || '',
        category: initialActivity.category || 'Activities',
        location: initialActivity.location || '',
        notes: initialActivity.notes || '',
        cost: initialActivity.cost || 0
      });
    } else {
      setFormData({
        time: '10:00',
        title: '',
        category: 'Activities',
        location: trip?.destination || '',
        notes: '',
        cost: 0
      });
    }
    setDayNumber(defaultDayNumber);
  }, [initialActivity, defaultDayNumber, isOpen, trip]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trip) return;

    if (initialActivity) {
      updateActivity(trip.id, dayNumber, initialActivity.id, formData);
    } else {
      addActivity(trip.id, dayNumber, formData);
    }

    onClose();
  };

  const daysCount = trip?.itinerary?.length || 3;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialActivity ? 'Edit Activity' : 'Add Activity to Itinerary'}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Day Number</label>
            <select
              className="form-select"
              value={dayNumber}
              onChange={(e) => setDayNumber(Number(e.target.value))}
            >
              {Array.from({ length: daysCount }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  Day {d} {trip?.itinerary?.[d-1]?.title ? `— ${trip.itinerary[d-1].title}` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Activity Time</label>
            <input
              type="time"
              className="form-input"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Activity Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Visit Senso-ji Temple"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Activities">Activities / Sights</option>
              <option value="Food">Food / Dining</option>
              <option value="Hotel">Hotel / Stay</option>
              <option value="Transport">Transport / Flight</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Estimated Cost ($)</label>
            <input
              type="number"
              min="0"
              className="form-input"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Location / Neighborhood</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Asakusa, Tokyo"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notes & Tips</label>
          <textarea
            className="form-textarea"
            rows={3}
            placeholder="e.g. Buy entry tickets online, arrive early for photography..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div className="modal-footer" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {initialActivity ? 'Save Changes' : '+ Add Activity'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
