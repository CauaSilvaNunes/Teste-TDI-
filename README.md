# 🧠 Testes Neuropsicológicos de Atenção

Aplicação web para aplicação de testes neuropsicológicos de atenção, os de atenção concentrada dividida e alternada são baseados nas metodologias de **Fabián Javier Marín Rueda**. Desenvolvida para uso educacional, com suporte completo a tablets e funcionamento offline.

---

## 🔗 Acesso Online

O site está disponível e pronto para uso no link abaixo:

**[➡ Acessar a aplicação](https://teste-tdi.vercel.app/)**

> Compatível com qualquer navegador moderno. Recomendado para uso em tablets (Android/iPad).

---

## 📋 Sobre a Aplicação

Esta aplicação reúne em um único ambiente os principais instrumentos de avaliação neuropsicológica da atenção, permitindo a aplicação padronizada e digital dos seguintes testes:

### Testes de Atenção em Grade (AC, AD e AA)

Todos os três testes utilizam uma **grade de 20 × 20 figuras geométricas** (400 itens no total), com **2 minutos de duração** cada. O avaliado deve identificar e marcar as figuras-alvo dentro do tempo limite.

| Teste | Nome Completo | Descrição |
|-------|--------------|-----------|
| **AC** | Atenção Concentrada | Uma única figura-alvo fixa para todo o teste. Mede a capacidade de foco e resistência à distração. |
| **AD** | Atenção Dividida | Dois alvos simultâneos devem ser identificados ao mesmo tempo. Mede a capacidade de processar múltiplos estímulos. |
| **AA** | Atenção Alternada | Cada linha possui seu próprio alvo, que muda a cada linha. Mede a flexibilidade cognitiva e a capacidade de alternância. |

Ao final de cada teste, são calculados automaticamente:
- **Acertos** — figuras-alvo corretamente identificadas
- **Omissões** — alvos não marcados (contados da esquerda até o último item marcado)
- **Erros** — figuras não-alvo marcadas incorretamente

---

### TEDIF 2 — Atenção Concentrada com Círculos Aninhados

Baseado na folha A4 do instrumento TEDIF, com **50 círculos aninhados** numerados de 1 a 50. O teste é dividido em **4 períodos de 60 segundos** cada, com transições visuais entre os períodos. Os círculos são agrupados por cores (branco, azul, amarelo, verde e vermelho) a cada 5 figuras.

---

### TEDIF 3 — Atenção Concentrada com Figuras Geométricas

Variação do TEDIF 2, utilizando **50 polígonos aninhados** (também 4 períodos de 60 s). As figuras são organizadas em grupos de 10, cada grupo com um polígono diferente:

| Figuras | Forma |
|---------|-------|
| 1 – 10  | Triângulos |
| 11 – 20 | Quadrados |
| 21 – 30 | Pentágonos |
| 31 – 40 | Hexágonos |
| 41 – 50 | Heptágonos |

---

## ✨ Funcionalidades

- **PWA e Suporte Offline:** Instale diretamente no tablet via "Adicionar à tela inicial" e use sem internet.
- **Leve e Estático:** Desenvolvido com HTML, CSS e JavaScript puro — sem frameworks, sem dependências externas.
- **Figuras Geométricas em SVG:** Todas as figuras são renderizadas vetorialmente, garantindo nitidez em qualquer tela.
- **Configurável:** O arquivo `config.js` centraliza todos os parâmetros (duração, probabilidade de alvos, layout) sem necessidade de alterar o código principal.
- **Responsivo:** Adaptado para funcionar em tablets e telas de diferentes tamanhos.

---

## 📱 Instalação como App (PWA)

A aplicação pode ser instalada como um Progressive Web App (PWA) diretamente no tablet ou computador:

1. Acesse o link do site no navegador (Chrome ou Edge recomendado).
2. Clique no botão **"Instalar o app"** (ícone de instalação na barra de endereços) ou vá em **Menu → Adicionar à tela inicial**.
3. O app estará disponível como um ícone e funcionará **offline**, sem necessidade de conexão.

---

## 🛠 Como Executar Localmente

O projeto é estático e pode ser executado com qualquer servidor web local simples.

1. **Clone o repositório:**
   ```bash
   git clone <URL-DO-REPOSITORIO>
   cd psico
   ```

2. **Inicie um servidor web:**

   Usando Node.js (`serve`):
   ```bash
   npx serve .
   ```
   Usando Python:
   ```bash
   python3 -m http.server
   ```
   Ou use a extensão **Live Server** no VS Code.

3. **Acesse no navegador:**
   Abra `http://localhost:3000` ou `http://localhost:8000` (porta informada pelo servidor).

---

## 📁 Estrutura do Projeto

```
psico/
├── index.html      # Estrutura HTML da página principal e menu de seleção de testes
├── styles.css      # Estilização e layout da grade, folhas A4 e UI geral
├── app.js          # Lógica dos testes AC, AD e AA (grade, timer, pontuação)
├── tedif2.js       # Lógica do TEDIF 2 (círculos aninhados, 4 períodos)
├── tedif3.js       # Lógica do TEDIF 3 (polígonos aninhados, 4 períodos)
├── figuras.js      # Biblioteca de figuras geométricas em SVG (G1–G5 e variações)
├── config.js       # Parâmetros configuráveis de todos os testes
├── manifest.json   # Configuração do PWA (nome, ícone, display)
├── sw.js           # Service Worker para cache offline
└── icon.svg        # Ícone do aplicativo
```

---

## 🔀 Branches e Fluxo de Trabalho

A branch `main` contém o código em produção, hospedado e acessível pelo link acima.

O desenvolvimento de novas funcionalidades e testes é feito em branches separadas.

---

## 💬 Discussões — Reporte Bugs, Experiências e Sugestões

A aba **[Discussions](../../discussions)** deste repositório é o espaço aberto para comunicação entre usuários, avaliadores e colaboradores do projeto. Use-a para:

### 🐛 Reportar Bugs
Encontrou um comportamento inesperado? Abra uma discussão na categoria **"Bug Report"** descrevendo:
- O que aconteceu e o que era esperado
- Em qual teste e dispositivo o problema ocorreu
- Passos para reproduzir o erro (se possível, com print ou vídeo)

### 🧪 Compartilhar Experiências
Utilizou os testes em uma avaliação clínica ou pesquisa? Compartilhe na categoria **"Experiências"**:
- Relato de uso em contexto clínico ou educacional
- Feedback sobre usabilidade em diferentes dispositivos
- Observações sobre comportamento dos avaliados

### 💡 Sugestões de Melhoria
Tem ideias para novos testes, novas figuras ou melhorias na interface? Abra uma discussão em **"Ideias / Sugestões"** com:
- Descrição detalhada da melhoria proposta
- Justificativa clínica ou técnica (se aplicável)
- Exemplos ou referências

> **Como acessar:** Clique na aba **"Discussions"** no topo deste repositório no GitHub, ou acesse diretamente em `https://github.com/<usuario>/<repositorio>/discussions`.

---

## 📄 Referências

- Rueda, F. J. M. (2013). *Bateria Psicológica para Avaliação da Atenção (BPA)*. Casa do Psicólogo.
- Rueda, F. J. M. (2010). *Teste de Atenção Concentrada (AC)*. Vetor Editora.
