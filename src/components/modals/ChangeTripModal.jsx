import React, { useState, useEffect } from 'react';
import { useTrips } from '../../context/TripContext';
import Modal from '../Modal';
import Button from '../Button';
import { RefreshCw, MapPin, Calendar, DollarSign } from 'lucide-react';

export default function ChangeTripModal({ isOpen, onClose, trip }) {
  const { changeTripDestination, destinations, formatCurrency } = useTrips();

  const [destination, setDestination] = useState('Paris');
  const [title, setTitle] = useState('');
  const [datesDisplay, setDatesDisplay] = useState('');
  const [budget, setBudget] = useState(2500);

  useEffect(() => {
    if (trip) {
      setDestination(trip.destination || 'Paris');
      setTitle(trip.title || '');
      setDatesDisplay(trip.datesDisplay || 'Oct 12 — Oct 20');
      setBudget(trip.budget || 2500);
    }
  }, [trip, isOpen]);

  const handleDestinationChange = (newDest) => {
    setDestination(newDest);
    const destObj = destinations.find(d => d.name.toLowerCase() === newDest.toLowerCase());
    if (destObj) {
      setTitle(`${destObj.name} Adventure`);
      setBudget(destObj.costValue || 2500);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trip) return;

    changeTripDestination(
      trip.id,
      destination,
      title || `${destination} Adventure`,
      Number(budget),
      datesDisplay
    );

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Trip & Destination">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Select New Destination City</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} style={{ color: 'var(--primary)' }} />
            <select
              className="form-select"
              value={destination}
              onChange={(e) => handleDestinationChange(e.target.value)}
            >
              {destinations.map(d => (
                <option key={d.id} value={d.name}>
                  {d.name}, {d.country} (Avg. {formatCurrency(d.costValue || 2500)})
                </option>
              ))}
            </select>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Changing the destination will update landmarks, hotels, route map coordinates, and cover imagery.
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">Custom Trip Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Paris Romantic Escape"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Travel Dates</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Nov 05 — Nov 12"
              value={datesDisplay}
              onChange={(e) => setDatesDisplay(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Target Budget ($)</label>
            <input
              type="number"
              min="200"
              step="50"
              className="form-input"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="modal-footer" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={RefreshCw}>
            Confirm Change
          </Button>
        </div>
      </form>
    </Modal>
  );
}
