// Утилиты управления локальным хранилищем данных для демонстрационного и автономного режима
import { INITIAL_REVIEWS } from '../data/reviews';

const STORAGE_KEYS = {
  CURRENT_USER: 'gdeotdohnut_current_user',
  USERS: 'gdeotdohnut_users',
  FAVORITES: 'gdeotdohnut_favorites',
  TRIPS: 'gdeotdohnut_trips',
  REVIEWS: 'gdeotdohnut_reviews',
  USER_VISITED: 'gdeotdohnut_visited_count'
};

// Дефолтный пользователь для мгновенного демо-доступа
export const DEMO_USER = {
  id: 'demo-user-777',
  email: 'alex.traveler@example.com',
  name: 'Алексей Смирнов',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80',
  bio: 'Любитель горных эко-троп, карельских озер и хорошего эспрессо с видом на природу.',
  visitedCount: 14,
  createdAt: '2025-01-15'
};

// Получить текущего пользователя
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading current user from storage:', e);
    return null;
  }
}

// Сохранить текущего пользователя
export function setCurrentUser(user) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error('Error setting current user:', e);
  }
}

// Регистрация нового пользователя
export function registerUser(email, password, name) {
  const usersRaw = localStorage.getItem(STORAGE_KEYS.USERS);
  const users = usersRaw ? JSON.parse(usersRaw) : [];

  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Пользователь с таким email уже зарегистрирован');
  }

  const newUser = {
    id: 'user-' + Date.now(),
    email: email.toLowerCase(),
    password, // в демо-режиме
    name: name || email.split('@')[0],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
    bio: 'Путешественник, исследую интересные уголки.',
    visitedCount: 0,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  setCurrentUser(newUser);
  return newUser;
}

// Вход пользователя
export function loginUser(email, password) {
  // Демо-вход без пароля
  if (email.toLowerCase() === DEMO_USER.email.toLowerCase()) {
    setCurrentUser(DEMO_USER);
    return DEMO_USER;
  }

  const usersRaw = localStorage.getItem(STORAGE_KEYS.USERS);
  const users = usersRaw ? JSON.parse(usersRaw) : [];

  const found = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!found) {
    throw new Error('Неверный адрес электронной почты или пароль');
  }

  setCurrentUser(found);
  return found;
}

// Выход
export function logoutUser() {
  setCurrentUser(null);
}

// Обновление профиля
export function updateUserProfile(updates) {
  const current = getCurrentUser();
  if (!current) throw new Error('Пользователь не авторизован');

  const updated = { ...current, ...updates };
  setCurrentUser(updated);

  // Обновим и в общем списке
  const usersRaw = localStorage.getItem(STORAGE_KEYS.USERS);
  if (usersRaw) {
    try {
      const users = JSON.parse(usersRaw);
      const idx = users.findIndex(u => u.id === current.id);
      if (idx !== -1) {
        users[idx] = updated;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }
    } catch (e) {
      console.error(e);
    }
  }

  return updated;
}

// Избранное
export function getStoredFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!raw) return ['place-1', 'place-3']; // базовые избранные для демонстрации
    return JSON.parse(raw);
  } catch (e) {
    return ['place-1', 'place-3'];
  }
}

export function saveStoredFavorites(favIds) {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favIds));
  } catch (e) {
    console.error(e);
  }
}

// Поездки (Trips)
export function getStoredTrips() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRIPS);
    if (!raw) {
      // Инициализируем одну демо-поездку для наглядности в профиле
      const initialTrips = [
        {
          id: 'trip-demo-1',
          placeId: 'place-1',
          placeTitle: 'Rosa Springs & Mountain Spa',
          placeCity: 'Сочи',
          placeImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
          startDate: '2026-10-10',
          endDate: '2026-10-12',
          guests: 2,
          budgetLimit: 30000,
          totalCost: 28400,
          budgetStatus: 'under', // 'under' | 'warning' | 'over'
          difference: 1600,
          nearestAirport: 'Международный аэропорт Сочи (Адлер) (AER)',
          airportDistanceKm: 42,
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(initialTrips));
      return initialTrips;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveTrip(tripData) {
  const trips = getStoredTrips();
  const newTrip = {
    ...tripData,
    id: 'trip-' + Date.now(),
    createdAt: new Date().toISOString()
  };
  trips.unshift(newTrip);
  localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
  return newTrip;
}

export function deleteTrip(tripId) {
  const trips = getStoredTrips().filter(t => t.id !== tripId);
  localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
  return trips;
}

// Отзывы (Reviews)
export function getStoredReviews() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_REVIEWS;
  }
}

export function addReview(newReview) {
  const reviews = getStoredReviews();
  const created = {
    ...newReview,
    id: 'rev-' + Date.now(),
    date: 'Сегодня',
    likes: 0
  };
  reviews.unshift(created);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  return created;
}
