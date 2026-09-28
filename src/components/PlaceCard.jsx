import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Heart, ArrowRight, Clock, Bed, Sparkles } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { CATEGORIES } from '../data/categories';

export default function PlaceCard({ place }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(place.id);

  const categoryObj = CATEGORIES.find(c => c.id === place.category);

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={place.images[0]}
          alt={place.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Category Tag */}
          <span
            className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-md backdrop-blur-md"
            style={{ backgroundColor: categoryObj ? `${categoryObj.color}dd` : '#0d9488' }}
          >
            {categoryObj?.shortName || place.category}
          </span>

          {/* Favorite Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(place.id, place.title);
            }}
            className={`pointer-events-auto p-2.5 rounded-full backdrop-blur-md transition-all duration-200 shadow-md ${
              favorite
                ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
                : 'bg-white/85 text-slate-700 hover:bg-white hover:text-rose-500'
            }`}
            aria-label="В избранное"
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Status / Overnight badge inside photo */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          {place.isOpenNow && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Открыто
            </span>
          )}
          {place.hasOvernight && (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900/75 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1 shadow-sm">
              <Bed className="w-3 h-3" />
              С ночёвкой
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between gap-2 mb-2 text-xs">
            <div className="flex items-center gap-1 text-slate-500 font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
              <span className="truncate">{place.city}, {place.region}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-slate-800 bg-amber-50 px-2 py-0.5 rounded-md flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{place.rating}</span>
              <span className="text-slate-400 font-normal">({place.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/place/${place.id}`}>
            <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-1 mb-1">
              {place.title}
            </h3>
          </Link>

          {/* Subtitle / Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {place.subtitle || place.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {place.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer: Price & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Стоимость</span>
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-extrabold text-lg text-slate-900">
                {place.price.toLocaleString('ru-RU')} ₽
              </span>
              <span className="text-xs text-slate-500 font-normal">
                {place.priceUnit ? place.priceUnit.replace('₽', '').trim() : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/trip-summary/${place.id}`}
              className="p-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-colors flex items-center gap-1"
              title="Спланировать поездку и бюджет"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Поездка</span>
            </Link>

            <Link
              to={`/place/${place.id}`}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span>Подробнее</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
