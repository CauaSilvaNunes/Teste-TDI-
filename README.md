# Teste Neuropsicológico de Atenção

Este projeto é uma aplicação web para a realização de um teste neuropsicológico de atenção (metodologia de Fabián Javier). A aplicação consiste em uma grade 20x20 de figuras geométricas abstratas com um design estritamente monocromático (preto e branco), projetado para um ambiente de teste padronizado.

## 🔗 Link de Acesso

O site está disponível online e pode ser acessado através do seguinte link:
**[Acessar o site](https://teste-tdi.vercel.app/)**

Ele pode se tornar um aplicativo para tablets e rodar offline ao adicionar um atalho para a tela de inicio com o botão de
"instalar o app" do seu navegador.

## ✨ Funcionalidades Principais

- **Grade de Figuras:** Matriz de figuras geométricas (como losangos, retângulos cortados, etc).
- **Design Monocromático:** Foco total na avaliação da atenção, sem distrações de cores ou animações de feedback na seleção.
- **PWA e Suporte Offline:** O site pode ser instalado em tablets ou dispositivos móveis (como PWA) e executado de forma offline e portátil, ideal para aplicações de testes in-loco.
- **Leve e Estático:** Desenvolvido puramente com HTML, CSS (Vanilla) e JavaScript, garantindo alta performance e compatibilidade.

## 🛠 Como Executar Localmente

Como o projeto é estático, você pode executá-lo com qualquer servidor web local simples.

1. **Clone o repositório:**
   ```bash
   git clone <URL-DO-REPOSITORIO>
   cd psico
   ```

2. **Inicie um servidor web:**
   Você pode usar extensões como *Live Server* no VSCode, ou executar um dos comandos abaixo na raiz do projeto:

   Usando Node.js (`serve`):
   ```bash
   npx serve .
   ```
   Usando Python:
   ```bash
   python3 -m http.server
   ```

3. **Acesse no navegador:**
   Abra `http://localhost:3000` ou `http://localhost:8000` (ou a porta informada pelo servidor local).

## 📁 Estrutura do Projeto

- `index.html`: A estrutura HTML da página principal.
- `styles.css`: Estilização e layout da grade.
- `app.js`: Lógica principal do aplicativo (avaliação, contagem, etc).
- `figuras.js`: Biblioteca que define as regras lógicas e a renderização (SVG) para as diferentes figuras geométricas (vazadas, complexas, invertidas).
- `manifest.json` & `sw.js` & `icon.svg`: Arquivos de configuração de PWA e Service Worker necessários para rodar a aplicação em tablets e em modo offline.

## 🔀 Branches e Fluxo de Trabalho

A migração de suporte offline (PWA) e adaptações para tablet estão consolidadas. Este repositório mantém a branch `main` como o código em produção atualizado, hospedado e pronto para uso pelo link de acesso.


Colocar os 