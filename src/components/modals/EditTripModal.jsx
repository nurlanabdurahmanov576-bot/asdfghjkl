import React, { useState, useEffect } from 'react';
import { useTrips } from '../../context/TripContext';
import Modal from '../Modal';
import Button from '../Button';

export default function EditTripModal({ isOpen, onClose, trip }) {
  const { updateTrip } = useTrips();

  const [formData, setFormData] = useState({
    title: '',
    datesDisplay: '',
    travelers: 2,
    budget: 2500,
    coverImage: ''
  });

  useEffect(() => {
    if (trip) {
      setFormData({
        title: trip.title || '',
        datesDisplay: trip.datesDisplay || '',
        travelers: trip.travelers || 2,
        budget: trip.budget || 2000,
        coverImage: trip.coverImage || ''
      });
    }
  }, [trip, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trip) return;

    updateTrip(trip.id, {
      title: formData.title,
      datesDisplay: formData.datesDisplay,
      travelers: Number(formData.travelers),
      travelersDisplay: `${formData.travelers} ${Number(formData.travelers) === 1 ? 'Traveler' : 'Travelers'}`,
      budget: Number(formData.budget),
      coverImage: formData.coverImage
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Trip Details">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Trip Title</label>
          <input
            type="text"
            className="form-input"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Dates Display</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Oct 12 — Oct 20"
            value={formData.datesDisplay}
            onChange={(e) => setFormData({ ...formData, datesDisplay: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Travelers Count</label>
            <input
              type="number"
              min="1"
              max="20"
              className="form-input"
              value={formData.travelers}
              onChange={(e) => setFormData({ ...formData, travelers: Number(e.target.value) })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Total Budget ($)</label>
            <input
              type="number"
              min="100"
              step="50"
              className="form-input"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Cover Image URL</label>
          <input
            type="url"
            className="form-input"
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
          />
        </div>

        <div className="modal-footer" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
