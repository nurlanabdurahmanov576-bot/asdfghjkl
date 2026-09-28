import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  Car,
  Ticket,
  Utensils,
  Bed,
  ShoppingBag,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export default function BudgetCalculator({
  place,
  costs,
  userBudget,
  setUserBudget,
  totalCost,
  budgetPercent,
  budgetVerdict,
  hasOvernight,
  setHasOvernight,
  guests,
  setGuests,
  days,
  setDays
}) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 shadow-xs">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-xl text-slate-900">
              Калькулятор стоимости поездки
            </h3>
            <p className="text-xs text-slate-500">
              Все статьи можно отредактировать под ваши планы
            </p>
          </div>
        </div>

        {/* Quick parameters: Guests & Days */}
        <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1">
            <span className="text-xs text-slate-500 font-medium">Гостей:</span>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} чел.
                </option>
              ))}
            </select>
          </div>

          <div className="w-px h-5 bg-slate-200" />

          <div className="flex items-center gap-1.5 px-3 py-1">
            <span className="text-xs text-slate-500 font-medium">Дней:</span>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 7, 10].map((d) => (
                <option key={d} value={d}>
                  {d} {d === 1 ? 'день' : d < 5 ? 'дня' : 'дней'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Breakdown Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Road & Transfer */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-brand-600" />
              <span className="text-xs font-bold text-slate-700">Дорога и трансфер</span>
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              value={costs.road}
              onChange={(e) => costs.setRoad(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <span className="absolute right-3 top-2 text-xs font-medium text-slate-400">₽</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1.5 block">От аэропорта/вокзала</span>
        </div>

        {/* Admission / Services */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-700">Билеты и услуги на месте</span>
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              value={costs.service}
              onChange={(e) => costs.setService(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <span className="absolute right-3 top-2 text-xs font-medium text-slate-400">₽</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1.5 block">Входной тариф x {guests} чел.</span>
        </div>

        {/* Food */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-700">Питание и кафе</span>
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              value={costs.food}
              onChange={(e) => costs.setFood(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <span className="absolute right-3 top-2 text-xs font-medium text-slate-400">₽</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1.5 block">Из расчёта на {days} дн.</span>
        </div>

        {/* Overnight Toggle & Stay Cost */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-sky-600" />
              <span className="text-xs font-bold text-slate-700">Проживание</span>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasOvernight}
                onChange={(e) => setHasOvernight(e.target.checked)}
                className="w-3.5 h-3.5 text-brand-600 rounded border-slate-300"
              />
              <span className="text-[11px] font-bold text-slate-500">С ночёвкой</span>
            </label>
          </div>
          {hasOvernight ? (
            <div className="relative">
              <input
                type="number"
                value={costs.stay}
                onChange={(e) => costs.setStay(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <span className="absolute right-3 top-2 text-xs font-medium text-slate-400">₽</span>
            </div>
          ) : (
            <div className="px-3 py-2 bg-slate-100/80 rounded-xl text-xs text-slate-400 italic font-medium">
              Без ночёвки (однодневный отдых)
            </div>
          )}
          <span className="text-[10px] text-slate-400 mt-1.5 block">
            {hasOvernight ? `Номер / шале на ${Math.max(1, days - 1)} ноч.` : 'Опционально'}
          </span>
        </div>

        {/* Extra Expenses */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-slate-700">Доп. расходы / сувениры</span>
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              value={costs.extra}
              onChange={(e) => costs.setExtra(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <span className="absolute right-3 top-2 text-xs font-medium text-slate-400">₽</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1.5 block">Снаряжение, сувениры, чаевые</span>
        </div>

        {/* User Budget Field */}
        <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-bold text-teal-900">Ваш бюджет</span>
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              value={userBudget}
              onChange={(e) => setUserBudget(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-teal-200 rounded-xl text-sm font-bold text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
            <span className="absolute right-3 top-2 text-xs font-medium text-slate-400">₽</span>
          </div>
          <span className="text-[10px] text-teal-700 mt-1.5 block">Лимит затрат на поездку</span>
        </div>
      </div>

      {/* Total & Comparison Section */}
      <div className="pt-6 border-t border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">
              Итоговая расчётная стоимость
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900">
                {totalCost.toLocaleString('ru-RU')} ₽
              </span>
              <span className="text-xs font-bold text-slate-500">
                (из бюджета {userBudget.toLocaleString('ru-RU')} ₽)
              </span>
            </div>
          </div>

          {/* Progress Percent Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Потрачено:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-extrabold shadow-xs ${
                budgetVerdict.status === 'under'
                  ? 'bg-emerald-100 text-emerald-800'
                  : budgetVerdict.status === 'warning'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {budgetPercent}%
            </span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${budgetVerdict.barColor}`}
            style={{ width: `${Math.min(100, budgetPercent)}%` }}
          />
        </div>

        {/* Verdict Box */}
        <div
          className={`p-5 rounded-2xl border transition-all duration-300 ${budgetVerdict.bgColor} ${budgetVerdict.borderColor}`}
        >
          <div className="flex items-start gap-3.5">
            {budgetVerdict.status === 'under' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            )}
            {budgetVerdict.status === 'warning' && (
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            {budgetVerdict.status === 'over' && (
              <TrendingDown className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            )}

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold uppercase tracking-wider ${budgetVerdict.color}`}>
                  {budgetVerdict.badge}
                </span>
              </div>
              <p className={`text-sm font-semibold leading-relaxed ${budgetVerdict.color}`}>
                {budgetVerdict.message}
              </p>

              {budgetVerdict.tip && (
                <div className="mt-2.5 pt-2.5 border-t border-rose-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs text-rose-800">
                    💡 {budgetVerdict.tip}
                  </span>
                  <Link
                    to={`/catalog?category=${place.category}&maxPrice=${Math.round(place.price * 0.7)}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 underline hover:text-rose-900"
                  >
                    <span>Смотреть места дешевле</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
