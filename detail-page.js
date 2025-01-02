import { fetchCountry } from "./utils.js";
import { isFavorite, toggleFavorite } from "./favorites.js";

async function renderCountryDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const countryCode = urlParams.get('country');

    const country = await fetchCountry(countryCode);
    if (!country) {
        detailsContainer.innerHTML = `
            <button onclick="window.location.href = document.referrer ? document.referrer : '/index.html'">Back</button>
            <h2>Invalid Country Code: The code you entered is not recognized (${countryCode}).</h2>`;
        return;
    };

    detailsContainer.innerHTML = `<div class="details-action-btn">
            <button class="back-btn" onclick="window.location.href = document.referrer ? document.referrer : '/index.html'">⬅ Back</button>
            <button class="fav-btn">
            ${isFavorite(country) ? `<img src="./svg/favorite-svgrepo-filled.svg" class="icon"/>` : `<img src="./svg/favorite-svgrepo-com.svg" class="icon"/>`}
            </button>
        </div>
        <div class="country-details">
            <h2>${country.name.common}</h2>
            <img src="${country.flags.png}" alt="${country.name.common}" class="flag-image" />
        </div>
        <div class="field-details">
            <div class="field">
                <span class="field-name">Top Level Domain</span>
                <span class="field-value">${country.tld}</span>
            </div>
            <div class="field">
                <span class="field-name">Capital</span>
                <span class="field-value">${country.capital}</span>
            </div>
            <div class="field">
                <span class="field-name">Region</span>
                <span class="field-value">${country.region}</span>
            </div>
            <div class="field">
                <span class="field-name">Population</span>
                <span class="field-value">${country.population.toLocaleString()}</span>
            </div>
            <div class="field">
                <span class="field-name">Area</span>
                <span class="field-value">${country.area.toLocaleString()} km²</span>
            </div>
            <div class="field">
                <span class="field-name">Languages</span>
                <span class="field-value">${Object.values(country.languages || {}).join(", ")}</span>
            </div>
        </div>
        <div style="margin-top: 20px; max-width:100%;list-style:none; transition: none;overflow:hidden;width:600px;height:200px;"><div id="google-maps-display" style="height:100%; width:100%;max-width:100%;"><iframe style="height:100%;width:100%;border:0;" frameborder="0" src="https://www.google.com/maps/embed/v1/place?q=${country.name.common}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"></iframe></div><a class="embed-ded-maphtml" href="https://www.bootstrapskins.com/themes" id="enable-map-info">premium bootstrap themes</a><style>#google-maps-display img{max-width:none!important;background:none!important;font-size: inherit;font-weight:inherit;}</style></div>
        `;

    document.getElementsByClassName("fav-btn")[0].addEventListener("click", () => {
        try {
            let result = toggleFavorite(country);
            if (result) {
                document.getElementsByClassName("fav-btn")[0].innerHTML = `<img src="./svg/favorite-svgrepo-filled.svg" class="icon"/>`;
            }
            else {
                document.getElementsByClassName("fav-btn")[0].innerHTML = `<img src="./svg/favorite-svgrepo-com.svg" class="icon"/>`;
            }
        } catch (err) {
            alert(err.message)
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    renderCountryDetails();
});