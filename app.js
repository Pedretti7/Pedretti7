const tabs = document.querySelectorAll(".tab");
const cardsContainer = document.getElementById("cards-container");
const searchInput = document.getElementById("search-input");
const clearSearchButton = document.getElementById("clear-search");
const detailType = document.getElementById("detail-type");
const detailTitle = document.getElementById("detail-title");
const detailSummary = document.getElementById("detail-summary");
const detailRequirements = document.getElementById("detail-requirements");
const detailFoundation = document.getElementById("detail-foundation");
const detailModel = document.getElementById("detail-model");
const favoriteToggle = document.getElementById("favorite-toggle");
const favoritesList = document.getElementById("favorites-list");
const totalItems = document.getElementById("total-items");
const favoriteCount = document.getElementById("favorite-count");
const progressCount = document.getElementById("progress-count");
const simuladoAnswer = document.getElementById("simulado-answer");
const simuladoCheck = document.getElementById("simulado-check");
const simuladoFeedback = document.getElementById("simulado-feedback");

const state = {
  data: {},
  category: "pieces",
  search: "",
  selected: null,
  favorites: new Set(JSON.parse(localStorage.getItem("favorites") || "[]")),
  checklist: JSON.parse(localStorage.getItem("checklist") || "{}"),
};

const categoryLabels = {
  pieces: "Peça",
  procedures: "Procedimento",
  resources: "Recurso",
  models: "Modelo",
};

const fetchContent = async () => {
  const response = await fetch("data/content.json");
  const data = await response.json();
  state.data = data;
  updateStats();
  renderCards();
  if (!state.selected) {
    selectItem(getCurrentItems()[0]);
  }
};

const getCurrentItems = () => {
  const items = state.data[state.category] || [];
  if (!state.search) return items;
  return items.filter((item) =>
    `${item.title} ${item.summary} ${item.foundation}`
      .toLowerCase()
      .includes(state.search)
  );
};

const renderCards = () => {
  cardsContainer.innerHTML = "";
  const items = getCurrentItems();

  if (items.length === 0) {
    cardsContainer.innerHTML =
      '<p class="empty">Nenhum item encontrado.</p>';
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <span>${categoryLabels[state.category]}</span>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <button class="btn-secondary">Ver detalhes</button>
    `;
    card.addEventListener("click", () => selectItem(item));
    cardsContainer.appendChild(card);
  });
};

const renderDetail = () => {
  if (!state.selected) return;
  const { title, summary, requirements, foundation, model } = state.selected;
  detailType.textContent = categoryLabels[state.category];
  detailTitle.textContent = title;
  detailSummary.textContent = summary;
  detailFoundation.textContent = foundation;
  detailModel.textContent = model;

  detailRequirements.innerHTML = "";
  requirements.forEach((req) => {
    const id = `${state.selected.id}-${req}`;
    const checked = state.checklist[id] || false;
    const item = document.createElement("li");
    item.innerHTML = `
      <input type="checkbox" ${checked ? "checked" : ""} data-id="${id}" />
      <span>${req}</span>
    `;
    detailRequirements.appendChild(item);
  });

  favoriteToggle.textContent = state.favorites.has(state.selected.id)
    ? "Remover favorito"
    : "Favoritar";
};

const renderFavorites = () => {
  favoritesList.innerHTML = "";
  const favorites = Array.from(state.favorites);

  if (favorites.length === 0) {
    favoritesList.innerHTML =
      '<p class="empty">Adicione itens aos favoritos para revisar.</p>';
    return;
  }

  favorites.forEach((id) => {
    const item = findItemById(id);
    if (!item) return;
    const row = document.createElement("div");
    row.className = "favorite-item";
    row.innerHTML = `
      <div>
        <strong>${item.title}</strong>
        <p>${item.summary}</p>
      </div>
      <button class="btn-secondary" data-id="${id}">Remover</button>
    `;
    row.querySelector("button").addEventListener("click", () => {
      toggleFavorite(id);
    });
    favoritesList.appendChild(row);
  });
};

const findItemById = (id) => {
  return Object.values(state.data)
    .flat()
    .find((item) => item.id === id);
};

const selectItem = (item) => {
  if (!item) return;
  state.selected = item;
  renderDetail();
};

const toggleFavorite = (id = state.selected?.id) => {
  if (!id) return;
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
  } else {
    state.favorites.add(id);
  }
  localStorage.setItem("favorites", JSON.stringify([...state.favorites]));
  renderDetail();
  renderFavorites();
  updateStats();
};

const updateStats = () => {
  const total = Object.values(state.data).flat().length || 0;
  totalItems.textContent = total.toString();
  favoriteCount.textContent = state.favorites.size.toString();
  const checklistTotal = Object.keys(state.checklist).length;
  const checklistDone = Object.values(state.checklist).filter(Boolean).length;
  const percent = checklistTotal
    ? Math.round((checklistDone / checklistTotal) * 100)
    : 0;
  progressCount.textContent = `${percent}%`;
};

const handleChecklist = (event) => {
  if (event.target.type !== "checkbox") return;
  const id = event.target.dataset.id;
  state.checklist[id] = event.target.checked;
  localStorage.setItem("checklist", JSON.stringify(state.checklist));
  updateStats();
};

const handleSearch = (event) => {
  state.search = event.target.value.trim().toLowerCase();
  renderCards();
};

const clearSearch = () => {
  state.search = "";
  searchInput.value = "";
  renderCards();
};

const handleTabClick = (event) => {
  const category = event.target.dataset.category;
  if (!category) return;
  state.category = category;
  tabs.forEach((tab) => tab.classList.toggle("active", tab === event.target));
  renderCards();
  selectItem(getCurrentItems()[0]);
};

const handleSimulado = () => {
  const answer = simuladoAnswer.value.trim().toLowerCase();
  if (!answer) {
    simuladoFeedback.textContent = "Digite uma resposta para validar.";
    return;
  }
  if (answer.includes("indenização") || answer.includes("acao de indenizacao")) {
    simuladoFeedback.textContent =
      "Correto! Uma ação de indenização é adequada nesse caso.";
  } else {
    simuladoFeedback.textContent =
      "Sugestão: revisão de responsabilidade civil e ação de indenização.";
  }
};

favoriteToggle.addEventListener("click", () => toggleFavorite());
searchInput.addEventListener("input", handleSearch);
clearSearchButton.addEventListener("click", clearSearch);

detailRequirements.addEventListener("change", handleChecklist);

tabs.forEach((tab) => tab.addEventListener("click", handleTabClick));

simuladoCheck.addEventListener("click", handleSimulado);

fetchContent();
renderFavorites();
