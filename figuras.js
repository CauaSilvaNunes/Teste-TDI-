/**
 * figuras.js — Figuras abstratas do Teste de Atenção de Fabián Javier
 *
 * As figuras são reproduções SVG dos símbolos geométricos abstratos do teste
 * original (traço preto sobre fundo branco), sem letras, sem números, sem
 * símbolos culturais para não favorecer escolaridade.
 *
 * Nomenclatura baseada nos modelos do teste original:
 *   F1 – Triângulo com ponto central
 *   F2 – Círculo com traço interno
 *   F3 – Quadrado vazio
 *   F4 – Losango
 *   F5 – Estrela de 4 pontas (×)
 *   F6 – Seta para a direita
 *   F7 – Ângulo aberto (chevron)
 *   F8 – Cruz (+)
 *   F9 – Semicírculo (arco)
 *   F10 – Triângulo invertido com traço
 */

const S = 'black'; // stroke / fill color – sempre preto

const FIGURAS = {
  // F1: Triângulo com ponto no centro
  'F1': () => `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="20,4 37,36 3,36"
        fill="none" stroke="${S}" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="20" cy="26" r="2.5" fill="${S}"/>
    </svg>`,

  // F2: Círculo com linha horizontal no meio
  'F2': () => `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="16" stroke="${S}" stroke-width="2"/>
      <line x1="4" y1="20" x2="36" y2="20" stroke="${S}" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

  // F3: Quadrado simples (vazio)
  'F3': () => `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="30" height="30" stroke="${S}" stroke-width="2"/>
    </svg>`,

  // F4: Losango
  'F4': () => `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="20,3 37,20 20,37 3,20"
        fill="none" stroke="${S}" stroke-width="2" stroke-linejoin="round"/>
    </svg>`,

  // F5: Estrela de 4 pontas (×)
  'F5': () => `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="7" y1="7"  x2="33" y2="33" stroke="${S}" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="33" y1="7" x2="7"  y2="33" stroke="${S}" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`,

  // F6: Seta simples →
  'F6': () => `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="4" y1="20" x2="32" y2="20" stroke="${S}" stroke-width="2" stroke-linecap="round"/>
      <polyline points="22,11 32,20 22,29"
        fill="none" stroke="${S}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

  // F7: Chevron (ângulo aberto para a direita >)
  'F7': () => `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="10,5 30,20 10,35"
        fill="none" stroke="${S}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

  // F8: Cruz (+)
  'F8': () => `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="4"  x2="20" y2="36" stroke="${S}" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="4"  y1="20" x2="36" y2="20" stroke="${S}" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`,

  // F9: Arco / Semicírculo (abertura para baixo)
  'F9': () => `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5,22 A15,15 0 0 1 35,22" stroke="${S}" stroke-width="2" stroke-linecap="round" fill="none"/>
      <line x1="5" y1="22" x2="35" y2="22" stroke="${S}" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

  // F10: Triângulo invertido com traço na base
  'F10': () => `
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="20,36 37,8 3,8"
        fill="none" stroke="${S}" stroke-width="2" stroke-linejoin="round"/>
      <line x1="10" y1="8" x2="30" y2="8" stroke="${S}" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
};

const CHAVES_FIGURAS = Object.keys(FIGURAS); // F1…F10

/**
 * Sorteia as figuras-alvo conforme o tipo de teste.
 */
function sortearAlvos(tipo) {
  const embaralhadas = [...CHAVES_FIGURAS].sort(() => Math.random() - 0.5);
  if (tipo === 'AC') return [embaralhadas[0]];
  if (tipo === 'AD') return embaralhadas.slice(0, 3);
  if (tipo === 'AA') return embaralhadas.slice(0, 2);
  return [embaralhadas[0]];
}

/**
 * Retorna uma figura que NÃO seja alvo.
 */
function figuraDitratora(alvoKeys) {
  const disponiveis = CHAVES_FIGURAS.filter(k => !alvoKeys.includes(k));
  return disponiveis[Math.floor(Math.random() * disponiveis.length)];
}
