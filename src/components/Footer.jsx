import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Sparkles, MapPin, ShieldCheck, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 pb-24 md:pb-12 text-slate-600 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
                Где<span className="text-brand-600">Отдохнуть</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Умная платформа для поиска мест отдыха и планирования идеальных поездок.
              От термальных спа и горных шале до арт-парков и тихих озерных глэмпингов.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-700 font-semibold bg-brand-50 px-3.5 py-2 rounded-xl w-fit">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Создано для гармоничного и осознанного отдыха</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider">
              Навигация
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/catalog" className="hover:text-brand-600 transition-colors">
                  Каталог мест
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-brand-600 transition-colors">
                  Интерактивная карта
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-brand-600 transition-colors">
                  Избранные места
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-brand-600 transition-colors">
                  Личный кабинет
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider">
              Категории отдыха
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/catalog?category=spa" className="hover:text-brand-600 transition-colors">
                  Термальные спа и бани
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=country" className="hover:text-brand-600 transition-colors">
                  Глэмпинги и шале
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=nature" className="hover:text-brand-600 transition-colors">
                  Озёра и заповедники
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=active" className="hover:text-brand-600 transition-colors">
                  Активный отдых и сапы
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider">
              Направления
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/catalog?city=Сочи" className="hover:text-brand-600 transition-colors">
                  Сочи & Красная Поляна
                </Link>
              </li>
              <li>
                <Link to="/catalog?city=Горно-Алтайск" className="hover:text-brand-600 transition-colors">
                  Горный Алтай
                </Link>
              </li>
              <li>
                <Link to="/catalog?city=Сортавала" className="hover:text-brand-600 transition-colors">
                  Карелия & Ладога
                </Link>
              </li>
              <li>
                <Link to="/catalog?city=Калининград" className="hover:text-brand-600 transition-colors">
                  Куршская коса & Балтика
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} «ГдеОтдохнуть». Все права защищены.</span>
          <div className="flex items-center gap-6">
            <span>Политика конфиденциальности</span>
            <span>Пользовательское соглашение</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
