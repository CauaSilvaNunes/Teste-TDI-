/**
 * app.js — Motor principal dos Testes de Atenção (Fabián Javier)
 *
 * Layout: grade fixa 10×10 (100 itens)
 * Figuras: SVG preto sobre branco
 * Interação: itens marcados com ✓/✗ mas NÃO somem da tela
 */

'use strict';

/* =====================================================
   CONSTANTES
   ===================================================== */
const LINHAS             = 20;
const COLUNAS            = 20;
const TOTAL_ITENS        = LINHAS * COLUNAS;   // 400
const TEMPO_TESTE        = 120;                // segundos
const PROB_ALVO          = 0.35;               // 35% de chance de nascer alvo (AC e AA)
const PROB_ALVO_AD       = 0.35;              // ~90 alvos em 400 itens (AD — Dividida)
const AA_FASE_DURACAO    = 15;                 // segundos por fase (AA)
const SPAM_COOLDOWN_MS   = 250;               // ms entre cliques no mesmo item

/* =====================================================
   ESTADO GLOBAL
   ===================================================== */
const Estado = {
  tipo:             null,
  alvos:            [],
  alvosAtivo:       0,
  acertos:          0,
  erros:            0,
  tempoTotal:       TEMPO_TESTE,
  tempoRestante:    TEMPO_TESTE,
  aaFaseRestante:   AA_FASE_DURACAO,
  totalAlvosNaTela: 0,
  alvosClicados:    new Set(),
  itensInteragidos: new Set(), // acertos + erros já marcados (não reprocessar)
  rodandoTeste:     false,
  timerInterval:    null,
  spamCooldowns:    new Map(),
  itensGerados:     [],
};

/* =====================================================
   UTILITÁRIOS
   ===================================================== */
function uid() { return Math.random().toString(36).slice(2, 9); }

function $el(tag, cls, html = '') {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (html) el.innerHTML = html;
  return el;
}

/* =====================================================
   COMPONENTE: MENU SELETOR
   ===================================================== */
function renderMenuSeletor() {
  document.body.style.overflow = '';
  const app = document.getElementById('app');
  app.innerHTML = '';

  const menu = $el('div', 'menu-seletor');
  menu.setAttribute('role', 'main');

  const header = $el('div', 'menu-header');
  header.innerHTML = `
    <div class="badge">Neuropsicologia</div>
    <h1>Testes psicológicos</h1>
    <p>Avaliação baseada na metodologia de Fabián Javier. Selecione o tipo de teste.</p>
  `;
  menu.appendChild(header);

  const cards = $el('div', 'menu-cards');

  const tipos = [
    {
      id: 'AC', emoji: '◎', classe: 'card-ac',
      sigla: 'AC — Concentrada',
      nome: 'Atenção Concentrada',
      desc: 'Identifique 1 figura-alvo entre os distratores o mais rápido possível.',
      chips: ['1 alvo', '100 itens', '120s'],
    },
    {
      id: 'AD', emoji: '⊗', classe: 'card-ad',
      sigla: 'AD — Dividida',
      nome: 'Atenção Dividida',
      desc: 'Rastreie 3 figuras-alvo simultâneas e marque qualquer uma delas.',
      chips: ['3 alvos', '100 itens', '120s'],
    },
    {
      id: 'AA', emoji: '⇄', classe: 'card-aa',
      sigla: 'AA — Alternada',
      nome: 'Atenção Alternada',
      desc: 'Foque em um alvo diferente para cada linha. O alvo específico da linha é indicado à esquerda.',
      chips: ['20 alvos', '400 itens', '120s'],
    },
    {
      id: 'T3', emoji: '△', classe: 'card-t3',
      sigla: 'TEDIF 3 — Concentrada',
      nome: 'TEDIF 3',
      desc: 'Figuras geométricas aninhadas (triângulos, quadrados, pentágonos, hexágonos e heptágonos) com números de 1 a 50, distribuídas em folha A4.',
      chips: ['50 figuras', 'Folha A4', 'Números 1–50'],
    },
  ];

  tipos.forEach(t => {
    const card = $el('div', `card-teste ${t.classe}`);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Iniciar ${t.nome}`);
    card.id = `btn-${t.id.toLowerCase()}`;
    card.innerHTML = `
      <div class="card-icon">${t.emoji}</div>
      <div class="card-sigla">${t.sigla}</div>
      <div class="card-nome">${t.nome}</div>
      <div class="card-desc">${t.desc}</div>
      <div class="card-meta">
        ${t.chips.map(c => `<span class="chip">${c}</span>`).join('')}
      </div>
      <div class="card-arrow">↗</div>
    `;
    // TEDIF 3 tem sua própria tela; os demais usam iniciarTeste()
    if (t.id === 'T3') {
      card.addEventListener('click', () => renderTedif3());
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') renderTedif3();
      });
    } else {
      card.addEventListener('click', () => iniciarTeste(t.id));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') iniciarTeste(t.id);
      });
    }
    cards.appendChild(card);
  });

  menu.appendChild(cards);

  const footer = $el('footer', 'menu-footer');
  footer.innerHTML = `
    <a href="https://github.com/CauaSilvaNunes/Teste-TDI-" target="_blank" rel="noopener noreferrer" class="footer-link" id="footer-github-link">
      <svg class="footer-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
      GitHub — CauaSilvaNunes/Teste-TDI-
    </a>
  `;
  menu.appendChild(footer);

  app.appendChild(menu);
}

/* =====================================================
   COMPONENTE: PAINEL ALVO
   ===================================================== */
function renderPainelAlvo() {
  const painel = $el('div', 'painel-alvo');
  painel.id = 'painel-alvo';

  // Esquerda
  const left = $el('div', 'painel-left');
  
  if (Estado.tipo === 'AA') {
    left.innerHTML = `
      <span class="painel-tipo">${Estado.tipo}</span>
      <span class="painel-label">Observe os alvos específicos à esquerda de cada linha</span>
    `;
  } else {
    left.innerHTML = `
      <span class="painel-tipo">${Estado.tipo}</span>
      <span class="painel-label">Procure:</span>
    `;

    const alvosContainer = $el('div', 'painel-alvos-container');
    alvosContainer.id = 'painel-alvos-container';

    Estado.alvos.forEach((chave, i) => {
      const item = $el('div', 'painel-alvo-item');
      item.id = `painel-alvo-${i}`;
      item.innerHTML = FIGURAS[chave]();
      item.classList.add('ativo');
      alvosContainer.appendChild(item);
    });

    left.appendChild(alvosContainer);
  }

  // Centro: timer + contadores
  const centro = $el('div', 'painel-center');
  const CIRCUNF = 2 * Math.PI * 21; // r=21 → ~132

  const timerWrap = $el('div', 'timer-wrap');
  timerWrap.innerHTML = `
    <svg class="timer-svg" viewBox="0 0 48 48">
      <circle class="timer-track" cx="24" cy="24" r="21"/>
      <circle class="timer-arc" id="timer-arc" cx="24" cy="24" r="21"
        style="stroke-dasharray:${CIRCUNF.toFixed(1)};stroke-dashoffset:0"/>
    </svg>
    <span class="timer-text" id="timer-text">${Estado.tempoRestante}</span>
  `;
  centro.appendChild(timerWrap);

  const counters = $el('div', 'painel-counters');
  counters.innerHTML = `
    <div class="counter-item" id="ctr-acertos">
      <span class="counter-label">Acertos</span>
      <span class="counter-value" id="ctr-acertos-val">0</span>
    </div>
    <div class="counter-item" id="ctr-erros">
      <span class="counter-label">Erros</span>
      <span class="counter-value" id="ctr-erros-val">0</span>
    </div>
  `;
  centro.appendChild(counters);

  // (Removida a barra de progresso do AA pois não há mais troca por tempo)

  // Direita: sair
  const right = $el('div', 'painel-right');
  const btnSair = $el('button', 'btn-sair');
  btnSair.id = 'btn-sair';
  btnSair.textContent = '✕ Encerrar';
  btnSair.setAttribute('aria-label', 'Encerrar teste');
  btnSair.addEventListener('click', () => encerrarTeste(false));
  right.appendChild(btnSair);

  painel.appendChild(left);
  painel.appendChild(centro);
  painel.appendChild(right);

  return painel;
}

function atualizarPainel() {
  const CIRCUNF = 2 * Math.PI * 21;

  // Timer
  const arc = document.getElementById('timer-arc');
  const txt = document.getElementById('timer-text');
  if (arc) {
    const ratio = Estado.tempoRestante / Estado.tempoTotal;
    arc.style.strokeDashoffset = (CIRCUNF * (1 - ratio)).toFixed(2);
    if (ratio < 0.25) arc.classList.add('alerta');
  }
  if (txt) {
    const m = Math.floor(Estado.tempoRestante / 60);
    const s = Estado.tempoRestante % 60;
    txt.textContent = m > 0 ? `${m}:${s.toString().padStart(2,'0')}` : Estado.tempoRestante;
  }

  // Counters
  const av = document.getElementById('ctr-acertos-val');
  const ev = document.getElementById('ctr-erros-val');
  if (av) av.textContent = Estado.acertos;
  if (ev) ev.textContent = Estado.erros;

  // (Removida a lógica de atualização da interface AA baseada em tempo)
}

/* =====================================================
   GERAÇÃO DO GRID
   ===================================================== */
function gerarGrid(grid) {
  Estado.itensGerados     = [];
  Estado.totalAlvosNaTela = 0;
  Estado.alvosClicados    = new Set();
  Estado.itensInteragidos = new Set();

  if (Estado.tipo === 'AA') {
    grid.classList.add('grid-aa');
    Estado.alvosPorLinha = [];
    
    for (let l = 0; l < LINHAS; l++) {
      // Sorteia um alvo específico para esta linha
      const alvoLinha = CHAVES_FIGURAS[Math.floor(Math.random() * CHAVES_FIGURAS.length)];
      Estado.alvosPorLinha.push(alvoLinha);
      
      // Cria a célula do alvo (indicador na esquerda)
      const elAlvo = $el('div', 'item-alvo-linha');
      elAlvo.innerHTML = FIGURAS[alvoLinha]();
      grid.appendChild(elAlvo);
      
      // Define alvos nesta linha
      const slots = Array.from({ length: COLUNAS }, (_, i) => i);
      for (let i = slots.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [slots[i], slots[j]] = [slots[j], slots[i]];
      }
      
      const qtdAlvos = Math.round(COLUNAS * PROB_ALVO);
      const posAlvos = new Set(slots.slice(0, qtdAlvos));
      
      for (let c = 0; c < COLUNAS; c++) {
        const isAlvo = posAlvos.has(c);
        const chave = isAlvo ? alvoLinha : figuraDitratora([alvoLinha]);
        
        const id = uid();
        const el = $el('div', 'item-teste');
        el.id = `item-${id}`;
        el.dataset.id       = id;
        el.dataset.isAlvo   = isAlvo ? '1' : '0';
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.innerHTML = FIGURAS[chave]();
        
        el.addEventListener('click', (e) => onItemClick(e, id, isAlvo, true, el));
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') onItemClick(e, id, isAlvo, true, el);
        });
        
        grid.appendChild(el);
        Estado.itensGerados.push({ id, chave, isAlvo, alvoIndex: null, el });
        if (isAlvo) Estado.totalAlvosNaTela++;
      }
    }
  } else {
    grid.classList.remove('grid-aa');
    // Decide quais posições serão alvo (garante pelo menos PROB_ALVO * 100)
    const slots = Array.from({ length: TOTAL_ITENS }, (_, i) => i);

    // Embaralha Fisher-Yates
    for (let i = slots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }

    // Define posições-alvo (AD usa probabilidade maior para ~90 alvos)
    const probAlvo    = Estado.tipo === 'AD' ? PROB_ALVO_AD : PROB_ALVO;
    const qtdAlvos    = Math.round(TOTAL_ITENS * probAlvo); // ~90 para AD, ~140 para AC
    const posAlvos    = new Set(slots.slice(0, qtdAlvos));

    for (let i = 0; i < TOTAL_ITENS; i++) {
      const isAlvo = posAlvos.has(i);

      let chave, alvoIndex = null;
      if (isAlvo) {
        alvoIndex = Math.floor(Math.random() * Estado.alvos.length);
        chave = Estado.alvos[alvoIndex];
      } else {
        chave = figuraDitratora(Estado.alvos);
      }

      const id = uid();
      const el = $el('div', 'item-teste');
      el.id = `item-${id}`;
      el.dataset.id       = id;
      el.dataset.isAlvo   = isAlvo ? '1' : '0';
      el.dataset.alvoIndex = alvoIndex !== null ? alvoIndex : '';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', 'Figura do teste');
      el.innerHTML = FIGURAS[chave]();

      // Em AC e AD não há alvo ativo que mude, apenas se fosse antigo AA
      el.addEventListener('click', (e) => onItemClick(e, id, isAlvo, true, el));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') onItemClick(e, id, isAlvo, true, el);
      });

      grid.appendChild(el);

      Estado.itensGerados.push({ id, chave, isAlvo, alvoIndex, el });
      if (isAlvo) Estado.totalAlvosNaTela++;
    }
  }
}

/* =====================================================
   HANDLER DE CLIQUE
   ===================================================== */
function onItemClick(e, id, isAlvo, alvoAtivo, el) {
  if (!Estado.rodandoTeste) return;

  // Já interagido → ignora
  if (Estado.itensInteragidos.has(id)) return;

  // Anti-spam
  const agora = Date.now();
  const ultimo = Estado.spamCooldowns.get(id) || 0;
  if (agora - ultimo < SPAM_COOLDOWN_MS) return;
  Estado.spamCooldowns.set(id, agora);

  if (isAlvo && alvoAtivo) {
    Estado.acertos++;
    Estado.alvosClicados.add(id);
    Estado.itensInteragidos.add(id);
    el.classList.add('acertado');
  } else {
    Estado.erros++;
    Estado.itensInteragidos.add(id);
    el.classList.add('errado-marcado');
  }

  atualizarPainel();
}

/* =====================================================
   COUNTDOWN
   ===================================================== */
function showCountdown(callback) {
  const overlay = $el('div', 'countdown-overlay');
  overlay.id = 'countdown-overlay';
  const numEl  = $el('div', 'countdown-number');
  const lbl    = $el('div', 'countdown-label');
  lbl.textContent = 'Prepare-se…';
  overlay.appendChild(numEl);
  overlay.appendChild(lbl);
  document.body.appendChild(overlay);

  let n = 3;
  numEl.textContent = n;
  let currentNumEl = numEl;

  const tick = setInterval(() => {
    n--;
    if (n === 0) {
      currentNumEl.textContent = 'Vai!';
      lbl.textContent = '';
      setTimeout(() => {
        clearInterval(tick);
        overlay.remove();
        callback();
      }, 650);
    } else {
      // Re-dispara animação
      const novo = currentNumEl.cloneNode(false);
      novo.textContent = n;
      overlay.replaceChild(novo, currentNumEl);
      currentNumEl = novo;
    }
  }, 900);
}

/* =====================================================
   INICIAR TESTE
   ===================================================== */
function iniciarTeste(tipo) {
  // Reset
  Estado.tipo             = tipo;
  Estado.alvos            = sortearAlvos(tipo);
  Estado.alvosAtivo       = 0;
  Estado.acertos          = 0;
  Estado.erros            = 0;
  Estado.tempoTotal       = TEMPO_TESTE;
  Estado.tempoRestante    = TEMPO_TESTE;
  Estado.aaFaseRestante   = AA_FASE_DURACAO;
  Estado.rodandoTeste     = false;
  Estado.spamCooldowns    = new Map();
  if (Estado.timerInterval) clearInterval(Estado.timerInterval);

  // Monta DOM
  const app = document.getElementById('app');
  app.innerHTML = '';

  const painel  = renderPainelAlvo();
  const wrapper = $el('div', 'test-wrapper');
  wrapper.id = 'test-wrapper';

  const grid = $el('div', 'grid-teste');
  grid.id = 'grid-teste';
  grid.setAttribute('role', 'grid');
  grid.setAttribute('aria-label', 'Grade do teste de atenção');

  wrapper.appendChild(grid);
  app.appendChild(painel);
  app.appendChild(wrapper);

  // Gera os 100 itens
  gerarGrid(grid);

  // Countdown → inicia timer
  showCountdown(() => iniciarTimer(wrapper));
}

/* =====================================================
   TIMER
   ===================================================== */
function iniciarTimer(wrapper) {
  Estado.rodandoTeste = true;

  Estado.timerInterval = setInterval(() => {
    if (!Estado.rodandoTeste) return;
    Estado.tempoRestante--;

    // (Troca de fase temporizada para o AA foi removida para esta nova versão)

    atualizarPainel();

    if (Estado.tempoRestante <= 0) encerrarTeste(true);
  }, 1000);
}

/* =====================================================
   ENCERRAR TESTE
   ===================================================== */
function encerrarTeste(porTempo) {
  Estado.rodandoTeste = false;
  clearInterval(Estado.timerInterval);

  // Encontra o índice (na ordem da grade, esq→dir, cima→baixo) do último item
  // que foi interagido (acerto ou erro). Itens após esse ponto são ignorados.
  let ultimoIdx = -1;
  Estado.itensGerados.forEach((item, idx) => {
    if (Estado.itensInteragidos.has(item.id)) ultimoIdx = idx;
  });

  // Recalcula dentro da janela [0 .. ultimoIdx]
  let acertos = 0, erros = 0, omissoes = 0;
  if (ultimoIdx >= 0) {
    for (let i = 0; i <= ultimoIdx; i++) {
      const item = Estado.itensGerados[i];
      const interagido = Estado.itensInteragidos.has(item.id);
      const acertado   = Estado.alvosClicados.has(item.id);

      if (item.isAlvo) {
        if (acertado) acertos++;
        else          omissoes++;  // alvo não clicado dentro da janela
      } else {
        if (interagido) erros++;   // não-alvo clicado = erro
      }
    }
  }

  const pontuacao = acertos - erros;

  renderResultado({ acertos, erros, omissoes, pontuacao, porTempo });
}

/* =====================================================
   MODAL DE RESULTADO
   ===================================================== */
function renderResultado({ acertos, erros, omissoes, pontuacao, porTempo }) {
  const nomeTeste = Estado.tipo === 'AC' ? 'Concentrada'
                  : Estado.tipo === 'AD' ? 'Dividida'
                  : Estado.tipo === 'AA' ? 'Alternada' : 'TEDIF 3';

  const overlay = $el('div', 'resultado-overlay');
  overlay.id = 'resultado-overlay';

  const modal = $el('div', 'resultado-modal');
  modal.innerHTML = `
    <p class="resultado-subtitulo">
      Atenção ${nomeTeste} &mdash; ${porTempo ? 'Tempo esgotado' : 'Encerrado manualmente'}
    </p>

    <div class="resultado-stats">
      <div class="stat-box stat-acertos">
        <div class="stat-value">${acertos}</div>
        <div class="stat-label">Acertos</div>
      </div>
      <div class="stat-box stat-erros">
        <div class="stat-value">${erros}</div>
        <div class="stat-label">Erros</div>
      </div>
      <div class="stat-box stat-omissoes">
        <div class="stat-value">${omissoes}</div>
        <div class="stat-label">Omissões</div>
      </div>
      <div class="stat-box stat-score">
        <div class="stat-value">${pontuacao}</div>
        <div class="stat-label">Pontuação</div>
      </div>
    </div>

    <div class="resultado-pontuacao">
      <div class="formula">Fórmula: Acertos − Erros = Pontuação</div>
      <div class="pontuacao-final">${pontuacao}</div>
      <div class="pontuacao-label">Pontuação final (pode ser negativa)</div>
    </div>

    <div class="resultado-botoes">
      <button class="btn-secondary" id="btn-novo-teste">← Menu</button>
      <button class="btn-primary"   id="btn-repetir">↺ Repetir ${nomeTeste}</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document.getElementById('btn-novo-teste').addEventListener('click', () => {
    overlay.remove();
    renderMenuSeletor();
  });
  document.getElementById('btn-repetir').addEventListener('click', () => {
    overlay.remove();
    iniciarTeste(Estado.tipo);
  });
}

/* =====================================================
   BOOT
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderMenuSeletor();
});
