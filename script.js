const countriesContainer = document.getElementById("countriesContainer");
const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");
const regionFilter = document.getElementById("regionFilter");
const languageFilter = document.getElementById("languageFilter");
const favoritesContainer = document.getElementById("favoritesList");
const showMoreButton = document.createElement("button");

let allCountries = [];
let favorites = []; // Store favorites in memory
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
const toggleFavoritesBtn = document.getElementById("toggleFavoritesBtn");
const favoritesContainers = document.getElementById("favoritesContainer");

// Add an event listener to the button to toggle the favorites container visibility
toggleFavoritesBtn.addEventListener("click", () => {
  if (favoritesContainers.style.display === "none" || favoritesContainers.style.display === "") {
    favoritesContainers.style.display = "block"; // Show the container
  } else {
    favoritesContainers.style.display = "none"; // Hide the container
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
      <p class="all"><i class="fas fa-users"></i>: ${country.population}</p>
      <p class="all"><i class="fas fa-city"></i>: ${country.region || "N/A"}</p>
      <button class="favorite-btn">
        ${isFavorite ? "❤️" : "🤍"}
      </button>
    `;

    // Add event listener for the card to show details
    card.addEventListener("click", () => showDetails(country));

    // Add event listener for the favorite button
    const favoriteBtn = card.querySelector(".favorite-btn");
    favoriteBtn.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent card click from triggering
      toggleFavorite(country.name.common);
      favoriteBtn.innerHTML = favorites.includes(country.name.common) ? "❤️" : "🤍";
    });

    countriesContainer.appendChild(card);
  });
}

// Show country details (triggered on click of country card)
 function showDetails(country) {
      console.log("Selected Country Details:", country);

      // Store the country details in sessionStorage
      sessionStorage.setItem("selectedCountry", JSON.stringify(country));

      // Redirect to the details page
      window.location.href = "country.html";
    }
// Toggle favorite status of a country
function toggleFavorite(countryName) {
  if (favorites.includes(countryName)) {
    favorites = favorites.filter((name) => name !== countryName);
  } else {
    favorites.push(countryName);
  }

  updateFavoritesUI();
  displayCountries(displayedCountries);
}

// Create the "Show More" button
function createShowMoreButton() {
  showMoreButton.textContent = "Show More";
  showMoreButton.className = "show-more-btn";
  showMoreButton.addEventListener("click", loadMoreCountries);
  document.body.appendChild(showMoreButton);
}

// Load more countries when "Show More" is clicked
function loadMoreCountries() {
  const currentCount = displayedCountries.length;
  const nextCountries = allCountries.slice(currentCount, currentCount + countriesPerPage);
  displayedCountries = [...displayedCountries, ...nextCountries];
  displayCountries(displayedCountries);

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
        showMoreButton.style.display = "none";
      };
      suggestions.appendChild(li);
    });
    suggestions.style.display = "block";

    displayedCountries = results.slice(0, countriesPerPage);
    displayCountries(displayedCountries);
    showMoreButton.style.display = results.length > countriesPerPage ? "block" : "none";
  } else {
    displayedCountries = allCountries.slice(0, countriesPerPage);
    displayCountries(displayedCountries);
    suggestions.style.display = "none";
    showMoreButton.style.display = allCountries.length > countriesPerPage ? "block" : "none";
  }
});

// Update favorites UI
function updateFavoritesUI() {
  favoritesContainer.innerHTML = "";
  favorites.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    favoritesContainer.appendChild(li);
  });
}

updateFavoritesUI();
