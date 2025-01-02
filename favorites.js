export function toggleFavorite(country) {
  let countryCode = country.cca3;
  let favorites = JSON.parse(localStorage.getItem("favoritesMap")) || {};
  let isAdded = false;
  if (favorites[countryCode]) {
    delete favorites[countryCode];
  } else {
    if (Object.keys(favorites).length >= 5) {
      throw new Error("You cannot favorite more than 5 countries.");
    }
    favorites[countryCode] = country;
    isAdded = true;
  }

  localStorage.setItem("favoritesMap", JSON.stringify(favorites));
  return isAdded;
}

export function getFavorites() {
  let favorites = JSON.parse(localStorage.getItem("favoritesMap")) || {};
  return favorites;
}

export function isFavorite(country) {
  console.log(getFavorites());
  console.log(country.cca3);
  if (getFavorites()[country.cca3]) {
    return true;
  }
  return false;
}
