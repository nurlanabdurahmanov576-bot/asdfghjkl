import { toLocalYMD, computeSummary, computeComparison, getCategoryBreakdown, computeBudgetsStatus } from '../js/analytics.js';

console.log('Testing Analytics & Logic...');

// 1. Test toLocalYMD
const todayStr = toLocalYMD();
console.log('toLocalYMD():', todayStr);
if (!/^\d{4}-\d{2}-\d{2}$/.test(todayStr)) {
  throw new Error('Invalid toLocalYMD format');
}

// 2. Test summary calculations
const txs = [
  { type: 'income', amount: 50000, categoryId: 'cat-salary', date: '2026-09-05' },
  { type: 'expense', amount: 15000, categoryId: 'cat-food', date: '2026-09-08' },
  { type: 'expense', amount: 5000, categoryId: 'cat-transport', date: '2026-09-10' },
  { type: 'transfer', amount: 10000, date: '2026-09-12' }
];

const summary = computeSummary(txs);
console.log('Summary:', summary);
if (summary.income !== 50000 || summary.expense !== 20000 || summary.net !== 30000 || summary.savingsRate !== 60) {
  throw new Error('Summary calculation error');
}

// 3. Test comparisons
const prevTxs = [
  { type: 'income', amount: 40000, date: '2026-08-05' },
  { type: 'expense', amount: 25000, date: '2026-08-10' }
];
const comp = computeComparison(txs, prevTxs);
console.log('Comparison:', comp);
if (comp.incomeDelta !== 25 || comp.expenseDelta !== -20) {
  throw new Error('Comparison delta calculation error');
}

// 4. Test category breakdown
const categories = [
  { id: 'cat-food', name: 'Еда', color: '#f59e0b', icon: 'food' },
  { id: 'cat-transport', name: 'Транспорт', color: '#3b82f6', icon: 'transport' }
];
const breakdown = getCategoryBreakdown(txs, categories, 'expense');
console.log('Breakdown:', breakdown);
if (breakdown.total !== 20000 || breakdown.items.length !== 2 || breakdown.items[0].name !== 'Еда' || breakdown.items[0].percentage !== 75) {
  throw new Error('Breakdown calculation error');
}

// 5. Test budgets status
const budgets = [
  { categoryId: 'cat-food', limit: 20000 },
  { categoryId: 'cat-transport', limit: 4000 }
];
const budgetsStatus = computeBudgetsStatus(budgets, categories, txs);
console.log('Budgets Status:', budgetsStatus);
const foodBudget = budgetsStatus.find(b => b.categoryId === 'cat-food');
const transBudget = budgetsStatus.find(b => b.categoryId === 'cat-transport');
if (foodBudget.spent !== 15000 || foodBudget.percent !== 75 || foodBudget.status !== 'warning') {
  throw new Error('Food budget status error');
}
if (transBudget.spent !== 5000 || transBudget.percent !== 125 || transBudget.status !== 'exceeded') {
  throw new Error('Transport budget status error');
}

console.log('ALL TESTS PASSED SUCCESSFULLY! ✓');
