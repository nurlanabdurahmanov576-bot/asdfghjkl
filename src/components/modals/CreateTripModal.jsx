import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import Modal from '../Modal';
import Button from '../Button';
import { Compass, Calendar, Users, DollarSign, Image } from 'lucide-react';

export default function CreateTripModal({ isOpen, onClose }) {
  const { createTrip, destinations } = useTrips();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    destination: 'Tokyo',
    startDate: '2026-10-12',
    endDate: '2026-10-20',
    travelers: 2,
    budget: 2500,
    coverImage: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dest = destinations.find(d => d.name.toLowerCase() === formData.destination.toLowerCase());
    const finalCover = formData.coverImage || dest?.image || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80';

    createTrip({
      title: formData.title || `${formData.destination} Adventure`,
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
      travelers: formData.travelers,
      budget: formData.budget,
      coverImage: finalCover
    });

    onClose();
    navigate('/planner');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Trip">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Trip Name (optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Tokyo Autumn Adventure"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Destination</label>
          <select
            className="form-select"
            value={formData.destination}
            onChange={(e) => handleChange('destination', e.target.value)}
          >
            {destinations.map(d => (
              <option key={d.id} value={d.name}>
                {d.name} ({d.country})
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Travelers</label>
            <select
              className="form-select"
              value={formData.travelers}
              onChange={(e) => handleChange('travelers', Number(e.target.value))}
            >
              <option value={1}>1 Solo traveler</option>
              <option value={2}>2 Travelers (Couple/Friends)</option>
              <option value={3}>3 Travelers</option>
              <option value={4}>4 Travelers (Group/Family)</option>
              <option value={5}>5+ Travelers</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Target Budget ($)</label>
            <input
              type="number"
              className="form-input"
              min="100"
              step="50"
              value={formData.budget}
              onChange={(e) => handleChange('budget', Number(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Custom Cover Image URL (optional)</label>
          <input
            type="url"
            className="form-input"
            placeholder="https://images.unsplash.com/..."
            value={formData.coverImage}
            onChange={(e) => handleChange('coverImage', e.target.value)}
          />
        </div>

        <div className="modal-footer" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create Trip
          </Button>
        </div>
      </form>
    </Modal>
  );
}
