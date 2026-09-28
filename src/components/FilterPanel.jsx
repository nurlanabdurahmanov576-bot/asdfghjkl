import React from 'react';
import { Filter, RotateCcw, Check, Star, Sparkles, Bed, Clock } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

export default function FilterPanel({
  filters,
  setFilters,
  onReset,
  cities = [],
  activeCount = 0
}) {
  const handleCategoryChange = (catId) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === catId ? 'all' : catId
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters(prev => ({
      ...prev,
      minRating: prev.minRating === rating ? 0 : rating
    }));
  };

  const handlePriceChange = (e) => {
    setFilters(prev => ({
      ...prev,
      maxPrice: Number(e.target.value)
    }));
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-heading font-bold text-lg text-slate-900">
          <Filter className="w-5 h-5 text-brand-600" />
          <span>Фильтры</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-brand-100 text-brand-800 font-bold rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сбросить</span>
          </button>
        )}
      </div>

      {/* City Filter */}
      {cities.length > 0 && (
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Город / Регион
          </label>
          <select
            value={filters.city || 'all'}
            onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          >
            <option value="all">Все регионы</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Category Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Категория отдыха
        </label>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}
            className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              filters.category === 'all'
                ? 'bg-brand-50 text-brand-800 border border-brand-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>Все категории</span>
            {filters.category === 'all' && <Check className="w-4 h-4 text-brand-600" />}
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-brand-50 text-brand-800 border border-brand-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-brand-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-2.5 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Макс. стоимость
          </label>
          <span className="font-bold text-sm text-slate-900">
            до {(filters.maxPrice || 15000).toLocaleString('ru-RU')} ₽
          </span>
        </div>
        <input
          type="range"
          min="1000"
          max="15000"
          step="500"
          value={filters.maxPrice || 15000}
          onChange={handlePriceChange}
          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
        />
        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
          <span>от 1 000 ₽</span>
          <span>15 000+ ₽</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2.5 pt-3 border-t border-slate-100">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Рейтинг места
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[4.5, 4.8, 4.9].map((r) => {
            const isSelected = filters.minRating === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleRatingChange(r)}
                className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{r}+</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Особенности
        </label>

        {/* Open Now Toggle */}
        <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/70 cursor-pointer transition-colors">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-700">Открыто сейчас</span>
          </div>
          <input
            type="checkbox"
            checked={Boolean(filters.openNow)}
            onChange={(e) => setFilters(prev => ({ ...prev, openNow: e.target.checked }))}
            className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
          />
        </label>

        {/* Overnight Toggle */}
        <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/70 cursor-pointer transition-colors">
          <div className="flex items-center gap-2.5">
            <Bed className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-slate-700">С ночёвкой (отель/глэмпинг)</span>
          </div>
          <input
            type="checkbox"
            checked={Boolean(filters.onlyOvernight)}
            onChange={(e) => setFilters(prev => ({ ...prev, onlyOvernight: e.target.checked }))}
            className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
          />
        </label>
      </div>
    </div>
  );
}
