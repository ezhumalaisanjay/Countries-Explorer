const countriesContainer = document.getElementById("countriesContainer");
const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");
const regionFilter = document.getElementById("regionFilter");
const languageFilter = document.getElementById("languageFilter");
const favoritesContainer = document.getElementById("favoritesList");
const showMoreButton = document.createElement("button");

let allCountries = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let displayedCountries = [];
let countriesPerPage = 12; // Number of countries to display at once

// Fetch countries on page load
async function fetchCountries() {
  const res = await fetch("https://restcountries.com/v3.1/all");
  allCountries = await res.json();
  displayedCountries = allCountries.slice(0, countriesPerPage);
  displayCountries(displayedCountries);
  if (allCountries.length > countriesPerPage) createShowMoreButton();
}


// Get references to the button and the favorites container
const toggleFavoritesBtn = document.getElementById('toggleFavoritesBtn');
const favoritesContainers = document.getElementById('favoritesContainer');

// Add an event listener to the button to toggle the favorites container visibility
toggleFavoritesBtn.addEventListener('click', () => {
  // Toggle the visibility of the favorites container
  if (favoritesContainers.style.display === 'none' || favoritesContainers.style.display === '') {
    favoritesContainers.style.display = 'block'; // Show the container
  } else {
    favoritesContainers.style.display = 'none'; // Hide the container
  }
});


fetchCountries();

// Display countries as cards
function displayCountries(countries) {
  countriesContainer.innerHTML = ""; // Clear container
  countries.forEach((country) => {
    const card = document.createElement("div");
    card.className = "country-card";
    
    // Check if the country is already in favorites
    const isFavorite = favorites.includes(country.name.common);
    
    card.innerHTML = `
      <img src="${country.flags.png}" alt="${country.name.common}" class="flag-image" />
      <h3 class="all">${country.name.common}</h3>
      <p class="all">👤: ${country.population}</p>
      <p class="all">🏛️: ${country.capital || "N/A"}</p>
      <button class="favorite-btn" onclick="toggleFavorite('${country.name.common}')">
        ${isFavorite ? "❤️" : "🤍"} <!-- Heart icon changes based on favorite status -->
      </button>
    `;
    // Add click event for details
    card.addEventListener("click", () => showDetails(country));
    
    countriesContainer.appendChild(card);
  });
}
// Show country details (triggered on click of country card)
function showDetails(country) {
  // Save country data in localStorage or in history
  localStorage.setItem("selectedCountry", JSON.stringify(country));
  window.location.href = "/country.html"; // Redirect to details page
}

// Render country details page
function renderCountryDetails() {
  const country = JSON.parse(localStorage.getItem("selectedCountry"));
  if (!country) return;

  const detailsContainer = document.getElementById("detailsContainer");
  detailsContainer.innerHTML = `
    <button onclick="window.history.back()">Back</button>
    <h2>${country.name.common}</h2>
    <p><strong>🌐:</strong> ${country.tld}</p>
    <p><strong>🏛️:</strong> ${country.capital || "N/A"}</p>
    <p><strong>🌍:</strong> ${country.region}</p>
    <p><strong>👤:</strong> ${country.population}</p>
    <p><strong>🗾:</strong> ${country.area} km²</p>
    <p><strong>🌐:</strong> ${Object.values(country.languages || {}).join(", ")}</p>
  `;
}

// Toggle favorite status of a country
function toggleFavorite(countryName) {
  if (favorites.includes(countryName)) {
    // Remove from favorites
    favorites = favorites.filter((name) => name !== countryName);
  } else {
    // Add to favorites
    favorites.push(countryName);
  }
  
  // Update localStorage and the favorites list UI
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoritesUI();
  
  // Re-render the country cards with updated favorite status
  displayCountries(displayedCountries);
}

// Create the "Show More" button
function createShowMoreButton() {
  showMoreButton.textContent = "Show More";
  showMoreButton.className = "show-more-btn";
  showMoreButton.addEventListener("click", loadMoreCountries);
  document.body.appendChild(showMoreButton); // Add it to the end of the body
}

// Load more countries when "Show More" is clicked
function loadMoreCountries() {
  const currentCount = displayedCountries.length;
  const nextCountries = allCountries.slice(currentCount, currentCount + countriesPerPage);
  displayedCountries = [...displayedCountries, ...nextCountries];
  displayCountries(displayedCountries);

  // Hide the button if no more countries are left
  if (displayedCountries.length >= allCountries.length) {
    showMoreButton.style.display = "none";
  }
}

// Filter by Region or Language
[regionFilter, languageFilter].forEach((filter) => {
  filter.addEventListener("change", () => {
    let filtered = allCountries;
    if (regionFilter.value) {
      filtered = filtered.filter((c) => c.region === regionFilter.value);
    }
    if (languageFilter.value) {
      filtered = filtered.filter((c) =>
        Object.values(c.languages || {}).includes(languageFilter.value)
      );
    }
    displayedCountries = filtered.slice(0, countriesPerPage);
    displayCountries(displayedCountries);
    showMoreButton.style.display = filtered.length > countriesPerPage ? "block" : "none";
  });
});

// Search functionality
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  
  // If there's a search query, filter the countries
  if (query) {
    const results = allCountries.filter((c) =>
      c.name.common.toLowerCase().includes(query)
    );
    suggestions.innerHTML = "";
    results.slice(0, 5).forEach((c) => {
      const li = document.createElement("li");
      li.textContent = c.name.common;
      li.onclick = () => {
        searchInput.value = c.name.common;
        displayedCountries = [c];
        displayCountries(displayedCountries);
        suggestions.innerHTML = "";
        showMoreButton.style.display = "none"; // Hide "Show More" for single result
      };
      suggestions.appendChild(li);
    });
    suggestions.style.display = "block";
    
    // Display filtered results
    displayedCountries = results.slice(0, countriesPerPage);
    displayCountries(displayedCountries);
    showMoreButton.style.display = results.length > countriesPerPage ? "block" : "none";
  } else {
    // When there's no search query, show all countries
    displayedCountries = allCountries.slice(0, countriesPerPage);
    displayCountries(displayedCountries);
    suggestions.style.display = "none";
    
    // If there are more countries, show "Show More"
    showMoreButton.style.display = allCountries.length > countriesPerPage ? "block" : "none";
  }
});

// Favorites functionality
function updateFavoritesUI() {
  favoritesContainer.innerHTML = "";
  favorites.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    favoritesContainer.appendChild(li);
  });
}

updateFavoritesUI();
