# Weather App

A weather application built as a **Frontend Mentor challenge** using HTML, Tailwind CSS, and JavaScript. The app uses the **Open-Meteo API** to search for locations and display current, daily, and hourly weather information.

## Features

* Search for weather information by city name
* Display the current:

  * Location
  * Date
  * Temperature
  * Feels-like temperature
  * Humidity
  * Wind speed
  * Precipitation
* Display a 7-day weather forecast
* Display an hourly weather forecast
* Weather icons based on weather conditions
* Switch between temperature units:

  * Celsius (°C)
  * Fahrenheit (°F)
* Switch between wind speed units:

  * km/h
  * mph
* Switch between precipitation units:

  * Millimeters (mm)
  * Inches (in)
* Loading skeleton while weather data is being fetched
* Error state for invalid locations or failed API requests
* Empty state before weather data is searched

## Technologies Used

* HTML5
* Tailwind CSS
* JavaScript
* Fetch API
* Open-Meteo API
* Google Fonts — DM Sans

## APIs

The application uses Open-Meteo for both location search and weather data.

* [Open-Meteo](https://open-meteo.com/)
* [Open-Meteo Weather API Documentation](https://open-meteo.com/en/docs)
* [Open-Meteo Geocoding API Documentation](https://open-meteo.com/en/docs/geocoding-api)

No API key is required.

## How It Works

### Location Search

When a user searches for a city, the application sends the city name to the Open-Meteo Geocoding API.

The API returns the location's:

* Name
* Country
* Latitude
* Longitude

The coordinates are then used to request weather data.

### Weather Data

The application requests:

* Current weather
* Daily forecast
* Hourly forecast

The returned data is processed using JavaScript and displayed dynamically in the UI.

### Unit Switching

The units dropdown allows users to change individual measurement units.

```text
Temperature
├── Celsius
└── Fahrenheit

Wind Speed
├── km/h
└── mph

Precipitation
├── Millimeters
└── Inches
```

When a unit is changed, the application fetches the weather data again using the selected unit.

## Loading and Error States

The application includes different UI states to improve the user experience.

### Initial State

Before a search is performed, the weather section displays a message asking the user to search for a location.

### Loading State

While the API request is being processed, skeleton elements are displayed for the weather card, statistics, daily forecast, and hourly forecast.

### Error State

If a location cannot be found or the API request fails, an error message is displayed.

## Weather Icons

Weather codes returned by Open-Meteo are mapped to the application's weather icons using the `getWeatherIcon()` function.

The application supports conditions including:

* Sunny
* Partly cloudy
* Overcast
* Fog
* Rain
* Snow
* Thunderstorms

## Project Structure

```text
Weather-App/
│
├── assets/
│   └── images/
│       ├── bg-today-large.svg
│       ├── icon-search.svg
│       ├── icon-sunny.webp
│       ├── icon-rain.webp
│       ├── icon-snow.webp
│       ├── icon-fog.webp
│       ├── icon-storm.webp
│       ├── icon-overcast.webp
│       ├── icon-partly-cloudy.webp
│       └── logo.svg
│
├── index.html
├── script.js
└── README.md
```

## Getting Started

### Clone the repository

```bash
git clone https://github.com/jzzmiiinn/Weather-App.git
```

### Open the project

```bash
cd Weather-App
```

You can open `index.html` directly in your browser or use the **Live Server** extension in VS Code.

## What I Learned

Building this project helped me practice working with real-world APIs and asynchronous JavaScript.

Some of the main concepts I practiced were:

* `fetch()`
* Promises
* `async/await`
* Working with JSON data
* API requests and responses
* DOM manipulation
* Event listeners
* Dynamic element creation
* Array methods
* Error handling with `try...catch`
* Loading and error states
* Working with external API parameters
* Managing application state with JavaScript variables

## Challenges I Faced

One of the main challenges was working with the weather API data because the information is returned in nested objects and arrays.

I had to understand how to access values such as:

```javascript
data.current.temperature_2m
data.current.relative_humidity_2m
data.daily.temperature_2m_max
data.hourly.temperature_2m
```

Another challenge was updating the weather data whenever the user changed the selected unit. This required keeping track of the current location and requesting the weather data again with the updated unit.

## Future Improvements

* Improve mobile responsiveness
* Add a proper day selector for the hourly forecast
* Display hourly forecasts for the selected day
* Add user's current location using geolocation
* Save the selected units using `localStorage`
* Improve accessibility
* Add more detailed weather information
* Improve animations and transitions
* Add a better mobile navigation/layout

## Credits

This project was created as part of a **Frontend Mentor** challenge.

[Frontend Mentor](https://www.frontendmentor.io/?utm_source=chatgpt.com)

Weather data is provided by **Open-Meteo**.

[Open-Meteo](https://open-meteo.com/?utm_source=chatgpt.com)

## Author

### Yasmin Ali

Software Engineering student focused on becoming a full-stack developer.

## License

This project was created for learning and portfolio purposes.
