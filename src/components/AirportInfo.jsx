import React from 'react';
import { Plane, Car, Clock, Navigation, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function AirportInfo({ airport, placeTitle, placeCity }) {
  if (!airport) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 shadow-xs">
            <Plane className="w-6 h-6 rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Ближайший аэропорт
              </span>
              <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-xs font-extrabold">
                {airport.iata}
              </span>
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 leading-tight">
              {airport.airportName}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Distance */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white text-slate-700 flex items-center justify-center flex-shrink-0 shadow-xs">
            <Navigation className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Расстояние</span>
            <span className="text-sm font-bold text-slate-800">
              {airport.distanceKm} км от места
            </span>
          </div>
        </div>

        {/* Drive Time */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white text-slate-700 flex items-center justify-center flex-shrink-0 shadow-xs">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">В пути на авто</span>
            <span className="text-sm font-bold text-slate-800">
              {airport.driveTime}
            </span>
          </div>
        </div>

        {/* Transfer Cost */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white text-slate-700 flex items-center justify-center flex-shrink-0 shadow-xs">
            <Car className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Такси / трансфер</span>
            <span className="text-sm font-bold text-slate-800">
              ~{(airport.transferCostBase + airport.distanceKm * airport.taxiRatePerKm).toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>
      </div>

      {/* Helpful tip */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/60 border border-sky-100 text-sky-900 text-xs">
        <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
        <span>
          Маршрут от терминала {airport.iata} до локации «{placeTitle}» доступен на каршеринге, такси или пригородном трансфере.
        </span>
      </div>
    </div>
  );
}
