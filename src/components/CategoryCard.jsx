import React from 'react';
import { Link } from 'react-router-dom';
import { Trees, Sparkles, Home, Compass, Utensils, Palmtree, ArrowRight } from 'lucide-react';

const ICON_MAP = {
  Trees,
  Sparkles,
  Home,
  Compass,
  Utensils,
  Palmtree,
};

export default function CategoryCard({ category, count = 0 }) {
  const Icon = ICON_MAP[category.icon] || Compass;

  return (
    <Link
      to={`/catalog?category=${category.id}`}
      className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200/70 p-6 flex flex-col justify-between h-72 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1.5"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-slate-900/10" />
      </div>

      {/* Top Header: Icon & Count */}
      <div className="flex items-center justify-between">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-md text-white transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${category.color}dd` }}
        >
          <Icon className="w-6 h-6" />
        </div>
        {count > 0 && (
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
            {count} мест
          </span>
        )}
      </div>

      {/* Bottom Info */}
      <div className="text-white">
        <h3 className="font-heading font-bold text-xl sm:text-2xl mb-1.5 group-hover:text-brand-200 transition-colors">
          {category.name}
        </h3>
        <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed opacity-90">
          {category.description}
        </p>

        <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-brand-300 group-hover:text-white transition-colors">
          <span>Смотреть подборку</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
