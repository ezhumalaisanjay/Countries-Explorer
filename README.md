live link https://countries-explorer-five.vercel.app/
# Country Explorer

Country Explorer is a web application that allows users to explore countries, filter them by region and language, search for specific countries, and save favorites. It fetches data from a public API and provides an intuitive interface for browsing and managing country information.

---

## Features

- **Search Countries**: Search for a country by name.
- **Filter by Region and Language**: Narrow down countries based on region or language.
- **Favorites Management**: Save and manage a list of favorite countries.
- **Dynamic Suggestions**: Display top suggestions while typing in the search bar.
- **"Show More" Functionality**: Load more countries dynamically.
- **Mobile-Responsive Design**: Adaptable for various screen sizes.

---

## Technologies Used

- **HTML5**: Markup for the structure of the app.
- **CSS3**: Styling and layout.
- **JavaScript (ES6+)**: Logic and interactivity.
- **Fetch API**: To retrieve country data from the REST Countries API.
- **LocalStorage**: To persist the user's favorite countries.

---

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/country-explorer.git
   ```
2. Navigate to the project folder:
   ```bash
   cd country-explorer
   ```
3. Open `index.html` in your preferred browser.

---

## Usage

1. **Search for a Country**:
   - Type a country name in the search bar to find matching countries.
   - Dynamic suggestions will appear as you type.

2. **Filter Countries**:
   - Use the "Region" dropdown to filter countries by continent.
   - Use the "Language" dropdown to filter countries by language.

3. **Save Favorites**:
   - Click the star icon on a country card to save it to your favorites list.
   - Favorites can be toggled in the favorites section.

4. **Show More Countries**:
   - Click the "Show More" button to load additional countries.

---

## API Reference

Data is fetched from the [REST Countries API](https://restcountries.com/).

**Endpoint Used**:
- `https://restcountries.com/v3.1/all`

---

## Project Structure

```plaintext
country-explorer/
├── index.html       # Main HTML file
├── styles.css       # Stylesheet
├── script.js           # Main JavaScript file
└── README.md        # Project documentation
```

---

## Development

### Prerequisites
- A modern web browser.
- A code editor (optional, e.g., VS Code).

### Steps to Modify
1. Open the project folder in your code editor.
2. Modify `app.js` for JavaScript functionality.
3. Modify `styles.css` for styling.
4. Save and refresh the browser to see changes.

---

## Future Enhancements

- Add more filters, such as population range or time zones.
- Improve accessibility by adding ARIA labels and better keyboard navigation.
- Optimize performance with search input debouncing.
- Integrate a backend for user authentication and data persistence.

---


## Acknowledgments

- [REST Countries API](https://restcountries.com/) for providing the country data.
- Icons and design inspiration from various online resources.

