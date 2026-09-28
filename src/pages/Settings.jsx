import React, { useState } from 'react';
import { useTrips } from '../context/TripContext';
import Button from '../components/Button';
import ChangeTripModal from '../components/modals/ChangeTripModal';
import CancelTripModal from '../components/modals/CancelTripModal';
import {
  Settings as SettingsIcon,
  Coins,
  DollarSign,
  ArrowRightLeft,
  Globe,
  Bell,
  RotateCcw,
  Ban,
  CheckCircle,
  RefreshCw,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function Settings() {
  const {
    selectedCurrency,
    setSelectedCurrency,
    currencies,
    currencyList,
    formatCurrency,
    convertCurrency,
    currentTrip,
    trips,
    setActiveTripId,
    destinations,
    resetAllData
  } = useTrips();

  // Converter interactive state
  const [calcAmount, setCalcAmount] = useState(100);
  const [calcBaseCurrency, setCalcBaseCurrency] = useState('USD');
  const [calcTargetCurrency, setCalcTargetCurrency] = useState('RUB');

  // Modals state
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Notification toggle state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [priceDropAlerts, setPriceDropAlerts] = useState(true);

  // Convert calculation
  const calculatedResult = convertCurrency(calcAmount, calcBaseCurrency, calcTargetCurrency);

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div className="section-badge" style={{ marginBottom: '6px' }}>
            <SettingsIcon size={16} />
            Application Settings & Tools
          </div>
          <h1 className="section-title">Настройки и калькулятор валют</h1>
          <p className="section-description">
            Управляйте валютой отображения цен, конвертером стоимости для разных стран, статусом поездок и параметрами приложения.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* SECTION 1: GLOBAL CURRENCY SELECTOR */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border)',
              padding: '28px',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div className="stat-icon-wrap emerald">
                <Coins size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Основная валюта отображения</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Все цены отелей, ресторанов, достопримечательностей и бюджета на сайте будут автоматически пересчитаны в выбранную валюту.
                </p>
              </div>
            </div>

            {/* Currency Choice Pills */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
                gap: '12px',
                marginTop: '18px'
              }}
            >
              {currencyList.map((curr) => {
                const isSelected = selectedCurrency === curr.code;
                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => setSelectedCurrency(curr.code)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-lg)',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--primary-light)' : '#ffffff',
                      color: isSelected ? 'var(--primary)' : 'var(--text-dark)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{curr.flag}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                        {curr.code} ({curr.symbol})
                      </span>
                      <span style={{ fontSize: '0.75rem', color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {curr.name.split('(')[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: LIVE MULTI-CURRENCY CONVERTER & COST COMPARISON */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border)',
              padding: '28px',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div className="stat-icon-wrap blue">
                <ArrowRightLeft size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  Переводчик долларов и конвертер валют разных стран
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Мгновенный перевод любой суммы для путешествий между долларами, рублями, сумами, евро, иенами, дирхамами и лирами.
                </p>
              </div>
            </div>

            {/* Live Interactive Converter Form */}
            <div
              style={{
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr auto 1.5fr',
                gap: '16px',
                alignItems: 'center',
                marginBottom: '28px'
              }}
            >
              {/* Amount Input */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Сумма для перевода</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    style={{ fontSize: '1.1rem', fontWeight: 700 }}
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Number(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Source Currency */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Из валюты</label>
                <select
                  className="form-select"
                  style={{ fontSize: '0.95rem', fontWeight: 600 }}
                  value={calcBaseCurrency}
                  onChange={(e) => setCalcBaseCurrency(e.target.value)}
                >
                  {currencyList.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <button
                type="button"
                className="navbar-icon-btn"
                style={{ alignSelf: 'flex-end', marginBottom: '4px' }}
                onClick={() => {
                  const temp = calcBaseCurrency;
                  setCalcBaseCurrency(calcTargetCurrency);
                  setCalcTargetCurrency(temp);
                }}
                title="Поменять валюты местами"
              >
                <ArrowRightLeft size={18} />
              </button>

              {/* Target Currency & Result */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">В валюту</label>
                <select
                  className="form-select"
                  style={{ fontSize: '0.95rem', fontWeight: 600 }}
                  value={calcTargetCurrency}
                  onChange={(e) => setCalcTargetCurrency(e.target.value)}
                >
                  {currencyList.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Result Highlight Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px 28px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '28px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.85rem', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Результат конвертации
                </span>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, marginTop: 4 }}>
                  {calcAmount} {calcBaseCurrency} = {calculatedResult.toLocaleString(undefined, { maximumFractionDigits: 2 })} {currencies[calcTargetCurrency]?.symbol} ({calcTargetCurrency})
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.18)', padding: '8px 16px', borderRadius: 'var(--radius-full)' }}>
                1 {calcBaseCurrency} = {(convertCurrency(1, calcBaseCurrency, calcTargetCurrency)).toLocaleString(undefined, { maximumFractionDigits: 4 })} {calcTargetCurrency}
              </div>
            </div>

            {/* All World Currencies Matrix */}
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px' }}>
              Стоимость {calcAmount} {calcBaseCurrency} в валютах разных стран:
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '12px'
              }}
            >
              {currencyList.map(c => {
                const converted = convertCurrency(calcAmount, calcBaseCurrency, c.code);
                return (
                  <div
                    key={c.code}
                    style={{
                      background: 'var(--bg-subtle)',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.4rem' }}>{c.flag}</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{c.code}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.name.split('(')[0]}</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary)' }}>
                      {converted >= 1000 ? Math.round(converted).toLocaleString() : converted.toLocaleString(undefined, { maximumFractionDigits: 2 })} {c.symbol}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: TRIP MODIFICATION & CANCELLATION */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border)',
              padding: '28px',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div className="stat-icon-wrap purple">
                <Calendar size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Управление и отмена поездки</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Здесь вы можете изменить город/страну назначения, скорректировать даты или отменить поездку.
                </p>
              </div>
            </div>

            {currentTrip && (
              <div
                style={{
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={currentTrip.coverImage}
                    alt={currentTrip.title}
                    style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{currentTrip.title}</h4>
                      <span
                        className={`trip-status-tag ${currentTrip.status === 'Cancelled' ? '' : 'active'}`}
                        style={{
                          position: 'static',
                          background: currentTrip.status === 'Cancelled' ? '#fee2e2' : '#ecfdf5',
                          color: currentTrip.status === 'Cancelled' ? '#dc2626' : '#059669',
                          padding: '3px 10px'
                        }}
                      >
                        {currentTrip.status || 'Active'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {currentTrip.destination}, {currentTrip.country} • {currentTrip.datesDisplay} • Бюджет: {formatCurrency(currentTrip.budget)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setChangeModalOpen(true)}
                    icon={RefreshCw}
                  >
                    Поменять поездку
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setCancelModalOpen(true)}
                    icon={Ban}
                  >
                    {currentTrip.status === 'Cancelled' ? 'Управление отменой' : 'Отменить поездку'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: DATA RESET */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border)',
              padding: '28px',
              boxShadow: 'var(--shadow-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Сброс к исходным демо-данным</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Очищает локальное хранилище и возвращает первоначальные демонстрационные поездки Токио, Париж и Дубай.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={resetAllData}
              icon={RotateCcw}
            >
              Сбросить демо-данные
            </Button>
          </div>
        </div>
      </div>

      {/* Change Trip Modal */}
      {currentTrip && (
        <ChangeTripModal
          isOpen={changeModalOpen}
          onClose={() => setChangeModalOpen(false)}
          trip={currentTrip}
        />
      )}

      {/* Cancel Trip Modal */}
      {currentTrip && (
        <CancelTripModal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          trip={currentTrip}
        />
      )}
    </div>
  );
}
