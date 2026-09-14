import React, { useState } from 'react';
import { useTrips } from '../../context/TripContext';
import Modal from '../Modal';
import Button from '../Button';

export default function AddExpenseModal({ isOpen, onClose, tripId }) {
  const { addExpense } = useTrips();

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    addExpense(tripId, {
      title: formData.title,
      amount: Number(formData.amount),
      category: formData.category,
      date: formData.date
    });

    setFormData({
      title: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0]
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Expense Description</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Dinner at Ichiran Ramen"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.5"
              className="form-input"
              placeholder="e.g. 45.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Flights">Flights</option>
              <option value="Hotels">Hotels</option>
              <option value="Food">Food & Dining</option>
              <option value="Transport">Transport</option>
              <option value="Activities">Activities & Attractions</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-input"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="modal-footer" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
}
