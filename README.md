# BuscaML — Front-end

Site em HTML, CSS e JavaScript puro (sem framework) que consome a [BuscaML API](https://github.com/murilosouzza/BuscaML_API).

## Como rodar

Este front **não funciona sozinho** — ele precisa da API rodando em `http://localhost:5102`.

1. Clone e rode o back primeiro: https://github.com/murilosouzza/BuscaML_API
2. Sirva esta pasta com um servidor estático (não abra os `.html` direto com duplo clique):
   - **VS Code**: extensão *Live Server* → botão direito em `home.html` → "Open with Live Server"
   - **ou**: `npx http-server -p 5500 .`
3. Abra `home.html` (ou `busca.html`) no navegador.

O endereço da API está fixado em [`app.js`](app.js), na constante `API_BASE`:

```js
const API_BASE = "http://localhost:5102";
```

Se a API rodar em outro endereço, é só trocar essa linha.

## Estrutura

```
home.html     página inicial (destaques + categorias)
busca.html    página de resultado de busca
app.js        toda a lógica: renderização dos cards e chamadas à API
styles.css    estilos
icones/       ícones das categorias
```

## Páginas

- `home.html` — mostra os produtos em destaque (`GET /api/produtos/destaques`)
- `busca.html?q=termo` — busca por texto (`GET /api/buscar?termo=`)
- `busca.html?categoria=Nome` — busca pelo nome da categoria
