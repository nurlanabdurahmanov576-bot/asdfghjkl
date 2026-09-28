import React, { createContext, useContext, useState, useEffect } from 'react';
import * as storage from '../lib/storage';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверка текущего пользователя при монтировании
    const initAuth = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data } = await supabase.auth.getUser();
          setUser(data?.user || null);
        } else {
          const localUser = storage.getCurrentUser();
          setUser(localUser);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Вход
  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUser(data.user);
        return data.user;
      } else {
        const loggedUser = storage.loginUser(email, password);
        setUser(loggedUser);
        return loggedUser;
      }
    } finally {
      setLoading(false);
    }
  };

  // Быстрый демо-вход
  const demoLogin = async () => {
    setLoading(true);
    try {
      storage.setCurrentUser(storage.DEMO_USER);
      setUser(storage.DEMO_USER);
      return storage.DEMO_USER;
    } finally {
      setLoading(false);
    }
  };

  // Регистрация
  const register = async (email, password, name) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } }
        });
        if (error) throw error;
        setUser(data.user);
        return data.user;
      } else {
        const newUser = storage.registerUser(email, password, name);
        setUser(newUser);
        return newUser;
      }
    } finally {
      setLoading(false);
    }
  };

  // Выход
  const logout = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      } else {
        storage.logoutUser();
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Обновление профиля
  const updateProfile = async (updates) => {
    if (!user) throw new Error('Пользователь не авторизован');
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.updateUser({ data: updates });
      if (error) throw error;
      setUser(prev => ({ ...prev, ...updates }));
      return data.user;
    } else {
      const updated = storage.updateUserProfile(updates);
      setUser(updated);
      return updated;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        demoLogin,
        register,
        logout,
        updateProfile,
        isAuthenticated: Boolean(user)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
