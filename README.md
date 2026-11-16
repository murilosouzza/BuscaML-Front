# BuscaML — Front-end

Site em HTML, CSS e JavaScript puro (sem framework) que mostra os **mais vendidos do Mercado Livre** e permite buscar por texto ou por categoria. Consome a [BuscaML API](https://github.com/murilosouzza/Busca_ML-API).

## Como rodar

Este front **não funciona sozinho**: ele precisa da API rodando em `http://localhost:5102`.

1. Suba o back primeiro, seguindo o README dele: https://github.com/murilosouzza/Busca_ML-API
   (precisa de PostgreSQL; sem credenciais do Mercado Livre a API roda com dados de exemplo).
2. Sirva esta pasta com um servidor estático (não abra os `.html` com duplo clique):
   - **VS Code**: extensão *Live Server* → botão direito em `home.html` → *Open with Live Server*
   - **ou**: `npx http-server -p 5500 .`
3. Abra `home.html` no navegador.

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

## Limitações conhecidas

- A seta `›` no canto da imagem do card é só visual: a API devolve uma única imagem por produto.
