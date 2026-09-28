import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RotateCcw, Compass, MapPin } from 'lucide-react';
import PlaceCard from '../components/PlaceCard';
import FilterPanel from '../components/FilterPanel';
import Modal from '../components/Modal';
import { PLACES } from '../data/places';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filters state initialized from query params
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    city: searchParams.get('city') || 'all',
    maxPrice: searchParams.get('budget')
      ? Number(searchParams.get('budget'))
      : searchParams.get('maxPrice')
      ? Number(searchParams.get('maxPrice'))
      : 15000,
    minRating: 0,
    openNow: false,
    onlyOvernight: false
  });

  // Sync state when URL params change
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlCity = searchParams.get('city');
    const urlBudget = searchParams.get('budget') || searchParams.get('maxPrice');

    setFilters(prev => ({
      ...prev,
      category: urlCategory || prev.category,
      city: urlCity || prev.city,
      maxPrice: urlBudget ? Number(urlBudget) : prev.maxPrice
    }));
  }, [searchParams]);

  // Unique list of cities from places
  const cities = useMemo(() => {
    const set = new Set(PLACES.map(p => p.city));
    return Array.from(set);
  }, []);

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      city: 'all',
      maxPrice: 15000,
      minRating: 0,
      openNow: false,
      onlyOvernight: false
    });
    setSearchTerm('');
    setSearchParams({});
  };

  // Active filter count
  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.city !== 'all') count++;
    if (filters.maxPrice < 15000) count++;
    if (filters.minRating > 0) count++;
    if (filters.openNow) count++;
    if (filters.onlyOvernight) count++;
    return count;
  }, [filters]);

  // Filtered and Sorted Places
  const filteredPlaces = useMemo(() => {
    return PLACES.filter((place) => {
      // Search keyword
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchTitle = place.title.toLowerCase().includes(term);
        const matchCity = place.city.toLowerCase().includes(term);
        const matchDesc = place.description.toLowerCase().includes(term);
        const matchTag = place.tags?.some(t => t.toLowerCase().includes(term));
        if (!matchTitle && !matchCity && !matchDesc && !matchTag) return false;
      }

      // Category
      if (filters.category !== 'all' && place.category !== filters.category) {
        return false;
      }

      // City
      if (filters.city !== 'all' && place.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }

      // Max price
      if (place.price > filters.maxPrice) {
        return false;
      }

      // Min rating
      if (filters.minRating > 0 && place.rating < filters.minRating) {
        return false;
      }

      // Open now
      if (filters.openNow && !place.isOpenNow) {
        return false;
      }

      // Overnight
      if (filters.onlyOvernight && !place.hasOvernight) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // 'popular'
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.reviewsCount - a.reviewsCount;
    });
  }, [searchTerm, filters, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Compass className="w-3.5 h-3.5 text-brand-600" />
          <span>Каталог впечатлений</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Все места для отдыха
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Найдено {filteredPlaces.length} из {PLACES.length} локаций
        </p>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Поиск по названию, городу или тегу..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-xs"
          />
        </div>

        {/* Controls: Mobile Filters Button + Sort Dropdown */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Trigger */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-sm shadow-xs hover:bg-slate-50 flex-1 sm:flex-none"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            <span>Фильтры</span>
            {activeCount > 0 && (
              <span className="px-2 py-0.5 text-xs bg-brand-600 text-white font-bold rounded-full">
                {activeCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Сортировка:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="popular">По популярности</option>
              <option value="rating-desc">По рейтингу (сначала высокие)</option>
              <option value="price-asc">По цене (сначала дешевле)</option>
              <option value="price-desc">По цене (сначала дороже)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar (hidden on tablet and mobile) */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
            cities={cities}
            activeCount={activeCount}
          />
        </div>

        {/* Places Grid */}
        <div className="lg:col-span-3">
          {filteredPlaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-soft max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">
                Ничего не найдено
              </h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                По заданным критериям фильтрации мест не обнаружено.
                Попробуйте ослабить фильтры по бюджету или выбрать другой регион.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Сбросить фильтры</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <Modal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="Фильтры каталога"
      >
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
          cities={cities}
          activeCount={activeCount}
        />
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(false)}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-2xl shadow-md transition-colors text-center"
          >
            Показать {filteredPlaces.length} мест
          </button>
        </div>
      </Modal>
    </div>
  );
}
