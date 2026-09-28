import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, Calendar, DollarSign } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

const POPULAR_CITIES = [
  'Все города',
  'Сочи',
  'Санкт-Петербург',
  'Москва',
  'Горно-Алтайск',
  'Казань',
  'Калининград',
  'Иркутск',
  'Сортавала',
  'Екатеринбург'
];

export default function SearchBar({ initialCity = '', initialCategory = '', initialBudget = '' }) {
  const navigate = useNavigate();
  const [city, setCity] = useState(initialCity || 'Все города');
  const [category, setCategory] = useState(initialCategory || 'all');
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState(initialBudget || '');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (city && city !== 'Все города') params.set('city', city);
    if (category && category !== 'all') params.set('category', category);
    if (budget) params.set('budget', budget);
    if (date) params.set('date', date);

    navigate(`/catalog?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-3xl sm:rounded-full shadow-2xl border border-slate-200/80 transition-all duration-300 hover:shadow-brand-500/10"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 items-center">
        {/* City Input / Select */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl sm:rounded-full hover:bg-slate-50 transition-colors border sm:border-transparent border-slate-100">
          <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Куда поехать
            </span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer truncate"
            >
              {POPULAR_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Select */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl sm:rounded-full hover:bg-slate-50 transition-colors border sm:border-transparent border-slate-100">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Тип отдыха
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer truncate"
            >
              <option value="all">Все форматы отдыха</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date / Time */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl sm:rounded-full hover:bg-slate-50 transition-colors border sm:border-transparent border-slate-100">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Когда
            </span>
            <input
              type="text"
              placeholder="Ближайшие выходные"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none placeholder:text-slate-400 truncate"
            />
          </div>
        </div>

        {/* Budget + Search Button */}
        <div className="flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-2xl sm:rounded-full bg-slate-50 sm:bg-transparent">
          <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="flex flex-col flex-1 min-w-0 mr-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Бюджет (до, ₽)
            </span>
            <input
              type="number"
              placeholder="30 000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl sm:rounded-full bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-700 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
          >
            <Search className="w-4 h-4" />
            <span className="hidden xl:inline">Найти место</span>
          </button>
        </div>
      </div>
    </form>
  );
}
