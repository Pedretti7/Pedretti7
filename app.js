const getElement = (id) => document.getElementById(id);
const tabs = document.querySelectorAll(".tab");
const cardsContainer = getElement("cards-container");
const searchInput = getElement("search-input");
const clearSearchButton = getElement("clear-search");
const detailType = getElement("detail-type");
const detailTitle = getElement("detail-title");
const detailSummary = getElement("detail-summary");
const detailRequirements = getElement("detail-requirements");
const detailFoundation = getElement("detail-foundation");
const detailModel = getElement("detail-model");
const favoriteToggle = getElement("favorite-toggle");
const favoritesList = getElement("favorites-list");
const totalItems = getElement("total-items");
const favoriteCount = getElement("favorite-count");
const progressCount = getElement("progress-count");
const simuladoAnswer = getElement("simulado-answer");
const simuladoCheck = getElement("simulado-check");
const simuladoFeedback = getElement("simulado-feedback");

const state = {
  data: {},
  category: document.body.dataset.category || "pieces",
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
  if (!cardsContainer) return;
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
      <button class="btn-secondary" type="button">Ver detalhes</button>
    `;
    card.addEventListener("click", () => selectItem(item));
    cardsContainer.appendChild(card);
  });
};

const renderDetail = () => {
  if (!state.selected || !detailTitle) return;
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
  if (!favoritesList) return;
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
      <button class="btn-secondary" type="button" data-id="${id}">Remover</button>
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
  if (!totalItems) return;
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
  if (searchInput) searchInput.value = "";
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
  if (!simuladoAnswer || !simuladoFeedback) return;
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

if (favoriteToggle) {
  favoriteToggle.addEventListener("click", () => toggleFavorite());
}
if (searchInput) {
  searchInput.addEventListener("input", handleSearch);
}
if (clearSearchButton) {
  clearSearchButton.addEventListener("click", clearSearch);
}
if (detailRequirements) {
  detailRequirements.addEventListener("change", handleChecklist);
}
if (tabs.length > 0) {
  tabs.forEach((tab) => tab.addEventListener("click", handleTabClick));
}
if (simuladoCheck) {
  simuladoCheck.addEventListener("click", handleSimulado);
}

fetchContent();
renderFavorites();
