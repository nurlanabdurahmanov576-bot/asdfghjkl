import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Compass, Heart, Award, MapPin } from 'lucide-react';
import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';
import PlaceCard from '../components/PlaceCard';
import { CATEGORIES } from '../data/categories';
import { PLACES } from '../data/places';

export default function Home() {
  // Рекомендуемые места (популярные с высоким рейтингом)
  const recommendedPlaces = PLACES.filter(p => p.isPopular).slice(0, 6);

  // Считаем количество мест в каждой категории
  const getCategoryCount = (catId) => {
    return PLACES.filter(p => p.category === catId).length;
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero section with SearchBar */}
      <Hero />

      {/* Categories section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-brand-600" />
              <span>Форматы отдыха</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
              Выберите категорию по душе
            </h2>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors group"
          >
            <span>Смотреть все локации</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              count={getCategoryCount(category.id)}
            />
          ))}
        </div>
      </section>

      {/* "Рекомендуем сегодня" section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Топ выбор путешественников</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
              Рекомендуем сегодня
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-xl">
              Проверенные локации с высокими оценками гостей, потрясающими видами и продуманным комфортом.
            </p>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors group"
          >
            <span>В каталог ({PLACES.length})</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Places Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </section>

      {/* Wellness & Trip Planning Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-teal-900 to-slate-900 p-8 sm:p-12 text-white shadow-2xl">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-200 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Умный калькулятор поездок</span>
            </span>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
              Спланируйте идеальный уикенд с точным расчётом бюджета
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Выберите понравившееся место — сервис автоматически определит ближайший аэропорт,
              построит маршрут на карте, посчитает трансфер, билеты, еду и проживание,
              а также сопоставит результат с вашим бюджетом.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/catalog"
                className="px-7 py-3.5 rounded-2xl bg-white hover:bg-brand-50 text-slate-900 font-bold text-sm shadow-lg transition-all duration-200 hover:scale-105"
              >
                Подобрать отдых
              </Link>
              <Link
                to="/map"
                className="px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md transition-colors"
              >
                Открыть на карте
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
