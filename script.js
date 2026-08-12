const stats = document.getElementById("weatherStats");
const daily = document.getElementById("dailyForecast");
const hourly = document.getElementById("hourlyForecast");
const place = document.getElementById("place");
const date = document.getElementById("date");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search");
const temperature = document.getElementById("temperature");
const weatherApp = document.getElementById("weatherApp");
const unitSelect = document.getElementById("weather-data");

let currentLocation = null;
let weatherData = null;
let units = {
  temperature: "celsius",
  wind: "kmh",
  precipitation: "mm",
};
let dailyForecasts = [];
let hourlyForecasts = [];

const weatherStats = [
  {
    title: "Feels Like",
    value: "",
  },
  {
    title: "Humidity",
    value: "",
  },
  {
    title: "Wind",
    value: "",
  },
  {
    title: "Precipitation",
    value: "",
  },
];

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function showNoDataState() {
  const weatherCard = document.getElementById("weatherCard");

  if (weatherCard) {
    weatherCard.className =
      "bg-[hsl(243,27%,20%)] w-[700px] h-[200px] rounded-lg py-3 px-5 flex items-center justify-center";
    weatherCard.innerHTML = `
      <div class="text-center text-slate-400">
        <p class="text-lg font-medium">Search for a place to see the weather</p>
      </div>
    `;
  }

  if (stats) stats.innerHTML = "";
  if (daily) daily.innerHTML = "";
  if (hourly) hourly.innerHTML = "";

  // Do NOT clear weatherApp – the structure must stay intact
}

function getWeatherIcon(code) {
  if (code === 0) {
    return "sunny";
  }

  if (code === 1 || code === 2) {
    return "partly-cloudy";
  }

  if (code === 3) {
    return "overcast";
  }

  if (code === 45 || code === 48) {
    return "fog";
  }

  if (code >= 51 && code <= 67) {
    return "rain";
  }

  if (code >= 71 && code <= 77) {
    return "snow";
  }

  if (code >= 80 && code <= 82) {
    return "rain";
  }

  if (code >= 85 && code <= 86) {
    return "snow";
  }

  if (code >= 95) {
    return "storm";
  }

  return "sunny";
}

function showError(message) {
  const weatherCard = document.getElementById("weatherCard");
  const stats = document.getElementById("weatherStats");
  const daily = document.getElementById("dailyForecast");
  const hourly = document.getElementById("hourlyForecast");

  if (weatherCard) {
    weatherCard.className =
      "bg-[hsl(243,27%,20%)] w-[700px] h-[200px] rounded-lg py-3 px-5 flex items-center justify-center";
    weatherCard.innerHTML = "";
  }
  if (stats) stats.innerHTML = "";
  if (daily) daily.innerHTML = "";
  if (hourly) hourly.innerHTML = "";

  weatherApp.innerHTML = "";
  weatherApp.className =
    "w-[1100px] h-[300px] flex items-center justify-center";
  weatherApp.innerHTML = `
    <div class="text-center">
      <p class="text-red-400 text-lg font-semibold">⚠️ Error</p>
      <p class="text-slate-300 mt-2">${message}</p>
    </div>
  `;
}

function showSkeleton() {
  const weatherCard = document.getElementById("weatherCard");

  weatherCard.classList.remove("bg-[url(assets/images/bg-today-large.svg)]");

  weatherCard.classList.add("bg-[hsl(243,27%,20%)]", "animate-pulse");

  weatherCard.innerHTML = `
    <div class="flex flex-col items-center gap-4">
      <div class="w-32 h-5 bg-[hsl(243,23%,30%)] rounded"></div>

      <div class="w-24 h-14 bg-[hsl(243,23%,30%)] rounded"></div>

      <div class="w-40 h-4 bg-[hsl(243,23%,30%)] rounded"></div>
    </div>
  `;

  stats.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    const skeleton = document.createElement("div");

    skeleton.classList.add(
      "bg-[hsl(243,27%,20%)]",
      "border",
      "border-[hsl(243,23%,30%)]",
      "rounded-lg",
      "p-4",
      "w-[140px]",
      "h-[100px]",
      "animate-pulse",
    );

    skeleton.innerHTML = `
  <div class="w-20 h-4 bg-[hsl(243,23%,30%)] rounded"></div>
  <div class="w-16 h-6 bg-[hsl(243,23%,30%)] rounded mt-4"></div>
`;

    stats.append(skeleton);
  }

  daily.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    const skeleton = document.createElement("div");

    skeleton.classList.add(
      "bg-[hsl(243,27%,20%)]",
      "border",
      "border-[hsl(243,23%,30%)]",
      "rounded-lg",
      "w-[140px]",
      "h-[140px]",
      "animate-pulse",
    );

    daily.append(skeleton);
  }

  hourly.innerHTML = "";

  for (let i = 0; i < 8; i++) {
    const skeleton = document.createElement("div");

    skeleton.classList.add(
      "bg-[hsl(243,23%,30%)]",
      "rounded-lg",
      "h-[45px]",
      "mb-2.5",
      "animate-pulse",
    );

    hourly.append(skeleton);
  }
}

async function loadInitialWeather() {
  try {
    const location = await getLocation("Addis Ababa");

    currentLocation = location;

    weatherData = await getWeather(location.latitude, location.longitude);

    updateCurrentWeather(location, weatherData);
    updateWeatherStats(weatherData);
    updateDailyForecast(weatherData);
    updateHourlyForecast(weatherData);
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

async function getLocation(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city,
  )}&count=1`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("Location not found");
  }

  const location = data.results[0];

  return {
    name: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
  };
}

async function getWeather(latitude, longitude) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&hourly=temperature_2m,weather_code` +
    `&temperature_unit=${units.temperature}` +
    `&wind_speed_unit=${units.wind}` +
    `&precipitation_unit=${units.precipitation}` +
    `&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Weather data could not be fetched");
  }

  const data = await response.json();

  return data;
}

function updateCurrentWeather(location, weather) {
  const weatherCard = document.getElementById("weatherCard");

  weatherCard.className =
    "bg-[url('assets/images/bg-today-large.svg')] bg-cover bg-center w-[700px] h-[200px] rounded-lg py-3 px-5";

  weatherCard.innerHTML = `
    <div class="flex justify-between items-center h-full">
      <div>
        <p id="place" class="text-xl font-semibold">${location.name}, ${location.country}</p>
        <p id="date" class="text-sm opacity-80">${formatDate(weather.current.time)}</p>
      </div>
      <p id="temperature" class="text-6xl font-bold">${Math.round(weather.current.temperature_2m)}°</p>
    </div>
  `;
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const inputValue = searchInput.value.trim();

  if (!inputValue) return;

  showSkeleton();

  try {
    const location = await getLocation(inputValue);

    currentLocation = location;

    weatherData = await getWeather(location.latitude, location.longitude);

    updateCurrentWeather(location, weatherData);
    updateWeatherStats(weatherData);
    updateDailyForecast(weatherData);
    updateHourlyForecast(weatherData);
    searchInput.value = "";
  } catch (error) {
    showError(error.message || "City not found");
  }
});

unitSelect.addEventListener("change", async () => {
  const selectedUnit = unitSelect.value;

  if (selectedUnit === "celsius") {
    units.temperature = "celsius";
  }

  if (selectedUnit === "fahrenheit") {
    units.temperature = "fahrenheit";
  }

  if (selectedUnit === "kmh") {
    units.wind = "kmh";
  }

  if (selectedUnit === "mph") {
    units.wind = "mph";
  }

  if (selectedUnit === "mm") {
    units.precipitation = "mm";
  }

  if (selectedUnit === "in") {
    units.precipitation = "inch";
  }

  if (!currentLocation) return;

  showSkeleton();

  try {
    weatherData = await getWeather(
      currentLocation.latitude,
      currentLocation.longitude,
    );

    updateCurrentWeather(currentLocation, weatherData);
    updateWeatherStats(weatherData);
    updateDailyForecast(weatherData);
    updateHourlyForecast(weatherData);
  } catch (error) {
    console.error("Failed to update units:", error.message);
  }
});

function createWeatherItems(weatherStats) {
  const statCard = document.createElement("div");
  statCard.classList.add(
    "flex",
    "flex-col",
    "justify-between",
    "bg-[hsl(243,27%,20%)]",
    "border",
    "border-[hsl(243,23%,30%)]",
    "rounded-lg",
    "p-4",
    "w-[140px]",
    "h-[100px]",
  );

  statCard.innerHTML = `
    <h3 id="stat-title" class="text-[hsl(240,6%,70%)]">${weatherStats.title}</h3>
    <p id="stat-value" class="text-2xl">${weatherStats.value}</p>
  `;

  return statCard;
}

function renderStats() {
  stats.innerHTML = "";
  for (let stat of weatherStats) {
    stats.append(createWeatherItems(stat));
  }
}

function updateWeatherStats(data) {
  weatherStats[0].value = `${Math.round(data.current.apparent_temperature)}°`;
  weatherStats[1].value = `${data.current.relative_humidity_2m}%`;

  const windUnit = units.wind === "kmh" ? "km/h" : "mph";
  weatherStats[2].value = `${Math.round(data.current.wind_speed_10m)} ${windUnit}`;

  const precipUnit = units.precipitation === "mm" ? "mm" : "in";
  weatherStats[3].value = `${data.current.precipitation} ${precipUnit}`;

  renderStats();
}

function createDailyItems(dailyForecast) {
  const forecastCard = document.createElement("div");
  forecastCard.classList.add(
    "bg-[hsl(243,27%,20%)]",
    "border",
    "border-[hsl(243,23%,30%)]",
    "rounded-lg",
    "p-4",
    "text-center",
    "w-[140px]",
    "h-[140px]",
  );

  forecastCard.innerHTML = `
    <p class="forecast-day">${dailyForecast.day}</p>

    <img
      src="./assets/images/icon-${dailyForecast.icon}.webp"
      alt="${dailyForecast.icon}"
      class="forecast-icon"
    />

    <div id="forecast-temp"
      class="flex justify-between items-center mt-4">
      <span id="high-temp">${dailyForecast.high}°</span>
      <span id="low-temp" class="text-[hsl(240,6%,70%)]">${dailyForecast.low}°</span>
    </div>
  `;

  return forecastCard;
}

function renderDaily() {
  daily.innerHTML = "";
  for (let dailyForecast of dailyForecasts) {
    daily.append(createDailyItems(dailyForecast));
  }
}

function updateDailyForecast(data) {
  const dailyData = data.daily;

  dailyForecasts = [];

  for (let i = 0; i < dailyData.time.length; i++) {
    const day = new Date(dailyData.time[i]);

    const dayName = day.toLocaleDateString("en-US", {
      weekday: "short",
    });

    const forecast = {
      day: dayName,
      icon: getWeatherIcon(dailyData.weather_code[i]),
      high: Math.round(dailyData.temperature_2m_max[i]),
      low: Math.round(dailyData.temperature_2m_min[i]),
    };

    dailyForecasts.push(forecast);
  }

  renderDaily();
}

function createHourlyItems(hourlyForecast) {
  const hourlyItem = document.createElement("div");

  hourlyItem.className =
    "flex justify-between items-center bg-[hsl(243,23%,30%)] rounded-lg p-2 mb-2.5";

  hourlyItem.innerHTML = `
      <div class="flex items-center gap-2">
        <img
          src="./assets/images/icon-${hourlyForecast.icon}.webp"
          alt="${hourlyForecast.icon}"
          class="w-8"
        />

        <span>${hourlyForecast.time}</span>
      </div>

      <span>${hourlyForecast.temperature}°</span>
    `;

  return hourlyItem;
}

function renderHourly() {
  hourly.innerHTML = "";
  for (let hourlyForecast of hourlyForecasts) {
    hourly.append(createHourlyItems(hourlyForecast));
  }
}

function updateHourlyForecast(data) {
  const hourlyData = data.hourly;

  hourlyForecasts = [];
  for (let i = 0; i < 8; i++) {
    const time = new Date(hourlyData.time[i]);

    const hourlyForecast = {
      time: time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),

      icon: getWeatherIcon(hourlyData.weather_code[i]),

      temperature: Math.round(hourlyData.temperature_2m[i]),
    };

    hourlyForecasts.push(hourlyForecast);
  }
  renderHourly();
}

document.addEventListener("DOMContentLoaded", () => {
  showNoDataState();
});
