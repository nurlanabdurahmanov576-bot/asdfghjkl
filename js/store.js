// Central Store with LocalStorage persistence and Event Emitter
import { DEFAULT_CATEGORIES } from './categories.js';
import { toLocalYMD } from './analytics.js';

const STORAGE_KEYS = {
  ACCOUNTS: 'ft_accounts_v2',
  CATEGORIES: 'ft_categories_v2',
  TRANSACTIONS: 'ft_transactions_v2',
  BUDGETS: 'ft_budgets_v2',
  GOALS: 'ft_goals_v2',
  RECURRING: 'ft_recurring_v2',
  SETTINGS: 'ft_settings_v2'
};

export const CURRENCIES = {
  UZS: { code: 'UZS', symbol: 'сум', name: 'Узбекский сум', rate: 1 },
  USD: { code: 'USD', symbol: '$', name: 'Доллар США', rate: 12750 },
  EUR: { code: 'EUR', symbol: '€', name: 'Евро', rate: 13900 },
  RUB: { code: 'RUB', symbol: '₽', name: 'Российский рубль', rate: 138 },
  KZT: { code: 'KZT', symbol: '₸', name: 'Казахстанский тенге', rate: 26 },
  USDT: { code: 'USDT', symbol: '₮', name: 'Tether (USDT)', rate: 12800 }
};

export class Store {
  constructor() {
    this.listeners = new Set();
    this.init();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event, data) {
    for (const listener of this.listeners) {
      try {
        listener(event, data);
      } catch (err) {
        console.error('Store listener error:', err);
      }
    }
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.ACCOUNTS)) {
      this.seedDemoData();
    }
    this.processRecurringTransactions();
  }

  seedDemoData() {
    const today = new Date();
    const curYear = today.getFullYear();
    const curMonth = String(today.getMonth() + 1).padStart(2, '0');
    const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 15);
    const prevYear = prevMonthDate.getFullYear();
    const prevMonth = String(prevMonthDate.getMonth() + 1).padStart(2, '0');

    const defaultAccounts = [
      { id: 'acc-card', name: 'Карта Uzcard / Humo', type: 'card', balance: 9850000, currency: 'UZS', color: '#3b82f6', icon: 'card' },
      { id: 'acc-cash', name: 'Наличные (сум)', type: 'cash', balance: 2400000, currency: 'UZS', color: '#10b981', icon: 'cash' },
      { id: 'acc-save', name: 'Накопительный вклад (21%)', type: 'savings', balance: 45000000, currency: 'UZS', color: '#8b5cf6', icon: 'savings' }
    ];

    const defaultBudgets = [
      { categoryId: 'cat-food', limit: 4500000 },
      { categoryId: 'cat-cafe', limit: 1500000 },
      { categoryId: 'cat-transport', limit: 1000000 },
      { categoryId: 'cat-shopping', limit: 2500000 },
      { categoryId: 'cat-bills', limit: 400000 }
    ];

    const defaultGoals = [
      { id: 'goal-1', title: 'Поездка в Самарканд и Бухару', targetAmount: 12000000, currentAmount: 8500000, targetDate: `${curYear}-12-20`, color: '#06b6d4', icon: 'travel' },
      { id: 'goal-2', title: 'Новый ноутбук (MacBook)', targetAmount: 22000000, currentAmount: 14000000, targetDate: `${curYear}-11-15`, color: '#6366f1', icon: 'education' },
      { id: 'goal-3', title: 'Подушка безопасности', targetAmount: 60000000, currentAmount: 45000000, targetDate: `${curYear + 1}-06-01`, color: '#10b981', icon: 'investment' }
    ];

    const defaultRecurring = [
      { id: 'rec-1', title: 'Зарплата', type: 'income', amount: 16500000, categoryId: 'cat-salary', accountId: 'acc-card', frequency: 'monthly', dayOfMonth: 5, nextDate: `${curYear}-${curMonth}-05`, active: true },
      { id: 'rec-2', title: 'Аренда квартиры', type: 'expense', amount: 4800000, categoryId: 'cat-housing', accountId: 'acc-card', frequency: 'monthly', dayOfMonth: 1, nextDate: `${curYear}-${curMonth}-01`, active: true },
      { id: 'rec-3', title: 'Интернет Uztelecom + связь', type: 'expense', amount: 200000, categoryId: 'cat-bills', accountId: 'acc-card', frequency: 'monthly', dayOfMonth: 10, nextDate: `${curYear}-${curMonth}-10`, active: true }
    ];

    const defaultSettings = {
      baseCurrency: 'UZS',
      theme: 'dark',
      exchangeRates: {
        UZS: 1,
        USD: 12750,
        EUR: 13900,
        RUB: 138,
        KZT: 26,
        USDT: 12800
      }
    };

    // Realistic Uzbek Sum transactions
    const defaultTransactions = [
      // Previous month
      { id: 'tx-p1', type: 'income', amount: 15000000, categoryId: 'cat-salary', accountId: 'acc-card', date: `${prevYear}-${prevMonth}-05`, time: '10:00', description: 'Зарплата за прошлый месяц' },
      { id: 'tx-p2', type: 'expense', amount: 4800000, categoryId: 'cat-housing', accountId: 'acc-card', date: `${prevYear}-${prevMonth}-06`, time: '11:30', description: 'Аренда жилья (Яккасарайский район)' },
      { id: 'tx-p3', type: 'expense', amount: 2950000, categoryId: 'cat-food', accountId: 'acc-card', date: `${prevYear}-${prevMonth}-12`, time: '19:40', description: 'Продукты в супермаркете Korzinka' },
      { id: 'tx-p4', type: 'expense', amount: 780000, categoryId: 'cat-cafe', accountId: 'acc-card', date: `${prevYear}-${prevMonth}-16`, time: '21:10', description: 'Чайхана: праздничный плов и шашлык' },
      { id: 'tx-p5', type: 'expense', amount: 540000, categoryId: 'cat-transport', accountId: 'acc-card', date: `${prevYear}-${prevMonth}-18`, time: '09:15', description: 'Яндекс Go и заправка бензином' },
      { id: 'tx-p6', type: 'income', amount: 3500000, categoryId: 'cat-freelance', accountId: 'acc-card', date: `${prevYear}-${prevMonth}-22`, time: '16:00', description: 'Фриланс: разработка Telegram-бота' },
      { id: 'tx-p7', type: 'expense', amount: 1850000, categoryId: 'cat-shopping', accountId: 'acc-card', date: `${prevYear}-${prevMonth}-25`, time: '14:20', description: 'Покупки в ТЦ Samarkand Darvoza' },

      // Current month
      { id: 'tx-c1', type: 'income', amount: 16500000, categoryId: 'cat-salary', accountId: 'acc-card', date: `${curYear}-${curMonth}-05`, time: '10:00', description: 'Основная зарплата + премия' },
      { id: 'tx-c2', type: 'expense', amount: 4800000, categoryId: 'cat-housing', accountId: 'acc-card', date: `${curYear}-${curMonth}-06`, time: '11:15', description: 'Оплата аренды квартиры' },
      { id: 'tx-c3', type: 'expense', amount: 1250000, categoryId: 'cat-food', accountId: 'acc-card', date: `${curYear}-${curMonth}-08`, time: '18:30', description: 'Закупка продуктов в Korzinka' },
      { id: 'tx-c4', type: 'expense', amount: 380000, categoryId: 'cat-cafe', accountId: 'acc-card', date: `${curYear}-${curMonth}-10`, time: '13:00', description: 'Обед в кофейне Чайкоф' },
      { id: 'tx-c5', type: 'expense', amount: 180000, categoryId: 'cat-bills', accountId: 'acc-card', date: `${curYear}-${curMonth}-10`, time: '08:00', description: 'Оптика Uztelecom + тариф Beeline' },
      { id: 'tx-c6', type: 'income', amount: 4200000, categoryId: 'cat-freelance', accountId: 'acc-card', date: `${curYear}-${curMonth}-14`, time: '15:20', description: 'Фриланс: настройка веб-сервиса' },
      { id: 'tx-c7', type: 'expense', amount: 460000, categoryId: 'cat-transport', accountId: 'acc-card', date: `${curYear}-${curMonth}-16`, time: '19:10', description: 'Яндекс Go (Комфорт) за неделю' },
      { id: 'tx-c8', type: 'expense', amount: 1650000, categoryId: 'cat-food', accountId: 'acc-card', date: `${curYear}-${curMonth}-19`, time: '20:00', description: 'Мясо и овощи на базаре Чорсу' },
      { id: 'tx-c9', type: 'expense', amount: 850000, categoryId: 'cat-entertainment', accountId: 'acc-card', date: `${curYear}-${curMonth}-21`, time: '22:15', description: 'Кино и боулинг в Magic City' },
      { id: 'tx-c10', type: 'transfer', amount: 5000000, fromAccountId: 'acc-card', toAccountId: 'acc-save', date: `${curYear}-${curMonth}-22`, time: '12:00', description: 'Пополнение накопительного вклада' },
      { id: 'tx-c11', type: 'expense', amount: 420000, categoryId: 'cat-health', accountId: 'acc-card', date: `${curYear}-${curMonth}-24`, time: '14:40', description: 'Аптека Olam: витамины' },
      { id: 'tx-c12', type: 'expense', amount: 890000, categoryId: 'cat-food', accountId: 'acc-cash', date: `${curYear}-${curMonth}-26`, time: '17:25', description: 'Свежие фрукты и лепёшки (Мирабадский рынок)' }
    ];

    this.saveData(STORAGE_KEYS.ACCOUNTS, defaultAccounts);
    this.saveData(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    this.saveData(STORAGE_KEYS.TRANSACTIONS, defaultTransactions);
    this.saveData(STORAGE_KEYS.BUDGETS, defaultBudgets);
    this.saveData(STORAGE_KEYS.GOALS, defaultGoals);
    this.saveData(STORAGE_KEYS.RECURRING, defaultRecurring);
    this.saveData(STORAGE_KEYS.SETTINGS, defaultSettings);
  }

  loadData(key, fallback = []) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error(`Failed to load ${key} from localStorage`, e);
      return fallback;
    }
  }

  saveData(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save ${key} to localStorage`, e);
    }
  }

  // --- Settings ---
  getSettings() {
    return this.loadData(STORAGE_KEYS.SETTINGS, {
      baseCurrency: 'UZS',
      theme: 'dark',
      exchangeRates: { UZS: 1, USD: 12750, EUR: 13900, RUB: 138, KZT: 26, USDT: 12800 }
    });
  }

  updateSettings(partial) {
    const current = this.getSettings();
    const updated = { ...current, ...partial };
    this.saveData(STORAGE_KEYS.SETTINGS, updated);
    this.notify('settings:updated', updated);
    return updated;
  }

  formatMoney(amount, currencyCode = null) {
    const settings = this.getSettings();
    const code = currencyCode || settings.baseCurrency || 'UZS';
    const currencyInfo = CURRENCIES[code] || { symbol: code };
    const num = Math.round(Number(amount) || 0);

    const formattedNum = new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);

    return `${formattedNum} ${currencyInfo.symbol}`;
  }

  getCurrencySymbol(currencyCode = null) {
    const settings = this.getSettings();
    const code = currencyCode || settings.baseCurrency || 'UZS';
    return CURRENCIES[code]?.symbol || code;
  }

  // --- Accounts ---
  getAccounts() {
    return this.loadData(STORAGE_KEYS.ACCOUNTS, []);
  }

  getAccount(id) {
    return this.getAccounts().find(a => a.id === id) || null;
  }

  addAccount(account) {
    const accounts = this.getAccounts();
    const newAccount = {
      id: `acc-${Date.now()}`,
      balance: Number(account.balance) || 0,
      currency: account.currency || this.getSettings().baseCurrency || 'UZS',
      color: account.color || '#3b82f6',
      icon: account.icon || 'card',
      ...account
    };
    accounts.push(newAccount);
    this.saveData(STORAGE_KEYS.ACCOUNTS, accounts);
    this.notify('accounts:changed', accounts);
    return newAccount;
  }

  updateAccount(id, partial) {
    const accounts = this.getAccounts();
    const index = accounts.findIndex(a => a.id === id);
    if (index === -1) return null;
    accounts[index] = { ...accounts[index], ...partial };
    if (partial.balance !== undefined) {
      accounts[index].balance = Number(partial.balance);
    }
    this.saveData(STORAGE_KEYS.ACCOUNTS, accounts);
    this.notify('accounts:changed', accounts);
    return accounts[index];
  }

  deleteAccount(id) {
    let accounts = this.getAccounts();
    if (accounts.length <= 1) {
      throw new Error('Нельзя удалить единственный счёт');
    }
    accounts = accounts.filter(a => a.id !== id);
    this.saveData(STORAGE_KEYS.ACCOUNTS, accounts);
    this.notify('accounts:changed', accounts);
  }

  adjustAccountBalance(accountId, delta) {
    const accounts = this.getAccounts();
    const acc = accounts.find(a => a.id === accountId);
    if (acc) {
      acc.balance = (Number(acc.balance) || 0) + Number(delta);
      this.saveData(STORAGE_KEYS.ACCOUNTS, accounts);
      this.notify('accounts:changed', accounts);
    }
  }

  // --- Categories ---
  getCategories(type = null) {
    const cats = this.loadData(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    if (!type) return cats;
    return cats.filter(c => c.type === type);
  }

  getCategory(id) {
    return this.getCategories().find(c => c.id === id) || null;
  }

  addCategory(category) {
    const categories = this.getCategories();
    const newCategory = {
      id: `cat-${Date.now()}`,
      name: category.name.trim(),
      type: category.type || 'expense',
      icon: category.icon || 'other',
      color: category.color || '#3b82f6'
    };
    categories.push(newCategory);
    this.saveData(STORAGE_KEYS.CATEGORIES, categories);
    this.notify('categories:changed', categories);
    return newCategory;
  }

  updateCategory(id, partial) {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    categories[index] = { ...categories[index], ...partial };
    this.saveData(STORAGE_KEYS.CATEGORIES, categories);
    this.notify('categories:changed', categories);
    return categories[index];
  }

  deleteCategory(id) {
    const categories = this.getCategories().filter(c => c.id !== id);
    this.saveData(STORAGE_KEYS.CATEGORIES, categories);
    this.notify('categories:changed', categories);
  }

  // --- Transactions ---
  getTransactions() {
    return this.loadData(STORAGE_KEYS.TRANSACTIONS, []);
  }

  getTransaction(id) {
    return this.getTransactions().find(t => t.id === id) || null;
  }

  addTransaction(txData) {
    const amount = Number(txData.amount);
    if (!amount || amount <= 0) {
      throw new Error('Сумма транзакции должна быть положительным числом');
    }

    const newTx = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type: txData.type,
      amount: amount,
      categoryId: txData.type === 'transfer' ? null : txData.categoryId,
      accountId: txData.accountId || null,
      fromAccountId: txData.fromAccountId || null,
      toAccountId: txData.toAccountId || null,
      date: txData.date || toLocalYMD(),
      time: txData.time || new Date().toTimeString().slice(0, 5),
      description: (txData.description || '').trim(),
      tags: txData.tags || []
    };

    if (newTx.type === 'expense') {
      this.adjustAccountBalance(newTx.accountId, -newTx.amount);
    } else if (newTx.type === 'income') {
      this.adjustAccountBalance(newTx.accountId, newTx.amount);
    } else if (newTx.type === 'transfer') {
      this.adjustAccountBalance(newTx.fromAccountId, -newTx.amount);
      this.adjustAccountBalance(newTx.toAccountId, newTx.amount);
    }

    const txs = this.getTransactions();
    txs.unshift(newTx);
    this.saveData(STORAGE_KEYS.TRANSACTIONS, txs);
    this.notify('transactions:changed', txs);
    return newTx;
  }

  updateTransaction(id, updatedData) {
    const txs = this.getTransactions();
    const index = txs.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Транзакция не найдена');

    const oldTx = txs[index];
    const amount = Number(updatedData.amount);
    if (!amount || amount <= 0) {
      throw new Error('Сумма должна быть положительным числом');
    }

    // Rollback old transaction balance effects
    if (oldTx.type === 'expense') {
      this.adjustAccountBalance(oldTx.accountId, oldTx.amount);
    } else if (oldTx.type === 'income') {
      this.adjustAccountBalance(oldTx.accountId, -oldTx.amount);
    } else if (oldTx.type === 'transfer') {
      this.adjustAccountBalance(oldTx.fromAccountId, oldTx.amount);
      this.adjustAccountBalance(oldTx.toAccountId, -oldTx.amount);
    }

    const newTx = {
      ...oldTx,
      ...updatedData,
      amount: amount,
      categoryId: updatedData.type === 'transfer' ? null : updatedData.categoryId,
      fromAccountId: updatedData.type === 'transfer' ? updatedData.fromAccountId : null,
      toAccountId: updatedData.type === 'transfer' ? updatedData.toAccountId : null,
      accountId: updatedData.type === 'transfer' ? null : updatedData.accountId,
      description: (updatedData.description || '').trim()
    };

    if (newTx.type === 'expense') {
      this.adjustAccountBalance(newTx.accountId, -newTx.amount);
    } else if (newTx.type === 'income') {
      this.adjustAccountBalance(newTx.accountId, newTx.amount);
    } else if (newTx.type === 'transfer') {
      this.adjustAccountBalance(newTx.fromAccountId, -newTx.amount);
      this.adjustAccountBalance(newTx.toAccountId, newTx.amount);
    }

    txs[index] = newTx;
    this.saveData(STORAGE_KEYS.TRANSACTIONS, txs);
    this.notify('transactions:changed', txs);
    return newTx;
  }

  deleteTransaction(id) {
    const txs = this.getTransactions();
    const index = txs.findIndex(t => t.id === id);
    if (index === -1) return;

    const oldTx = txs[index];
    if (oldTx.type === 'expense') {
      this.adjustAccountBalance(oldTx.accountId, oldTx.amount);
    } else if (oldTx.type === 'income') {
      this.adjustAccountBalance(oldTx.accountId, -oldTx.amount);
    } else if (oldTx.type === 'transfer') {
      this.adjustAccountBalance(oldTx.fromAccountId, oldTx.amount);
      this.adjustAccountBalance(oldTx.toAccountId, -oldTx.amount);
    }

    txs.splice(index, 1);
    this.saveData(STORAGE_KEYS.TRANSACTIONS, txs);
    this.notify('transactions:changed', txs);
  }

  // --- Budgets ---
  getBudgets() {
    return this.loadData(STORAGE_KEYS.BUDGETS, []);
  }

  setBudget(categoryId, limit) {
    let budgets = this.getBudgets();
    const index = budgets.findIndex(b => b.categoryId === categoryId);
    const numLimit = Number(limit);
    if (index >= 0) {
      if (numLimit <= 0) {
        budgets.splice(index, 1);
      } else {
        budgets[index].limit = numLimit;
      }
    } else if (numLimit > 0) {
      budgets.push({ categoryId, limit: numLimit });
    }
    this.saveData(STORAGE_KEYS.BUDGETS, budgets);
    this.notify('budgets:changed', budgets);
  }

  deleteBudget(categoryId) {
    const budgets = this.getBudgets().filter(b => b.categoryId !== categoryId);
    this.saveData(STORAGE_KEYS.BUDGETS, budgets);
    this.notify('budgets:changed', budgets);
  }

  // --- Goals ---
  getGoals() {
    return this.loadData(STORAGE_KEYS.GOALS, []);
  }

  addGoal(goal) {
    const goals = this.getGoals();
    const newGoal = {
      id: `goal-${Date.now()}`,
      title: goal.title.trim(),
      targetAmount: Number(goal.targetAmount) || 0,
      currentAmount: Number(goal.currentAmount) || 0,
      targetDate: goal.targetDate || '',
      color: goal.color || '#3b82f6',
      icon: goal.icon || 'travel'
    };
    goals.push(newGoal);
    this.saveData(STORAGE_KEYS.GOALS, goals);
    this.notify('goals:changed', goals);
    return newGoal;
  }

  updateGoal(id, partial) {
    const goals = this.getGoals();
    const index = goals.findIndex(g => g.id === id);
    if (index === -1) return null;
    goals[index] = { ...goals[index], ...partial };
    if (partial.targetAmount !== undefined) goals[index].targetAmount = Number(partial.targetAmount);
    if (partial.currentAmount !== undefined) goals[index].currentAmount = Number(partial.currentAmount);
    this.saveData(STORAGE_KEYS.GOALS, goals);
    this.notify('goals:changed', goals);
    return goals[index];
  }

  deleteGoal(id) {
    const goals = this.getGoals().filter(g => g.id !== id);
    this.saveData(STORAGE_KEYS.GOALS, goals);
    this.notify('goals:changed', goals);
  }

  contributeToGoal(goalId, amount, accountId = null) {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) throw new Error('Некорректная сумма');
    const goals = this.getGoals();
    const goal = goals.find(g => g.id === goalId);
    if (!goal) throw new Error('Цель не найдена');

    goal.currentAmount = (Number(goal.currentAmount) || 0) + numAmount;
    if (accountId) {
      this.adjustAccountBalance(accountId, -numAmount);
      this.addTransaction({
        type: 'expense',
        amount: numAmount,
        accountId: accountId,
        categoryId: 'cat-investment',
        description: `Пополнение цели: ${goal.title}`
      });
    }
    this.saveData(STORAGE_KEYS.GOALS, goals);
    this.notify('goals:changed', goals);
  }

  // --- Recurring Transactions ---
  getRecurring() {
    return this.loadData(STORAGE_KEYS.RECURRING, []);
  }

  addRecurring(rule) {
    const list = this.getRecurring();
    const newRule = {
      id: `rec-${Date.now()}`,
      title: rule.title.trim(),
      type: rule.type,
      amount: Number(rule.amount) || 0,
      categoryId: rule.categoryId,
      accountId: rule.accountId,
      frequency: rule.frequency || 'monthly',
      dayOfMonth: Number(rule.dayOfMonth) || 1,
      nextDate: rule.nextDate || toLocalYMD(),
      active: true
    };
    list.push(newRule);
    this.saveData(STORAGE_KEYS.RECURRING, list);
    this.notify('recurring:changed', list);
    return newRule;
  }

  deleteRecurring(id) {
    const list = this.getRecurring().filter(r => r.id !== id);
    this.saveData(STORAGE_KEYS.RECURRING, list);
    this.notify('recurring:changed', list);
  }

  processRecurringTransactions() {
    const list = this.getRecurring();
    const today = toLocalYMD();
    let createdCount = 0;

    for (const rule of list) {
      if (!rule.active) continue;
      if (rule.nextDate && rule.nextDate <= today) {
        this.addTransaction({
          type: rule.type,
          amount: rule.amount,
          categoryId: rule.categoryId,
          accountId: rule.accountId,
          date: rule.nextDate,
          description: `Авто: ${rule.title}`
        });

        const d = new Date(rule.nextDate + 'T00:00:00');
        if (rule.frequency === 'daily') {
          d.setDate(d.getDate() + 1);
        } else if (rule.frequency === 'weekly') {
          d.setDate(d.getDate() + 7);
        } else {
          d.setMonth(d.getMonth() + 1);
        }
        rule.nextDate = toLocalYMD(d);
        createdCount++;
      }
    }

    if (createdCount > 0) {
      this.saveData(STORAGE_KEYS.RECURRING, list);
      this.notify('recurring:processed', { count: createdCount });
    }
  }

  // --- Reset & Clear ---
  resetToDemo() {
    localStorage.clear();
    this.seedDemoData();
    this.notify('data:reset', null);
  }

  clearAllData() {
    const settings = this.getSettings();
    localStorage.clear();
    this.saveData(STORAGE_KEYS.SETTINGS, settings);
    this.saveData(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    this.saveData(STORAGE_KEYS.ACCOUNTS, [
      { id: 'acc-1', name: 'Основная карта Uzcard', type: 'card', balance: 0, currency: settings.baseCurrency, color: '#3b82f6', icon: 'card' }
    ]);
    this.saveData(STORAGE_KEYS.TRANSACTIONS, []);
    this.saveData(STORAGE_KEYS.BUDGETS, []);
    this.saveData(STORAGE_KEYS.GOALS, []);
    this.saveData(STORAGE_KEYS.RECURRING, []);
    this.notify('data:reset', null);
  }
}

export const store = new Store();
