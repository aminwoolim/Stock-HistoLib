// ============================================
// Stock HistoLibrary - Learning Platform
// ============================================

const BASE = "https://75mogiezvd.execute-api.us-east-1.amazonaws.com";
document.getElementById('ver').textContent = APP_VERSION;

// ============================================
// Educational Content Database
// ============================================

const STAT_EXPLANATIONS = {
  avg: {
    icon: "📊",
    title: "Average Price",
    short: "Mean closing price over the data period",
    description: "The arithmetic mean of all closing prices in the dataset. This represents the 'typical' price the stock has traded at historically. It's useful as a baseline reference point to determine if the current price is above or below historical norms.",
    interpretation: "If the current price is significantly above the average, the stock may be at highs or potentially overvalued. If below, it could be undervalued or in decline. Compare with other metrics to get the full picture.",
    guide: [
      { label: "Above avg", badge: "good", text: "Stock has appreciated from historical mean" },
      { label: "Near avg", badge: "average", text: "Trading at typical historical levels" },
      { label: "Below avg", badge: "poor", text: "May be undervalued or declining" }
    ]
  },
  change: {
    icon: "📈",
    title: "Price Change %",
    short: "Total return from first to last data point",
    description: "Measures the percentage change in stock price from the beginning to the end of the available data period. This simple metric shows whether you would have gained or lost money by holding the stock.",
    interpretation: "Positive percentage means the stock appreciated over time. Compare to market benchmarks (S&P 500 averages ~10% annually) to gauge relative performance. Consider the time period when interpreting.",
    guide: [
      { label: "> +50%", badge: "excellent", text: "Strong growth stock" },
      { label: "+10% to +50%", badge: "good", text: "Healthy appreciation" },
      { label: "0% to +10%", badge: "average", text: "Modest gains" },
      { label: "< 0%", badge: "poor", text: "Value declined" }
    ]
  },
  volatility: {
    icon: "🎢",
    title: "Volatility",
    short: "Standard deviation of daily returns",
    description: "Measures how much the stock price fluctuates day-to-day, calculated as the standard deviation of daily percentage changes. Higher volatility means bigger price swings in both directions — more risk, but potentially more reward.",
    interpretation: "Low volatility stocks are 'safer' but may have limited upside. High volatility stocks can generate large gains but also significant losses. Match volatility to your risk tolerance.",
    guide: [
      { label: "< 20", badge: "good", text: "Low volatility — stable, lower risk" },
      { label: "20-40", badge: "average", text: "Moderate volatility — balanced risk/reward" },
      { label: "40-60", badge: "poor", text: "High volatility — significant swings" },
      { label: "> 60", badge: "poor", text: "Very high volatility — speculative" }
    ]
  },
  ma20: {
    icon: "📉",
    title: "MA20 (20-Day Moving Average)",
    short: "Average of the last 20 trading days",
    description: "A short-term trend indicator calculated by averaging the closing prices of the last 20 trading days. It smooths out day-to-day noise to reveal the recent price trend. When the current price crosses above or below the MA20, it can signal momentum shifts.",
    interpretation: "When price is above MA20, short-term momentum is bullish. When below, momentum is bearish. Watch for crossovers — price crossing above MA20 is often seen as a buy signal by traders.",
    guide: [
      { label: "Price > MA20", badge: "good", text: "Short-term uptrend / bullish momentum" },
      { label: "Price ≈ MA20", badge: "average", text: "Consolidating / neutral" },
      { label: "Price < MA20", badge: "poor", text: "Short-term downtrend / bearish momentum" }
    ]
  },
  ma50: {
    icon: "📊",
    title: "MA50 (50-Day Moving Average)",
    short: "Average of the last 50 trading days",
    description: "A medium-term trend indicator. The MA50 is slower to react than MA20, making it useful for identifying more established trends. The relationship between MA20 and MA50 creates important trading signals.",
    interpretation: "The 'Golden Cross' occurs when MA20 crosses above MA50 — a classic bullish signal. The 'Death Cross' is when MA20 crosses below MA50 — a bearish signal. Institutional investors often watch these levels.",
    guide: [
      { label: "MA20 > MA50", badge: "good", text: "Golden Cross territory — bullish trend" },
      { label: "MA20 ≈ MA50", badge: "average", text: "Potential trend change brewing" },
      { label: "MA20 < MA50", badge: "poor", text: "Death Cross territory — bearish trend" }
    ]
  },
  cagr: {
    icon: "🚀",
    title: "CAGR (Compound Annual Growth Rate)",
    short: "Smoothed annual return rate",
    description: "CAGR represents the rate at which an investment would have grown if it grew at a steady rate annually. Unlike simple percentage change, CAGR accounts for compounding and time, making it the best metric for comparing investments over different time periods.",
    interpretation: "CAGR tells you: 'If I invested $1,000 and it grew at this rate each year, I'd reach the current value.' It's more meaningful than total return for multi-year investments. Compare to inflation (~3%) and market average (~10%).",
    guide: [
      { label: "> 20%", badge: "excellent", text: "Outstanding growth — top performer" },
      { label: "15-20%", badge: "good", text: "Excellent — beating the market" },
      { label: "10-15%", badge: "good", text: "Good — matching market returns" },
      { label: "5-10%", badge: "average", text: "Modest — below market average" },
      { label: "< 5%", badge: "poor", text: "Poor — underperforming market" }
    ]
  },
  bestDay: {
    icon: "🎉",
    title: "Best Day",
    short: "Largest single-day percentage gain",
    description: "The highest single-day percentage increase in the stock's price within the data period. Large best days often occur during positive earnings surprises, market rebounds, or major good news announcements.",
    interpretation: "A very large best day suggests the stock can have explosive upside moves. However, stocks with very large best days often also have large worst days — they're typically more volatile overall.",
    guide: [
      { label: "> 10%", badge: "excellent", text: "Highly volatile — potential for big gains" },
      { label: "5-10%", badge: "good", text: "Moderate upside volatility" },
      { label: "< 5%", badge: "average", text: "Relatively stable stock" }
    ]
  },
  worstDay: {
    icon: "📉",
    title: "Worst Day",
    short: "Largest single-day percentage loss",
    description: "The biggest single-day percentage drop in the stock's price. This represents the maximum one-day pain you might experience. Large worst days often occur during earnings misses, market crashes, or negative news.",
    interpretation: "Compare worst day to best day — if the worst day loss exceeds the best day gain, the stock may have asymmetric downside risk. Use this to gauge how much you could lose in a single bad day.",
    guide: [
      { label: "< -10%", badge: "poor", text: "High downside risk — volatile stock" },
      { label: "-5% to -10%", badge: "average", text: "Moderate downside volatility" },
      { label: "> -5%", badge: "good", text: "Relatively stable — limited single-day risk" }
    ]
  }
};

// ============================================
// Glossary Terms
// ============================================

const GLOSSARY = [
  { term: "Bull Market", icon: "🐂", definition: "A market condition where prices are rising or expected to rise. Named after how a bull attacks (horns up). Generally defined as a 20%+ rise from recent lows." },
  { term: "Bear Market", icon: "🐻", definition: "A market condition where prices are falling or expected to fall. Named after how a bear attacks (claws down). Generally defined as a 20%+ decline from recent highs." },
  { term: "Moving Average", icon: "📈", definition: "A calculation that averages a stock's price over a specific period, creating a smoothed line that helps identify trends by filtering out daily noise." },
  { term: "Golden Cross", icon: "✨", definition: "A bullish technical signal where a short-term moving average (like MA20) crosses above a long-term moving average (like MA50). Often signals the start of an uptrend." },
  { term: "Death Cross", icon: "💀", definition: "A bearish technical signal where a short-term moving average crosses below a long-term moving average. Often signals the start of a downtrend." },
  { term: "Volatility", icon: "🎢", definition: "A measure of how much a stock's price fluctuates over time. High volatility means big price swings; low volatility means more stable prices." },
  { term: "Standard Deviation", icon: "📊", definition: "A statistical measure showing how spread out values are from the average. In stocks, it quantifies volatility — higher SD means more price variation." },
  { term: "CAGR", icon: "🚀", definition: "Compound Annual Growth Rate — the mean annual growth rate of an investment assuming profits were reinvested. The best way to compare returns across different time periods." },
  { term: "Closing Price", icon: "🔔", definition: "The final price at which a stock trades during a regular trading session. Most analysis and moving averages are based on closing prices." },
  { term: "Daily Return", icon: "📆", definition: "The percentage change in a stock's price from one day to the next. Daily returns are used to calculate volatility and other risk metrics." },
  { term: "Support Level", icon: "🛡️", definition: "A price level where a stock tends to stop falling and bounce back up. Think of it as a 'floor' where buying interest increases." },
  { term: "Resistance Level", icon: "🧱", definition: "A price level where a stock tends to stop rising and pull back. Think of it as a 'ceiling' where selling pressure increases." },
  { term: "Trading Volume", icon: "📊", definition: "The number of shares traded during a given period. High volume confirms price moves; low volume may indicate weak conviction." },
  { term: "Market Cap", icon: "💰", definition: "Market Capitalization — the total market value of a company's shares. Calculated as share price × total shares outstanding." },
  { term: "P/E Ratio", icon: "🔢", definition: "Price-to-Earnings ratio — share price divided by earnings per share. Helps determine if a stock is over or undervalued relative to its earnings." },
  { term: "Dividend", icon: "💵", definition: "A portion of company profits paid to shareholders, usually quarterly. Dividend yield is annual dividend divided by share price." },
  { term: "IPO", icon: "🎯", definition: "Initial Public Offering — when a private company first sells shares to the public. Often volatile as the market discovers fair value." },
  { term: "ETF", icon: "📦", definition: "Exchange-Traded Fund — a basket of securities that trades like a single stock. Provides diversification and tracks indices or sectors." },
  { term: "Portfolio", icon: "💼", definition: "A collection of investments held by an individual or institution. Diversifying your portfolio reduces risk." },
  { term: "Blue Chip", icon: "💎", definition: "Large, established companies with reliable earnings and often dividends. Named after the highest-value poker chips." }
];

// ============================================
// Quiz Questions
// ============================================

const QUIZ_QUESTIONS = [
  {
    question: "If a stock's 20-day moving average crosses above its 50-day moving average, this is called a:",
    options: ["Death Cross", "Golden Cross", "Bear Signal", "Volatility Spike"],
    correct: 1,
    explanation: "A Golden Cross is a bullish technical indicator that occurs when a short-term moving average (MA20) crosses above a longer-term moving average (MA50). It suggests upward momentum is building."
  },
  {
    question: "Which metric best accounts for compounding when comparing investments over different time periods?",
    options: ["Total Return %", "Average Price", "CAGR", "Volatility"],
    correct: 2,
    explanation: "CAGR (Compound Annual Growth Rate) shows the smoothed annual return assuming profits were reinvested. It's the gold standard for comparing investments over different time periods."
  },
  {
    question: "A stock with high volatility means:",
    options: ["It always goes up", "It has large price swings", "It pays dividends", "It's a safe investment"],
    correct: 1,
    explanation: "High volatility indicates the stock experiences large price fluctuations in both directions. This means higher risk but also potentially higher rewards."
  },
  {
    question: "When the current price is below the 20-day moving average, what does this typically signal?",
    options: ["Strong bullish momentum", "Short-term bearish momentum", "The stock is undervalued", "Time to buy immediately"],
    correct: 1,
    explanation: "When price drops below MA20, it indicates short-term bearish momentum. The recent trend is downward, though this alone doesn't mean you should sell or buy."
  },
  {
    question: "What does a 'Death Cross' signal indicate?",
    options: ["The company is going bankrupt", "A bearish trend may be starting", "The stock will definitely fall", "Time to buy the dip"],
    correct: 1,
    explanation: "A Death Cross (MA20 crossing below MA50) is a bearish technical signal suggesting downward momentum. It's a warning sign, not a guarantee of decline."
  },
  {
    question: "If a stock has a CAGR of 15% over 5 years, this means:",
    options: ["It grew exactly 15% total", "It grew 15% each year on average, compounded", "It's guaranteed to grow 15% next year", "It beat inflation by 15%"],
    correct: 1,
    explanation: "A 15% CAGR means if you invested and left the money to compound, you'd average 15% growth annually. Actual yearly returns varied, but the smoothed annual rate was 15%."
  },
  {
    question: "Why is 'worst day' percentage useful to know?",
    options: ["To time when to sell", "To understand maximum single-day downside risk", "To predict future crashes", "It's not useful"],
    correct: 1,
    explanation: "Knowing the worst day helps you understand how much you could lose in a single bad day. It's useful for risk assessment and ensuring you're comfortable with potential volatility."
  },
  {
    question: "A bull market is characterized by:",
    options: ["Falling prices over 20%", "Rising prices or optimism", "High volatility only", "Low trading volume"],
    correct: 1,
    explanation: "A bull market features rising prices and investor optimism. It's named after how a bull attacks — thrusting its horns upward. Generally defined as a 20%+ rise from lows."
  },
  {
    question: "Which of these would indicate a relatively stable, low-risk stock?",
    options: ["High volatility, large best/worst days", "Low volatility, small daily price changes", "Price below all moving averages", "Very high CAGR"],
    correct: 1,
    explanation: "Low volatility with small daily price changes indicates a more stable stock. These tend to be less risky but may also have lower growth potential."
  },
  {
    question: "If MA20 > MA50 and price > MA20, the stock is likely in a:",
    options: ["Bearish downtrend", "Bullish uptrend", "Sideways consolidation", "Death Cross pattern"],
    correct: 1,
    explanation: "When MA20 is above MA50 (Golden Cross territory) AND price is above both averages, the stock shows bullish momentum on multiple timeframes — a positive technical setup."
  }
];

// ============================================
// Logo URLs
// ============================================

const LOGOS = {
  AAPL: "apple.com", AMZN: "amazon.com", META: "meta.com", MSFT: "microsoft.com",
  NFLX: "netflix.com", NVDA: "nvidia.com", TSLA: "tesla.com", GOOGL: "google.com", GOOG: "google.com",
  AMD: "amd.com", INTC: "intel.com", SHOP: "shopify.com", UBER: "uber.com", ABNB: "airbnb.com",
  COIN: "coinbase.com", SQ: "block.xyz", PYPL: "paypal.com", CRM: "salesforce.com"
};

// ============================================
// Utility Functions
// ============================================

function api(url) {
  const sep = url.includes('?') ? '&' : '?';
  return fetch(url + sep + 'ts=' + Date.now());
}

async function j(url) {
  const r = await api(url);
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}

function logoURL(t) {
  const d = LOGOS[t];
  return d ? `https://logo.clearbit.com/${d}?v=${encodeURIComponent(APP_VERSION)}` : "";
}

function pct(v) {
  if (v == null) return '—';
  const n = Number(v);
  return (n >= 0 ? '+' : '') + (Math.round(n * 100) / 100).toFixed(2) + '%';
}

function money(v) {
  if (v == null) return '—';
  const n = Number(v);
  return '$' + (Math.round(n * 100) / 100).toFixed(2);
}

function sma(arr, w) {
  const out = [];
  let s = 0;
  for (let i = 0; i < arr.length; i++) {
    s += arr[i];
    if (i >= w) s -= arr[i - w];
    out.push(i >= w - 1 ? s / w : null);
  }
  return out;
}

// ============================================
// DOM Elements
// ============================================

const grid = document.getElementById('grid');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close');
const infoModal = document.getElementById('info-modal');
const infoClose = document.getElementById('info-close');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortBy');

let priceChart, annualChart;
let cardData = {}; // Store card data for sorting/filtering

// ============================================
// Navigation
// ============================================

const navTabs = document.querySelectorAll('.nav-tab');
const sections = document.querySelectorAll('.section');

navTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetId = tab.dataset.tab + '-section';
    
    // Update tabs
    navTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Update sections
    sections.forEach(s => {
      s.classList.remove('active');
      if (s.id === targetId) s.classList.add('active');
    });
  });
});

// ============================================
// Card Creation
// ============================================

function cardHTML(ticker) {
  const logo = logoURL(ticker);
  return `
    <div class="top">
      ${logo ? `<img class="logo" src="${logo}" alt="${ticker} logo" onerror="this.style.display='none'">` : `<div class="logo"></div>`}
      <h3>${ticker}</h3>
    </div>
    <div class="sparkBlock">
      <div class="skeleton" id="sk-${ticker}"></div>
      <canvas class="spark" id="sp-${ticker}" style="display:none"></canvas>
      <div class="placeholder" id="ph-${ticker}" style="display:none">No history</div>
    </div>
    <div class="pillrow" id="row-${ticker}">
      <span class="pill">Loading stats...</span>
    </div>
  `;
}

function attachGlow(el) {
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    el.style.setProperty('--mx', x + 'px');
    el.style.setProperty('--my', y + 'px');
  });
}

async function makeCard(ticker) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.ticker = ticker;
  card.innerHTML = cardHTML(ticker);
  attachGlow(card);

  // Load data
  setTimeout(() => loadFront(ticker), 20);

  // Open modal on click
  card.addEventListener('click', (e) => {
    // Don't open modal if clicking info button
    if (e.target.classList.contains('info-btn')) return;
    openModal(ticker);
  });
  
  return card;
}

function createInfoButton(statKey) {
  const btn = document.createElement('button');
  btn.className = 'info-btn';
  btn.textContent = 'ℹ️';
  btn.title = 'Learn about this stat';
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    showStatInfo(statKey);
  });
  return btn;
}

function createPill(label, value, statKey, isPositive = null) {
  const pill = document.createElement('span');
  pill.className = 'pill';
  if (isPositive === true) pill.classList.add('positive');
  if (isPositive === false) pill.classList.add('negative');
  
  pill.innerHTML = `${label} ${value}`;
  
  if (statKey && STAT_EXPLANATIONS[statKey]) {
    pill.appendChild(createInfoButton(statKey));
  }
  
  return pill;
}

async function loadFront(ticker) {
  const sk = document.getElementById(`sk-${ticker}`);
  const cv = document.getElementById(`sp-${ticker}`);
  const ph = document.getElementById(`ph-${ticker}`);
  const row = document.getElementById(`row-${ticker}`);

  // Stats for pills
  try {
    const stats = await j(`${BASE}/stats/${ticker}`);
    const ov = stats.overall || {};
    
    // Store data for sorting
    cardData[ticker] = {
      change: stats.price_change_pct || 0,
      volatility: stats.volatility || 0,
      cagr: ov.cagr_pct || 0
    };
    
    row.innerHTML = '';
    
    // Average price
    row.appendChild(createPill('Avg', money(stats.average_price), 'avg'));
    
    // Price change
    const changeVal = stats.price_change_pct;
    row.appendChild(createPill('Δ', pct(changeVal), 'change', changeVal > 0 ? true : changeVal < 0 ? false : null));
    
    // Volatility
    row.appendChild(createPill('Vol', Number(stats.volatility || 0).toFixed(2), 'volatility'));
    
    // MA20
    if (ov.ma20_last != null) {
      row.appendChild(createPill('MA20', money(ov.ma20_last), 'ma20'));
    }
    
    // MA50
    if (ov.ma50_last != null) {
      row.appendChild(createPill('MA50', money(ov.ma50_last), 'ma50'));
    }
    
    // CAGR
    if (ov.cagr_pct != null) {
      const cagrVal = ov.cagr_pct;
      row.appendChild(createPill('CAGR', pct(cagrVal), 'cagr', cagrVal > 10 ? true : cagrVal < 0 ? false : null));
    }
    
  } catch (e) {
    row.innerHTML = `<span class="pill" style="opacity:.7">Stats pending</span>`;
  }

  // Sparkline history
  try {
    const hist = await j(`${BASE}/hist/${ticker}`);
    if (Array.isArray(hist) && hist.length) {
      const ctx = cv.getContext('2d');
      cv.style.display = 'block';
      sk.style.display = 'none';
      ph.style.display = 'none';
      
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: hist.map(h => h.date),
          datasets: [{
            data: hist.map(h => h.close),
            borderColor: '#3b82f6',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.3,
            fill: true,
            backgroundColor: 'rgba(59, 130, 246, 0.1)'
          }]
        },
        options: {
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } },
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      sk.style.display = 'none';
      ph.style.display = 'block';
    }
  } catch (e) {
    sk.style.display = 'none';
    ph.style.display = 'block';
  }
}

// ============================================
// Stock Detail Modal
// ============================================

async function openModal(ticker) {
  document.getElementById('modalTitle').textContent = ticker;
  const pills = document.getElementById('statPills');
  pills.innerHTML = `<span class="pill">Loading…</span>`;

  // Destroy old charts
  if (priceChart) { priceChart.destroy(); priceChart = null; }
  if (annualChart) { annualChart.destroy(); annualChart = null; }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');

  try {
    const [stats, hist] = await Promise.all([
      j(`${BASE}/stats/${ticker}`),
      j(`${BASE}/hist/${ticker}`).catch(() => [])
    ]);

    const ov = stats.overall || {};
    
    pills.innerHTML = '';
    pills.appendChild(createPill('Avg', money(stats.average_price), 'avg'));
    
    const changeVal = stats.price_change_pct;
    pills.appendChild(createPill('Δ', pct(changeVal), 'change', changeVal > 0));
    
    pills.appendChild(createPill('Vol', Number(stats.volatility || 0).toFixed(2), 'volatility'));
    pills.appendChild(createPill('Best', pct(ov.best_day_pct), 'bestDay'));
    pills.appendChild(createPill('Worst', pct(ov.worst_day_pct), 'worstDay'));
    pills.appendChild(createPill('CAGR', pct(ov.cagr_pct), 'cagr', ov.cagr_pct > 10));

    // Price + MAs chart
    const pc = document.getElementById('priceChart').getContext('2d');
    if (Array.isArray(hist) && hist.length) {
      const closes = hist.map(d => d.close);
      priceChart = new Chart(pc, {
        type: 'line',
        data: {
          labels: hist.map(d => d.date),
          datasets: [
            { 
              label: 'Close', 
              data: closes, 
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 2, 
              pointRadius: 0, 
              tension: 0.2,
              fill: true
            },
            { 
              label: 'MA20', 
              data: sma(closes, 20), 
              borderColor: '#10b981',
              borderWidth: 2, 
              pointRadius: 0, 
              tension: 0.2,
              borderDash: [5, 5]
            },
            { 
              label: 'MA50', 
              data: sma(closes, 50), 
              borderColor: '#f59e0b',
              borderWidth: 2, 
              pointRadius: 0, 
              tension: 0.2,
              borderDash: [10, 5]
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              labels: { color: '#a8c0e8', font: { family: 'Outfit' } }
            },
            tooltip: {
              backgroundColor: '#0d1a2d',
              titleColor: '#e8f0ff',
              bodyColor: '#a8c0e8',
              borderColor: '#1a3152',
              borderWidth: 1,
              callbacks: {
                afterBody: function(context) {
                  const label = context[0].dataset.label;
                  if (label === 'MA20') {
                    return '\n💡 Price above MA20 = short-term bullish';
                  }
                  if (label === 'MA50') {
                    return '\n💡 Watch for Golden Cross (MA20 > MA50)';
                  }
                  return '';
                }
              }
            }
          },
          scales: {
            x: { 
              display: false
            },
            y: {
              ticks: { 
                callback: v => '$' + v,
                color: '#6b8ab8'
              },
              grid: { color: '#1a3152' }
            }
          }
        }
      });
    }

    // Annual returns chart
    const ys = stats.year_stats || {};
    const years = (stats.years || Object.keys(ys)).sort();
    const returns = years.map(y => (ys[y]?.return_pct ?? 0));
    const ac = document.getElementById('annualChart').getContext('2d');
    
    annualChart = new Chart(ac, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [{
          label: 'Annual Return %',
          data: returns,
          backgroundColor: returns.map(r => r >= 0 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)'),
          borderColor: returns.map(r => r >= 0 ? '#10b981' : '#ef4444'),
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0d1a2d',
            titleColor: '#e8f0ff',
            bodyColor: '#a8c0e8',
            borderColor: '#1a3152',
            borderWidth: 1,
            callbacks: {
              label: ctx => ctx.parsed.y.toFixed(2) + '%'
            }
          }
        },
        scales: {
          y: {
            ticks: { 
              callback: v => v + '%',
              color: '#6b8ab8'
            },
            grid: { color: '#1a3152' }
          },
          x: {
            ticks: { color: '#6b8ab8' },
            grid: { display: false }
          }
        }
      }
    });

  } catch (e) {
    pills.innerHTML = `<span class="pill">Failed to load: ${e.message}</span>`;
  }
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

closeBtn.onclick = closeModal;
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

// ============================================
// Info Modal (Educational)
// ============================================

function showStatInfo(statKey) {
  const info = STAT_EXPLANATIONS[statKey];
  if (!info) return;
  
  document.getElementById('info-icon').textContent = info.icon;
  document.getElementById('info-title').textContent = info.title;
  document.getElementById('info-description').textContent = info.description;
  document.getElementById('info-interpretation').textContent = info.interpretation;
  
  const guideEl = document.getElementById('info-guide');
  guideEl.innerHTML = info.guide.map(g => `
    <div class="guide-item">
      <span class="guide-badge ${g.badge}">${g.label}</span>
      <span>${g.text}</span>
    </div>
  `).join('');
  
  infoModal.classList.add('open');
  infoModal.setAttribute('aria-hidden', 'false');
}

function closeInfoModal() {
  infoModal.classList.remove('open');
  infoModal.setAttribute('aria-hidden', 'true');
}

infoClose.onclick = closeInfoModal;
infoModal.addEventListener('click', (e) => { if (e.target === infoModal) closeInfoModal(); });

// ============================================
// Search & Sort
// ============================================

searchInput.addEventListener('input', filterCards);
sortSelect.addEventListener('change', sortCards);

function filterCards() {
  const query = searchInput.value.toLowerCase().trim();
  const cards = grid.querySelectorAll('.card');
  
  cards.forEach(card => {
    const ticker = card.dataset.ticker.toLowerCase();
    card.style.display = ticker.includes(query) ? '' : 'none';
  });
}

function sortCards() {
  const sortBy = sortSelect.value;
  const cards = Array.from(grid.querySelectorAll('.card'));
  
  cards.sort((a, b) => {
    const tickerA = a.dataset.ticker;
    const tickerB = b.dataset.ticker;
    const dataA = cardData[tickerA] || {};
    const dataB = cardData[tickerB] || {};
    
    switch (sortBy) {
      case 'alpha':
        return tickerA.localeCompare(tickerB);
      case 'alpha-desc':
        return tickerB.localeCompare(tickerA);
      case 'change-desc':
        return (dataB.change || 0) - (dataA.change || 0);
      case 'change-asc':
        return (dataA.change || 0) - (dataB.change || 0);
      case 'volatility-desc':
        return (dataB.volatility || 0) - (dataA.volatility || 0);
      case 'volatility-asc':
        return (dataA.volatility || 0) - (dataB.volatility || 0);
      case 'cagr-desc':
        return (dataB.cagr || 0) - (dataA.cagr || 0);
      default:
        return 0;
    }
  });
  
  cards.forEach(card => grid.appendChild(card));
}

// ============================================
// Learn Section
// ============================================

function renderLearnSection() {
  const container = document.getElementById('learn-cards');
  
  container.innerHTML = Object.entries(STAT_EXPLANATIONS).map(([key, stat]) => `
    <div class="learn-card">
      <div class="learn-card-header">
        <span class="learn-icon">${stat.icon}</span>
        <div>
          <h3>${stat.title}</h3>
          <p>${stat.short}</p>
        </div>
      </div>
      <div class="learn-card-body">
        <h4>What is it?</h4>
        <p>${stat.description}</p>
        
        <h4>How to Interpret</h4>
        <p>${stat.interpretation}</p>
        
        <div class="interpretation-guide">
          <h4>Quick Reference</h4>
          ${stat.guide.map(g => `
            <div class="guide-item">
              <span class="guide-badge ${g.badge}">${g.label}</span>
              <span>${g.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// ============================================
// Glossary Section
// ============================================

function renderGlossary() {
  const container = document.getElementById('glossary-list');
  const searchEl = document.getElementById('glossarySearch');
  
  container.innerHTML = GLOSSARY.map(item => `
    <div class="glossary-item" data-term="${item.term.toLowerCase()}">
      <h4><span>${item.icon}</span> ${item.term}</h4>
      <p>${item.definition}</p>
    </div>
  `).join('');
  
  searchEl.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    container.querySelectorAll('.glossary-item').forEach(item => {
      const term = item.dataset.term;
      const text = item.textContent.toLowerCase();
      item.classList.toggle('hidden', !term.includes(query) && !text.includes(query));
    });
  });
}

// ============================================
// Quiz Section
// ============================================

let quizState = {
  currentQuestion: 0,
  score: 0,
  answers: [],
  bestScore: localStorage.getItem('quizBestScore') || null
};

function initQuiz() {
  const startBtn = document.getElementById('start-quiz');
  const nextBtn = document.getElementById('next-question');
  const retryBtn = document.getElementById('retry-quiz');
  const reviewBtn = document.getElementById('review-answers');
  
  // Update best score display
  if (quizState.bestScore !== null) {
    document.getElementById('best-score').textContent = quizState.bestScore + '/' + QUIZ_QUESTIONS.length;
  }
  
  startBtn.addEventListener('click', startQuiz);
  nextBtn.addEventListener('click', nextQuestion);
  retryBtn.addEventListener('click', startQuiz);
  reviewBtn.addEventListener('click', () => {
    document.querySelector('[data-tab="learn"]').click();
  });
}

function startQuiz() {
  quizState = {
    currentQuestion: 0,
    score: 0,
    answers: [],
    bestScore: quizState.bestScore
  };
  
  document.getElementById('quiz-start').classList.add('hidden');
  document.getElementById('quiz-results').classList.add('hidden');
  document.getElementById('quiz-active').classList.remove('hidden');
  
  showQuestion();
}

function showQuestion() {
  const q = QUIZ_QUESTIONS[quizState.currentQuestion];
  const total = QUIZ_QUESTIONS.length;
  
  document.getElementById('q-current').textContent = quizState.currentQuestion + 1;
  document.getElementById('q-total').textContent = total;
  document.getElementById('quiz-progress-fill').style.width = ((quizState.currentQuestion) / total * 100) + '%';
  
  document.getElementById('quiz-question').textContent = q.question;
  
  const optionsEl = document.getElementById('quiz-options');
  optionsEl.innerHTML = q.options.map((opt, i) => `
    <div class="quiz-option" data-index="${i}">
      <span class="option-letter">${String.fromCharCode(65 + i)}</span>
      <span>${opt}</span>
    </div>
  `).join('');
  
  // Add click handlers
  optionsEl.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', () => selectAnswer(parseInt(opt.dataset.index)));
  });
  
  document.getElementById('quiz-feedback').classList.add('hidden');
  document.getElementById('next-question').classList.add('hidden');
}

function selectAnswer(index) {
  const q = QUIZ_QUESTIONS[quizState.currentQuestion];
  const isCorrect = index === q.correct;
  
  // Store answer
  quizState.answers.push({ question: quizState.currentQuestion, selected: index, correct: isCorrect });
  if (isCorrect) quizState.score++;
  
  // Update UI
  const options = document.querySelectorAll('.quiz-option');
  options.forEach((opt, i) => {
    opt.style.pointerEvents = 'none';
    if (i === q.correct) opt.classList.add('correct');
    if (i === index && !isCorrect) opt.classList.add('incorrect');
  });
  
  // Show feedback
  const feedback = document.getElementById('quiz-feedback');
  feedback.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'incorrect');
  feedback.innerHTML = `
    <strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong><br>
    ${q.explanation}
  `;
  feedback.classList.remove('hidden');
  
  // Show next button
  const nextBtn = document.getElementById('next-question');
  nextBtn.textContent = quizState.currentQuestion === QUIZ_QUESTIONS.length - 1 ? 'See Results →' : 'Next Question →';
  nextBtn.classList.remove('hidden');
}

function nextQuestion() {
  quizState.currentQuestion++;
  
  if (quizState.currentQuestion >= QUIZ_QUESTIONS.length) {
    showResults();
  } else {
    showQuestion();
  }
}

function showResults() {
  document.getElementById('quiz-active').classList.add('hidden');
  document.getElementById('quiz-results').classList.remove('hidden');
  
  const score = quizState.score;
  const total = QUIZ_QUESTIONS.length;
  const percentage = (score / total) * 100;
  
  // Update best score
  if (quizState.bestScore === null || score > parseInt(quizState.bestScore)) {
    quizState.bestScore = score;
    localStorage.setItem('quizBestScore', score);
    document.getElementById('best-score').textContent = score + '/' + total;
  }
  
  // Set icon and title based on score
  let icon, title;
  if (percentage >= 90) { icon = '🏆'; title = 'Outstanding!'; }
  else if (percentage >= 70) { icon = '🎉'; title = 'Great Job!'; }
  else if (percentage >= 50) { icon = '👍'; title = 'Good Effort!'; }
  else { icon = '📚'; title = 'Keep Learning!'; }
  
  document.getElementById('results-icon').textContent = icon;
  document.getElementById('results-title').textContent = title;
  document.getElementById('final-score').textContent = score;
  document.getElementById('final-total').textContent = total;
  
  // Breakdown
  const breakdown = document.getElementById('results-breakdown');
  breakdown.innerHTML = `
    <p style="margin:0 0 10px;color:#a8c0e8;">You answered <strong style="color:#10b981;">${score}</strong> questions correctly and <strong style="color:#ef4444;">${total - score}</strong> incorrectly.</p>
    <p style="margin:0;font-size:13px;color:#6b8ab8;">Review the "Learn Stats" section to strengthen your understanding of the concepts you missed.</p>
  `;
}

// ============================================
// Keyboard Shortcuts
// ============================================

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeInfoModal();
  }
});

// ============================================
// Initialize App
// ============================================

async function init() {
  // Render static sections
  renderLearnSection();
  renderGlossary();
  initQuiz();
  
  // Load stock data
  try {
    const tickers = await j(`${BASE}/tickers`);
    if (!Array.isArray(tickers) || !tickers.length) {
      grid.innerHTML = `<div class="placeholder">No tickers found. Upload CSVs to your data bucket.</div>`;
      return;
    }
    for (const tk of tickers) {
      grid.appendChild(await makeCard(tk));
    }
  } catch (e) {
    grid.innerHTML = `<div class="placeholder">Error loading tickers: ${e.message}</div>`;
  }
}

init();
