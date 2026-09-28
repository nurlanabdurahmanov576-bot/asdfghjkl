import React, { createContext, useContext, useState, useEffect } from 'react';
import * as storage from '../lib/storage';
import { useNotifications } from './ToastContext';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const notify = useNotifications();

  useEffect(() => {
    const initialFavs = storage.getStoredFavorites();
    setFavorites(initialFavs);
  }, []);

  const toggleFavorite = (placeId, placeTitle = '') => {
    setFavorites(prev => {
      const exists = prev.includes(placeId);
      let updated;
      if (exists) {
        updated = prev.filter(id => id !== placeId);
        notify.info(`«${placeTitle || 'Место'}» удалено из избранного`);
      } else {
        updated = [...prev, placeId];
        notify.success(`«${placeTitle || 'Место'}» добавлено в избранное! ❤️`);
      }
      storage.saveStoredFavorites(updated);
      return updated;
    });
  };

  const isFavorite = (placeId) => favorites.includes(placeId);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        favoritesCount: favorites.length
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
