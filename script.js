import { applyQueryFilters, fetchCountries, filterCountries, getQueryFilters } from "./utils.js";
import { getFavorites } from "./favorites.js";

const countriesContainer = document.getElementById("countriesContainer");
const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");
const regionFilter = document.getElementById("regionFilter");
const languageFilter = document.getElementById("languageFilter");
const favoritesContainer = document.getElementById("favoritesContainer");
const showMoreButton = document.getElementById("showMoreButton");

let allCountries = [];
let countriesPerPage = 12;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
  displayCountries(); // Fetch and render countries
  displayFavorites(); // Display favorite countries
  registerEvents(); // Attach event listeners
});

async function displayCountries() {
  const { region, language, search } = getQueryFilters();
  prefillFilters();

  try {
    allCountries = await filterCountries(region, language, search);
    if (allCountries.length) {
      currentPage = 1;
      renderCountriesWithPagination(allCountries);

      if (region || language || search) {
        document.getElementById(
          "resultsCount"
        ).innerHTML = `Showing ${allCountries.length} results for your search. `;

        const viewAllLink = document.createElement("a");
        viewAllLink.setAttribute("href", "javascript:void(0)")
        viewAllLink.innerHTML = "View All";
        viewAllLink.onclick = () => {
          viewAll();
        };
        document.getElementById("resultsCount").appendChild(viewAllLink);
        document.getElementById("resultsCount").style.display = "block";
      } else {
        document.getElementById("resultsCount").style.display = "none";
      }
    } else {
      countriesContainer.innerHTML = `<div class="noresults">No countries found for your search.</div>`;
      document.getElementById("resultsCount").style.display = "none";
    }
  }
  catch (error) {
    countriesContainer.innerHTML = `<div class="noresults">Unable to fetch countries. Please try again by refreshing the page.</div>`;
    document.getElementById("resultsCount").style.display = "none";
  }
}

function prefillFilters() {
  const { region, language, search } = getQueryFilters();
  document.getElementById("searchInput").value = search || "";
  document.getElementById("regionFilter").value = region || "";
  document.getElementById("languageFilter").value = language || "";
}

function renderCountriesWithPagination(countries) {
  if (currentPage === 1) {
    countriesContainer.innerHTML = ""; // Reset the container for the first page
  }

  const startIndex = (currentPage - 1) * countriesPerPage;
  const paginatedCountries = countries.slice(startIndex, startIndex + countriesPerPage);

  paginatedCountries.forEach((country) => {
    const card = document.createElement("div");
    card.className = "country-card";
    card.innerHTML = `
      <img src = "${country.flags.png}" alt = "${country.name.common}" class="flag-image" />
      <h3 class="country-info">${country.name.common}</h3>
      <p class="country-info"><img class="icon" src="./svg/results-demographics-svgrepo-com.svg"/> ${country.population}</p>
      <p class="country-info"><img class="icon" src="./svg/capital-svgrepo-com.svg"/> ${country.capital || "N/A"}</p>
      `;
    card.addEventListener("click", () => showDetails(country.name.common));
    countriesContainer.appendChild(card);
  });

  showMoreButton.style.display = paginatedCountries.length < countriesPerPage ? "none" : "block";
}

function loadNextPage() {
  currentPage += 1;
  renderCountriesWithPagination(allCountries);
}

function displayFavorites() {
  let favorites = getFavorites();
  if (Object.keys(favorites).length) {
    countriesContainer.classList.add("fav");
    let favHTML = `<div>
        <div class="fav-header">Favorites</div>
        <div class="fav-items">`;
    for (let countryCode of Object.keys(favorites)) {
      let country = favorites[countryCode];
      favHTML += `<div class="fav-item" onclick="window.location.href = '/country.html?country=${country.name.common}'">
        <img src="${country.flags.png}" class="icon"> ${country.name.common}</div>`;
    }
    favHTML += `</div></ > `;
    favoritesContainer.innerHTML = favHTML;
    favoritesContainer.style.display = "block";
  } else {
    favoritesContainer.style.display = "none";
  }
}

function registerEvents() {
  [regionFilter, languageFilter].forEach((filter) => {
    filter.addEventListener("change", () => {
      applyQueryFilters(regionFilter.value, languageFilter.value, searchInput.value);
      displayCountries();
    });
  });

  searchInput.addEventListener("input", handleSearchInput);
  searchInput.addEventListener("keypress", handleSearchEnter);

  showMoreButton.onclick = loadNextPage;
}

async function handleSearchInput() {
  const query = searchInput.value.toLowerCase();
  const countries = await filterCountries(regionFilter.value, languageFilter.value, "");
  if (query) {
    const results = countries.filter((c) =>
      c.name.common.toLowerCase().includes(query)
    );
    if (!results.length) {
      hideSearchSuggestions();
      return;
    }
    suggestions.innerHTML = "";
    results.slice(0, 5).forEach((c) => {
      const li = document.createElement("li");
      li.innerHTML = c.name.common.replace(new RegExp(query, "gi"), "<b>$&</b>");
      li.onclick = () => showDetails(c.name.common);
      suggestions.appendChild(li);
    });
    if (results.length > 5) {
      const li = document.createElement("li");
      li.classList.add("suggestions-view-all");
      li.innerHTML = `Show all results for <b>${searchInput.value}</b>`;
      li.onclick = () => {
        applyQueryFilters(regionFilter.value, languageFilter.value, query);
        displayCountries();
        hideSearchSuggestions();
      };
      suggestions.appendChild(li);
    }
    suggestions.style.display = "block";
  } else {
    hideSearchSuggestions();
  }
}

function handleSearchEnter(event) {
  if (event.key === "Enter") {
    const query = searchInput.value.toLowerCase();
    applyQueryFilters(regionFilter.value, languageFilter.value, query);
    displayCountries();
    hideSearchSuggestions();
  }
}

function hideSearchSuggestions() {
  suggestions.innerHTML = "";
  suggestions.style.display = "none";
}

function showDetails(name) {
  window.location.href = `/country.html?country=${name}`;
}

function viewAll() {
  applyQueryFilters();
  displayCountries();
}