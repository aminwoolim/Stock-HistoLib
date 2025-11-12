const BASE = "https://75mogiezvd.execute-api.us-east-1.amazonaws.com";
document.getElementById('ver').textContent = APP_VERSION;

const LOGOS = {
  AAPL:"apple.com", AMZN:"amazon.com", META:"meta.com", MSFT:"microsoft.com",
  NFLX:"netflix.com", NVDA:"nvidia.com", TSLA:"tesla.com", GOOGL:"google.com", GOOG:"google.com",
  AMD:"amd.com", INTC:"intel.com", SHOP:"shopify.com", UBER:"uber.com", ABNB:"airbnb.com",
  COIN:"coinbase.com", SQ:"block.xyz", PYPL:"paypal.com", CRM:"salesforce.com"
};

function api(url){ const sep = url.includes('?') ? '&':'?'; return fetch(url+sep+'ts='+Date.now()); }
async function j(url){ const r = await api(url); if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); }
function logoURL(t){ const d = LOGOS[t]; return d ? `https://logo.clearbit.com/${d}?v=${encodeURIComponent(APP_VERSION)}` : ""; }

const grid = document.getElementById('grid');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close');
let priceChart, annualChart;

function pct(v){ if(v==null) return '—'; const n=Number(v); return (n>=0?'+':'') + (Math.round(n*100)/100).toFixed(2)+'%'; }
function money(v){ if(v==null) return '—'; const n=Number(v); return '$'+(Math.round(n*100)/100).toFixed(2); }

function cardHTML(ticker){
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
      <!-- pills filled on demand -->
    </div>
  `;
}

function attachGlow(el){
  el.addEventListener('mousemove', (e)=>{
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    el.style.setProperty('--mx', (x/r.width*100)+'%');
    el.style.setProperty('--my', (y/r.height*100)+'%');
  });
}

async function makeCard(ticker){
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.ticker = ticker;
  card.innerHTML = cardHTML(ticker);
  attachGlow(card);

  // lazy sparkline & pills
  setTimeout(()=> loadFront(ticker), 20);

  // open modal on click
  card.addEventListener('click', ()=> openModal(ticker));
  return card;
}

async function loadFront(ticker){
  const sk = document.getElementById(`sk-${ticker}`);
  const cv = document.getElementById(`sp-${ticker}`);
  const ph = document.getElementById(`ph-${ticker}`);
  const row = document.getElementById(`row-${ticker}`);

  // stats for pills
  try{
    const stats = await j(`${BASE}/stats/${ticker}`);
    const ov = stats.overall || {};
    row.innerHTML = [
      `<span class="pill">Avg ${money(stats.average_price)}</span>`,
      `<span class="pill">Δ ${pct(stats.price_change_pct)}</span>`,
      `<span class="pill">Vol ${Number(stats.volatility||0).toFixed(2)}</span>`,
      (ov.ma20_last!=null? `<span class="pill">MA20 ${money(ov.ma20_last)}</span>`:''),
      (ov.ma50_last!=null? `<span class="pill">MA50 ${money(ov.ma50_last)}</span>`:''),
      (ov.cagr_pct!=null? `<span class="pill">CAGR ${pct(ov.cagr_pct)}</span>`:'')
    ].join(' ');
  }catch(e){
    row.innerHTML = `<span class="pill" style="opacity:.7">Stats pending</span>`;
  }

  // sparkline history
  try{
    const hist = await j(`${BASE}/hist/${ticker}`);
    if (Array.isArray(hist) && hist.length){
      const ctx = cv.getContext('2d');
      cv.style.display = 'block'; sk.style.display='none'; ph.style.display='none';
      new Chart(ctx, {
        type:'line',
        data:{ labels: hist.map(h=>h.date), datasets:[{ data: hist.map(h=>h.close), borderWidth:1, pointRadius:0, tension:.25 }]},
        options:{ plugins:{legend:{display:false}}, scales:{x:{display:false}, y:{display:false}} }
      });
    } else {
      sk.style.display='none'; ph.style.display='block';
    }
  }catch(e){
    sk.style.display='none'; ph.style.display='block';
  }
}

function sma(arr,w){ const out=[]; let s=0; for(let i=0;i<arr.length;i++){ s+=arr[i]; if(i>=w) s-=arr[i-w]; out.push(i>=w-1? s/w : null) } return out; }

async function openModal(ticker){
  document.getElementById('modalTitle').textContent = ticker;
  const pills = document.getElementById('statPills');
  pills.innerHTML = `<span class="pill">Loading…</span>`;

  // destroy old charts
  if (priceChart){ priceChart.destroy(); priceChart = null; }
  if (annualChart){ annualChart.destroy(); annualChart = null; }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');

  try{
    const [stats, hist] = await Promise.all([
      j(`${BASE}/stats/${ticker}`),
      j(`${BASE}/hist/${ticker}`).catch(()=>[])
    ]);

    const ov = stats.overall || {};
    pills.innerHTML = [
      `<span class="pill">Avg ${money(stats.average_price)}</span>`,
      `<span class="pill">Δ ${pct(stats.price_change_pct)}</span>`,
      `<span class="pill">Vol ${Number(stats.volatility||0).toFixed(2)}</span>`,
      `<span class="pill">Best ${pct(ov.best_day_pct)}</span>`,
      `<span class="pill">Worst ${pct(ov.worst_day_pct)}</span>`,
      `<span class="pill">CAGR ${pct(ov.cagr_pct)}</span>`
    ].join(' ');

    // price + MAs
    const pc = document.getElementById('priceChart').getContext('2d');
    if (Array.isArray(hist) && hist.length){
      const closes = hist.map(d=>d.close);
      priceChart = new Chart(pc, {
        type:'line',
        data:{ labels: hist.map(d=>d.date),
          datasets:[
            { label:'Close', data:closes, borderWidth:1, pointRadius:0, tension:.12 },
            { label:'MA20', data:sma(closes,20), borderWidth:1, pointRadius:0, tension:.12 },
            { label:'MA50', data:sma(closes,50), borderWidth:1, pointRadius:0, tension:.12 }
          ]
        },
        options:{ scales:{ x:{display:false}, y:{ ticks:{ callback:v=>'$'+v } } } }
      });
    } else {
      pc.canvas.replaceWith(Object.assign(document.createElement('div'), {className:'placeholder', textContent:'No history available'}));
    }

    // annual returns
    const ys = stats.year_stats || {};
    const years = (stats.years || Object.keys(ys)).sort();
    const returns = years.map(y => (ys[y]?.return_pct ?? 0));
    const ac = document.getElementById('annualChart').getContext('2d');
    annualChart = new Chart(ac, {
      type:'bar',
      data:{ labels: years, datasets:[{ label:'Annual Return %', data: returns }] },
      options:{ scales:{ y:{ ticks:{ callback:v=>v+'%' } } }, plugins:{legend:{display:false}} }
    });

  }catch(e){
    pills.innerHTML = `<span class="pill">Failed to load: ${e.message}</span>`;
  }
}

function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  // reset canvases to avoid stale DOM if reopened
  const pc = document.getElementById('priceChart');
  const ac = document.getElementById('annualChart');
  if (pc && pc.parentNode && !pc.getContext) { /* already replaced */ }
}

closeBtn.onclick = closeModal;
modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });

async function init(){
  try{
    const tickers = await j(`${BASE}/tickers`);
    if(!Array.isArray(tickers) || !tickers.length){
      grid.innerHTML = `<div class="placeholder">No tickers found. Upload CSVs to your data bucket.</div>`;
      return;
    }
    for (const tk of tickers){
      grid.appendChild(await makeCard(tk));
    }
  }catch(e){
    grid.innerHTML = `<div class="placeholder">Error loading tickers: ${e.message}</div>`;
  }
}
init();