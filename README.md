
# Loja de Sinalização de Segurança

Este é um projeto de E-commerce para venda de placas de sinalização de segurança e trânsito, desenvolvido com React, Vite e Tailwind CSS.

## 🚀 Funcionalidades

- **Catálogo Interativo:** Placas de Aviso, Perigo, Obrigatório, Emergência e Trânsito.
- **Personalização:** Escolha de materiais (Vinil, PVC, ACM) e tamanhos.
- **Carrinho de Compras:** Sistema de carrinho persistente.
- **Checkout via WhatsApp:** Envia o pedido formatado diretamente para o WhatsApp do vendedor.
- **Painel Admin (Client-Side):** 
  - Edição de títulos e descrições.
  - Upload de logos e imagens das placas.
  - Sistema de Backup/Restauração (JSON) para persistência de dados.
  - Suporte a links do Google Drive para imagens.

## 🛠️ Tecnologias

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📦 Como rodar localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   ```

2. Entre na pasta:
   ```bash
   cd sinalizacao-seguranca
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Rode o projeto:
   ```bash
   npm run dev
   ```

## ☁️ Como publicar (Deploy)

A maneira mais fácil é usar a **Vercel**:

1. Suba este código para o seu GitHub.
2. Acesse [Vercel](https://vercel.com).
3. Clique em **Add New Project**.
4. Importe seu repositório do GitHub.
5. A Vercel detectará automaticamente as configurações (Vite).
6. Clique em **Deploy**.

## ⚠️ Importante sobre os Dados

Como este projeto utiliza `localStorage` para salvar as edições (imagens, preços, novos produtos):
1. Ao publicar, o site iniciará com os dados padrão.
2. Use o botão **"Restaurar"** no topo do site publicado e carregue o arquivo de backup `.json` gerado no ambiente de desenvolvimento.
