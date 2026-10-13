
const products = [
  {
    id: 1,
    name: "Headphone Studio Wireless",
    category: "Áudio",
    price: 249.90,
    oldPrice: 329.90,
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
    badge: "MAIS VENDIDO",
    tags: ["Ofertas", "Mais vendidos"],
    installments: "ou 3x de R$ 83,30 sem juros"
  },
  {
    id: 2,
    name: "Mouse Precision Wireless",
    category: "Acessórios",
    price: 159.90,
    oldPrice: 199.90,
    rating: 4.8,
    reviews: 86,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=700&q=80",
    badge: "−20%",
    tags: ["Ofertas", "Mais vendidos"],
    installments: "ou 3x de R$ 53,30 sem juros"
  },
  {
    id: 3,
    name: "Notebook Essential Pro",
    category: "Informática",
    price: 3299.90,
    oldPrice: null,
    rating: 4.9,
    reviews: 54,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80",
    badge: "DESTAQUE",
    tags: ["Mais vendidos"],
    installments: "ou 12x de R$ 274,99"
  },
  {
    id: 4,
    name: "Smartphone Next Generation",
    category: "Celulares",
    price: 1899.90,
    oldPrice: 2199.90,
    rating: 4.7,
    reviews: 73,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80",
    badge: "−13%",
    tags: ["Ofertas", "Novidades"],
    installments: "ou 12x de R$ 158,33"
  },
  {
    id: 5,
    name: "Teclado Mecânico RGB",
    category: "Acessórios",
    price: 289.90,
    oldPrice: null,
    rating: 4.8,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=700&q=80",
    badge: "NOVIDADE",
    tags: ["Novidades"],
    installments: "ou 3x de R$ 96,63 sem juros"
  },
  {
    id: 6,
    name: "Smartwatch Active Series",
    category: "Acessórios",
    price: 399.90,
    oldPrice: 459.90,
    rating: 4.6,
    reviews: 91,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
    badge: "−13%",
    tags: ["Ofertas", "Mais vendidos"],
    installments: "ou 4x de R$ 99,98 sem juros"
  },
  {
    id: 7,
    name: "Headphone Minimal Black",
    category: "Áudio",
    price: 199.90,
    oldPrice: null,
    rating: 4.7,
    reviews: 36,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=80",
    badge: "NOVIDADE",
    tags: ["Novidades"],
    installments: "ou 3x de R$ 66,63 sem juros"
  },
  {
    id: 8,
    name: "Câmera Digital Compact",
    category: "Eletrônicos",
    price: 749.90,
    oldPrice: 899.90,
    rating: 4.8,
    reviews: 29,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80",
    badge: "−17%",
    tags: ["Ofertas"],
    installments: "ou 6x de R$ 124,98 sem juros"
  }
];

// Estado da loja

const STORAGE = {
  cart: "shoptech_cart",
  favorites: "shoptech_favorites"
};

function loadStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

let cart = loadStorage(STORAGE.cart, []);
let favorites = loadStorage(STORAGE.favorites, []);
let currentFilter = "Todos";
let currentSearch = "";
let favoritesOnly = false;

const $ = (selector) => document.querySelector(selector);

const productsGrid = $("#productsGrid");
const resultsInfo = $("#resultsInfo");
const emptyState = $("#emptyState");
const cartDrawer = $("#cartDrawer");
const drawerBackdrop = $("#drawerBackdrop");
const cartItems = $("#cartItems");
const cartFooter = $("#cartFooter");
const cartEmpty = $("#cartEmpty");
const toastElement = $("#toast");

const money = (value) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

function saveState() {
  localStorage.setItem(STORAGE.cart, JSON.stringify(cart));
  localStorage.setItem(STORAGE.favorites, JSON.stringify(favorites));
}

let toastTimeout;

function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toastElement.classList.remove("show");
  }, 2600);
}

// Produtos

function getVisibleProducts() {
  let result = [...products];

  if (currentSearch) {
    const search = currentSearch.toLocaleLowerCase("pt-BR");

    result = result.filter((product) => {
      const searchable = [
        product.name,
        product.category,
        ...product.tags
      ].join(" ").toLocaleLowerCase("pt-BR");

      return searchable.includes(search);
    });
  }

  if (currentFilter !== "Todos") {
    if (currentFilter === "Informática" ||
        currentFilter === "Áudio" ||
        currentFilter === "Acessórios" ||
        currentFilter === "Celulares" ||
        currentFilter === "Eletrônicos") {
      result = result.filter(
        (product) => product.category === currentFilter
      );
    } else {
      result = result.filter(
        (product) => product.tags.includes(currentFilter)
      );
    }
  }

  if (favoritesOnly) {
    result = result.filter(
      (product) => favorites.includes(product.id)
    );
  }

  const sort = $("#sortSelect").value;

  if (sort === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }

  return result;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();

  productsGrid.innerHTML = visibleProducts.map((product) => {
    const isFavorite = favorites.includes(product.id);
    const discount = product.oldPrice
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;

    let badgeClass = "";

    if (product.badge?.includes("−")) {
      badgeClass = "sale";
    }

    const badge = product.badge
      ? `<span class="product-badge ${badgeClass}">${product.badge}</span>`
      : "";

    return `
      <article class="product-card">
        <div class="product-image">
          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
          >

          ${badge}

          <button
            class="favorite-btn ${isFavorite ? "is-favorite" : ""}"
            data-favorite="${product.id}"
            type="button"
            aria-label="${isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}: ${product.name}"
            aria-pressed="${isFavorite}"
          >${isFavorite ? "♥" : "♡"}</button>

          <button
            class="quick-add"
            data-add="${product.id}"
            type="button"
          >Adicionar à sacola +</button>
        </div>

        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3 class="product-name">${product.name}</h3>

          <div class="product-rating" aria-label="Avaliação ${product.rating} de 5">
            ★★★★★ <span>${product.rating.toFixed(1)} (${product.reviews})</span>
          </div>

          <div class="product-prices">
            <strong class="product-price">${money(product.price)}</strong>

            ${
              product.oldPrice
                ? `<span class="product-old-price">${money(product.oldPrice)}</span>`
                : ""
            }
          </div>

          <p class="product-payment">${product.installments}</p>

          <button
            class="mobile-buy"
            data-add="${product.id}"
            type="button"
          >Adicionar à sacola +</button>
        </div>
      </article>
    `;
  }).join("");

  const label = visibleProducts.length === 1
    ? "produto encontrado"
    : "produtos encontrados";

  resultsInfo.textContent =
    `${visibleProducts.length} ${label}` +
    (currentSearch ? ` para "${currentSearch}"` : "") +
    (favoritesOnly ? " nos seus favoritos" : "");

  productsGrid.hidden = visibleProducts.length === 0;
  emptyState.hidden = visibleProducts.length !== 0;

  updateFavoriteCount();
}

function setFilter(filter) {
  currentFilter = filter;
  favoritesOnly = false;

  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.classList.toggle(
      "selected",
      button.dataset.filter === filter
    );
  });

  $("#favoritesBtn").setAttribute("aria-pressed", "false");

  renderProducts();
}

function resetFilters() {
  currentSearch = "";
  currentFilter = "Todos";
  favoritesOnly = false;

  $("#searchInput").value = "";
  $("#sortSelect").value = "featured";

  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.classList.toggle(
      "selected",
      button.dataset.filter === "Todos"
    );
  });

  $("#favoritesBtn").setAttribute("aria-pressed", "false");

  renderProducts();
}

$("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();

  currentSearch = $("#searchInput").value.trim();
  favoritesOnly = false;

  renderProducts();
  $("#produtos").scrollIntoView({ behavior: "smooth" });
});

$("#searchInput").addEventListener("input", () => {
  currentSearch = $("#searchInput").value.trim();
  renderProducts();
});

$("#sortSelect").addEventListener("change", renderProducts);

$("#filterList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");

  if (button) {
    setFilter(button.dataset.filter);
  }
});

$("#showAll").addEventListener("click", (event) => {
  event.preventDefault();
  resetFilters();
  $("#produtos").scrollIntoView({ behavior: "smooth" });
});

$("#clearFilters").addEventListener("click", resetFilters);

// Filtros de categoria

document.querySelectorAll(".category-card").forEach((button) => {
  button.addEventListener("click", () => {
    currentSearch = "";
    $("#searchInput").value = "";

    const category = button.dataset.category;
    setFilter(category);

    $("#produtos").scrollIntoView({ behavior: "smooth" });
  });
});

// Favoritos

function updateFavoriteCount() {
  $("#favoritesCount").textContent = favorites.length;
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((favoriteId) => favoriteId !== id);
    showToast("Produto removido dos favoritos.");
  } else {
    favorites.push(id);
    showToast("Produto adicionado aos favoritos.");
  }

  saveState();
  renderProducts();
}

productsGrid.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const addButton = event.target.closest("[data-add]");

  if (favoriteButton) {
    toggleFavorite(Number(favoriteButton.dataset.favorite));
  }

  if (addButton) {
    addToCart(Number(addButton.dataset.add));
  }
});

$("#favoritesBtn").addEventListener("click", () => {
  favoritesOnly = !favoritesOnly;
  currentSearch = "";
  currentFilter = "Todos";

  $("#searchInput").value = "";

  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.classList.toggle(
      "selected",
      button.dataset.filter === "Todos"
    );
  });

  $("#favoritesBtn").setAttribute(
    "aria-pressed",
    String(favoritesOnly)
  );

  renderProducts();
  $("#produtos").scrollIntoView({ behavior: "smooth" });

  if (favoritesOnly && favorites.length === 0) {
    showToast("Você ainda não tem produtos favoritos.");
  }
});

// Carrinho

function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartSubtotal() {
  return cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.id);

    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function updateCartCount() {
  $("#cartCount").textContent = getCartQuantity();
  $("#drawerItemCount").textContent = `(${getCartQuantity()})`;
  $("#cartSubtotal").textContent = money(getCartSubtotal());
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);

  if (!product) return;

  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }

  saveState();
  renderCart();
  showToast(`${product.name} adicionado à sacola.`);
}

function changeQuantity(id, amount) {
  const item = cart.find((product) => product.id === id);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter((product) => product.id !== id);
  }

  saveState();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);

  saveState();
  renderCart();
  showToast("Produto removido da sacola.");
}

function renderCart() {
  cart = cart.filter((item) => products.some((p) => p.id === item.id));

  cartItems.innerHTML = cart.map((item) => {
    const product = products.find((p) => p.id === item.id);

    return `
      <article class="cart-item">
        <img src="${product.image}" alt="${product.name}">

        <div>
          <h3>${product.name}</h3>
          <p class="cart-item-price">${money(product.price)}</p>

          <div class="quantity-controls">
            <button
              type="button"
              data-quantity="${product.id}"
              data-change="-1"
              aria-label="Diminuir quantidade"
            >−</button>

            <span>${item.quantity}</span>

            <button
              type="button"
              data-quantity="${product.id}"
              data-change="1"
              aria-label="Aumentar quantidade"
            >+</button>
          </div>
        </div>

        <button
          class="remove-item"
          type="button"
          data-remove="${product.id}"
          aria-label="Remover ${product.name}"
        >×</button>
      </article>
    `;
  }).join("");

  const hasItems = cart.length > 0;

  cartEmpty.hidden = hasItems;
  cartFooter.hidden = !hasItems;
  cartItems.hidden = !hasItems;

  updateCartCount();
}

cartItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    changeQuantity(
      Number(quantityButton.dataset.quantity),
      Number(quantityButton.dataset.change)
    );
  }

  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.remove));
  }
});

function openCart() {
  renderCart();

  cartDrawer.classList.add("open");
  drawerBackdrop.classList.add("open");
  document.body.classList.add("drawer-open");

  cartDrawer.setAttribute("aria-hidden", "false");
  $("#closeCart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  drawerBackdrop.classList.remove("open");
  document.body.classList.remove("drawer-open");

  cartDrawer.setAttribute("aria-hidden", "true");
  $("#cartBtn").focus();
}

$("#cartBtn").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#continueShopping").addEventListener("click", closeCart);
drawerBackdrop.addEventListener("click", closeCart);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("open")) {
    closeCart();
  }
});

// Finalização do pedido

$("#checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) return;

  showToast(
    "O carrinho está pronto. Para receber pedidos reais, conecte um checkout e um meio de pagamento."
  );
});

// Menu mobile

const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Fechar menu" : "Abrir menu"
  );
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");

    if (link.dataset.filter) {
      setFilter(link.dataset.filter);
    }
  });
});

// Conta

$("#accountBtn").addEventListener("click", () => {
  showToast(
    "A área de clientes precisa de um sistema de cadastro e autenticação para funcionar."
  );
});

// Newsletter

$("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const email = $("#newsletterEmail").value.trim();
  const message = $("#newsletterMessage");

  if (!email) return;

  message.textContent =
    "Formulário validado! Para cadastrar seu e-mail de verdade, conecte um serviço de newsletter.";

  showToast("E-mail validado. Falta conectar o serviço de cadastro.");
  event.target.reset();
});

// Inicialização

$("#currentYear").textContent = new Date().getFullYear();

renderProducts();
renderCart();
updateFavoriteCount();
