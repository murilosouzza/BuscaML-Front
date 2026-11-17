
// ÍCONES SVG REUTILIZADOS NOS CARDS DOS PRODUTOS
const ICONS = {

  verified: `
    <svg viewBox="0 0 24 24" fill="currentColor">

      <path d="M12 2l2.4 2.2 3.2-.5 1 3.1 3 1.3-1 3.2
        1 3.2-3 1.3-1 3.1-3.2-.5L12 22l-2.4-2.2-3.2.5
        -1-3.1-3-1.3 1-3.2-1-3.2 3-1.3 1-3.1 3.2.5L12 2z"/>

      <path
        d="M9 12l2 2 4-4"
        stroke="#fff"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

    </svg>
  `,

  star: `
    <svg viewBox="0 0 24 24" fill="currentColor">

      <path d="M12 2l2.9 6.3 6.9.7-5.2 4.7
        1.5 6.8-6.1-3.6-6.1 3.6
        1.5-6.8-5.2-4.7 6.9-.7L12 2z"/>

    </svg>
  `,

  refresh: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >

      <polyline points="1 4 1 10 7 10"/>
      <polyline points="23 20 23 14 17 14"/>

      <path d="M3.5 9a9 9 0 0114.6-3.4L23 10"/>
      <path d="M1 14l4.9 4.4A9 9 0 0020.5 15"/>

    </svg>
  `,

  bolt: `
    <svg viewBox="0 0 24 24" fill="currentColor">

      <path d="M13 2L3 14h7l-1 8 11-13h-7l0-7z"/>

    </svg>
  `,

  heart: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >

      <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 5.5
        5.5 5.5 0 0121.5 12c-2.5 4.5-9.5 9-9.5 9z"/>

    </svg>
  `
};

// CATEGORIAS DA HOME
// "id" é o código oficial da categoria no Mercado Livre: é com ele que o back
// busca os mais vendidos daquela categoria (GET /api/categorias/{id}/mais-vendidos).
const CATEGORIES = [

  {
    name: "Games",
    id: "MLB1144",
    icon: '<img src="icones/game.png" alt="">'
  },

  {
    name: "Eletrodomésticos",
    id: "MLB5726",
    icon: '<img src="icones/eletrodomestico.png" alt="">'
  },

  {
    name: "Ferramentas",
    id: "MLB263532",
    icon: '<img src="icones/caixa-de-ferramentas.png" alt="">'
  },

  {
    name: "Beleza e Cuidado Pessoal",
    id: "MLB1246",
    icon: '<img src="icones/perfume.png" alt="">'
  },

  {
    name: "Celulares e Telefones",
    id: "MLB1051",
    icon: '<img src="icones/smartphone.png" alt="">'
  },

  {
    name: "Informática",
    id: "MLB1648",
    icon: '<img src="icones/informatica.png" alt="">'
  },

  {
    name: "Eletrônicos, Áudio e Vídeo",
    id: "MLB1000",
    icon: '<img src="icones/eletronicos.png" alt="">'
  },

  {
    name: "Esportes e Fitness",
    id: "MLB1276",
    icon: '<img src="icones/esporte.png" alt="">'
  },

  {
    name: "Calçados, Roupas e Bolsas",
    id: "MLB1430",
    icon: '<img src="icones/roupa.png" alt="">'
  },

  {
    name: "Acessórios para Veículos",
    id: "MLB5672",
    icon: '<img src="icones/veiculo.png" alt="">'
  }

];

// CONEXÃO COM A API
// Front e back rodam separados: o front (Live Server, VS Code, etc.) chama
// o back nesse endereço. Se o endereço do back mudar, só ajustar aqui.
const API_BASE = "http://localhost:5102";

// Os títulos reais do Mercado Livre têm aspas e símbolos (ex.: Tela 15,6" FHD).
// Sem escapar, eles quebram o HTML do card (o alt="..." fecha no meio do título).
function escapeHtml(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
// ARMAZENAMENTO LOCAL
// Favoritos, histórico de buscas e nome do perfil ficam só neste navegador (localStorage).
const STORAGE_KEYS = {
  favoritos: "buscaml:favoritos",
  historico: "buscaml:historico",
  perfil: "buscaml:perfil"
};

const LIMITE_HISTORICO = 10;

// Produtos já desenhados na tela, por id. É daqui que o botão de favoritar
// tira o produto completo pra guardar.
const produtosPorId = new Map();

function lerStorage(chave, padrao) {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : padrao;
  } catch (err) {
    return padrao;
  }
}

function gravarStorage(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch (err) {
    console.warn("Não foi possível salvar neste navegador:", err);
    return false;
  }
}

function removerStorage(chave) {
  try {
    localStorage.removeItem(chave);
  } catch (err) {
    console.warn("Não foi possível apagar dados deste navegador:", err);
  }
}

// FAVORITOS
function listarFavoritos() {
  const lista = lerStorage(STORAGE_KEYS.favoritos, []);
  return Array.isArray(lista) ? lista : [];
}

function isFavorito(id) {
  return listarFavoritos().some(p => p.id === id);
}

// Favorita ou desfavorita. Devolve true (virou favorito), false (saiu dos favoritos)
// ou null quando o produto não está na tela e por isso não dá pra guardar.
function alternarFavorito(id) {
  const favoritos = listarFavoritos();
  const indice = favoritos.findIndex(p => p.id === id);

  if (indice >= 0) {
    favoritos.splice(indice, 1);
    gravarStorage(STORAGE_KEYS.favoritos, favoritos);
    atualizarContadorFavoritos();
    return false;
  }

  const produto = produtosPorId.get(id);
  if (!produto) {
    return null;
  }

  favoritos.unshift(produto);
  gravarStorage(STORAGE_KEYS.favoritos, favoritos);
  atualizarContadorFavoritos();
  return true;
}

function atualizarContadorFavoritos() {
  const total = listarFavoritos().length;

  document.querySelectorAll("[data-fav-count]").forEach(el => {
    el.textContent = total > 99 ? "99+" : String(total);
    el.hidden = total === 0;
  });
}

// Botão de coração do card
function favButtonHTML(p) {
  const ativo = isFavorito(p.id);

  return `
    <button
      class="fav-btn${ativo ? " is-active" : ""}"
      type="button"
      data-fav-id="${escapeHtml(p.id)}"
      aria-pressed="${ativo}"
      aria-label="${ativo ? "Remover dos favoritos" : "Adicionar aos favoritos"}"
    >
      ${ICONS.heart}
    </button>
  `;
}

// HISTÓRICO DE BUSCAS
function listarHistorico() {
  const lista = lerStorage(STORAGE_KEYS.historico, []);
  return Array.isArray(lista) ? lista : [];
}

function registrarBusca(termo) {
  const texto = (termo || "").trim();

  if (!texto) {
    return;
  }

  const historico = listarHistorico()
    .filter(t => t.toLowerCase() !== texto.toLowerCase());

  historico.unshift(texto);
  gravarStorage(STORAGE_KEYS.historico, historico.slice(0, LIMITE_HISTORICO));
}

// PERFIL
function lerNomePerfil() {
  const perfil = lerStorage(STORAGE_KEYS.perfil, {});
  return (perfil && typeof perfil.nome === "string") ? perfil.nome : "";
}

function gravarNomePerfil(nome) {
  gravarStorage(STORAGE_KEYS.perfil, { nome: nome.trim() });
}

// Traduz o produto do formato do back (pt/snake_case) pro formato que o card espera.
function mapProduto(r) {

  return {
    id: r.id,
    title: r.titulo,
    price: r.preco,
    image: r.imagem_url,
    productUrl: r.link_ml,
    freeShipping: r.frete_gratis,
    bestSeller: r.mais_vendido,
    category: r.categoria
  };
}

async function fetchProducts(query = "", categoriaId = "") {

  const termo = (query || "").trim();

  // Com id de categoria -> mais vendidos daquela categoria.
  // Com termo -> busca por texto. Sem nada -> destaques (mais vendidos em geral).
  let url = `${API_BASE}/api/produtos/destaques?quantidade=20`;

  if (categoriaId) {
    url = `${API_BASE}/api/categorias/${encodeURIComponent(categoriaId)}/mais-vendidos`;
  } else if (termo) {
    url = `${API_BASE}/api/buscar?termo=${encodeURIComponent(termo)}`;
  }

  try {

    const resp = await fetch(url);

    // 404 = nada encontrado e sem cache; trata como lista vazia.
    if (resp.status === 404) {
      return [];
    }

    if (!resp.ok) {
      console.error("Falha na API:", resp.status);
      return [];
    }

    const data = await resp.json();

    return (data.resultados || []).map(mapProduto);

  } catch (err) {

    console.error("Erro ao chamar a API (o back está rodando?):", err);
    return [];
  }
}

// FORMATAÇÃO DE PREÇOS
function formatPrice(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";
  }

  return "R$ " +
    value.toLocaleString(
      "pt-BR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );
}

// CORES PARA REPRESENTAR VARIAÇÕES DE PRODUTOS
const PALETTE_GUESS = [

  "#1c2b52",
  "#ffffff",
  "#c9a13b",
  "#7a1f1f",
  "#2e5c3e",
  "#444444",
  "#8a4b9e"

];

// CARD DO PRODUTO
function productCardHTML(p) {

  const hasDiscount =
    p.oldPrice &&
    p.discountPercent;

  const hasInstallments =
    !!p.installments;

  const colorCount =
    p.colors || 0;

  const dotsToShow =
    Math.min(colorCount, 3);

// BOLINHAS DE CORES
  const colorDotsHTML =
    colorCount > 0
      ? `
        <div class="color-dots">

          ${
            Array.from(
              { length: dotsToShow }
            )
            .map(
              (_, i) => `
                <span
                  class="color-dot"
                  style="
                    background:
                    ${PALETTE_GUESS[
                      i % PALETTE_GUESS.length
                    ]}
                  "
                ></span>
              `
            )
            .join("")
          }


          ${
            colorCount > dotsToShow

              ? `
                <span class="color-dot-count">
                  +${colorCount - dotsToShow}
                </span>
              `

              : ""
          }

        </div>
      `

      : "";

// NOTA DO PRODUTO
  const ratingHTML =
    p.rating

      ? `
        <div class="product-rating">

          ${ICONS.star}

          <span>
            ${p.rating.toFixed(1)}
          </span>

        </div>
      `

      : "";

// PREÇO ANTIGO
  const oldPriceHTML =
    hasDiscount
      ? `
        <p class="price-old">
          ${formatPrice(p.oldPrice)}
        </p>
      `

      : "";

// DESCONTO
  const discountBadgeHTML =
    hasDiscount

      ? `
        <span class="price-discount">
          ${p.discountPercent}% OFF
        </span>

        <span class="price-pix">
          no Pix
        </span>
      `

      : "";

// PARCELAMENTO
  const installmentsHTML =
    hasInstallments
      ? `
        <p class="installments">

          ou

          <strong>
            ${formatPrice(p.price)}
          </strong>

          em

          <span class="in-green">

            ${p.installments.count}x

            ${formatPrice(
              p.installments.value
            )}

            ${
              p.installments.noInterest
                ? " sem juros"
                : ""
            }

          </span>

        </p>
      `

      : "";

// PLANO DE TROCA
  const tradeInHTML =
    p.tradeIn

      ? `
        <p class="trade-in">

          ${ICONS.refresh}

          Poupe com o Plano de troca

        </p>
      `

      : "";

// FRETE GRÁTIS
  const freeShippingHTML =
    p.freeShipping
      ? `
        <p class="free-shipping">

          ${ICONS.bolt}

          Frete grátis

          ${
            p.full
              ? `
                <span class="full-tag">
                  FULL
                </span>
              `
              : ""
          }

        </p>
      `

      : "";

// SELO DE MAIS VENDIDO
  const bestSellerHTML =
    p.bestSeller
      ? `
        <span class="best-seller-tag">
          Mais vendido
        </span>
      `
      : "";

// PRODUTO PATROCINADO
  const adTagHTML =
    p.sponsored

      ? `
        <span class="ad-tag">
          Ad
        </span>
      `

      : "";

// MARCA
  const brandHTML =
    p.brand
      ? `
        <p class="product-brand">

          ${escapeHtml(p.brand)}

          ${
            p.verifiedBrand
              ? ICONS.verified
              : ""
          }

        </p>
      `

      : "";

// LINK PARA O MERCADO LIVRE
  const ctaHTML = `

    <a
      class="product-cta"
      href="${escapeHtml(p.productUrl || "#")}"
      target="_blank"
      rel="noopener noreferrer"
    >
      Clique para ver produto
    </a>

  `;

// ESTRUTURA FINAL DO CARD
  return `

    <article
      class="product-card"
      data-id="${escapeHtml(p.id)}"
    >

      <div class="product-media">

        <img
          class="product-image"
          src="${escapeHtml(p.image)}"
          alt="${escapeHtml(p.title)}"
          loading="lazy"
        >

        ${bestSellerHTML}

        ${favButtonHTML(p)}

        ${colorDotsHTML}

        ${adTagHTML}

      </div>

      <div class="product-body">

        <h3 class="product-title">
          ${escapeHtml(p.title)}
        </h3>

        ${brandHTML}

        ${ratingHTML}

        ${oldPriceHTML}

        <div class="price-row">

          <span class="price-new">
            ${formatPrice(p.price)}
          </span>

          ${discountBadgeHTML}

        </div>

        ${installmentsHTML}

        ${tradeInHTML}

        ${freeShippingHTML}

        ${ctaHTML}

      </div>
    </article>

  `;
}

// RENDERIZAÇÃO DOS PRODUTOS
function renderProducts(
  products,
  containerEl
) {

  if (
    !products ||
    products.length === 0
  ) {

    containerEl.innerHTML = `

      <p
        style="
          grid-column:1/-1;
          color:#8a8a8a;
          padding:24px 0;
        "
      >
        Nenhum produto encontrado.
        Tente outra busca ou verifique se a API está no ar.
      </p>

    `;

    return;
  }

  products.forEach(p => produtosPorId.set(p.id, p));

  containerEl.innerHTML =
    products
      .map(productCardHTML)
      .join("");
}

// RENDERIZAÇÃO DAS CATEGORIAS
function renderCategories() {

  const row =
    document.getElementById(
      "categoriesRow"
    );


  if (!row) {
    return;
  }

  // Na página de busca por categoria, a pílula da categoria atual fica destacada.
  const paramsUrl = new URLSearchParams(window.location.search);
  const categoriaAtivaId =
    paramsUrl.get("q")
      ? ""
      : (paramsUrl.get("categoriaId") || "");

  row.innerHTML =
    CATEGORIES
      .map(
        cat => `

          <button
            class="category-pill${cat.id === categoriaAtivaId ? " is-active" : ""}"
            data-category="${cat.name}"
            data-category-id="${cat.id}"
            type="button"
          >

            ${cat.icon}

            <span>
              ${cat.name}
            </span>

          </button>

        `
      )
      .join("");

  const pilulaAtiva = row.querySelector(".category-pill.is-active");

  if (pilulaAtiva) {

    const centralizar = () => {
      pilulaAtiva.scrollIntoView({ inline: "center", block: "nearest", behavior: "instant" });
    };

    centralizar();

    // Fontes e ícones terminam de carregar depois e deixam a faixa um pouco mais larga:
    // recentraliza quando a página termina de carregar.
    if (document.readyState !== "complete") {
      window.addEventListener("load", centralizar);
    }
  }
}

// ELEMENTOS DA HOME
const categoriesRow =
  document.getElementById(
    "categoriesRow"
  );

const homeGrid =
  document.getElementById(
    "homeProductGrid"
  );

const homeSearchForm =
  document.getElementById(
    "homeSearchForm"
  );

const homeSearchInput =
  document.getElementById(
    "homeSearchInput"
  );

// BUSCA DA HOME
if (homeSearchForm) {

  homeSearchForm.addEventListener(
    "submit",
    (e) => {

      e.preventDefault();

      const q =
        (
          homeSearchInput.value || ""
        ).trim();

      window.location.href =
        q

          ? `busca.html?q=${encodeURIComponent(q)}`

          : "busca.html";
    }
  );
}

// CATEGORIAS DA HOME
if (categoriesRow) {

  renderCategories();

  categoriesRow.addEventListener(
    "click",
    (e) => {

      const pill =
        e.target.closest(
          ".category-pill"
        );


      if (!pill) {
        return;
      }

      e.preventDefault();

      window.location.href =
        `busca.html?categoria=${
          encodeURIComponent(
            pill.dataset.category
          )
        }&categoriaId=${
          encodeURIComponent(
            pill.dataset.categoryId
          )
        }`;
    }
  );
}

// SETAS DE NAVEGAÇÃO DAS CATEGORIAS
const categoryPrev =
  document.getElementById(
    "categoryPrev"
  );

const categoryNext =
  document.getElementById(
    "categoryNext"
  );

if (
  categoryPrev &&
  categoriesRow
) {

  categoryPrev.addEventListener(
    "click",
    () => {

      categoriesRow.scrollBy({

        left: -350,

        behavior: "smooth"

      });
    }
  );
}

if (
  categoryNext &&
  categoriesRow
) {

  categoryNext.addEventListener(
    "click",
    () => {

      categoriesRow.scrollBy({

        left: 350,
        behavior: "smooth"

      });
    }
  );
}

// PRODUTOS DA HOME
if (homeGrid) {

  fetchProducts()
    .then(
      produtos => {

        renderProducts(
          produtos,
          homeGrid
        );
      }
    );
}

// ELEMENTOS DA PÁGINA DE RESULTADOS
const searchGrid =
  document.getElementById(
    "searchProductGrid"
  );

const resultsSearchForm =
  document.getElementById(
    "resultsSearchForm"
  );

const resultsSearchInputEl =
  document.getElementById(
    "resultsSearchInput"
  );

// BUSCA DA PÁGINA DE RESULTADOS
if (resultsSearchForm) {

  resultsSearchForm.addEventListener(
    "submit",
    (e) => {

      e.preventDefault();

      const q =
        (
          resultsSearchInputEl.value || ""
        ).trim();

      window.location.href =
        q

          ? `busca.html?q=${encodeURIComponent(q)}`

          : "busca.html";
    }
  );
}

// RESULTADOS DA BUSCA
if (searchGrid) {

  const resultCountEl =
    document.getElementById(
      "resultCount"
    );

  const resultsSearchInput =
    document.getElementById(
      "resultsSearchInput"
    );

// LÊ OS PARÂMETROS DA URL
  const params =
    new URLSearchParams(
      window.location.search
    );

  const query =
    params.get("q") || "";

  const categoria =
    params.get("categoria") || "";

  // Se a pessoa digitou uma busca, ela vale mais que a categoria da URL.
  const categoriaId =
    query
      ? ""
      : (params.get("categoriaId") || "");

  const termo =
    query || categoria;

// PREENCHE A BUSCA
  if (resultsSearchInput) {

    resultsSearchInput.value =
      query;

  }

// TEXTO INICIAL
  resultCountEl.textContent =
    termo

      ? `Resultados para "${termo}"`
      : "Resultados";

// BUSCA OS PRODUTOS
// Categoria com id -> mais vendidos dela. Se vier vazio (categoria sem ranking
// no Mercado Livre), cai na busca por texto usando o nome da categoria.
  let veioDoRanking =
    !!categoriaId;

  const buscar =
    categoriaId
      ? fetchProducts("", categoriaId)
          .then(
            produtos => {
              if (produtos.length > 0) {
                return produtos;
              }
              veioDoRanking = false;
              return fetchProducts(termo);
            }
          )
      : fetchProducts(termo);

  buscar

    .then(
      produtos => {

        resultCountEl.textContent =
          veioDoRanking

            ? `${produtos.length} mais vendido${
                produtos.length !== 1
                  ? "s"
                  : ""
              } em "${categoria}"`

          : termo

            ? `${produtos.length} resultado${
                produtos.length !== 1
                  ? "s"
                  : ""
              } para "${termo}"`

            : `${produtos.length} resultado${
                produtos.length !== 1
                  ? "s"
                  : ""
              }`;

        renderProducts(
          produtos,
          searchGrid
        );
      }
    );
}


// ---------------------------------------------------------------------------
// NAVEGAÇÃO, FAVORITOS, CATEGORIAS E PERFIL
// ---------------------------------------------------------------------------

// Página de cada item do menu (barra inferior no celular, ícones no cabeçalho).
const ROTAS = {
  inicio: "home.html",
  categorias: "categorias.html",
  favoritos: "favoritos.html",
  perfil: "perfil.html"
};

// Qual item do menu fica destacado em cada página.
const MENU_DA_PAGINA = {
  "home.html": "inicio",
  "categorias.html": "categorias",
  "favoritos.html": "favoritos",
  "perfil.html": "perfil"
};

function configurarNavegacao() {

  document.querySelectorAll(".nav-item[data-nav]").forEach(item => {
    item.addEventListener("click", () => {
      window.location.href = ROTAS[item.dataset.nav] || ROTAS.inicio;
    });
  });

  const favoritesBtn = document.getElementById("favoritesBtn");
  if (favoritesBtn) {
    favoritesBtn.addEventListener("click", () => {
      window.location.href = ROTAS.favoritos;
    });
  }

  const profileBtn = document.getElementById("profileBtn");
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      window.location.href = ROTAS.perfil;
    });
  }

  const arquivo = window.location.pathname.split("/").pop() || "home.html";
  const ativo = MENU_DA_PAGINA[arquivo];

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.toggle("active", item.dataset.nav === ativo);
  });
}

configurarNavegacao();
atualizarContadorFavoritos();

// Guarda no histórico tudo que a pessoa busca pelas barras de pesquisa.
document.querySelectorAll('form[role="search"]').forEach(form => {
  form.addEventListener("submit", () => {
    const campo = form.querySelector('input[name="q"]');
    registrarBusca(campo ? campo.value : "");
  });
});

// Clique no coração de qualquer card (os cards são criados depois, por isso delegação).
document.addEventListener("click", (e) => {

  const botao = e.target.closest(".fav-btn");

  if (!botao) {
    return;
  }

  e.preventDefault();

  const agoraFavorito = alternarFavorito(botao.dataset.favId);

  if (agoraFavorito === null) {
    return;
  }

  botao.classList.toggle("is-active", agoraFavorito);
  botao.setAttribute("aria-pressed", String(agoraFavorito));
  botao.setAttribute(
    "aria-label",
    agoraFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"
  );

  // Na página de favoritos, desfavoritar tira o card da lista.
  if (!agoraFavorito && document.getElementById("favoritesGrid")) {
    renderFavoritos();
  }
});

// PÁGINA DE CATEGORIAS
const categoriesGrid = document.getElementById("categoriesGrid");

if (categoriesGrid) {

  categoriesGrid.innerHTML =
    CATEGORIES
      .map(
        cat => `

          <a
            class="category-tile"
            href="busca.html?categoria=${encodeURIComponent(cat.name)}&categoriaId=${encodeURIComponent(cat.id)}"
          >

            ${cat.icon}

            <span>
              ${cat.name}
            </span>

          </a>

        `
      )
      .join("");
}

// PÁGINA DE FAVORITOS
function renderFavoritos() {

  const grid = document.getElementById("favoritesGrid");
  const contagem = document.getElementById("favoritesCount");

  if (!grid || !contagem) {
    return;
  }

  const favoritos = listarFavoritos();

  if (favoritos.length === 0) {

    contagem.textContent = "";

    grid.innerHTML = `

      <div class="empty-state">
        <strong>Você ainda não favoritou nada</strong>
        Toque no coração de um produto pra guardá-lo aqui.
        <br>
        <a href="home.html">Ver os mais vendidos</a>
      </div>

    `;

    return;
  }

  contagem.textContent =
    `${favoritos.length} produto${favoritos.length !== 1 ? "s" : ""} favoritado${favoritos.length !== 1 ? "s" : ""}. ` +
    "Os preços podem ter mudado desde que você favoritou.";

  renderProducts(favoritos, grid);
}

if (document.getElementById("favoritesGrid")) {
  renderFavoritos();
}

// PÁGINA DE PERFIL
const profileName = document.getElementById("profileName");

function renderPerfil() {

  const nome = lerNomePerfil();

  const avatar = document.getElementById("profileAvatar");
  if (avatar) {
    avatar.textContent = nome ? nome.charAt(0).toUpperCase() : "?";
  }

  const titulo = document.getElementById("profileTitle");
  if (titulo) {
    titulo.textContent = nome ? `Olá, ${nome}` : "Perfil";
  }

  const historico = listarHistorico();

  const statFavoritos = document.getElementById("statFavoritos");
  if (statFavoritos) {
    statFavoritos.textContent = String(listarFavoritos().length);
  }

  const statBuscas = document.getElementById("statBuscas");
  if (statBuscas) {
    statBuscas.textContent = String(historico.length);
  }

  const lista = document.getElementById("historyList");
  if (lista) {
    lista.innerHTML =
      historico.length === 0
        ? '<p class="profile-note">Suas buscas recentes aparecem aqui.</p>'
        : historico
            .map(
              termo => `
                <a class="chip" href="busca.html?q=${encodeURIComponent(termo)}">
                  ${escapeHtml(termo)}
                </a>
              `
            )
            .join("");
  }
}

if (profileName) {

  profileName.value = lerNomePerfil();
  renderPerfil();

  let avisoTimer = null;

  profileName.addEventListener("input", () => {

    gravarNomePerfil(profileName.value);
    renderPerfil();

    const aviso = document.getElementById("profileSaved");
    if (aviso) {
      aviso.hidden = false;
      clearTimeout(avisoTimer);
      avisoTimer = setTimeout(() => { aviso.hidden = true; }, 1500);
    }
  });

  const limparHistorico = document.getElementById("clearHistory");
  if (limparHistorico) {
    limparHistorico.addEventListener("click", () => {
      removerStorage(STORAGE_KEYS.historico);
      renderPerfil();
    });
  }

  const limparTudo = document.getElementById("clearAll");
  if (limparTudo) {
    limparTudo.addEventListener("click", () => {

      if (!window.confirm("Apagar seus favoritos, seu histórico e seu nome deste navegador?")) {
        return;
      }

      Object.values(STORAGE_KEYS).forEach(removerStorage);
      profileName.value = "";
      renderPerfil();
      atualizarContadorFavoritos();
    });
  }
}
