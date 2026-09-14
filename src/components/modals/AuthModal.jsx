import React, { useState } from 'react';
import { useTrips } from '../../context/TripContext';
import Modal from '../Modal';
import Button from '../Button';
import { Lock, Mail, User } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { updateUserProfile, setIsAuthenticated, showToast } = useTrips();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    if (isRegister) {
      updateUserProfile({
        name: name || email.split('@')[0],
        email: email
      });
      setIsAuthenticated(true);
      showToast(`Welcome to Triply, ${name || email.split('@')[0]}! 🎉`);
    } else {
      setIsAuthenticated(true);
      showToast('Signed in successfully! Welcome back.');
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isRegister ? 'Create your Triply account' : 'Welcome back to Triply'}
      maxWidth="480px"
    >
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          type="button"
          className={`filter-chip ${!isRegister ? 'active' : ''}`}
          style={{ flex: 1, textAlign: 'center' }}
          onClick={() => setIsRegister(false)}
        >
          Sign In
        </button>
        <button
          type="button"
          className={`filter-chip ${isRegister ? 'active' : ''}`}
          style={{ flex: 1, textAlign: 'center' }}
          onClick={() => setIsRegister(true)}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Elena Rostova"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isRegister}
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            placeholder="alex.mercer@triply.io"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: '24px' }}>
          <Button variant="primary" style={{ width: '100%' }} type="submit">
            {isRegister ? 'Create Free Account' : 'Sign In to Dashboard'}
          </Button>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '16px' }}>
          By signing in, you agree to Triply's Terms of Service and Privacy Policy. Demo account saved in local session.
        </p>
      </form>
    </Modal>
  );
}
