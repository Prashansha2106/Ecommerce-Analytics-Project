// ── All years data ──
const data = {
  all: {
    sales: '$2.30M', profit: '$286K', orders: '5,009', margin: '12.47%',
    trend: {
      2016: [7, 6, 11, 9, 8, 12, 11, 13, 15, 13, 18, 20],
      2017: [9, 8, 14, 11, 11, 15, 13, 17, 19, 16, 22, 26],
      2018: [11, 10, 17, 14, 13, 19, 16, 21, 23, 20, 28, 31],
      2019: [14, 13, 21, 18, 16, 24, 20, 26, 29, 25, 34, 39]
    }
  },
  2016: {
    sales: '$484K', profit: '$49K', orders: '1,865', margin: '10.1%',
    trend: { 2016: [7, 6, 11, 9, 8, 12, 11, 13, 15, 13, 18, 20] }
  },
  2017: {
    sales: '$470K', profit: '$52K', orders: '1,951', margin: '11.1%',
    trend: { 2017: [9, 8, 14, 11, 11, 15, 13, 17, 19, 16, 22, 26] }
  },
  2018: {
    sales: '$609K', profit: '$81K', orders: '1,988', margin: '13.3%',
    trend: { 2018: [11, 10, 17, 14, 13, 19, 16, 21, 23, 20, 28, 31] }
  },
  2019: {
    sales: '$733K', profit: '$93K', orders: '2,049', margin: '12.7%',
    trend: { 2019: [14, 13, 21, 18, 16, 24, 20, 26, 29, 25, 34, 39] }
  }
};

// Chart colors per year
const colors = {
  2016: '#4f8ef7',
  2017: '#2dd4a0',
  2018: '#f7a24f',
  2019: '#f74f7a'
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Shared tooltip style for all charts
const tooltipStyle = {
  backgroundColor: '#1a1d26',
  borderColor: 'rgba(255,255,255,0.1)',
  borderWidth: 1,
  titleColor: '#f0f2f7',
  bodyColor: '#7a8299',
  padding: 10
};

// Shared tick style
const tickStyle = { color: '#7a8299', font: { size: 11 } };


// ── 1. Monthly Trend Line Chart ──
const trendCtx = document.getElementById('trendChart').getContext('2d');

let trendChart = new Chart(trendCtx, {
  type: 'line',
  data: {
    labels: months,
    datasets: buildTrendDatasets(data.all.trend)
  },
  options: {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { display: false }, tooltip: tooltipStyle },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: tickStyle },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { ...tickStyle, callback: v => '$' + v + 'K' }
      }
    }
  }
});

// Builds line chart datasets from trend object
function buildTrendDatasets(trend) {
  return Object.entries(trend).map(([year, values]) => ({
    label: year,
    data: values,
    borderColor: colors[year],
    backgroundColor: colors[year] + '18',  // 10% opacity fill
    fill: true,
    tension: 0.4,
    pointRadius: 3,
    borderWidth: 2
  }));
}


// ── 2. Category Donut Chart ──
new Chart(document.getElementById('catChart').getContext('2d'), {
  type: 'doughnut',
  data: {
    labels: ['Technology', 'Furniture', 'Office Supplies'],
    datasets: [{
      data: [836154, 742000, 719047],
      backgroundColor: ['#4f8ef7', '#2dd4a0', '#f7a24f'],
      borderWidth: 0,
      hoverOffset: 6
    }]
  },
  options: {
    responsive: true,
    cutout: '70%',
    plugins: { legend: { display: false }, tooltip: tooltipStyle }
  }
});


// ── 3. Region Bar Chart ──
new Chart(document.getElementById('regionChart').getContext('2d'), {
  type: 'bar',
  data: {
    labels: ['West', 'East', 'Central', 'South'],
    datasets: [{
      data: [108418, 91523, 39706, 46749],
      backgroundColor: ['#4f8ef7', '#2dd4a0', '#f7a24f', '#f74f7a'],
      borderRadius: 6,
      borderSkipped: false
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: tooltipStyle },
    scales: {
      x: { grid: { display: false }, ticks: tickStyle },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { ...tickStyle, callback: v => '$' + Math.round(v / 1000) + 'K' }
      }
    }
  }
});


// ── 4. Sub-Category Horizontal Bar ──
new Chart(document.getElementById('subCatChart').getContext('2d'), {
  type: 'bar',
  indexAxis: 'y',   // makes it horizontal
  data: {
    labels: ['Phones', 'Chairs', 'Storage', 'Tables', 'Binders'],
    datasets: [{
      data: [330007, 328449, 223844, 206966, 203413],
      backgroundColor: '#4f8ef7',
      borderRadius: 5,
      borderSkipped: false
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: tooltipStyle },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { ...tickStyle, callback: v => '$' + Math.round(v / 1000) + 'K' }
      },
      y: { grid: { display: false }, ticks: tickStyle }
    }
  }
});


// ── 5. Year Filter ──
function filterYear(year, el) {
  // Remove active from all chips, add to clicked
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');

  // Get data for selected year
  const d = data[year] || data.all;

  // Update KPI values
  document.getElementById('kpi-sales').textContent = d.sales;
  document.getElementById('kpi-profit').textContent = d.profit;
  document.getElementById('kpi-orders').textContent = d.orders;
  document.getElementById('kpi-margin').textContent = d.margin;

  // Update trend chart datasets
  trendChart.data.datasets = buildTrendDatasets(d.trend);
  trendChart.update();
}
// Animated counter for KPI cards
function animateCounter(id, target, prefix, suffix, isDecimal) {
  const el = document.getElementById(id);
  const duration = 1800;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    current += increment;
    if (step >= steps) { current = target; clearInterval(timer); }

    let display = isDecimal ? current.toFixed(2) : Math.round(current);

    // Format large numbers
    if (!isDecimal && current >= 1000000) display = '$' + (current / 1000000).toFixed(2) + 'M';
    else if (!isDecimal && current >= 1000) display = prefix + Math.round(current / 1000) + 'K';
    else display = prefix + display + suffix;

    el.textContent = display;
  }, duration / steps);
}

// Run on page load
window.addEventListener('load', () => {
  animateCounter('kpi-sales', 2300000, '$', '', false);
  animateCounter('kpi-profit', 286397, '$', '', false);
  animateCounter('kpi-orders', 5009, '', '', false);
  animateCounter('kpi-margin', 12.47, '', '%', true);
});
// Dark / Light mode toggle
function toggleTheme() {
  const html = document.documentElement;
  const btn = document.getElementById('themeBtn');
  const isDark = html.getAttribute('data-theme') === 'dark';

  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  btn.textContent = isDark ? '☀️' : '🌙';

  // Update all chart colors on theme switch
  updateChartTheme(isDark ? 'light' : 'dark');
}

function updateChartTheme(theme) {
  const tickColor = theme === 'dark' ? '#7a8299' : '#6b7280';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';

  [trendChart, regionChart, subCatChart].forEach(chart => {
    chart.options.scales.x.ticks.color = tickColor;
    chart.options.scales.y.ticks.color = tickColor;
    chart.options.scales.x.grid.color = gridColor;
    chart.options.scales.y.grid.color = gridColor;
    chart.update();
  });
}

// Live search filter for product table
function searchTable() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#tableBody tr');

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
}

// Sort table by column
let sortAsc = true;

function sortTable(colIndex) {
  const tbody = document.getElementById('tableBody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    const aText = a.cells[colIndex].textContent.trim();
    const bText = b.cells[colIndex].textContent.trim();
    const aNum = parseFloat(aText.replace(/[^0-9.]/g, ''));
    const bNum = parseFloat(bText.replace(/[^0-9.]/g, ''));

    if (!isNaN(aNum) && !isNaN(bNum)) return sortAsc ? aNum - bNum : bNum - aNum;
    return sortAsc ? aText.localeCompare(bText) : bText.localeCompare(aText);
  });

  sortAsc = !sortAsc;
  rows.forEach(row => tbody.appendChild(row));
}
// Export all charts as PNG
function exportDashboard() {
  const charts = [
    { id: 'trendChart', name: 'monthly_trend' },
    { id: 'catChart', name: 'category_sales' },
    { id: 'regionChart', name: 'region_profit' },
    { id: 'subCatChart', name: 'subcategory_sales' }
  ];

  charts.forEach(({ id, name }) => {
    const link = document.createElement('a');
    link.download = name + '.png';
    link.href = document.getElementById(id).toDataURL('image/png');
    link.click();
  });
}