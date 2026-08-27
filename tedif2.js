'use strict';

/* =====================================================
   CONSTANTES — valores lidos de config.js
   Para alterar, edite o arquivo config.js
   ===================================================== */
const COR_CICLO_T2 = CONFIG.tedif2.cores;

function corFiguraT2(num) {
  return COR_CICLO_T2[(num - 1) % COR_CICLO_T2.length];
}

/* =====================================================
   GERADOR SVG — CÍRCULO CONCÊNTRICO
   Dois círculos: externo (colorido) + interno (branco) + número
   ===================================================== */
function svgCirculo(num, color) {
  const cx = 50, cy = 50;
  const outerR = 46;
  const innerR = 27;
  const label = String(num).padStart(2, '0');
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="tedif3-svg">
    <rect x="0" y="0" width="100" height="100" fill="#fff"/>
    <circle cx="${cx}" cy="${cy}" r="${outerR}" fill="${color}" stroke="#000" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="${innerR}" fill="#fff" stroke="#000" stroke-width="2"/>
    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
      font-size="17" font-family="Inter,sans-serif" font-weight="700" fill="#000">${label}</text>
  </svg>`;
}

function gerarFiguraTedif2(num) {
  return svgCirculo(num, corFiguraT2(num));
}

/* =====================================================
   DADOS DAS 50 FIGURAS
   ===================================================== */
function buildFigurasTedif2() {
  const figuras = [];
  for (let i = 1; i <= 50; i++) {
    figuras.push({ num: i });
  }
  return figuras;
}

/* =====================================================
   LAYOUT: GRADE ESTRATIFICADA RESPONSIVA
   Valores definidos em config.js → tedif2
   ===================================================== */
const FIG_SIZE_PCT_T2 = CONFIG.tedif2.tamanhoFig;
const A4_PAD_PCT_T2   = CONFIG.tedif2.margem;
const GRID_COLS_T2    = CONFIG.tedif2.colunas;
const GRID_ROWS_T2    = CONFIG.tedif2.linhas;

function gerarPosicoesAleatorias_T2(n) {
  const usableW = 100 - 2 * A4_PAD_PCT_T2;
  const usableH = 100 - 2 * A4_PAD_PCT_T2;

  const cellW = usableW / GRID_COLS_T2;
  const cellH = usableH / GRID_ROWS_T2;

  const jitterX = ((cellW - FIG_SIZE_PCT_T2) / 2) * 0.95;
  const jitterY = ((cellH - FIG_SIZE_PCT_T2) / 2) * 0.95;

  const slots = [];
  for (let r = 0; r < GRID_ROWS_T2; r++)
    for (let c = 0; c < GRID_COLS_T2; c++)
      slots.push({ col: c, row: r });

  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }

  const rand = max => max > 0 ? (Math.random() * 2 * max) - max : 0;

  return slots.slice(0, n).map(({ col, row }) => ({
    x: Math.max(A4_PAD_PCT_T2, Math.min(100 - A4_PAD_PCT_T2 - FIG_SIZE_PCT_T2,
        A4_PAD_PCT_T2 + col * cellW + (cellW - FIG_SIZE_PCT_T2) / 2 + rand(jitterX))),
    y: Math.max(A4_PAD_PCT_T2, Math.min(100 - A4_PAD_PCT_T2 - FIG_SIZE_PCT_T2,
        A4_PAD_PCT_T2 + row * cellH + (cellH - FIG_SIZE_PCT_T2) / 2 + rand(jitterY))),
  }));
}

/* =====================================================
   TIMER — valores definidos em config.js → tedif2
   ===================================================== */
const T2_PERIODOS  = CONFIG.tedif2.periodos;
const T2_DURACAO_S = CONFIG.tedif2.duracaoS;

let _t2Interval = null;

function iniciarTimerT2(onFim) {
  let tempoTotal = 0;
  let pausado    = false;

  function mostrarCobertura(periodoEncerrado, cb) {
    pausado = true;
    const ov = document.createElement('div');
    ov.className = 'tedif3-periodo-overlay';
    const proximo = periodoEncerrado + 1;
    ov.innerHTML = `
      <div class="t3-ov-box">
        <div class="t3-ov-periodo">Período ${periodoEncerrado} encerrado</div>
        ${proximo <= T2_PERIODOS
          ? `<div class="t3-ov-sub">Período ${proximo} começa em instantes…</div>
             <div class="t3-ov-count" id="t2-ov-count">3</div>`
          : `<div class="t3-ov-sub">Teste finalizado!</div>`}
      </div>`;
    document.body.appendChild(ov);

    if (proximo <= T2_PERIODOS) {
      let n = 3;
      const tick = setInterval(() => {
        n--;
        const el = document.getElementById('t2-ov-count');
        if (el) el.textContent = n > 0 ? n : 'Vai!';
        if (n <= 0) {
          clearInterval(tick);
          setTimeout(() => { ov.remove(); pausado = false; cb(); }, 600);
        }
      }, 800);
    } else {
      setTimeout(() => { ov.remove(); cb(); }, 1500);
    }
  }

  function atualizarTopbarT2() {
    const periodo = Math.min(T2_PERIODOS, Math.floor(tempoTotal / T2_DURACAO_S) + 1);
    const restante = T2_DURACAO_S - (tempoTotal % T2_DURACAO_S);
    const m = Math.floor(restante / 60);
    const s = restante % 60;
    const pEl = document.getElementById('t2-periodo-label');
    const tEl = document.getElementById('t2-tempo-label');
    if (pEl) pEl.textContent = `Período ${periodo} / ${T2_PERIODOS}`;
    if (tEl) tEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
  }

  atualizarTopbarT2();

  _t2Interval = setInterval(() => {
    if (pausado) return;
    tempoTotal++;

    atualizarTopbarT2();

    const fimTotal = T2_PERIODOS * T2_DURACAO_S;

    if (tempoTotal >= fimTotal) {
      clearInterval(_t2Interval);
      mostrarCobertura(T2_PERIODOS, () => onFim());
      return;
    }

    if (tempoTotal % T2_DURACAO_S === 0) {
      const periodoEncerrado = Math.floor(tempoTotal / T2_DURACAO_S);
      mostrarCobertura(periodoEncerrado, () => {});
    }
  }, 1000);
}

function pararTimerT2() {
  if (_t2Interval) { clearInterval(_t2Interval); _t2Interval = null; }
}

/* =====================================================
   AVISO DE ORDEM
   ===================================================== */
let _t2ToastTimeout = null;

function mostrarAvisoOrdemT2(numEsperado) {
  const existing = document.getElementById('t2-toast-ordem');
  if (existing) {
    existing.remove();
    clearTimeout(_t2ToastTimeout);
  }

  const toast = document.createElement('div');
  toast.id = 't2-toast-ordem';
  toast.className = 't3-toast-ordem';
  toast.textContent = `Ordem incorreta — próxima figura: ${String(numEsperado).padStart(2, '0')}`;
  document.body.appendChild(toast);

  void toast.offsetWidth;
  toast.classList.add('t3-toast-visivel');

  _t2ToastTimeout = setTimeout(() => {
    toast.classList.remove('t3-toast-visivel');
    setTimeout(() => toast.remove(), 350);
  }, 2000);
}

/* =====================================================
   RENDERIZAÇÃO DO TESTE TEDIF 2
   ===================================================== */
function renderTedif2() {
  pararTimerT2();
  document.body.style.overflow = 'auto';
  const app = document.getElementById('app');
  app.innerHTML = '';

  /* ── Topbar ── */
  const topbar = document.createElement('div');
  topbar.className = 'tedif3-topbar';
  topbar.id = 'tedif2-topbar';
  topbar.innerHTML = `
    <div class="tedif3-title-group">
      <span class="tedif3-badge">TEDIF 2</span>
      <span class="tedif3-title">Atenção Concentrada — Círculos Aninhados</span>
    </div>
    <div class="t3-timer-group">
      <span id="t2-periodo-label">Período 1 / 4</span>
      <span id="t2-tempo-label">1:00</span>
    </div>
    <button class="btn-sair" id="tedif2-btn-sair" aria-label="Voltar ao menu">← Menu</button>
  `;
  app.appendChild(topbar);

  /* ── Área principal ── */
  const main = document.createElement('div');
  main.className = 'tedif3-main';
  main.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 60px);
    width: 100vw;
    background: #ccc;
    padding: 10px;
  `;

  /* ── Folha A4 ── */
  const sheet = document.createElement('div');
  sheet.className = 'tedif3-sheet';
  sheet.id = 'tedif2-sheet';
  sheet.style.cssText = `
    position: relative;
    height: 100%;
    aspect-ratio: 1 / 1.414;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    overflow: hidden;
  `;

  /* ── Figuras ── */
  const figuras   = buildFigurasTedif2();
  const shuffled  = [...figuras].sort(() => Math.random() - 0.5);
  const positions = gerarPosicoesAleatorias_T2(shuffled.length);

  let proximoEsperado = 1;

  shuffled.forEach((fig, idx) => {
    const pos     = positions[idx];
    const wrapper = document.createElement('div');
    wrapper.className = 'tedif3-figura';
    wrapper.setAttribute('data-num', fig.num);
    wrapper.style.cssText = `
      position: absolute;
      left: ${pos.x.toFixed(2)}%;
      top: ${pos.y.toFixed(2)}%;
      width: ${FIG_SIZE_PCT_T2}%;
      aspect-ratio: 1 / 1;
      cursor: pointer;
    `;
    wrapper.innerHTML = gerarFiguraTedif2(fig.num);

    wrapper.addEventListener('click', () => {
      if (wrapper.classList.contains('tedif3-marcada')) return;

      if (fig.num === proximoEsperado) {
        wrapper.classList.add('tedif3-marcada');
        proximoEsperado++;
      } else {
        mostrarAvisoOrdemT2(proximoEsperado);
      }
    });

    sheet.appendChild(wrapper);
  });

  main.appendChild(sheet);
  app.appendChild(main);

  /* ── Botão sair ── */
  document.getElementById('tedif2-btn-sair').addEventListener('click', () => {
    pararTimerT2();
    document.body.style.overflow = '';
    renderMenuSeletor();
  });

  /* ── Inicia timer ── */
  iniciarTimerT2(() => {
    pararTimerT2();
    const fim = document.createElement('div');
    fim.className = 'tedif3-periodo-overlay';
    fim.id = 'tedif2-fim-overlay';
    fim.innerHTML = `
      <div class="t3-ov-box">
        <div class="t3-ov-periodo">✓ Teste Concluído!</div>
        <div class="t3-ov-sub">Todos os 4 períodos foram finalizados.</div>
        <button class="btn-primary" id="tedif2-btn-fim" style="margin-top:1.5rem;font-size:1rem;padding:.75rem 2rem;">
          ← Voltar ao Menu
        </button>
      </div>`;
    document.body.appendChild(fim);
    document.getElementById('tedif2-btn-fim').addEventListener('click', () => {
      fim.remove();
      document.body.style.overflow = '';
      renderMenuSeletor();
    });
  });
}
