const countriesContainer = document.getElementById("countriesContainer");
const searchInput = document.getElementById("searchInput");
const regionFilter = document.getElementById("regionFilter");
const languageFilter = document.getElementById("languageFilter");
const favoritesContainer = document.getElementById("favoritesContainer");
const showMoreButton = document.createElement("button");

let allCountries = [];
let displayedCountries = [];
let countriesPerPage = 12; // Number of countries to display at once

// Fetch countries on page load
async function fetchCountries() {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const region = params.get("region");
  const language = params.get("language");
  const search = params.get("search");

  const res = await fetch("https://restcountries.com/v3.1/all");
  allCountries = await res.json();

  document.getElementById("searchInput").value = search || "";
  document.getElementById("regionFilter").value = region || "";
  document.getElementById("languageFilter").value = language || "";
  let isFilterApplied = false;
  if (search) {
    isFilterApplied = true;
    allCountries = allCountries.filter(
      (c) => c.name.common.toLowerCase().indexOf(search.toLowerCase()) >= 0
    );
  }
  if (region) {
    isFilterApplied = true;
    allCountries = allCountries.filter((c) => c.region === region);
  }
  if (language) {
    isFilterApplied = true;
    allCountries = allCountries.filter((c) =>
      Object.values(c.languages || {}).includes(language)
    );
  }
  displayedCountries = allCountries.slice(0, countriesPerPage);
  if (displayedCountries.length) {
    displayCountries(displayedCountries);

    if (isFilterApplied) {
      document.getElementById(
        "resultsCount"
      ).innerHTML = `Showing ${allCountries.length} results for your search. <a href="javascript:void(0)" onclick="viewAll()">View All</a>`;
      document.getElementById("resultsCount").style.display = "block";
    } else {
      document.getElementById("resultsCount").style.display = "none";
    }
  } else {
    countriesContainer.innerHTML = `<div class="noresults">No countries found for your search.</div>`;
  }
  displayFavorites();
  if (allCountries.length > countriesPerPage) {
    createShowMoreButton();
  } else {
    showMoreButton.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchCountries();
});

// Display countries as cards
function displayCountries(countries) {
  countriesContainer.innerHTML = ""; // Clear container
  countries.forEach((country) => {
    const card = document.createElement("div");
    card.className = "country-card";

    card.innerHTML = `
    <img src="${country.flags.png}" alt="${
      country.name.common
    }" class="flag-image" />
    <h3 class="all">${country.name.common}</h3>
    <p class="all">👤 ${country.population}</p>
    <p class="all">🏛️ ${country.capital || "N/A"}</p>
  `;

    // Add event listener for the card to show details
    card.addEventListener("click", () => showDetails(country.name.common));

    countriesContainer.appendChild(card);
  });
}

function displayFavorites() {
  let favorites = JSON.parse(localStorage.getItem("favoritesMap")) || {};
  console.log("favorites loaded", favorites);
  if (Object.keys(favorites).length) {
    countriesContainer.classList.add("fav");
    let favHTML = `<div>
        <div class="fav-header">Favorites</div>
        <div class="fav-items">`;
    for (let countryCode of Object.keys(favorites)) {
      let country = favorites[countryCode];
      favHTML += `<div class="fav-item" onclick="showDetails('${country.name.common}')"><img src="${country.flags.png}" width="16px"> ${country.name.common}</div>`;
    }
    favHTML += `</div></div>`;
    favoritesContainer.innerHTML = favHTML;
    favoritesContainer.style.display = "block";
  } else {
    favoritesContainer.style.display = "none";
  }
}

// Show country details (triggered on click of country card)
function showDetails(name) {
  window.location.href = `/country.html?country=${name}`;
}

// Create the "Show More" button
function createShowMoreButton() {
  showMoreButton.textContent = "Show More";
  showMoreButton.className = "show-more-btn";
  showMoreButton.style.display = "block";
  showMoreButton.addEventListener("click", loadMoreCountries);
  document.body.appendChild(showMoreButton); // Add it to the end of the body
}

// Load more countries when "Show More" is clicked
function loadMoreCountries() {
  const currentCount = displayedCountries.length;
  const nextCountries = allCountries.slice(
    currentCount,
    currentCount + countriesPerPage
  );
  displayedCountries = [...displayedCountries, ...nextCountries];
  displayCountries(displayedCountries);

  // Hide the button if no more countries are left
  if (displayedCountries.length >= allCountries.length) {
    showMoreButton.style.display = "none";
  }
}

function viewAll() {
  let url = new URL(window.location.href);
  url.searchParams.delete("region");
  url.searchParams.delete("language");
  url.searchParams.delete("search");
  window.history.pushState({}, "", url);
  fetchCountries();
}

// Filter by Region or Language
[regionFilter, languageFilter].forEach((filter) => {
  filter.addEventListener("change", () => {
    let filtered = allCountries;

    let url = new URL(window.location.href);

    if (regionFilter.value) {
      url.searchParams.set("region", regionFilter.value);
    } else {
      url.searchParams.delete("region");
    }
    if (languageFilter.value) {
      url.searchParams.set("language", languageFilter.value);
    } else {
      url.searchParams.delete("language");
    }
    window.history.pushState({}, "", url);
    fetchCountries();
  });
});

// Search functionality
searchInput.addEventListener("change", () => {
  const query = searchInput.value.toLowerCase();

  let url = new URL(window.location.href);
  if (query) {
    url.searchParams.set("search", query);
  } else {
    url.searchParams.delete("search");
  }
  window.history.pushState({}, "", url);
  fetchCountries();
});
