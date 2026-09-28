// Analytics and financial calculation logic

export function toLocalYMD(date = new Date()) {
  const d = (date instanceof Date) ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateRange(period, customStart = null, customEnd = null) {
  const now = new Date();
  let start = new Date(now);
  let end = new Date(now);

  if (period === 'today') {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === 'week') {
    // Current week (starting from Monday)
    const day = now.getDay() || 7; // Monday is 1, Sunday is 7
    start.setDate(now.getDate() - day + 1);
    start.setHours(0, 0, 0, 0);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  } else if (period === 'month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  } else if (period === 'year') {
    start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
  } else if (period === 'custom' && customStart && customEnd) {
    start = new Date(customStart + 'T00:00:00');
    end = new Date(customEnd + 'T23:59:59');
  } else {
    // All time
    start = new Date(2000, 0, 1);
    end = new Date(2099, 11, 31);
  }

  return {
    startStr: toLocalYMD(start),
    endStr: toLocalYMD(end),
    start,
    end
  };
}

export function getPreviousPeriodDateRange(period, currentStart, currentEnd) {
  const start = new Date(currentStart);
  const end = new Date(currentEnd);

  if (period === 'month') {
    // 1 month prior
    const prevStart = new Date(start.getFullYear(), start.getMonth() - 1, 1);
    const prevEnd = new Date(start.getFullYear(), start.getMonth(), 0, 23, 59, 59);
    return {
      startStr: toLocalYMD(prevStart),
      endStr: toLocalYMD(prevEnd)
    };
  } else if (period === 'week') {
    const prevStart = new Date(start);
    prevStart.setDate(prevStart.getDate() - 7);
    const prevEnd = new Date(end);
    prevEnd.setDate(prevEnd.getDate() - 7);
    return {
      startStr: toLocalYMD(prevStart),
      endStr: toLocalYMD(prevEnd)
    };
  } else if (period === 'year') {
    const prevStart = new Date(start.getFullYear() - 1, 0, 1);
    const prevEnd = new Date(start.getFullYear() - 1, 11, 31);
    return {
      startStr: toLocalYMD(prevStart),
      endStr: toLocalYMD(prevEnd)
    };
  }

  // Default duration shift
  const diffTime = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - diffTime);
  return {
    startStr: toLocalYMD(prevStart),
    endStr: toLocalYMD(prevEnd)
  };
}

export function filterTransactionsByDate(transactions, startStr, endStr) {
  return transactions.filter(t => t.date >= startStr && t.date <= endStr);
}

export function computeSummary(transactions) {
  let income = 0;
  let expense = 0;
  let transferCount = 0;

  for (const t of transactions) {
    if (t.type === 'income') {
      income += Number(t.amount) || 0;
    } else if (t.type === 'expense') {
      expense += Number(t.amount) || 0;
    } else if (t.type === 'transfer') {
      transferCount++;
    }
  }

  const net = income - expense;
  const savingsRate = income > 0 ? Math.round((net / income) * 100) : 0;

  return {
    income,
    expense,
    net,
    savingsRate,
    count: transactions.length,
    transferCount
  };
}

export function computeComparison(currentTransactions, previousTransactions) {
  const current = computeSummary(currentTransactions);
  const previous = computeSummary(previousTransactions);

  const calcDelta = (curr, prev) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100);
  };

  return {
    current,
    previous,
    incomeDelta: calcDelta(current.income, previous.income),
    expenseDelta: calcDelta(current.expense, previous.expense),
    netDelta: calcDelta(current.net, previous.net)
  };
}

export function getCategoryBreakdown(transactions, categories, type = 'expense') {
  const filtered = transactions.filter(t => t.type === type);
  const total = filtered.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const catMap = new Map();
  for (const cat of categories) {
    catMap.set(cat.id, {
      id: cat.id,
      name: cat.name,
      color: cat.color,
      icon: cat.icon,
      amount: 0,
      percentage: 0,
      count: 0
    });
  }

  for (const t of filtered) {
    let item = catMap.get(t.categoryId);
    if (!item) {
      item = {
        id: t.categoryId || 'unknown',
        name: 'Без категории',
        color: '#94a3b8',
        icon: 'other',
        amount: 0,
        percentage: 0,
        count: 0
      };
      catMap.set(t.categoryId, item);
    }
    item.amount += Number(t.amount) || 0;
    item.count += 1;
  }

  const result = Array.from(catMap.values())
    .filter(item => item.amount > 0)
    .map(item => ({
      ...item,
      percentage: total > 0 ? Math.round((item.amount / total) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    total,
    items: result,
    top5: result.slice(0, 5)
  };
}

export function getTimeSeriesData(transactions, period, startStr, endStr) {
  // Decide granularity: daily or monthly
  const startDate = new Date(startStr);
  const endDate = new Date(endStr);
  const diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  const isDaily = diffDays <= 62; // up to 2 months -> daily

  const labels = [];
  const incomeData = [];
  const expenseData = [];
  const map = new Map();

  if (isDaily) {
    const cur = new Date(startDate);
    while (cur <= endDate) {
      const dStr = toLocalYMD(cur);
      const label = cur.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
      map.set(dStr, { label, income: 0, expense: 0 });
      cur.setDate(cur.getDate() + 1);
    }

    for (const t of transactions) {
      if (map.has(t.date)) {
        const item = map.get(t.date);
        if (t.type === 'income') item.income += Number(t.amount) || 0;
        if (t.type === 'expense') item.expense += Number(t.amount) || 0;
      }
    }
  } else {
    // Monthly grouping
    const cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    while (cur <= endDate) {
      const mKey = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}`;
      const label = cur.toLocaleDateString('ru-RU', { month: 'short', year: '2-digit' });
      map.set(mKey, { label, income: 0, expense: 0 });
      cur.setMonth(cur.getMonth() + 1);
    }

    for (const t of transactions) {
      const mKey = t.date.slice(0, 7);
      if (map.has(mKey)) {
        const item = map.get(mKey);
        if (t.type === 'income') item.income += Number(t.amount) || 0;
        if (t.type === 'expense') item.expense += Number(t.amount) || 0;
      }
    }
  }

  for (const val of map.values()) {
    labels.push(val.label);
    incomeData.push(val.income);
    expenseData.push(val.expense);
  }

  return { labels, incomeData, expenseData };
}

export function computeBudgetsStatus(budgets, categories, currentMonthTransactions) {
  const currentMonthExpenses = currentMonthTransactions.filter(t => t.type === 'expense');

  return budgets.map(budget => {
    const category = categories.find(c => c.id === budget.categoryId) || {
      name: 'Неизвестная категория',
      color: '#94a3b8',
      icon: 'other'
    };

    const spent = currentMonthExpenses
      .filter(t => t.categoryId === budget.categoryId)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const limit = Number(budget.limit) || 0;
    const remaining = limit - spent;
    const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;

    let status = 'good'; // < 75%
    if (percent >= 100) {
      status = 'exceeded';
    } else if (percent >= 75) {
      status = 'warning';
    }

    return {
      categoryId: budget.categoryId,
      category,
      limit,
      spent,
      remaining,
      percent,
      status
    };
  }).sort((a, b) => b.percent - a.percent);
}
