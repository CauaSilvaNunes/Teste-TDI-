/**
 * ╔══════════════════════════════════════════════════════╗
 * ║            config.js — CONFIGURAÇÕES DO APP          ║
 * ║                                                      ║
 * ║  Edite este arquivo para ajustar os parâmetros       ║
 * ║  de todos os testes sem mexer no código principal.   ║
 * ╚══════════════════════════════════════════════════════╝
 */

'use strict';

const CONFIG = {

  /* ======================================================
     TESTES DE ATENÇÃO (AC, AD e AA)
     Grade com figuras para identificar e clicar
     ====================================================== */
  grade: {
    linhas:  20,   // quantidade de linhas da grade
    colunas: 20,   // quantidade de colunas da grade
    //   → total de itens = linhas × colunas (ex: 20×20 = 400)
  },

  tempo: {
    duracaoSegundos: 120,  // duração de cada teste em segundos (padrão: 2 min)
  },

  probabilidade: {
    //   Fração de células que serão figuras-alvo (de 0.0 a 1.0)
    //   Exemplo: 0.35 = 35% das células são alvos
    alvo:          0.35,  // AC (Atenção Concentrada) e AA (Atenção Alternada)
    alvoAD:        0.35,  // AD (Atenção Dividida)
  },

  antiSpam: {
    intervaloMs: 150,  // tempo mínimo (ms) entre dois cliques no mesmo item
  },


  /* ======================================================
     TEDIF 2 — Círculos Aninhados
     Folha A4 com 50 círculos numerados (1–50)
     ====================================================== */
  tedif2: {
    periodos:   4,   // número de períodos do teste
    duracaoS:   60,  // duração de cada período em segundos

    // Layout da folha A4
    colunas:    7,   // colunas na grade interna da folha
    linhas:     8,   // linhas na grade interna da folha (7×8 = 56 slots p/ 50 figuras)
    tamanhoFig: 10,  // tamanho de cada figura em % da largura da folha
    margem:     2,   // margem das bordas da folha em %

    // Sequência de cores dos anéis externos (repete a cada 5 figuras)
    //   Formato: array de cores CSS
    cores: ['#ffffff', '#5B9BD5', '#FFC000', '#70AD47', '#FF4444'],
    //              branco    azul    amarelo    verde    vermelho
  },


  /* ======================================================
     TEDIF 3 — Figuras Geométricas Aninhadas
     Folha A4 com 50 polígonos numerados (1–50)
     Grupos: triângulos (1–10), quadrados (11–20),
             pentágonos (21–30), hexágonos (31–40),
             heptágonos (41–50)
     ====================================================== */
  tedif3: {
    periodos:   4,
    duracaoS:   60,

    // Layout da folha A4 (mesmos parâmetros do TEDIF 2)
    colunas:    7,
    linhas:     8,
    tamanhoFig: 10,
    margem:     2,

    // Sequência de cores dos anéis externos
    cores: ['#ffffff', '#5B9BD5', '#FFC000', '#70AD47', '#FF4444'],
  },

};
