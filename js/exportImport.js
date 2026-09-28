// Data Export and Import module (JSON & CSV with UTF-8 BOM support)
import { store } from './store.js';
import { toLocalYMD } from './analytics.js';

export function exportToJSON() {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    accounts: store.getAccounts(),
    categories: store.getCategories(),
    transactions: store.getTransactions(),
    budgets: store.getBudgets(),
    goals: store.getGoals(),
    recurring: store.getRecurring(),
    settings: store.getSettings()
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = toLocalYMD();
  a.href = url;
  a.download = `fin_tracker_backup_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToCSV() {
  const transactions = store.getTransactions();
  const accounts = store.getAccounts();
  const categories = store.getCategories();

  const getAccountName = (id) => accounts.find(a => a.id === id)?.name || id || '';
  const getCatName = (id) => categories.find(c => c.id === id)?.name || id || '';

  const headers = ['Дата', 'Время', 'Тип', 'Сумма', 'Категория', 'Счёт', 'Счёт списания', 'Счёт зачисления', 'Описание'];

  const rows = transactions.map(t => {
    let typeLabel = 'Расход';
    if (t.type === 'income') typeLabel = 'Доход';
    if (t.type === 'transfer') typeLabel = 'Перевод';

    return [
      t.date || '',
      t.time || '',
      typeLabel,
      t.amount || 0,
      t.type === 'transfer' ? '' : getCatName(t.categoryId),
      t.type === 'transfer' ? '' : getAccountName(t.accountId),
      t.type === 'transfer' ? getAccountName(t.fromAccountId) : '',
      t.type === 'transfer' ? getAccountName(t.toAccountId) : '',
      `"${(t.description || '').replace(/"/g, '""')}"`
    ].join(';');
  });

  // \uFEFF is UTF-8 Byte Order Mark for Excel Cyrillic support
  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = toLocalYMD();
  a.href = url;
  a.download = `fin_tracker_transactions_${dateStr}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importFromJSON(file, onComplete, onError) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data || typeof data !== 'object') {
        throw new Error('Некорректный формат JSON файла');
      }

      if (Array.isArray(data.accounts)) store.saveData('ft_accounts_v1', data.accounts);
      if (Array.isArray(data.categories)) store.saveData('ft_categories_v1', data.categories);
      if (Array.isArray(data.transactions)) store.saveData('ft_transactions_v1', data.transactions);
      if (Array.isArray(data.budgets)) store.saveData('ft_budgets_v1', data.budgets);
      if (Array.isArray(data.goals)) store.saveData('ft_goals_v1', data.goals);
      if (Array.isArray(data.recurring)) store.saveData('ft_recurring_v1', data.recurring);
      if (data.settings && typeof data.settings === 'object') store.saveData('ft_settings_v1', data.settings);

      store.notify('data:imported', null);
      if (onComplete) onComplete();
    } catch (err) {
      if (onError) onError(err.message || 'Ошибка при разборе файла');
    }
  };

  reader.onerror = () => {
    if (onError) onError('Не удалось прочитать файл');
  };

  reader.readAsText(file);
}
