// UI View Controller and Modals
import { store, CURRENCIES } from './store.js';
import { CATEGORY_ICONS, COLOR_PALETTE, getCategoryIconSvg } from './categories.js';
import {
  getDateRange,
  getPreviousPeriodDateRange,
  filterTransactionsByDate,
  computeSummary,
  computeComparison,
  getCategoryBreakdown,
  getTimeSeriesData,
  computeBudgetsStatus,
  toLocalYMD
} from './analytics.js';
import { renderCategoryChart, renderDynamicsChart, updateAllChartsTheme } from './charts.js';
import { exportToCSV, exportToJSON, importFromJSON } from './exportImport.js';

export class UIController {
  constructor() {
    this.currentTab = 'dashboard';
    this.selectedPeriod = 'month'; // 'week', 'month', 'year', 'all', 'custom'
    this.customStartDate = null;
    this.customEndDate = null;
    this.dynamicsChartType = 'bar'; // 'bar' | 'line'

    // Filters for transactions tab
    this.txFilter = {
      type: 'all',
      categoryId: 'all',
      accountId: 'all',
      search: '',
      sort: 'date-desc'
    };

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.appRoot = document.getElementById('view-container');
    this.modalOverlay = document.getElementById('modal-overlay');
    this.modalTitle = document.getElementById('modal-title');
    this.modalBody = document.getElementById('modal-body');
    this.modalFooter = document.getElementById('modal-footer');
    this.toastContainer = document.getElementById('toast-container');
  }

  bindEvents() {
    // Nav items
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Quick Add Transaction buttons (desktop sidebar + mobile FAB)
    document.getElementById('quick-add-btn')?.addEventListener('click', () => this.openTransactionModal());
    document.getElementById('mobile-fab-btn')?.addEventListener('click', () => this.openTransactionModal());

    // Theme toggles
    document.getElementById('theme-toggle-btn')?.addEventListener('click', () => this.toggleTheme());
    document.getElementById('mobile-theme-btn')?.addEventListener('click', () => this.toggleTheme());

    // Close modal on overlay click
    this.modalOverlay?.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) this.closeModal();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalOverlay?.classList.contains('active')) {
        this.closeModal();
      }
      if ((e.key === 'n' || e.key === 'N' || e.key === 'т' || e.key === 'Т') && !this.isInputFocused() && !this.modalOverlay?.classList.contains('active')) {
        this.openTransactionModal();
      }
    });

    // Store updates
    store.subscribe((event, data) => {
      this.render();
      if (event === 'recurring:processed' && data?.count) {
        this.showToast(`Автоматически добавлено ${data.count} регулярных платежей`, 'success');
      }
    });
  }

  isInputFocused() {
    const tag = document.activeElement?.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll('[data-tab]').forEach(el => {
      if (el.getAttribute('data-tab') === tabName) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleTheme() {
    const settings = store.getSettings();
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    store.updateSettings({ theme: newTheme });
    this.applyTheme(newTheme);
  }

  applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
    }
    const label = document.getElementById('theme-toggle-label');
    if (label) label.textContent = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
    updateAllChartsTheme(theme === 'dark');
  }

  showToast(message, type = 'success', duration = 3200) {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    }

    toast.innerHTML = `<span>${iconSvg}</span><span>${message}</span>`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  openModal(title, bodyHtml, footerHtml) {
    if (!this.modalOverlay) return;
    this.modalTitle.textContent = title;
    this.modalBody.innerHTML = bodyHtml;
    this.modalFooter.innerHTML = footerHtml;
    this.modalOverlay.classList.add('active');
  }

  closeModal() {
    if (!this.modalOverlay) return;
    this.modalOverlay.classList.remove('active');
  }

  // =========================================================================
  // VIEW RENDERING
  // =========================================================================

  render() {
    switch (this.currentTab) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'transactions':
        this.renderTransactions();
        break;
      case 'accounts':
        this.renderAccounts();
        break;
      case 'budgets':
        this.renderBudgets();
        break;
      case 'analytics':
        this.renderAnalytics();
        break;
      case 'settings':
        this.renderSettings();
        break;
      default:
        this.renderDashboard();
    }
  }

  // --- DASHBOARD ---
  renderDashboard() {
    const allTxs = store.getTransactions();
    const categories = store.getCategories();
    const accounts = store.getAccounts();
    const settings = store.getSettings();
    const isDark = settings.theme === 'dark';

    // Period calculation
    const range = getDateRange(this.selectedPeriod, this.customStartDate, this.customEndDate);
    const prevRange = getPreviousPeriodDateRange(this.selectedPeriod, range.start, range.end);

    const currentTxs = filterTransactionsByDate(allTxs, range.startStr, range.endStr);
    const prevTxs = filterTransactionsByDate(allTxs, prevRange.startStr, prevRange.endStr);

    const comp = computeComparison(currentTxs, prevTxs);
    const categoryBreakdown = getCategoryBreakdown(currentTxs, categories, 'expense');
    const timeSeries = getTimeSeriesData(currentTxs, this.selectedPeriod, range.startStr, range.endStr);

    // Total net worth
    const totalBalance = accounts.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0);

    const periodLabels = {
      today: 'Сегодня',
      week: 'Эта неделя',
      month: 'Этот месяц',
      year: 'Этот год',
      all: 'Всё время',
      custom: 'Период'
    };

    let deltaExpenseClass = comp.expenseDelta > 0 ? 'negative' : 'positive';
    let deltaExpenseIcon = comp.expenseDelta > 0 ? '↑' : '↓';
    let deltaIncomeClass = comp.incomeDelta >= 0 ? 'positive' : 'negative';
    let deltaIncomeIcon = comp.incomeDelta >= 0 ? '↑' : '↓';

    this.appRoot.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Финансовый обзор</h1>
          <p class="page-subtitle">Общая сводка, распределение расходов и активность</p>
        </div>
        <div class="period-pill-group">
          <button class="period-pill ${this.selectedPeriod === 'week' ? 'active' : ''}" data-period="week">Неделя</button>
          <button class="period-pill ${this.selectedPeriod === 'month' ? 'active' : ''}" data-period="month">Месяц</button>
          <button class="period-pill ${this.selectedPeriod === 'year' ? 'active' : ''}" data-period="year">Год</button>
          <button class="period-pill ${this.selectedPeriod === 'all' ? 'active' : ''}" data-period="all">Всё время</button>
        </div>
      </div>

      <!-- Top Stat Cards -->
      <div class="stats-grid">
        <div class="card stat-card">
          <div class="stat-header">
            <span class="stat-label">Общий баланс</span>
            <div class="stat-icon" style="background: var(--primary-glow); color: var(--primary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
          </div>
          <div class="stat-value">${store.formatMoney(totalBalance)}</div>
          <div class="stat-footer">
            <span>Активных счетов: <strong>${accounts.length}</strong></span>
          </div>
        </div>

        <div class="card stat-card income">
          <div class="stat-header">
            <span class="stat-label">Доходы (${periodLabels[this.selectedPeriod]})</span>
            <div class="stat-icon" style="background: var(--accent-income-bg); color: var(--accent-income);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
          </div>
          <div class="stat-value" style="color: var(--accent-income);">${store.formatMoney(comp.current.income)}</div>
          <div class="stat-footer">
            <span class="badge-delta ${deltaIncomeClass}">${deltaIncomeIcon} ${Math.abs(comp.incomeDelta)}%</span>
            <span>к прошл. периоду</span>
          </div>
        </div>

        <div class="card stat-card expense">
          <div class="stat-header">
            <span class="stat-label">Расходы (${periodLabels[this.selectedPeriod]})</span>
            <div class="stat-icon" style="background: var(--accent-expense-bg); color: var(--accent-expense);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
            </div>
          </div>
          <div class="stat-value">${store.formatMoney(comp.current.expense)}</div>
          <div class="stat-footer">
            <span class="badge-delta ${deltaExpenseClass}">${deltaExpenseIcon} ${Math.abs(comp.expenseDelta)}%</span>
            <span>к прошл. периоду</span>
          </div>
        </div>

        <div class="card stat-card savings">
          <div class="stat-header">
            <span class="stat-label">Чистая разница / Сбережения</span>
            <div class="stat-icon" style="background: var(--accent-transfer-bg); color: var(--accent-transfer);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
          </div>
          <div class="stat-value" style="color: ${comp.current.net >= 0 ? 'var(--accent-income)' : 'var(--accent-expense)'};">
            ${store.formatMoney(comp.current.net)}
          </div>
          <div class="stat-footer">
            <span class="badge-delta ${comp.current.savingsRate >= 20 ? 'positive' : 'neutral'}">
              Норма: ${comp.current.savingsRate}%
            </span>
            <span>от доходов</span>
          </div>
        </div>
      </div>

      <!-- Dashboard Two Column Charts -->
      <div class="dashboard-grid">
        <!-- Dynamics Chart -->
        <div class="card chart-card">
          <div class="chart-header">
            <h2 class="chart-title">Динамика доходов и расходов</h2>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary" id="dash-chart-toggle" style="padding: 4px 10px; font-size: 0.78rem;">
                ${this.dynamicsChartType === 'bar' ? 'Линейный' : 'Столбчатый'}
              </button>
            </div>
          </div>
          <div class="chart-container">
            <canvas id="dash-dynamics-chart"></canvas>
          </div>
        </div>

        <!-- Category Doughnut Chart & Top 5 -->
        <div class="card chart-card">
          <div class="chart-header">
            <h2 class="chart-title">Расходы по категориям</h2>
            <span style="font-size: 0.82rem; color: var(--text-muted);">${store.formatMoney(categoryBreakdown.total)}</span>
          </div>
          <div class="chart-container" style="min-height: 200px; max-height: 220px;">
            <canvas id="dash-category-chart"></canvas>
          </div>
          <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 8px;">
            ${categoryBreakdown.top5.map(item => `
              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.84rem;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="width: 10px; height: 10px; border-radius: 50%; background: ${item.color};"></span>
                  <span>${item.name}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                  <strong style="color: var(--text-main);">${store.formatMoney(item.amount)}</strong>
                  <span style="color: var(--text-muted); width: 34px; text-align: right;">${item.percentage}%</span>
                </div>
              </div>
            `).join('')}
            ${categoryBreakdown.items.length === 0 ? '<div style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 20px 0;">Расходов пока нет</div>' : ''}
          </div>
        </div>
      </div>

      <!-- Quick Accounts & Recent Transactions -->
      <div class="dashboard-grid">
        <!-- Accounts Overview -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 class="chart-title">Мои счета и кошельки</h2>
            <button class="btn btn-secondary" id="dash-manage-accs-btn" style="padding: 4px 10px; font-size: 0.8rem;">Управление</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${accounts.map(acc => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: var(--bg-input); border-radius: var(--radius-md); border-left: 4px solid ${acc.color};">
                <div>
                  <div style="font-weight: 600; font-size: 0.92rem;">${acc.name}</div>
                  <div style="font-size: 0.76rem; color: var(--text-muted); text-transform: uppercase;">${acc.type}</div>
                </div>
                <div style="font-weight: 700; font-size: 1.05rem;">${store.formatMoney(acc.balance, acc.currency)}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 class="chart-title">Последние операции</h2>
            <button class="btn btn-secondary" id="dash-view-all-txs" style="padding: 4px 10px; font-size: 0.8rem;">Все (${allTxs.length})</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${allTxs.slice(0, 5).map(tx => this.renderTransactionRowHtml(tx, categories, accounts, false)).join('')}
            ${allTxs.length === 0 ? '<div style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 20px;">Нет операций</div>' : ''}
          </div>
        </div>
      </div>
    `;

    // Bind period pills
    this.appRoot.querySelectorAll('[data-period]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedPeriod = e.currentTarget.getAttribute('data-period');
        this.renderDashboard();
      });
    });

    // Toggle dynamics chart type
    document.getElementById('dash-chart-toggle')?.addEventListener('click', () => {
      this.dynamicsChartType = this.dynamicsChartType === 'bar' ? 'line' : 'bar';
      this.renderDashboard();
    });

    document.getElementById('dash-manage-accs-btn')?.addEventListener('click', () => this.switchTab('accounts'));
    document.getElementById('dash-view-all-txs')?.addEventListener('click', () => this.switchTab('transactions'));

    // Render Canvas Charts
    setTimeout(() => {
      const catCanvas = document.getElementById('dash-category-chart');
      const dynCanvas = document.getElementById('dash-dynamics-chart');
      if (catCanvas) renderCategoryChart(catCanvas, categoryBreakdown, isDark);
      if (dynCanvas) renderDynamicsChart(dynCanvas, timeSeries, this.dynamicsChartType === 'line', isDark);
    }, 20);
  }

  // --- TRANSACTIONS ---
  renderTransactions() {
    const allTxs = store.getTransactions();
    const categories = store.getCategories();
    const accounts = store.getAccounts();

    // Filter
    let filtered = [...allTxs];

    if (this.txFilter.type !== 'all') {
      filtered = filtered.filter(t => t.type === this.txFilter.type);
    }
    if (this.txFilter.categoryId !== 'all') {
      filtered = filtered.filter(t => t.categoryId === this.txFilter.categoryId);
    }
    if (this.txFilter.accountId !== 'all') {
      filtered = filtered.filter(t => t.accountId === this.txFilter.accountId || t.fromAccountId === this.txFilter.accountId || t.toAccountId === this.txFilter.accountId);
    }
    if (this.txFilter.search.trim()) {
      const q = this.txFilter.search.toLowerCase();
      filtered = filtered.filter(t => (t.description || '').toLowerCase().includes(q));
    }

    // Sort
    filtered.sort((a, b) => {
      if (this.txFilter.sort === 'date-desc') return b.date.localeCompare(a.date) || (b.time || '').localeCompare(a.time || '');
      if (this.txFilter.sort === 'date-asc') return a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || '');
      if (this.txFilter.sort === 'amount-desc') return b.amount - a.amount;
      if (this.txFilter.sort === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

    // Group by date
    const groups = new Map();
    for (const tx of filtered) {
      if (!groups.has(tx.date)) {
        groups.set(tx.date, []);
      }
      groups.get(tx.date).push(tx);
    }

    this.appRoot.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">История транзакций</h1>
          <p class="page-subtitle">Найдено операций: ${filtered.length}</p>
        </div>
        <button class="btn btn-primary" id="tx-add-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Добавить операцию
        </button>
      </div>

      <!-- Filter Controls Bar -->
      <div class="filter-bar">
        <div class="search-input-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" class="form-input" id="tx-search-input" placeholder="Поиск по заметкам и описанию..." value="${this.escapeHtml(this.txFilter.search)}" />
        </div>

        <select class="form-select" id="tx-type-filter">
          <option value="all" ${this.txFilter.type === 'all' ? 'selected' : ''}>Все типы</option>
          <option value="expense" ${this.txFilter.type === 'expense' ? 'selected' : ''}>Расходы</option>
          <option value="income" ${this.txFilter.type === 'income' ? 'selected' : ''}>Доходы</option>
          <option value="transfer" ${this.txFilter.type === 'transfer' ? 'selected' : ''}>Переводы</option>
        </select>

        <select class="form-select" id="tx-cat-filter">
          <option value="all">Все категории</option>
          ${categories.map(c => `
            <option value="${c.id}" ${this.txFilter.categoryId === c.id ? 'selected' : ''}>${c.name}</option>
          `).join('')}
        </select>

        <select class="form-select" id="tx-acc-filter">
          <option value="all">Все счета</option>
          ${accounts.map(a => `
            <option value="${a.id}" ${this.txFilter.accountId === a.id ? 'selected' : ''}>${a.name}</option>
          `).join('')}
        </select>

        <select class="form-select" id="tx-sort-select">
          <option value="date-desc" ${this.txFilter.sort === 'date-desc' ? 'selected' : ''}>Сначала новые</option>
          <option value="date-asc" ${this.txFilter.sort === 'date-asc' ? 'selected' : ''}>Сначала старые</option>
          <option value="amount-desc" ${this.txFilter.sort === 'amount-desc' ? 'selected' : ''}>Сумма (по убыванию)</option>
          <option value="amount-asc" ${this.txFilter.sort === 'amount-asc' ? 'selected' : ''}>Сумма (по возрастанию)</option>
        </select>
      </div>

      <!-- Transaction List Grouped by Date -->
      <div class="transaction-list">
        ${Array.from(groups.entries()).map(([dateStr, txs]) => `
          <div>
            <div class="tx-date-group-title">${this.formatDateHeader(dateStr)}</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${txs.map(tx => this.renderTransactionRowHtml(tx, categories, accounts, true)).join('')}
            </div>
          </div>
        `).join('')}

        ${filtered.length === 0 ? `
          <div class="empty-state card">
            <div class="empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </div>
            <div class="empty-title">Ничего не найдено</div>
            <div class="empty-desc">Попробуйте изменить параметры поиска или фильтрации</div>
            <button class="btn btn-secondary" id="tx-reset-filters">Сбросить фильтры</button>
          </div>
        ` : ''}
      </div>
    `;

    // Event listeners for filters
    document.getElementById('tx-add-btn')?.addEventListener('click', () => this.openTransactionModal());
    document.getElementById('tx-search-input')?.addEventListener('input', (e) => {
      this.txFilter.search = e.target.value;
      this.renderTransactions();
    });
    document.getElementById('tx-type-filter')?.addEventListener('change', (e) => {
      this.txFilter.type = e.target.value;
      this.renderTransactions();
    });
    document.getElementById('tx-cat-filter')?.addEventListener('change', (e) => {
      this.txFilter.categoryId = e.target.value;
      this.renderTransactions();
    });
    document.getElementById('tx-acc-filter')?.addEventListener('change', (e) => {
      this.txFilter.accountId = e.target.value;
      this.renderTransactions();
    });
    document.getElementById('tx-sort-select')?.addEventListener('change', (e) => {
      this.txFilter.sort = e.target.value;
      this.renderTransactions();
    });
    document.getElementById('tx-reset-filters')?.addEventListener('click', () => {
      this.txFilter = { type: 'all', categoryId: 'all', accountId: 'all', search: '', sort: 'date-desc' };
      this.renderTransactions();
    });

    // Row clicks for edit / delete
    this.appRoot.querySelectorAll('[data-edit-tx]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.getAttribute('data-edit-tx');
        const tx = store.getTransaction(id);
        if (tx) this.openTransactionModal(tx);
      });
    });

    this.appRoot.querySelectorAll('[data-delete-tx]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.getAttribute('data-delete-tx');
        if (confirm('Удалить эту транзакцию? Баланс счёта будет пересчитан.')) {
          store.deleteTransaction(id);
          this.showToast('Транзакция удалена', 'info');
        }
      });
    });

    this.appRoot.querySelectorAll('.tx-row').forEach(row => {
      row.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const tx = store.getTransaction(id);
        if (tx) this.openTransactionModal(tx);
      });
    });
  }

  // --- ACCOUNTS & TRANSFERS ---
  renderAccounts() {
    const accounts = store.getAccounts();
    const totalBalance = accounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0);

    this.appRoot.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Счета и кошельки</h1>
          <p class="page-subtitle">Общий капитал: <strong>${store.formatMoney(totalBalance)}</strong></p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" id="acc-transfer-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
            Перевод между счетами
          </button>
          <button class="btn btn-primary" id="acc-add-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Новый счёт
          </button>
        </div>
      </div>

      <!-- Account Cards Grid -->
      <div class="accounts-grid">
        ${accounts.map(acc => `
          <div class="account-card" style="background: linear-gradient(135deg, ${acc.color}, ${this.adjustColorBrightness(acc.color, -30)});">
            <div class="acc-card-top">
              <div class="acc-chip"></div>
              <span class="acc-type">${acc.type}</span>
            </div>
            <div>
              <div class="acc-balance">${store.formatMoney(acc.balance, acc.currency)}</div>
              <div class="acc-name">${acc.name}</div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; pt: 10px; border-top: 1px solid rgba(255,255,255,0.2);">
              <span style="font-size: 0.78rem; opacity: 0.85;">${acc.currency || 'RUB'}</span>
              <div style="display: flex; gap: 8px;">
                <button class="icon-btn" style="color: white; background: rgba(255,255,255,0.15);" data-edit-acc="${acc.id}" title="Редактировать">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
                <button class="icon-btn" style="color: white; background: rgba(255,255,255,0.15);" data-delete-acc="${acc.id}" title="Удалить">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    document.getElementById('acc-add-btn')?.addEventListener('click', () => this.openAccountModal());
    document.getElementById('acc-transfer-btn')?.addEventListener('click', () => this.openTransferModal());

    this.appRoot.querySelectorAll('[data-edit-acc]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-edit-acc');
        const acc = store.getAccount(id);
        if (acc) this.openAccountModal(acc);
      });
    });

    this.appRoot.querySelectorAll('[data-delete-acc]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-delete-acc');
        try {
          if (confirm('Удалить этот счёт?')) {
            store.deleteAccount(id);
            this.showToast('Счёт удалён', 'info');
          }
        } catch (err) {
          this.showToast(err.message, 'error');
        }
      });
    });
  }

  // --- BUDGETS & GOALS ---
  renderBudgets() {
    const budgets = store.getBudgets();
    const categories = store.getCategories();
    const goals = store.getGoals();
    const recurring = store.getRecurring();
    const allTxs = store.getTransactions();

    // Get current month transactions
    const monthRange = getDateRange('month');
    const monthTxs = filterTransactionsByDate(allTxs, monthRange.startStr, monthRange.endStr);
    const budgetsStatus = computeBudgetsStatus(budgets, categories, monthTxs);

    const totalBudget = budgets.reduce((sum, b) => sum + (Number(b.limit) || 0), 0);
    const totalSpent = budgetsStatus.reduce((sum, b) => sum + b.spent, 0);

    this.appRoot.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Бюджеты и финансовые цели</h1>
          <p class="page-subtitle">Контроль ежемесячных лимитов и накопления</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" id="bg-add-goal-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            Новая цель
          </button>
          <button class="btn btn-primary" id="bg-add-budget-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Задать бюджет
          </button>
        </div>
      </div>

      <!-- Monthly Budgets Section -->
      <div class="card" style="margin-bottom: 26px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h2 class="chart-title">Месячные бюджеты категорий</h2>
            <p style="font-size: 0.82rem; color: var(--text-muted);">
              Потрачено <strong>${store.formatMoney(totalSpent)}</strong> из <strong>${store.formatMoney(totalBudget)}</strong>
            </p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
          ${budgetsStatus.map(b => `
            <div style="background: var(--bg-input); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="color: ${b.category.color};">${getCategoryIconSvg(b.category.icon)}</span>
                  <span style="font-weight: 600; font-size: 0.95rem;">${b.category.name}</span>
                </div>
                <button class="icon-btn danger" data-delete-budget="${b.categoryId}" title="Удалить бюджет">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <div class="progress-bar-bg">
                <div class="progress-bar-fill ${b.status}" style="width: ${Math.min(b.percent, 100)}%;"></div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; margin-top: 6px;">
                <span>Потрачено: <strong>${store.formatMoney(b.spent)}</strong></span>
                <span>Лимит: <strong>${store.formatMoney(b.limit)}</strong></span>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 0.78rem;">
                <span style="color: ${b.status === 'exceeded' ? 'var(--accent-expense)' : 'var(--text-muted)'}; font-weight: 600;">
                  ${b.status === 'exceeded' ? `Превышен на ${store.formatMoney(Math.abs(b.remaining))}` : `Осталось ${store.formatMoney(b.remaining)}`}
                </span>
                <span class="badge-delta ${b.status === 'exceeded' ? 'negative' : (b.status === 'warning' ? 'neutral' : 'positive')}">
                  ${b.percent}%
                </span>
              </div>
            </div>
          `).join('')}

          ${budgetsStatus.length === 0 ? `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">
              Бюджеты пока не настроены. Нажмите "Задать бюджет", чтобы контролировать расходы!
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Financial Goals Section -->
      <div class="card" style="margin-bottom: 26px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h2 class="chart-title">Копилки и финансовые цели</h2>
            <p style="font-size: 0.82rem; color: var(--text-muted);">Отслеживайте прогресс накоплений к важным датам</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
          ${goals.map(goal => {
            const percent = goal.targetAmount > 0 ? Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100) : 0;
            return `
              <div style="background: var(--bg-input); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="color: ${goal.color};">${getCategoryIconSvg(goal.icon)}</span>
                      <strong style="font-size: 1rem;">${goal.title}</strong>
                    </div>
                    <button class="icon-btn danger" data-delete-goal="${goal.id}" title="Удалить цель">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>

                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-top: 10px;">
                    <span style="color: var(--text-muted);">Накоплено:</span>
                    <strong>${store.formatMoney(goal.currentAmount)} / ${store.formatMoney(goal.targetAmount)}</strong>
                  </div>

                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill good" style="width: ${percent}%; background: ${goal.color};"></div>
                  </div>

                  <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted);">
                    <span>${percent}% достигнуто</span>
                    <span>Срок: ${goal.targetDate || 'Без срока'}</span>
                  </div>
                </div>

                <div style="margin-top: 16px; display: flex; gap: 8px;">
                  <button class="btn btn-secondary" style="flex: 1; font-size: 0.84rem; padding: 6px 12px;" data-contribute-goal="${goal.id}">
                    + Пополнить цель
                  </button>
                </div>
              </div>
            `;
          }).join('')}

          ${goals.length === 0 ? `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">
              Нет созданных целей. Поставьте себе финансовую цель и начните копить!
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Recurring Payments Section -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h2 class="chart-title">Регулярные платежи и подписки</h2>
            <p style="font-size: 0.82rem; color: var(--text-muted);">Автоматически добавляются в историю при наступлении даты</p>
          </div>
          <button class="btn btn-secondary" id="bg-add-rec-btn" style="font-size: 0.84rem; padding: 6px 12px;">+ Добавить</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${recurring.map(rec => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--bg-input); border-radius: var(--radius-md);">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div class="stat-icon" style="background: ${rec.type === 'income' ? 'var(--accent-income-bg)' : 'var(--accent-expense-bg)'}; color: ${rec.type === 'income' ? 'var(--accent-income)' : 'var(--accent-expense)'};">
                  ${rec.type === 'income' ? '↓' : '↑'}
                </div>
                <div>
                  <div style="font-weight: 600; font-size: 0.92rem;">${rec.title}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">
                    Следующее списание: <strong>${rec.nextDate}</strong> (${rec.frequency})
                  </div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <strong style="color: ${rec.type === 'income' ? 'var(--accent-income)' : 'var(--text-main)'};">
                  ${rec.type === 'income' ? '+' : '-'}${store.formatMoney(rec.amount)}
                </strong>
                <button class="icon-btn danger" data-delete-rec="${rec.id}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
          `).join('')}

          ${recurring.length === 0 ? '<div style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 20px;">Нет активных регулярных платежей</div>' : ''}
        </div>
      </div>
    `;

    document.getElementById('bg-add-budget-btn')?.addEventListener('click', () => this.openBudgetModal());
    document.getElementById('bg-add-goal-btn')?.addEventListener('click', () => this.openGoalModal());
    document.getElementById('bg-add-rec-btn')?.addEventListener('click', () => this.openRecurringModal());

    this.appRoot.querySelectorAll('[data-delete-budget]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-delete-budget');
        store.deleteBudget(id);
        this.showToast('Бюджет удалён', 'info');
      });
    });

    this.appRoot.querySelectorAll('[data-delete-goal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-delete-goal');
        if (confirm('Удалить эту цель?')) {
          store.deleteGoal(id);
          this.showToast('Цель удалена', 'info');
        }
      });
    });

    this.appRoot.querySelectorAll('[data-contribute-goal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-contribute-goal');
        this.openContributeGoalModal(id);
      });
    });

    this.appRoot.querySelectorAll('[data-delete-rec]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-delete-rec');
        store.deleteRecurring(id);
        this.showToast('Платёж удалён', 'info');
      });
    });
  }

  // --- ANALYTICS ---
  renderAnalytics() {
    const allTxs = store.getTransactions();
    const categories = store.getCategories();
    const settings = store.getSettings();
    const isDark = settings.theme === 'dark';

    const range = getDateRange(this.selectedPeriod, this.customStartDate, this.customEndDate);
    const prevRange = getPreviousPeriodDateRange(this.selectedPeriod, range.start, range.end);

    const currentTxs = filterTransactionsByDate(allTxs, range.startStr, range.endStr);
    const prevTxs = filterTransactionsByDate(allTxs, prevRange.startStr, prevRange.endStr);

    const comp = computeComparison(currentTxs, prevTxs);
    const expBreakdown = getCategoryBreakdown(currentTxs, categories, 'expense');
    const incBreakdown = getCategoryBreakdown(currentTxs, categories, 'income');
    const timeSeries = getTimeSeriesData(currentTxs, this.selectedPeriod, range.startStr, range.endStr);

    this.appRoot.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Глубокая аналитика</h1>
          <p class="page-subtitle">Детальный анализ структуры расходов и динамики потоков</p>
        </div>
        <div class="period-pill-group">
          <button class="period-pill ${this.selectedPeriod === 'week' ? 'active' : ''}" data-period="week">Неделя</button>
          <button class="period-pill ${this.selectedPeriod === 'month' ? 'active' : ''}" data-period="month">Месяц</button>
          <button class="period-pill ${this.selectedPeriod === 'year' ? 'active' : ''}" data-period="year">Год</button>
          <button class="period-pill ${this.selectedPeriod === 'all' ? 'active' : ''}" data-period="all">Всё время</button>
        </div>
      </div>

      <!-- Comparative Stat Cards -->
      <div class="stats-grid">
        <div class="card stat-card income">
          <div class="stat-header">
            <span class="stat-label">Доходы</span>
          </div>
          <div class="stat-value" style="color: var(--accent-income);">${store.formatMoney(comp.current.income)}</div>
          <div class="stat-footer">
            <span class="badge-delta ${comp.incomeDelta >= 0 ? 'positive' : 'negative'}">
              ${comp.incomeDelta >= 0 ? '↑' : '↓'} ${Math.abs(comp.incomeDelta)}%
            </span>
            <span>по сравнению с прошлым</span>
          </div>
        </div>

        <div class="card stat-card expense">
          <div class="stat-header">
            <span class="stat-label">Расходы</span>
          </div>
          <div class="stat-value">${store.formatMoney(comp.current.expense)}</div>
          <div class="stat-footer">
            <span class="badge-delta ${comp.expenseDelta > 0 ? 'negative' : 'positive'}">
              ${comp.expenseDelta > 0 ? '↑' : '↓'} ${Math.abs(comp.expenseDelta)}%
            </span>
            <span>по сравнению с прошлым</span>
          </div>
        </div>

        <div class="card stat-card savings">
          <div class="stat-header">
            <span class="stat-label">Сбережения</span>
          </div>
          <div class="stat-value" style="color: ${comp.current.net >= 0 ? 'var(--accent-income)' : 'var(--accent-expense)'};">
            ${store.formatMoney(comp.current.net)}
          </div>
          <div class="stat-footer">
            <span class="badge-delta neutral">${comp.current.savingsRate}% сохранено</span>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="dashboard-grid">
        <div class="card chart-card">
          <div class="chart-header">
            <h2 class="chart-title">Динамика по времени</h2>
            <button class="btn btn-secondary" id="analytics-chart-toggle" style="padding: 4px 10px; font-size: 0.78rem;">
              ${this.dynamicsChartType === 'bar' ? 'Линейный' : 'Столбчатый'}
            </button>
          </div>
          <div class="chart-container">
            <canvas id="analytics-dynamics-chart"></canvas>
          </div>
        </div>

        <div class="card chart-card">
          <div class="chart-header">
            <h2 class="chart-title">Структура расходов</h2>
          </div>
          <div class="chart-container" style="min-height: 220px; max-height: 240px;">
            <canvas id="analytics-category-chart"></canvas>
          </div>
          <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 8px;">
            ${expBreakdown.items.slice(0, 6).map(item => `
              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.84rem;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="width: 10px; height: 10px; border-radius: 50%; background: ${item.color};"></span>
                  <span>${item.name}</span>
                </div>
                <div style="display: flex; gap: 8px;">
                  <strong>${store.formatMoney(item.amount)}</strong>
                  <span style="color: var(--text-muted); width: 34px; text-align: right;">${item.percentage}%</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Detailed Breakdown Table -->
      <div class="card">
        <h2 class="chart-title" style="margin-bottom: 16px;">Рейтинг расходов по категориям</h2>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${expBreakdown.items.map(item => `
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 4px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="color: ${item.color};">${getCategoryIconSvg(item.icon)}</span>
                  <strong>${item.name}</strong>
                  <span style="font-size: 0.76rem; color: var(--text-muted);">(${item.count} опер.)</span>
                </div>
                <div>
                  <strong>${store.formatMoney(item.amount)}</strong>
                  <span style="color: var(--text-muted); margin-left: 8px;">${item.percentage}%</span>
                </div>
              </div>
              <div class="progress-bar-bg" style="margin: 0;">
                <div class="progress-bar-fill" style="width: ${item.percentage}%; background: ${item.color};"></div>
              </div>
            </div>
          `).join('')}

          ${expBreakdown.items.length === 0 ? '<div style="color: var(--text-muted); text-align: center; padding: 20px;">Нет расходов за выбранный период</div>' : ''}
        </div>
      </div>
    `;

    this.appRoot.querySelectorAll('[data-period]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedPeriod = e.currentTarget.getAttribute('data-period');
        this.renderAnalytics();
      });
    });

    document.getElementById('analytics-chart-toggle')?.addEventListener('click', () => {
      this.dynamicsChartType = this.dynamicsChartType === 'bar' ? 'line' : 'bar';
      this.renderAnalytics();
    });

    setTimeout(() => {
      const catCanvas = document.getElementById('analytics-category-chart');
      const dynCanvas = document.getElementById('analytics-dynamics-chart');
      if (catCanvas) renderCategoryChart(catCanvas, expBreakdown, isDark);
      if (dynCanvas) renderDynamicsChart(dynCanvas, timeSeries, this.dynamicsChartType === 'line', isDark);
    }, 20);
  }

  // --- SETTINGS ---
  renderSettings() {
    const settings = store.getSettings();
    const categories = store.getCategories();

    this.appRoot.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Настройки и данные</h1>
          <p class="page-subtitle">Управление валютой, категориями и резервными копиями</p>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 800px;">
        <!-- General Preferences -->
        <div class="card">
          <h2 class="chart-title" style="margin-bottom: 16px;">Основные настройки</h2>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Основная валюта приложения</label>
              <select class="form-select" id="settings-currency">
                ${Object.entries(CURRENCIES).map(([code, cur]) => `
                  <option value="${code}" ${settings.baseCurrency === code ? 'selected' : ''}>
                    ${cur.symbol} — ${cur.name} (${code})
                  </option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Тема интерфейса</label>
              <select class="form-select" id="settings-theme">
                <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Тёмная (Dark)</option>
                <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Светлая (Light)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Categories Management -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 class="chart-title">Категории расходов и доходов</h2>
            <button class="btn btn-secondary" id="settings-add-cat-btn" style="font-size: 0.84rem; padding: 6px 12px;">+ Новая категория</button>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
            ${categories.map(c => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-input); border-radius: var(--radius-md);">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="color: ${c.color};">${getCategoryIconSvg(c.icon)}</span>
                  <span style="font-size: 0.88rem; font-weight: 500;">${c.name}</span>
                </div>
                <button class="icon-btn danger" data-delete-cat="${c.id}" title="Удалить">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Data Backup & Restore -->
        <div class="card">
          <h2 class="chart-title" style="margin-bottom: 8px;">Резервное копирование и экспорт</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 18px;">
            Сохраняйте ваши финансовые данные локально или переносите между устройствами
          </p>

          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="btn btn-secondary" id="settings-export-csv">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Экспорт в CSV (Excel)
            </button>
            <button class="btn btn-secondary" id="settings-export-json">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Экспорт бэкапа (JSON)
            </button>
            <label class="btn btn-secondary" style="cursor: pointer;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Импорт бэкапа (JSON)
              <input type="file" id="settings-import-file" accept=".json" style="display: none;" />
            </label>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="card" style="border-color: rgba(239, 68, 68, 0.3);">
          <h2 class="chart-title" style="color: var(--accent-expense); margin-bottom: 8px;">Опасная зона</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
            Сброс данных до начального демо-набора или полная очистка хранилища
          </p>
          <div style="display: flex; gap: 12px;">
            <button class="btn btn-secondary" id="settings-reset-demo">Загрузить демо-данные</button>
            <button class="btn btn-danger" id="settings-clear-all">Очистить все данные</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('settings-currency')?.addEventListener('change', (e) => {
      store.updateSettings({ baseCurrency: e.target.value });
      this.showToast('Основная валюта изменена', 'success');
    });

    document.getElementById('settings-theme')?.addEventListener('change', (e) => {
      const theme = e.target.value;
      store.updateSettings({ theme });
      this.applyTheme(theme);
    });

    document.getElementById('settings-add-cat-btn')?.addEventListener('click', () => this.openCategoryModal());

    this.appRoot.querySelectorAll('[data-delete-cat]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-delete-cat');
        if (confirm('Удалить эту категорию?')) {
          store.deleteCategory(id);
          this.showToast('Категория удалена', 'info');
        }
      });
    });

    document.getElementById('settings-export-csv')?.addEventListener('click', () => {
      exportToCSV();
      this.showToast('CSV успешно скачан', 'success');
    });

    document.getElementById('settings-export-json')?.addEventListener('click', () => {
      exportToJSON();
      this.showToast('Бэкап JSON успешно скачан', 'success');
    });

    document.getElementById('settings-import-file')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        importFromJSON(
          file,
          () => this.showToast('Данные успешно восстановлены!', 'success'),
          (err) => this.showToast(`Ошибка: ${err}`, 'error')
        );
      }
    });

    document.getElementById('settings-reset-demo')?.addEventListener('click', () => {
      if (confirm('Сбросить текущие данные и загрузить примеры?')) {
        store.resetToDemo();
        this.showToast('Демо-данные загружены', 'success');
      }
    });

    document.getElementById('settings-clear-all')?.addEventListener('click', () => {
      if (confirm('ВНИМАНИЕ: Это полностью удалит все транзакции, бюджеты и цели! Продолжить?')) {
        store.clearAllData();
        this.showToast('Все данные очищены', 'warning');
      }
    });
  }

  // =========================================================================
  // MODAL DIALOGS
  // =========================================================================

  openTransactionModal(txToEdit = null) {
    const isEdit = !!txToEdit;
    const accounts = store.getAccounts();
    const categories = store.getCategories();
    let currentType = txToEdit ? txToEdit.type : 'expense';
    let selectedCatId = txToEdit ? txToEdit.categoryId : (categories.find(c => c.type === currentType)?.id || '');

    const todayStr = toLocalYMD();
    const timeStr = new Date().toTimeString().slice(0, 5);

    const bodyHtml = `
      <div class="type-tab-group" id="modal-type-tabs">
        <button class="type-tab ${currentType === 'expense' ? 'active expense' : ''}" data-type="expense">Расход</button>
        <button class="type-tab ${currentType === 'income' ? 'active income' : ''}" data-type="income">Доход</button>
        <button class="type-tab ${currentType === 'transfer' ? 'active transfer' : ''}" data-type="transfer">Перевод</button>
      </div>

      <div class="form-group">
        <label class="form-label">Сумма (${store.getSettings().baseCurrency})</label>
        <input type="number" class="form-input" id="tx-modal-amount" placeholder="0" min="0.01" step="any" value="${txToEdit ? txToEdit.amount : ''}" style="font-size: 1.4rem; font-weight: 700; padding: 12px 14px;" autofocus />
      </div>

      <div id="modal-cat-section" style="${currentType === 'transfer' ? 'display: none;' : ''}">
        <label class="form-label" style="margin-bottom: 8px;">Категория</label>
        <div class="category-picker-grid" id="modal-cat-picker">
          ${categories.filter(c => c.type === currentType).map(c => `
            <div class="cat-picker-item ${c.id === selectedCatId ? 'active' : ''}" data-cat-id="${c.id}">
              <div class="cat-picker-icon" style="background: ${c.color};">
                ${getCategoryIconSvg(c.icon)}
              </div>
              <span class="cat-picker-label">${c.name}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="modal-acc-section" style="${currentType === 'transfer' ? 'display: none;' : ''}">
        <div class="form-group">
          <label class="form-label">Счёт</label>
          <select class="form-select" id="tx-modal-account">
            ${accounts.map(a => `
              <option value="${a.id}" ${txToEdit && txToEdit.accountId === a.id ? 'selected' : ''}>
                ${a.name} (${store.formatMoney(a.balance, a.currency)})
              </option>
            `).join('')}
          </select>
        </div>
      </div>

      <div id="modal-transfer-section" style="${currentType === 'transfer' ? '' : 'display: none;'}">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Со счёта</label>
            <select class="form-select" id="tx-modal-from-account">
              ${accounts.map(a => `
                <option value="${a.id}" ${txToEdit && txToEdit.fromAccountId === a.id ? 'selected' : ''}>
                  ${a.name} (${store.formatMoney(a.balance, a.currency)})
                </option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">На счёт</label>
            <select class="form-select" id="tx-modal-to-account">
              ${accounts.map((a, i) => `
                <option value="${a.id}" ${(txToEdit ? txToEdit.toAccountId === a.id : i === 1) ? 'selected' : ''}>
                  ${a.name} (${store.formatMoney(a.balance, a.currency)})
                </option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Дата</label>
          <input type="date" class="form-input" id="tx-modal-date" value="${txToEdit ? txToEdit.date : todayStr}" />
        </div>
        <div class="form-group">
          <label class="form-label">Время</label>
          <input type="time" class="form-input" id="tx-modal-time" value="${txToEdit ? txToEdit.time : timeStr}" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Описание / Заметка</label>
        <input type="text" class="form-input" id="tx-modal-desc" placeholder="Например: Обед в кафе или Покупка кроссовок" value="${txToEdit ? this.escapeHtml(txToEdit.description) : ''}" />
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary" id="modal-cancel-btn">Отмена</button>
      <button class="btn btn-primary" id="modal-save-tx-btn">${isEdit ? 'Сохранить изменения' : 'Добавить'}</button>
    `;

    this.openModal(isEdit ? 'Редактирование операции' : 'Новая операция', bodyHtml, footerHtml);

    // Bind Type Tabs
    const tabs = document.querySelectorAll('#modal-type-tabs .type-tab');
    const catSection = document.getElementById('modal-cat-section');
    const accSection = document.getElementById('modal-acc-section');
    const transferSection = document.getElementById('modal-transfer-section');
    const catPicker = document.getElementById('modal-cat-picker');

    const updateCategoryPicker = (type) => {
      const typeCats = categories.filter(c => c.type === type);
      if (typeCats.length > 0 && !typeCats.find(c => c.id === selectedCatId)) {
        selectedCatId = typeCats[0].id;
      }
      catPicker.innerHTML = typeCats.map(c => `
        <div class="cat-picker-item ${c.id === selectedCatId ? 'active' : ''}" data-cat-id="${c.id}">
          <div class="cat-picker-icon" style="background: ${c.color};">
            ${getCategoryIconSvg(c.icon)}
          </div>
          <span class="cat-picker-label">${c.name}</span>
        </div>
      `).join('');

      catPicker.querySelectorAll('.cat-picker-item').forEach(item => {
        item.addEventListener('click', (e) => {
          selectedCatId = e.currentTarget.getAttribute('data-cat-id');
          catPicker.querySelectorAll('.cat-picker-item').forEach(i => i.classList.remove('active'));
          e.currentTarget.classList.add('active');
        });
      });
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.className = 'type-tab');
        currentType = e.currentTarget.getAttribute('data-type');
        e.currentTarget.classList.add('active', currentType);

        if (currentType === 'transfer') {
          catSection.style.display = 'none';
          accSection.style.display = 'none';
          transferSection.style.display = 'block';
        } else {
          catSection.style.display = 'block';
          accSection.style.display = 'block';
          transferSection.style.display = 'none';
          updateCategoryPicker(currentType);
        }
      });
    });

    updateCategoryPicker(currentType);

    document.getElementById('modal-cancel-btn')?.addEventListener('click', () => this.closeModal());
    document.getElementById('modal-save-tx-btn')?.addEventListener('click', () => {
      const amountVal = parseFloat(document.getElementById('tx-modal-amount').value);
      if (isNaN(amountVal) || amountVal <= 0) {
        this.showToast('Пожалуйста, введите корректную сумму больше нуля', 'error');
        return;
      }

      const dateVal = document.getElementById('tx-modal-date').value;
      const timeVal = document.getElementById('tx-modal-time').value;
      const descVal = document.getElementById('tx-modal-desc').value;

      try {
        if (currentType === 'transfer') {
          const fromId = document.getElementById('tx-modal-from-account').value;
          const toId = document.getElementById('tx-modal-to-account').value;
          if (fromId === toId) {
            this.showToast('Счета списания и зачисления должны отличаться', 'error');
            return;
          }
          if (isEdit) {
            store.updateTransaction(txToEdit.id, {
              type: 'transfer',
              amount: amountVal,
              fromAccountId: fromId,
              toAccountId: toId,
              date: dateVal,
              time: timeVal,
              description: descVal || 'Перевод между счетами'
            });
            this.showToast('Перевод обновлён', 'success');
          } else {
            store.addTransaction({
              type: 'transfer',
              amount: amountVal,
              fromAccountId: fromId,
              toAccountId: toId,
              date: dateVal,
              time: timeVal,
              description: descVal || 'Перевод между счетами'
            });
            this.showToast('Перевод успешно выполнен', 'success');
          }
        } else {
          const accId = document.getElementById('tx-modal-account').value;
          if (!selectedCatId) {
            this.showToast('Выберите категорию', 'error');
            return;
          }
          if (isEdit) {
            store.updateTransaction(txToEdit.id, {
              type: currentType,
              amount: amountVal,
              categoryId: selectedCatId,
              accountId: accId,
              date: dateVal,
              time: timeVal,
              description: descVal
            });
            this.showToast('Операция обновлена', 'success');
          } else {
            store.addTransaction({
              type: currentType,
              amount: amountVal,
              categoryId: selectedCatId,
              accountId: accId,
              date: dateVal,
              time: timeVal,
              description: descVal
            });
            this.showToast('Операция добавлена', 'success');
          }
        }
        this.closeModal();
      } catch (err) {
        this.showToast(err.message, 'error');
      }
    });
  }

  openTransferModal() {
    const accounts = store.getAccounts();
    if (accounts.length < 2) {
      this.showToast('Для перевода требуется минимум 2 счёта', 'warning');
      return;
    }

    const bodyHtml = `
      <div class="form-group">
        <label class="form-label">Сумма перевода</label>
        <input type="number" class="form-input" id="trans-amount" placeholder="0" min="0.01" step="any" style="font-size: 1.4rem; font-weight: 700;" autofocus />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Со счёта</label>
          <select class="form-select" id="trans-from">
            ${accounts.map(a => `<option value="${a.id}">${a.name} (${store.formatMoney(a.balance, a.currency)})</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">На счёт</label>
          <select class="form-select" id="trans-to">
            ${accounts.map((a, i) => `<option value="${a.id}" ${i === 1 ? 'selected' : ''}>${a.name} (${store.formatMoney(a.balance, a.currency)})</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Примечание</label>
        <input type="text" class="form-input" id="trans-desc" placeholder="Перевод" value="Перевод средств" />
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary" id="modal-cancel-btn">Отмена</button>
      <button class="btn btn-primary" id="modal-do-transfer-btn">Перевести</button>
    `;

    this.openModal('Перевод между счетами', bodyHtml, footerHtml);

    document.getElementById('modal-cancel-btn')?.addEventListener('click', () => this.closeModal());
    document.getElementById('modal-do-transfer-btn')?.addEventListener('click', () => {
      const amount = parseFloat(document.getElementById('trans-amount').value);
      const fromId = document.getElementById('trans-from').value;
      const toId = document.getElementById('trans-to').value;
      const desc = document.getElementById('trans-desc').value;

      if (isNaN(amount) || amount <= 0) {
        this.showToast('Укажите корректную сумму', 'error');
        return;
      }
      if (fromId === toId) {
        this.showToast('Выберите разные счета', 'error');
        return;
      }

      store.addTransaction({
        type: 'transfer',
        amount: amount,
        fromAccountId: fromId,
        toAccountId: toId,
        description: desc
      });

      this.showToast('Перевод успешно выполнен', 'success');
      this.closeModal();
    });
  }

  openAccountModal(accountToEdit = null) {
    const isEdit = !!accountToEdit;

    const bodyHtml = `
      <div class="form-group">
        <label class="form-label">Название счёта / карты</label>
        <input type="text" class="form-input" id="acc-modal-name" placeholder="Например: Зарплатная карта" value="${accountToEdit ? this.escapeHtml(accountToEdit.name) : ''}" autofocus />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Тип</label>
          <select class="form-select" id="acc-modal-type">
            <option value="card" ${accountToEdit?.type === 'card' ? 'selected' : ''}>Банковская карта</option>
            <option value="cash" ${accountToEdit?.type === 'cash' ? 'selected' : ''}>Наличные</option>
            <option value="savings" ${accountToEdit?.type === 'savings' ? 'selected' : ''}>Накопительный вклад</option>
            <option value="investment" ${accountToEdit?.type === 'investment' ? 'selected' : ''}>Брокерский счёт</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Валюта</label>
          <select class="form-select" id="acc-modal-currency">
            ${Object.keys(CURRENCIES).map(code => `
              <option value="${code}" ${accountToEdit?.currency === code ? 'selected' : ''}>${code}</option>
            `).join('')}
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Начальный баланс</label>
        <input type="number" class="form-input" id="acc-modal-balance" placeholder="0" step="any" value="${accountToEdit ? accountToEdit.balance : '0'}" />
      </div>
      <div class="form-group">
        <label class="form-label">Цвет карты</label>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="acc-color-picker">
          ${COLOR_PALETTE.map(color => `
            <div style="width: 28px; height: 28px; border-radius: 50%; background: ${color}; cursor: pointer; border: 2px solid ${(accountToEdit?.color || '#3b82f6') === color ? 'white' : 'transparent'};" data-color="${color}"></div>
          `).join('')}
        </div>
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary" id="modal-cancel-btn">Отмена</button>
      <button class="btn btn-primary" id="modal-save-acc-btn">${isEdit ? 'Сохранить' : 'Создать счёт'}</button>
    `;

    this.openModal(isEdit ? 'Редактировать счёт' : 'Новый счёт', bodyHtml, footerHtml);

    let selectedColor = accountToEdit?.color || '#3b82f6';
    const colorItems = document.querySelectorAll('#acc-color-picker [data-color]');
    colorItems.forEach(item => {
      item.addEventListener('click', (e) => {
        selectedColor = e.currentTarget.getAttribute('data-color');
        colorItems.forEach(i => i.style.borderColor = 'transparent');
        e.currentTarget.style.borderColor = 'white';
      });
    });

    document.getElementById('modal-cancel-btn')?.addEventListener('click', () => this.closeModal());
    document.getElementById('modal-save-acc-btn')?.addEventListener('click', () => {
      const name = document.getElementById('acc-modal-name').value.trim();
      const type = document.getElementById('acc-modal-type').value;
      const currency = document.getElementById('acc-modal-currency').value;
      const balance = parseFloat(document.getElementById('acc-modal-balance').value) || 0;

      if (!name) {
        this.showToast('Введите название счёта', 'error');
        return;
      }

      if (isEdit) {
        store.updateAccount(accountToEdit.id, { name, type, currency, balance, color: selectedColor });
        this.showToast('Счёт обновлён', 'success');
      } else {
        store.addAccount({ name, type, currency, balance, color: selectedColor });
        this.showToast('Счёт успешно создан', 'success');
      }
      this.closeModal();
    });
  }

  openBudgetModal() {
    const categories = store.getCategories('expense');
    const budgets = store.getBudgets();

    const bodyHtml = `
      <div class="form-group">
        <label class="form-label">Категория расхода</label>
        <select class="form-select" id="budget-modal-cat">
          ${categories.map(c => `
            <option value="${c.id}">${c.name}</option>
          `).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Месячный лимит (${store.getSettings().baseCurrency})</label>
        <input type="number" class="form-input" id="budget-modal-limit" placeholder="Например: 25000" min="1" step="any" autofocus />
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary" id="modal-cancel-btn">Отмена</button>
      <button class="btn btn-primary" id="modal-save-budget-btn">Сохранить лимит</button>
    `;

    this.openModal('Установка месячного бюджета', bodyHtml, footerHtml);

    document.getElementById('modal-cancel-btn')?.addEventListener('click', () => this.closeModal());
    document.getElementById('modal-save-budget-btn')?.addEventListener('click', () => {
      const catId = document.getElementById('budget-modal-cat').value;
      const limit = parseFloat(document.getElementById('budget-modal-limit').value);

      if (isNaN(limit) || limit <= 0) {
        this.showToast('Укажите корректный лимит', 'error');
        return;
      }

      store.setBudget(catId, limit);
      this.showToast('Бюджет установлен', 'success');
      this.closeModal();
    });
  }

  openGoalModal() {
    const bodyHtml = `
      <div class="form-group">
        <label class="form-label">Название цели</label>
        <input type="text" class="form-input" id="goal-modal-title" placeholder="Например: Новый автомобиль или Отпуск" autofocus />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Целевая сумма</label>
          <input type="number" class="form-input" id="goal-modal-target" placeholder="100000" min="1" step="any" />
        </div>
        <div class="form-group">
          <label class="form-label">Уже накоплено</label>
          <input type="number" class="form-input" id="goal-modal-current" placeholder="0" min="0" step="any" value="0" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Желаемая дата достижения</label>
        <input type="date" class="form-input" id="goal-modal-date" />
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary" id="modal-cancel-btn">Отмена</button>
      <button class="btn btn-primary" id="modal-save-goal-btn">Создать цель</button>
    `;

    this.openModal('Новая финансовая цель', bodyHtml, footerHtml);

    document.getElementById('modal-cancel-btn')?.addEventListener('click', () => this.closeModal());
    document.getElementById('modal-save-goal-btn')?.addEventListener('click', () => {
      const title = document.getElementById('goal-modal-title').value.trim();
      const target = parseFloat(document.getElementById('goal-modal-target').value);
      const current = parseFloat(document.getElementById('goal-modal-current').value) || 0;
      const date = document.getElementById('goal-modal-date').value;

      if (!title) {
        this.showToast('Введите название цели', 'error');
        return;
      }
      if (isNaN(target) || target <= 0) {
        this.showToast('Укажите целевую сумму', 'error');
        return;
      }

      store.addGoal({ title, targetAmount: target, currentAmount: current, targetDate: date });
      this.showToast('Цель создана!', 'success');
      this.closeModal();
    });
  }

  openContributeGoalModal(goalId) {
    const goal = store.getGoals().find(g => g.id === goalId);
    if (!goal) return;
    const accounts = store.getAccounts();

    const bodyHtml = `
      <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 14px;">
        Цель: <strong>${goal.title}</strong> (Осталось накопить: ${store.formatMoney(goal.targetAmount - goal.currentAmount)})
      </p>
      <div class="form-group">
        <label class="form-label">Сумма взноса</label>
        <input type="number" class="form-input" id="contrib-amount" placeholder="0" min="1" step="any" style="font-size: 1.3rem; font-weight: 700;" autofocus />
      </div>
      <div class="form-group">
        <label class="form-label">Списать со счёта (опционально)</label>
        <select class="form-select" id="contrib-account">
          <option value="">Не списывать (просто увеличить счётчик цели)</option>
          ${accounts.map(a => `<option value="${a.id}">${a.name} (${store.formatMoney(a.balance, a.currency)})</option>`).join('')}
        </select>
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary" id="modal-cancel-btn">Отмена</button>
      <button class="btn btn-primary" id="modal-save-contrib-btn">Внести</button>
    `;

    this.openModal('Пополнение цели', bodyHtml, footerHtml);

    document.getElementById('modal-cancel-btn')?.addEventListener('click', () => this.closeModal());
    document.getElementById('modal-save-contrib-btn')?.addEventListener('click', () => {
      const amount = parseFloat(document.getElementById('contrib-amount').value);
      const accId = document.getElementById('contrib-account').value || null;

      if (isNaN(amount) || amount <= 0) {
        this.showToast('Введите корректную сумму', 'error');
        return;
      }

      try {
        store.contributeToGoal(goalId, amount, accId);
        this.showToast('Взнос учтён!', 'success');
        this.closeModal();
      } catch (err) {
        this.showToast(err.message, 'error');
      }
    });
  }

  openRecurringModal() {
    const categories = store.getCategories();
    const accounts = store.getAccounts();
    const todayStr = toLocalYMD();

    const bodyHtml = `
      <div class="form-group">
        <label class="form-label">Название (например: Аренда, Подписка Spotify)</label>
        <input type="text" class="form-input" id="rec-modal-title" autofocus />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Тип</label>
          <select class="form-select" id="rec-modal-type">
            <option value="expense">Расход</option>
            <option value="income">Доход</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Сумма</label>
          <input type="number" class="form-input" id="rec-modal-amount" placeholder="0" min="1" step="any" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Категория</label>
          <select class="form-select" id="rec-modal-cat">
            ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Счёт</label>
          <select class="form-select" id="rec-modal-acc">
            ${accounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Периодичность</label>
          <select class="form-select" id="rec-modal-freq">
            <option value="monthly">Каждый месяц</option>
            <option value="weekly">Каждую неделю</option>
            <option value="daily">Каждый день</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Следующая дата</label>
          <input type="date" class="form-input" id="rec-modal-date" value="${todayStr}" />
        </div>
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary" id="modal-cancel-btn">Отмена</button>
      <button class="btn btn-primary" id="modal-save-rec-btn">Сохранить</button>
    `;

    this.openModal('Новый регулярный платёж', bodyHtml, footerHtml);

    document.getElementById('modal-cancel-btn')?.addEventListener('click', () => this.closeModal());
    document.getElementById('modal-save-rec-btn')?.addEventListener('click', () => {
      const title = document.getElementById('rec-modal-title').value.trim();
      const type = document.getElementById('rec-modal-type').value;
      const amount = parseFloat(document.getElementById('rec-modal-amount').value);
      const categoryId = document.getElementById('rec-modal-cat').value;
      const accountId = document.getElementById('rec-modal-acc').value;
      const frequency = document.getElementById('rec-modal-freq').value;
      const nextDate = document.getElementById('rec-modal-date').value;

      if (!title || isNaN(amount) || amount <= 0) {
        this.showToast('Заполните название и корректную сумму', 'error');
        return;
      }

      store.addRecurring({ title, type, amount, categoryId, accountId, frequency, nextDate });
      this.showToast('Регулярный платёж сохранён', 'success');
      this.closeModal();
    });
  }

  openCategoryModal() {
    const iconsList = Object.keys(CATEGORY_ICONS);
    let selectedIcon = 'other';
    let selectedColor = '#3b82f6';

    const bodyHtml = `
      <div class="form-group">
        <label class="form-label">Название категории</label>
        <input type="text" class="form-input" id="cat-modal-name" placeholder="Например: Книги или Спорт" autofocus />
      </div>
      <div class="form-group">
        <label class="form-label">Тип</label>
        <select class="form-select" id="cat-modal-type">
          <option value="expense">Расход</option>
          <option value="income">Доход</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Цвет</label>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="cat-color-picker">
          ${COLOR_PALETTE.map(color => `
            <div style="width: 26px; height: 26px; border-radius: 50%; background: ${color}; cursor: pointer; border: 2px solid ${color === selectedColor ? 'white' : 'transparent'};" data-color="${color}"></div>
          `).join('')}
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Иконка</label>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; max-height: 120px; overflow-y: auto; padding: 4px;" id="cat-icon-picker">
          ${iconsList.map(iconKey => `
            <div style="width: 36px; height: 36px; border-radius: 8px; background: var(--bg-input); display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid ${iconKey === selectedIcon ? 'var(--primary)' : 'var(--border-color)'};" data-icon="${iconKey}">
              ${getCategoryIconSvg(iconKey)}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary" id="modal-cancel-btn">Отмена</button>
      <button class="btn btn-primary" id="modal-save-cat-btn">Создать категорию</button>
    `;

    this.openModal('Новая категория', bodyHtml, footerHtml);

    document.querySelectorAll('#cat-color-picker [data-color]').forEach(el => {
      el.addEventListener('click', (e) => {
        selectedColor = e.currentTarget.getAttribute('data-color');
        document.querySelectorAll('#cat-color-picker [data-color]').forEach(i => i.style.borderColor = 'transparent');
        e.currentTarget.style.borderColor = 'white';
      });
    });

    document.querySelectorAll('#cat-icon-picker [data-icon]').forEach(el => {
      el.addEventListener('click', (e) => {
        selectedIcon = e.currentTarget.getAttribute('data-icon');
        document.querySelectorAll('#cat-icon-picker [data-icon]').forEach(i => i.style.borderColor = 'var(--border-color)');
        e.currentTarget.style.borderColor = 'var(--primary)';
      });
    });

    document.getElementById('modal-cancel-btn')?.addEventListener('click', () => this.closeModal());
    document.getElementById('modal-save-cat-btn')?.addEventListener('click', () => {
      const name = document.getElementById('cat-modal-name').value.trim();
      const type = document.getElementById('cat-modal-type').value;

      if (!name) {
        this.showToast('Введите название категории', 'error');
        return;
      }

      store.addCategory({ name, type, color: selectedColor, icon: selectedIcon });
      this.showToast('Категория успешно создана', 'success');
      this.closeModal();
    });
  }

  // =========================================================================
  // HELPER TEMPLATES
  // =========================================================================

  renderTransactionRowHtml(tx, categories, accounts, showActions = true) {
    const isIncome = tx.type === 'income';
    const isTransfer = tx.type === 'transfer';
    const cat = isTransfer ? null : (categories.find(c => c.id === tx.categoryId) || { name: 'Без категории', color: '#64748b', icon: 'other' });

    let fromAcc = null;
    let toAcc = null;
    let acc = null;

    if (isTransfer) {
      fromAcc = accounts.find(a => a.id === tx.fromAccountId);
      toAcc = accounts.find(a => a.id === tx.toAccountId);
    } else {
      acc = accounts.find(a => a.id === tx.accountId);
    }

    const badgeColor = isTransfer ? 'var(--primary)' : (cat?.color || '#3b82f6');
    const iconSvg = isTransfer
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`
      : getCategoryIconSvg(cat?.icon);

    let title = isTransfer ? `Перевод: ${fromAcc?.name || 'Счёт'} → ${toAcc?.name || 'Счёт'}` : (cat?.name || 'Операция');
    let sub = tx.description || (isTransfer ? 'Перевод между своими счетами' : '');

    let prefix = isIncome ? '+' : (isTransfer ? '' : '-');
    let amountClass = isIncome ? 'income' : (isTransfer ? 'transfer' : 'expense');

    return `
      <div class="tx-row" data-id="${tx.id}">
        <div class="tx-left">
          <div class="tx-icon-badge" style="background: ${badgeColor};">
            ${iconSvg}
          </div>
          <div class="tx-details">
            <span class="tx-desc">${this.escapeHtml(title)}</span>
            <div class="tx-meta">
              <span>${this.escapeHtml(sub)}</span>
              ${acc ? `<span class="tx-account-tag">${this.escapeHtml(acc.name)}</span>` : ''}
              <span>${tx.time || ''}</span>
            </div>
          </div>
        </div>
        <div class="tx-right">
          <span class="tx-amount ${amountClass}">
            ${prefix}${store.formatMoney(tx.amount)}
          </span>
          ${showActions ? `
            <div class="tx-actions">
              <button class="icon-btn" data-edit-tx="${tx.id}" title="Редактировать">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <button class="icon-btn danger" data-delete-tx="${tx.id}" title="Удалить">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  formatDateHeader(dateStr) {
    const today = toLocalYMD();
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    const yesterday = toLocalYMD(yest);

    if (dateStr === today) return 'Сегодня';
    if (dateStr === yesterday) return 'Вчера';

    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'short' });
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  adjustColorBrightness(col, percent) {
    const num = parseInt(col.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }
}
