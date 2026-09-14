import React, { useState } from 'react';
import { DollarSign, Plus, Trash2, PieChart, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import Button from './Button';
import AddExpenseModal from './modals/AddExpenseModal';

export default function BudgetTracker({ trip }) {
  const { deleteExpense } = useTrips();
  const [modalOpen, setModalOpen] = useState(false);

  const categories = [
    { key: 'Flights', label: 'Flights', color: '#3b82f6' },
    { key: 'Hotels', label: 'Hotels', color: '#6366f1' },
    { key: 'Food', label: 'Food', color: '#f43f5e' },
    { key: 'Transport', label: 'Transport', color: '#06b6d4' },
    { key: 'Activities', label: 'Activities', color: '#a855f7' },
    { key: 'Shopping', label: 'Shopping', color: '#f59e0b' },
    { key: 'Other', label: 'Other', color: '#64748b' }
  ];

  const totalBudget = trip?.budget || 2500;
  const expenses = trip?.expenses || [];

  const totalSpent = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const remaining = totalBudget - totalSpent;
  const percentSpent = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;
  const isOverBudget = remaining < 0;

  // Breakdown by category
  const categoryTotals = categories.reduce((acc, cat) => {
    acc[cat.key] = expenses
      .filter(e => (e.category || '').toLowerCase() === cat.key.toLowerCase())
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    return acc;
  }, {});

  return (
    <div>
      {/* 3 Summary Cards */}
      <div className="budget-summary-grid">
        <div className="budget-card highlight">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="budget-title">Total Budget</span>
            <DollarSign size={20} />
          </div>
          <span className="budget-amount">${totalBudget.toLocaleString()}</span>
          <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>Allocated for {trip?.title}</span>
        </div>

        <div className="budget-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="budget-title">Total Spent</span>
            <TrendingUp size={20} style={{ color: '#f43f5e' }} />
          </div>
          <span className="budget-amount" style={{ color: '#f43f5e' }}>
            ${totalSpent.toLocaleString()}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {percentSpent}% of planned budget
          </span>
        </div>

        <div className="budget-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="budget-title">Remaining</span>
            {isOverBudget ? (
              <AlertCircle size={20} style={{ color: '#dc2626' }} />
            ) : (
              <CheckCircle2 size={20} style={{ color: '#10b981' }} />
            )}
          </div>
          <span
            className="budget-amount"
            style={{ color: isOverBudget ? '#dc2626' : '#10b981' }}
          >
            ${remaining.toLocaleString()}
          </span>
          <span style={{ fontSize: '0.8rem', color: isOverBudget ? '#dc2626' : '#10b981' }}>
            {isOverBudget ? 'Over budget!' : 'Available to spend'}
          </span>
        </div>
      </div>

      {/* Visual Progress Bar & Category Spectrum */}
      <div className="budget-progress-wrap">
        <div className="progress-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PieChart size={18} style={{ color: 'var(--primary)' }} />
            <span>Budget Utilization</span>
          </div>
          <span style={{ color: isOverBudget ? '#dc2626' : 'var(--primary)', fontWeight: 700 }}>
            {percentSpent}% Spent
          </span>
        </div>

        <div className="progress-bar-bg" style={{ height: '18px', display: 'flex' }}>
          {totalSpent > 0 ? (
            categories.map(cat => {
              const spent = categoryTotals[cat.key] || 0;
              const pct = (spent / totalSpent) * 100;
              if (pct === 0) return null;
              return (
                <div
                  key={cat.key}
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    backgroundColor: cat.color
                  }}
                  title={`${cat.label}: $${spent} (${Math.round(pct)}%)`}
                />
              );
            })
          ) : (
            <div style={{ width: '0%' }} />
          )}
        </div>

        {/* Category Legend & Totals */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px',
            marginTop: '20px'
          }}
        >
          {categories.map(cat => {
            const spent = categoryTotals[cat.key] || 0;
            return (
              <div
                key={cat.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--bg-subtle)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '4px',
                    backgroundColor: cat.color,
                    flexShrink: 0
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {cat.label}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                    ${spent}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="expenses-table-wrap">
        <div className="table-header-line">
          <div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Expense Records</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {expenses.length} tracked items
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setModalOpen(true)}
            icon={Plus}
          >
            Add Expense
          </Button>
        </div>

        {expenses.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No expenses tracked yet. Click "Add Expense" to log your first payment!
          </div>
        ) : (
          <div>
            {expenses.map((item) => (
              <div key={item.id} className="expense-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span className="expense-category-pill">{item.category}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.95rem' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {item.date}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-dark)' }}>
                    ${Number(item.amount).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    className="navbar-icon-btn"
                    style={{ width: '32px', height: '32px', color: '#ef4444' }}
                    onClick={() => deleteExpense(trip.id, item.id)}
                    title="Delete expense"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal to add an expense */}
      <AddExpenseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tripId={trip.id}
      />
    </div>
  );
}
