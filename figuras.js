/**
 * figuras.js — As 13 figuras do Teste de Atenção de Fabián Javier
 *
 * viewBox: "-8 -8 116 116"  →  8 unidades de margem em cada lado
 *   (as formas continuam em coordenadas 0–100, mas o espaço
 *    renderizado é maior, criando espaçamento natural entre células)
 *
 * ─── Grupo 1: Metades ──────────────────────────────────────
 *  G1A  Metade Esquerda    rect x=0   y=0  w=50  h=100
 *  G1B  Metade Direita     rect x=50  y=0  w=50  h=100
 *  G1C  Metade Superior    rect x=0   y=0  w=100 h=50
 *  G1D  Metade Inferior    rect x=0   y=50 w=100 h=50
 *
 * ─── Grupo 2: Triângulos de Borda (Isósceles) ──────────────
 *  G2A  Apontando p/ Cima     (0,100)(100,100)(50,0)
 *  G2B  Apontando p/ Baixo    (0,0)(100,0)(50,100)
 *  G2C  Apontando p/ Esq.     (100,0)(100,100)(0,50)
 *  G2D  Apontando p/ Dir.     (0,0)(0,100)(100,50)
 *
 * ─── Grupo 3: Cortes Diagonais (Triângulos Retângulos) ─────
 *  G3A  Canto Sup. Esq.  /   (0,0)(100,0)(0,100)
 *  G3B  Canto Inf. Dir.  /   (0,100)(100,100)(100,0)
 *  G3C  Canto Sup. Dir.  \   (0,0)(100,0)(100,100)
 *  G3D  Canto Inf. Esq.  \   (0,0)(100,100)(0,100)
 *
 * ─── Grupo 4: Figura Complexa ──────────────────────────────
 *  G4A  Losango Vazado        ◆ com círculo branco central r=15
 */

// viewBox exato: formas preenchem o quadrado da célula completamente
const VB = '0 0 100 100';

const FIGURAS = {

  /* ── Grupo 1: Metades ──────────────────────────────── */

  'G1A': () => `
    <svg viewBox="${VB}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="50" height="100" fill="#000"/>
    </svg>`,

  'G1B': () => `
    <svg viewBox="${VB}" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="0" width="50" height="100" fill="#000"/>
    </svg>`,

  'G1C': () => `
    <svg viewBox="${VB}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="100" height="50" fill="#000"/>
    </svg>`,

  'G1D': () => `
    <svg viewBox="${VB}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="50" width="100" height="50" fill="#000"/>
    </svg>`,

  /* ── Grupo 2: Triângulos de Borda ──────────────────── */

  // Triângulo vazado apontando para cima (base na parte inferior)
  'G2A': () => `
    <svg viewBox="${VB}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,50 0,0 100,0 100,50 50,0" fill="#000"/>
    </svg>`,

  // Triângulo vazado apontando para baixo (base na parte superior)
  'G2B': () => `
    <svg viewBox="${VB}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,50 0,100 100,100 100,50 50,100" fill="#000"/>
    </svg>`,

  // Triângulo vazado apontando para a esquerda (base na direita)
  'G2C': () => `
    <svg viewBox="${VB}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,0 0,0 0,100 50,100 0,50" fill="#000"/>
    </svg>`,

  // Triângulo vazado apontando para a direita (base na esquerda)
  'G2D': () => `
    <svg viewBox="${VB}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,0 100,0 100,100 50,100 100,50" fill="#000"/>
    </svg>`,

  /* ── Grupo 3: Cortes Diagonais ─────────────────────── */

  // Canto superior esquerdo  /  → triângulo cobre topo-esq.
  'G3A': () => `
    <svg viewBox="${VB}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 100,0 0,100" fill="#000"/>
    </svg>`,

  // Canto inferior direito   /  → triângulo cobre base-dir.
  'G3B': () => `
    <svg viewBox="${VB}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,100 100,100 100,0" fill="#000"/>
    </svg>`,

  // Canto superior direito   \  → triângulo cobre topo-dir.
  'G3C': () => `
    <svg viewBox="${VB}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 100,0 100,100" fill="#000"/>
    </svg>`,

  // Canto inferior esquerdo  \  → triângulo cobre base-esq.
  'G3D': () => `
    <svg viewBox="${VB}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 100,100 0,100" fill="#000"/>
    </svg>`,

  /* ── Grupo 4: Figura Complexa ──────────────────────── */

  // Losango Vazado: losango preto + círculo branco central
  'G4A': () => `
    <svg viewBox="${VB}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,0 100,50 50,100 0,50" fill="#000"/>
      <circle cx="50" cy="50" r="15" fill="#fff"/>
    </svg>`,

  // Losango Vazado Inverso: fundo preto, losango branco, círculo preto
  'G4B': () => `
    <svg viewBox="${VB}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="100" height="100" fill="#000"/>
      <polygon points="50,0 100,50 50,100 0,50" fill="#fff"/>
      <circle cx="50" cy="50" r="15" fill="#000"/>
    </svg>`,
};

const CHAVES_FIGURAS = Object.keys(FIGURAS); // 14 chaves
FIGURAS['G2_IMAGEM2'] = FIGURAS['G2B'];

/**
 * Sorteia as figuras-alvo conforme o tipo de teste.
 * @param {'AC'|'AD'|'AA'} tipo
 * @returns {string[]}
 */
function sortearAlvos(tipo) {
  const embaralhadas = [...CHAVES_FIGURAS].sort(() => Math.random() - 0.5);
  if (tipo === 'AC') return [embaralhadas[0]];
  if (tipo === 'AD') return embaralhadas.slice(0, 3);
  if (tipo === 'AA') return embaralhadas.slice(0, 2);
  return [embaralhadas[0]];
}

/**
 * Retorna uma chave de figura que NÃO seja alvo ativo.
 * @param {string[]} alvoKeys
 * @returns {string}
 */
function figuraDitratora(alvoKeys) {
  const disponiveis = CHAVES_FIGURAS.filter(k => !alvoKeys.includes(k));
  return disponiveis[Math.floor(Math.random() * disponiveis.length)];
}
