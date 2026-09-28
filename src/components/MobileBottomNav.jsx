import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, MapPin, Heart, User } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

export default function MobileBottomNav() {
  const location = useLocation();
  const { favoritesCount } = useFavorites();

  const isActive = (path) => location.pathname === path;

  const tabs = [
    { to: '/catalog', label: 'Каталог', icon: Compass },
    { to: '/map', label: 'Карта', icon: MapPin },
    { to: '/favorites', label: 'Избранное', icon: Heart, badge: favoritesCount },
    { to: '/profile', label: 'Профиль', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.to);

          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all relative ${
                active ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px] scale-110' : 'stroke-[1.75px]'}`} />
                {Boolean(tab.badge) && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-[16px] h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1">{tab.label}</span>
              {active && (
                <span className="absolute bottom-0.5 w-6 h-0.5 bg-brand-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
