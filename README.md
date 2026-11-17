# BuscaML — Front-end...

Site em HTML, CSS e JavaScript puro (sem framework) que mostra os **mais vendidos do Mercado Livre** e permite buscar por texto ou por categoria. Consome a [BuscaML API](https://github.com/murilosouzza/Busca_ML-API).

## Como rodar

Este front **não funciona sozinho**: ele precisa da API rodando em `http://localhost:5102`.

1. Suba o back primeiro, seguindo o README dele: https://github.com/murilosouzza/Busca_ML-API
   (precisa de PostgreSQL; sem credenciais do Mercado Livre a API roda com dados de exemplo).
2. Abra o site de um destes jeitos:
   - **Mais simples (Chrome ou Edge):** dê dois cliques em `home.html`. Não precisa de servidor.
   - **Com servidor local:** extensão *Live Server* do VS Code (botão direito em `home.html` → *Open with Live Server*) ou, no terminal, `npx http-server -p 5500 .` e abra `http://127.0.0.1:5500/home.html`.

O endereço da API fica na constante `API_BASE`, no começo de [`app.js`](app.js):

```js
const API_BASE = "http://localhost:5102";
```

Se a API rodar em outro endereço, é só trocar essa linha.

## Páginas

| Página | O que mostra | Chamada à API |
|---|---|---|
| `home.html` | Mais vendidos em alta e atalhos de categorias | `GET /api/produtos/destaques?quantidade=20` |
| `busca.html?q=termo` | Resultado da busca por texto | `GET /api/buscar?termo=` |
| `busca.html?categoria=Nome&categoriaId=MLB1000` | Mais vendidos da categoria (se vier vazio, busca pelo nome dela) | `GET /api/categorias/{id}/mais-vendidos` |
| `categorias.html` | As 10 categorias em grade | — |
| `favoritos.html` | Os produtos que você favoritou | — |
| `perfil.html` | Nome, contadores, buscas recentes e botão de apagar dados | — |

Na página de busca, a faixa de categorias (com os ícones) fica no topo e funciona como filtro: clicar em outra categoria troca o resultado, e a categoria atual aparece destacada.

No computador, Favoritos e Perfil ficam nos ícones do cabeçalho. No celular, na barra inferior.

## Favoritos, histórico e perfil

Ficam no `localStorage` do navegador (chaves `buscaml:favoritos`, `buscaml:historico` e `buscaml:perfil`):
sem cadastro, sem login e sem enviar nada pro servidor.

- Cada navegador (e cada endereço, como `localhost` e `127.0.0.1`) guarda os seus.
- O preço de um favorito é o da hora em que ele foi favoritado.
- O botão **Apagar todos os meus dados**, no perfil, limpa tudo.

## Estrutura

```
home.html        página inicial (destaques + categorias)
busca.html       resultado de busca por texto ou por categoria
categorias.html  lista de categorias
favoritos.html   produtos favoritados
perfil.html      perfil local
app.js           toda a lógica: cards, chamadas à API, favoritos, histórico e perfil
styles.css       estilos
icones/          ícones das categorias
```

## Problemas comuns

- **`ERR_CONNECTION_REFUSED` ao abrir ou navegar** (por exemplo em `127.0.0.1:5500`): o servidor local do site não está rodando. Abra o `home.html` direto (dois cliques) ou rode de novo `npx http-server -p 5500 .` e deixe o terminal aberto.
- **"Nenhum produto encontrado":** a API não está rodando em `http://localhost:5102`. Suba o back primeiro.
