import { createClient } from '@supabase/supabase-js';
import * as storage from './storage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder')
);

// Реальный клиент Supabase если ключи заданы
export const realSupabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Демо-клиент Supabase с идентичным Auth и DB API для автономной работы
export const mockSupabase = {
  auth: {
    async signUp({ email, password, options }) {
      try {
        const user = storage.registerUser(email, password, options?.data?.name);
        return { data: { user, session: { user } }, error: null };
      } catch (err) {
        return { data: { user: null, session: null }, error: { message: err.message } };
      }
    },
    async signInWithPassword({ email, password }) {
      try {
        const user = storage.loginUser(email, password);
        return { data: { user, session: { user } }, error: null };
      } catch (err) {
        return { data: { user: null, session: null }, error: { message: err.message } };
      }
    },
    async signOut() {
      storage.logoutUser();
      return { error: null };
    },
    async getUser() {
      const user = storage.getCurrentUser();
      return { data: { user }, error: null };
    },
    async updateUser({ data }) {
      try {
        const user = storage.updateUserProfile(data);
        return { data: { user }, error: null };
      } catch (err) {
        return { data: { user: null }, error: { message: err.message } };
      }
    },
    onAuthStateChange(callback) {
      // Подписка на изменение авторизации
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
  },
  from(table) {
    return {
      select() {
        return Promise.resolve({ data: [], error: null });
      },
      insert() {
        return Promise.resolve({ data: null, error: null });
      },
      delete() {
        return Promise.resolve({ data: null, error: null });
      }
    };
  }
};

// Экспортируем основной supabase-клиент
export const supabase = isSupabaseConfigured ? realSupabase : mockSupabase;
