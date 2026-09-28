// Main Application Entry Point
import { store } from './store.js';
import { UIController } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI
  const ui = new UIController();

  // Apply initial theme
  const settings = store.getSettings();
  ui.applyTheme(settings.theme || 'dark');

  // Initial render
  ui.render();

  // Periodic recurring check (every 5 minutes)
  setInterval(() => {
    store.processRecurringTransactions();
  }, 5 * 60 * 1000);

  console.log('Финансовый трекер успешно инициализирован.');
});
