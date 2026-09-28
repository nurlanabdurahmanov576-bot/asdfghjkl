import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, ShieldCheck, Heart, Plane, ArrowRight } from 'lucide-react';
import SearchBar from './SearchBar';

export default function Hero() {
  const quickFilters = [
    { label: 'Термальные спа в Сочи', query: 'city=Сочи&category=spa' },
    { label: 'Глэмпинг на Ладоге', query: 'city=Сортавала&category=country' },
    { label: 'Бирюзовый Алтай', query: 'city=Горно-Алтайск&category=nature' },
    { label: 'Сапы на Байкале', query: 'city=Иркутск&category=active' },
    { label: 'Балтийские дюны', query: 'city=Калининград&category=nature' },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pb-24">
      {/* Decorative ambient background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10 opacity-70">
        <div className="absolute top-[-10%] left-[15%] w-96 h-96 bg-brand-200/50 rounded-full blur-3xl" />
        <div className="absolute top-[20%] right-[10%] w-80 h-80 bg-amber-100/60 rounded-full blur-3xl" />
        <div className="absolute top-[35%] left-[35%] w-88 h-88 bg-teal-100/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-800 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Умный планировщик отдыха &middot; Сезон 2026</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.15] mb-6">
            Найдите идеальное место для{' '}
            <span className="bg-gradient-to-r from-brand-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              перезагрузки и отдыха
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
            От термальных источников и горных шале до видовых террас и арт-парков.
            Сравнение с вашим бюджетом, расчёт трансфера от аэропорта и проверенные отзывы.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="max-w-4xl mx-auto mb-8">
          <SearchBar />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto text-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1">
            Популярно:
          </span>
          {quickFilters.map((q) => (
            <Link
              key={q.label}
              to={`/catalog?${q.query}`}
              className="px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-brand-700 text-xs font-medium border border-slate-200/70 hover:border-brand-300 shadow-xs hover:shadow-sm transition-all duration-200"
            >
              {q.label}
            </Link>
          ))}
        </div>

        {/* Trust & Feature Badges */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800">18+ локаций</p>
              <p className="text-xs text-slate-500">Только проверенные места</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800">Ближайший аэропорт</p>
              <p className="text-xs text-slate-500">Расстояние и маршрут</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800">Умный бюджет</p>
              <p className="text-xs text-slate-500">Автоматический вердикт</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800">Избранное и туры</p>
              <p className="text-xs text-slate-500">Сохранение в профиль</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
