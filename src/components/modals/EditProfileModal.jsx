import React, { useState, useEffect } from 'react';
import { useTrips } from '../../context/TripContext';
import Modal from '../Modal';
import Button from '../Button';

export default function EditProfileModal({ isOpen, onClose }) {
  const { user, updateUserProfile } = useTrips();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    favoriteDestination: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
        favoriteDestination: user.favoriteDestination || '',
        bio: user.bio || ''
      });
    }
  }, [user, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile Details">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Avatar Image URL</label>
          <input
            type="url"
            className="form-input"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Favorite Travel Destination</label>
          <input
            type="text"
            className="form-input"
            value={formData.favoriteDestination}
            onChange={(e) => setFormData({ ...formData, favoriteDestination: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Bio & Travel Philosophy</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        <div className="modal-footer" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Profile
          </Button>
        </div>
      </form>
    </Modal>
  );
}
