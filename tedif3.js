'use strict';

/* =====================================================
   UTILITÁRIO: POLÍGONO REGULAR
   ===================================================== */
function polyPts(n, cx, cy, r, startDeg = -90) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (startDeg + (360 / n) * i) * Math.PI / 180;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

/* =====================================================
   COR DO ANEL — cicla figura a figura
   Sequência: branco → azul → amarelo → verde → vermelho → branco → ...
   ===================================================== */
const COR_CICLO = ['#ffffff', '#5B9BD5', '#FFC000', '#70AD47', '#FF4444'];

function corFigura(num) {
  return COR_CICLO[(num - 1) % COR_CICLO.length];
}

/* =====================================================
   GERADORES SVG
   ===================================================== */

/** Triângulo equilátero — vértice aponta para o canto. */
function svgTriangle(num, corner, color) {
  const cx = 50, cy = 50, outerR = 46, innerR = 20;
  const startDeg = { tl: 225, tr: 315, bl: 135, br: 45 }[corner] ?? 225;
  const outerPts = polyPts(3, cx, cy, outerR, startDeg);
  const innerPts = polyPts(3, cx, cy, innerR, startDeg);
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="tedif3-svg">
    <rect x="0" y="0" width="100" height="100" fill="#fff"/>
    <polygon points="${outerPts}" fill="${color}" stroke="#000" stroke-width="3" stroke-linejoin="round"/>
    <polygon points="${innerPts}" fill="#fff" stroke="#000" stroke-width="2" stroke-linejoin="round"/>
    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
      font-size="11" font-family="Inter,sans-serif" font-weight="700" fill="#000">${num}</text>
  </svg>`;
}

/** Quadrado com cantos arredondados externo + interno. */
function svgSquare(num, color) {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="tedif3-svg">
    <rect x="0" y="0" width="100" height="100" fill="#fff"/>
    <rect x="6" y="6" width="88" height="88" rx="14" ry="14"
      fill="${color}" stroke="#000" stroke-width="3"/>
    <rect x="28" y="28" width="44" height="44" rx="8" ry="8"
      fill="#fff" stroke="#000" stroke-width="2"/>
    <text x="50" y="50" text-anchor="middle" dominant-baseline="central"
      font-size="13" font-family="Inter,sans-serif" font-weight="700" fill="#000">${num}</text>
  </svg>`;
}

/** Polígono regular n lados externo + interno. */
function svgPoly(num, n, color) {
  const cx = 50, cy = 50, outerR = 42, innerR = 20;
  const outerPts = polyPts(n, cx, cy, outerR, -90);
  const innerPts = polyPts(n, cx, cy, innerR, -90);
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="tedif3-svg">
    <rect x="0" y="0" width="100" height="100" fill="#fff"/>
    <polygon points="${outerPts}" fill="${color}" stroke="#000" stroke-width="3" stroke-linejoin="round"/>
    <polygon points="${innerPts}" fill="#fff" stroke="#000" stroke-width="2" stroke-linejoin="round"/>
    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
      font-size="13" font-family="Inter,sans-serif" font-weight="700" fill="#000">${num}</text>
  </svg>`;
}

function gerarFiguraTedif3(num, sides, corner) {
  const color = corFigura(num);
  if (sides === 3) return svgTriangle(num, corner, color);
  if (sides === 4) return svgSquare(num, color);
  return svgPoly(num, sides, color);
}

/* =====================================================
   DADOS DAS 50 FIGURAS
   ===================================================== */
const CORNERS_LIST = ['tl', 'tr', 'bl', 'br'];

function buildFigurasTedif3() {
  const figuras = [];
  for (let i = 1; i <= 50; i++) {
    let sides;
    if      (i <= 10) sides = 3;
    else if (i <= 20) sides = 4;
    else if (i <= 30) sides = 5;
    else if (i <= 40) sides = 6;
    else              sides = 7;
    const corner = sides === 3 ? CORNERS_LIST[(i - 1) % 4] : null;
    figuras.push({ num: i, sides, corner });
  }
  return figuras;
}

/* =====================================================
   LAYOUT: GRADE ESTRATIFICADA RESPONSIVA
   ===================================================== */
const FIG_SIZE_PCT  = 10;   // Figuras maiores (10% da largura da folha)
const A4_PAD_PCT    = 2;    // Margem da folha
const GRID_COLS     = 7;    // 7 colunas
const GRID_ROWS     = 8;    // 8 linhas = 56 slots (6 slots vazios para respiro leve)

function gerarPosicoesAleatorias(n) {
  const usableW = 100 - 2 * A4_PAD_PCT;
  const usableH = 100 - 2 * A4_PAD_PCT;
  
  const cellW = usableW / GRID_COLS;
  const cellH = usableH / GRID_ROWS;
  
  // Calcula jitter baseado no espaço livre dentro da célula (%)
  const jitterX = ((cellW - FIG_SIZE_PCT) / 2) * 0.95;
  const jitterY = ((cellH - FIG_SIZE_PCT) / 2) * 0.95;

  const slots = [];
  for (let r = 0; r < GRID_ROWS; r++)
    for (let c = 0; c < GRID_COLS; c++)
      slots.push({ col: c, row: r });

  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }

  // Gera número aleatório entre -max e +max
  const rand = max => max > 0 ? (Math.random() * 2 * max) - max : 0;

  return slots.slice(0, n).map(({ col, row }) => ({
    // Retorna posições X e Y em porcentagem (%)
    x: Math.max(A4_PAD_PCT, Math.min(100 - A4_PAD_PCT - FIG_SIZE_PCT,
        A4_PAD_PCT + col * cellW + (cellW - FIG_SIZE_PCT) / 2 + rand(jitterX))),
    y: Math.max(A4_PAD_PCT, Math.min(100 - A4_PAD_PCT - FIG_SIZE_PCT,
        A4_PAD_PCT + row * cellH + (cellH - FIG_SIZE_PCT) / 2 + rand(jitterY))),
  }));
}

/* =====================================================
   TIMER: 4 PERÍODOS DE 1 MINUTO
   ===================================================== */
const T3_PERIODOS   = 4;
const T3_DURACAO_S  = 60; // segundos por período

let _t3Interval = null;

function iniciarTimerT3(onFim) {
  let tempoTotal = 0;       // segundos totais decorridos
  let pausado    = false;

  function mostrarCobertura(periodoEncerrado, cb) {
    pausado = true;
    const ov = document.createElement('div');
    ov.className = 'tedif3-periodo-overlay';
    const proximo = periodoEncerrado + 1;
    ov.innerHTML = `
      <div class="t3-ov-box">
        <div class="t3-ov-periodo">Período ${periodoEncerrado} encerrado</div>
        ${proximo <= T3_PERIODOS
          ? `<div class="t3-ov-sub">Período ${proximo} começa em instantes…</div>
             <div class="t3-ov-count" id="t3-ov-count">3</div>`
          : `<div class="t3-ov-sub">Teste finalizado!</div>`}
      </div>`;
    document.body.appendChild(ov);

    if (proximo <= T3_PERIODOS) {
      let n = 3;
      const tick = setInterval(() => {
        n--;
        const el = document.getElementById('t3-ov-count');
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

  function atualizarTopbar() {
    const periodo = Math.min(T3_PERIODOS, Math.floor(tempoTotal / T3_DURACAO_S) + 1);
    const restante = T3_DURACAO_S - (tempoTotal % T3_DURACAO_S);
    const m = Math.floor(restante / 60);
    const s = restante % 60;
    const pEl = document.getElementById('t3-periodo-label');
    const tEl = document.getElementById('t3-tempo-label');
    if (pEl) pEl.textContent = `Período ${periodo} / ${T3_PERIODOS}`;
    if (tEl) tEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
  }

  atualizarTopbar();

  _t3Interval = setInterval(() => {
    if (pausado) return;
    tempoTotal++;

    atualizarTopbar();

    const fimTotal = T3_PERIODOS * T3_DURACAO_S;

    if (tempoTotal >= fimTotal) {
      clearInterval(_t3Interval);
      const periodoEncerrado = T3_PERIODOS;
      mostrarCobertura(periodoEncerrado, () => onFim());
      return;
    }

    if (tempoTotal % T3_DURACAO_S === 0) {
      const periodoEncerrado = Math.floor(tempoTotal / T3_DURACAO_S);
      mostrarCobertura(periodoEncerrado, () => {});
    }
  }, 1000);
}

function pararTimerT3() {
  if (_t3Interval) { clearInterval(_t3Interval); _t3Interval = null; }
}

/* =====================================================
   RENDERIZAÇÃO DO TESTE TEDIF 3
   ===================================================== */
function renderTedif3() {
  pararTimerT3();
  document.body.style.overflow = 'auto';
  const app = document.getElementById('app');
  app.innerHTML = '';

  /* ── Topbar ── */
  const topbar = document.createElement('div');
  topbar.className = 'tedif3-topbar';
  topbar.id = 'tedif3-topbar';
  topbar.innerHTML = `
    <div class="tedif3-title-group">
      <span class="tedif3-badge">TEDIF 3</span>
      <span class="tedif3-title">Atenção Concentrada — Figuras Aninhadas</span>
    </div>
    <div class="t3-timer-group">
      <span id="t3-periodo-label">Período 1 / 4</span>
      <span id="t3-tempo-label">1:00</span>
    </div>
    <button class="btn-sair" id="tedif3-btn-sair" aria-label="Voltar ao menu">← Menu</button>
  `;
  app.appendChild(topbar);

  /* ── Área principal para centralizar a folha ── */
  const main = document.createElement('div');
  main.className = 'tedif3-main';
  // Garante que a div ocupe todo o espaço restante e centralize o conteúdo
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
  sheet.id = 'tedif3-sheet';
  // Folha responsiva: mantem proporção A4 (1:1.414) e se ajusta à altura
  sheet.style.cssText = `
    position: relative;
    height: 100%;
    aspect-ratio: 1 / 1.414;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    overflow: hidden;
  `;

  /* ── Figuras ── */
  const figuras   = buildFigurasTedif3();
  const shuffled  = [...figuras].sort(() => Math.random() - 0.5);
  const positions = gerarPosicoesAleatorias(shuffled.length);

  shuffled.forEach((fig, idx) => {
    const pos     = positions[idx];
    const wrapper = document.createElement('div');
    wrapper.className = 'tedif3-figura';
    wrapper.setAttribute('data-num',   fig.num);
    wrapper.setAttribute('data-sides', fig.sides);
    wrapper.style.cssText = `
      position: absolute;
      left: ${pos.x.toFixed(2)}%;
      top: ${pos.y.toFixed(2)}%;
      width: ${FIG_SIZE_PCT}%;
      aspect-ratio: 1 / 1;
      cursor: pointer;
    `;
    wrapper.innerHTML = gerarFiguraTedif3(fig.num, fig.sides, fig.corner);

    /* Risco ao clicar */
    wrapper.addEventListener('click', () => {
      wrapper.classList.toggle('tedif3-marcada');
    });

    sheet.appendChild(wrapper);
  });

  main.appendChild(sheet);
  app.appendChild(main);

  /* ── Botão sair ── */
  document.getElementById('tedif3-btn-sair').addEventListener('click', () => {
    pararTimerT3();
    document.body.style.overflow = '';
    renderMenuSeletor();
  });

  /* ── Inicia timer ── */
  iniciarTimerT3(() => {
    // Fim do teste — volta ao menu após breve pausa
    setTimeout(() => {
      pararTimerT3();
      document.body.style.overflow = '';
      renderMenuSeletor();
    }, 1000);
  });
}
