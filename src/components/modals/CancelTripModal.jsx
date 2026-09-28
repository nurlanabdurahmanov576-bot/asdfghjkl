import React from 'react';
import { useTrips } from '../../context/TripContext';
import Modal from '../Modal';
import Button from '../Button';
import { AlertTriangle, Ban, Trash2, RotateCcw } from 'lucide-react';

export default function CancelTripModal({ isOpen, onClose, trip }) {
  const { cancelTrip, restoreTrip, deleteTrip } = useTrips();

  if (!trip) return null;

  const isCancelled = trip.status === 'Cancelled';

  const handleCancel = () => {
    cancelTrip(trip.id);
    onClose();
  };

  const handleRestore = () => {
    restoreTrip(trip.id);
    onClose();
  };

  const handleDelete = () => {
    deleteTrip(trip.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isCancelled ? 'Manage Cancelled Trip' : 'Cancel or Modify Trip'}
      maxWidth="500px"
    >
      <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: isCancelled ? '#ecfdf5' : '#fee2e2',
            color: isCancelled ? '#10b981' : '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}
        >
          {isCancelled ? <RotateCcw size={28} /> : <AlertTriangle size={28} />}
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 8 }}>
          {isCancelled ? `Reactivate "${trip.title}"?` : `Cancel "${trip.title}"?`}
        </h3>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, maxWidth: '400px', margin: '0 auto' }}>
          {isCancelled
            ? 'This trip is currently marked as Cancelled. You can restore it to Upcoming status, or remove it permanently from your account.'
            : 'You can mark this trip as Cancelled to keep your notes and itinerary for future reference, or permanently remove it.'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isCancelled ? (
          <Button
            variant="primary"
            onClick={handleRestore}
            icon={RotateCcw}
            style={{ width: '100%', padding: '12px' }}
          >
            Restore Trip (Возобновить поездку)
          </Button>
        ) : (
          <Button
            variant="danger"
            onClick={handleCancel}
            icon={Ban}
            style={{ width: '100%', padding: '12px' }}
          >
            Cancel Trip (Отменить поездку)
          </Button>
        )}

        <Button
          variant="secondary"
          onClick={handleDelete}
          icon={Trash2}
          style={{ width: '100%', padding: '12px', color: '#dc2626' }}
        >
          Delete Permanently (Удалить насовсем)
        </Button>

        <Button
          variant="ghost"
          onClick={onClose}
          style={{ width: '100%', padding: '10px' }}
        >
          Back (Назад)
        </Button>
      </div>
    </Modal>
  );
}
