// Chart.js rendering and management
import { store } from './store.js';

let categoryChartInstance = null;
let dynamicsChartInstance = null;
let analyticsCategoryChartInstance = null;
let analyticsDynamicsChartInstance = null;

export function renderCategoryChart(canvas, categoryData, isDark = true) {
  if (!canvas) return;

  if (categoryChartInstance) {
    categoryChartInstance.destroy();
    categoryChartInstance = null;
  }

  const ctx = canvas.getContext('2d');
  const items = categoryData.items;

  if (!items || items.length === 0) {
    // Show empty placeholder inside canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Нет данных о расходах за период', canvas.width / 2, canvas.height / 2);
    return;
  }

  const labels = items.map(i => i.name);
  const data = items.map(i => i.amount);
  const colors = items.map(i => i.color || '#3b82f6');

  // @ts-ignore Chart is loaded globally via CDN
  categoryChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: isDark ? '#1e293b' : '#ffffff',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          display: false // We render custom interactive legend in HTML
        },
        tooltip: {
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          titleColor: isDark ? '#f8fafc' : '#0f172a',
          bodyColor: isDark ? '#cbd5e1' : '#334155',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              const val = context.raw || 0;
              const formatted = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(val);
              const percentage = categoryData.total > 0 ? Math.round((val / categoryData.total) * 100) : 0;
              const symbol = store.getCurrencySymbol();
              return ` ${formatted} ${symbol} (${percentage}%)`;
            }
          }
        }
      }
    }
  });

  return categoryChartInstance;
}

export function renderDynamicsChart(canvas, timeSeriesData, isLine = false, isDark = true) {
  if (!canvas) return;

  if (dynamicsChartInstance) {
    dynamicsChartInstance.destroy();
    dynamicsChartInstance = null;
  }

  const ctx = canvas.getContext('2d');
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';

  const datasets = [
    {
      label: 'Доходы',
      data: timeSeriesData.incomeData,
      backgroundColor: isLine ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.85)',
      borderColor: '#10b981',
      borderWidth: 2,
      borderRadius: isLine ? 0 : 6,
      fill: isLine,
      tension: 0.35,
      pointRadius: isLine ? 3 : 0,
      pointHoverRadius: 6
    },
    {
      label: 'Расходы',
      data: timeSeriesData.expenseData,
      backgroundColor: isLine ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.85)',
      borderColor: '#ef4444',
      borderWidth: 2,
      borderRadius: isLine ? 0 : 6,
      fill: isLine,
      tension: 0.35,
      pointRadius: isLine ? 3 : 0,
      pointHoverRadius: 6
    }
  ];

  // @ts-ignore
  dynamicsChartInstance = new Chart(ctx, {
    type: isLine ? 'line' : 'bar',
    data: {
      labels: timeSeriesData.labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: textColor,
            font: { size: 11 },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 10
          }
        },
        y: {
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor,
            font: { size: 11 },
            callback: function(value) {
              if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
              if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
              return value;
            }
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            color: textColor,
            boxWidth: 12,
            boxHeight: 12,
            usePointStyle: true,
            pointStyle: 'circle',
            font: { size: 12 }
          }
        },
        tooltip: {
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          titleColor: isDark ? '#f8fafc' : '#0f172a',
          bodyColor: isDark ? '#cbd5e1' : '#334155',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
          padding: 12,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              const val = context.raw || 0;
              const formatted = new Intl.NumberFormat('ru-RU').format(val);
              return ` ${context.dataset.label}: ${formatted} ₽`;
            }
          }
        }
      }
    }
  });

  return dynamicsChartInstance;
}

export function updateAllChartsTheme(isDark) {
  // Triggers chart re-render with new colors
  if (categoryChartInstance) {
    categoryChartInstance.options.plugins.tooltip.backgroundColor = isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    categoryChartInstance.data.datasets[0].borderColor = isDark ? '#1e293b' : '#ffffff';
    categoryChartInstance.update();
  }
}
