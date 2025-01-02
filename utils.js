export async function fetchCountries(force = false) {
    if (!window.COUNTRIES_DATASET || force) {
        const res = await fetch("https://restcountries.com/v3.1/all")
        window.COUNTRIES_DATASET = await res.json();
    }
    return window.COUNTRIES_DATASET;
}

export async function fetchCountry(countryCode) {
    const res = await fetch(`https://restcountries.com/v3.1/name/${countryCode}?fullText=true`);
    let countriesResult = await res.json();
    if (countriesResult && countriesResult.length) {
        return countriesResult[0];
    }
    return null;
}

export async function filterCountries(region, language, search) {
    let countries = await fetchCountries();
    let filtered = countries.filter((c) => {
        const matchesRegion = region ? c.region === region : true;
        const matchesLanguage = language ? Object.values(c.languages || {}).includes(language) : true;
        const matchesSearch = search ? c.name.common.toLowerCase().includes(search.toLowerCase()) : true;

        return matchesRegion && matchesLanguage && matchesSearch;
    });
    return filtered;
}

export function getQueryFilters() {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const region = params.get("region");
    const language = params.get("language");
    const search = params.get("search");

    return { region, language, search };
}

export function applyQueryFilters(region, language, search) {
    let url = new URL(window.location.href);
    if (region) {
        url.searchParams.set("region", region);
    } else {
        url.searchParams.delete("region");
    }
    if (language) {
        url.searchParams.set("language", language);
    } else {
        url.searchParams.delete("language");
    }
    if (search) {
        url.searchParams.set("search", search);
    } else {
        url.searchParams.delete("search");
    }
    window.history.pushState({}, "", url);
}