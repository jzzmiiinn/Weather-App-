const stats = document.getElementById("weatherStats");
const daily = document.getElementById("dailyForecast");
const hourly = document.getElementById("hourlyForecast");
const place = document.getElementById("place");
const date = document.getElementById("date");
const weatherIcon = document.getElementById("weather-icon");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search");
const temperature = document.getElementById("temperature");
const weatherApp = document.getElementById("weatherApp");
const unitButton = document.querySelector("#unit-toggle");
const unitsMenu = document.getElementById("units-menu");
const unitsBtn = document.getElementById("units-btn");
const daysBtn = document.getElementById("days-btn");
const daysMenu = document.getElementById("days-menu");

let currentLocation = null;
let weatherData = null;
let fullHourlyData = null;
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

function saveLocation(location) {
  localStorage.setItem("lastLocation", JSON.stringify(location));
}

function getSavedLocation() {
  const savedLocation = localStorage.getItem("lastLocation");

  if (!savedLocation) {
    return null;
  }

  return JSON.parse(savedLocation);
}

function updateUnitChecks() {
  document.querySelectorAll(".unit-option").forEach((btn) => {
    const type = btn.dataset.type;
    const value = btn.dataset.value;
    const check = btn.querySelector(".check");

    if (units[type] === value) {
      check.classList.remove("hidden");
      btn.classList.add("bg-[hsl(243,23%,30%)]");
    } else {
      check.classList.add("hidden");
      btn.classList.remove("bg-[hsl(243,23%,30%)]");
    }
  });
}

async function applyUnits() {
  updateUnitChecks();
  unitsMenu.classList.add("hidden");

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
    populateDaySelector(weatherData.daily);
    updateHourlyForecast(weatherData, 0);
  } catch (error) {
    console.error("Failed to update units:", error);
    showError("Could not update units");
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function populateDaySelector(dailyData) {
  const daysMenu = document.getElementById("days-menu");
  const selectedDay = document.getElementById("selected-day");

  if (!daysMenu || !selectedDay) return;

  daysMenu.innerHTML = "";

  dailyData.time.forEach((dateStr, index) => {
    const date = new Date(dateStr);

    const dayName = date.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const button = document.createElement("button");

    button.type = "button";
    button.dataset.index = index;

    button.className =
      "w-full text-left px-3 py-2 rounded-lg " +
      "hover:bg-[hsl(243,23%,30%)] text-sm text-slate-200";

    button.textContent = index === 0 ? "Today" : dayName;

    button.addEventListener("click", () => {
      selectedDay.textContent = button.textContent;
      daysMenu.classList.add("hidden");

      if (weatherData) {
        updateHourlyForecast(weatherData, index);
      }
    });

    daysMenu.appendChild(button);
  });

  selectedDay.textContent = "Today";
}

daysBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  daysMenu.classList.toggle("hidden");
});

daysMenu.addEventListener("click", (e) => {
  e.stopPropagation();
});

document.addEventListener("click", () => {
  daysMenu.classList.add("hidden");
});

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
  const weatherApp = document.getElementById("weatherApp");

  weatherApp.className = "w-full flex items-center justify-center mt-20";

  weatherApp.innerHTML = `
    <div class="text-center flex flex-col justify-center items-center">
      <img
        class="w-[60px] h-[60px] m-4"
        src="assets/images/icon-error.svg"
        alt="Error"
      />

      <h2 class="text-3xl m-2 font-bold">
        Something went wrong
      </h2>

      <p class="text-xl text-slate-300">
        ${message || "We couldn't load the weather data. Please try again."}
      </p>  

      <button 
        onclick = "location.reload()";
        id="retry-btn"
        type="button"
        class="flex items-center gap-2 bg-[hsl(243,23%,30%)]
        hover:bg-[hsl(243,23%,35%)] mb-20
        px-4 py-2 rounded-lg mt-4 transition-colors"
      >
        <img
          src="assets/images/icon-retry.svg"
          alt=""
          class="w-4 h-4"
        />
        Retry
      </button>
    </div>
  `;
}

async function loadInitialData() {
  try {
    showSkeleton();

    const savedLocation = getSavedLocation();

    if (savedLocation) {
      currentLocation = savedLocation;

      weatherData = await getWeather(
        savedLocation.latitude,
        savedLocation.longitude,
      );

      updateCurrentWeather(savedLocation, weatherData);
      updateWeatherStats(weatherData);
      updateDailyForecast(weatherData);
      populateDaySelector(weatherData.daily);
      updateHourlyForecast(weatherData, 0);

      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        currentLocation = {
          latitude,
          longitude,
          name: "Your Location",
          country: "",
        };

        weatherData = await getWeather(latitude, longitude);

        updateCurrentWeather(currentLocation, weatherData);
        updateWeatherStats(weatherData);
        updateDailyForecast(weatherData);
        populateDaySelector(weatherData.daily);
        updateHourlyForecast(weatherData, 0);
      },

      (error) => {
        console.error("Location error:", error);
        showError("Unable to access your location.");
      },
    );
  } catch (error) {
    console.error("Failed to load initial data:", error);
    showError("Could not load weather data.");
  }
}

function showSkeleton() {
  const weatherCard = document.getElementById("weatherCard");
  const stats = document.getElementById("weatherStats");
  const daily = document.getElementById("dailyForecast");
  const hourly = document.getElementById("hourlyForecast");

  if (!weatherCard || !stats || !daily || !hourly) return;

  weatherCard.classList.add("relative");

  weatherCard.innerHTML = `
    <div class="absolute inset-0 bg-[hsl(243,27%,20%)]/90 rounded-lg
                flex flex-col gap-2 justify-center items-center z-10">
      <img
        src="assets/images/icon-loading.svg"
        class="w-8 h-8"
        alt="Loading"
      />
      <p>Loading...</p>
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
      "w-full",
      "sm:w-[140px]",
      "h-[100px]",
      "animate-pulse",
    );

    skeleton.innerHTML = `
      <p>${weatherStats[i].title}</p>
      <p>--</p>
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
  const iconName = getWeatherIcon(weather.current.weather_code);

  weatherCard.className =
    "bg-[url('assets/images/bg-today-large.svg')] bg-cover bg-center w-full h-[180px] sm:h-[200px] rounded-lg py-3 px-4 sm:px-5";
  weatherCard.innerHTML = `
    <div class="flex justify-between items-center h-full gap-2">
      <div>
        <p id="place" class="text-base sm:text-xl font-semibold">${location.name}, ${location.country}</p>
        <p id="date" class="text-sm opacity-80">${formatDate(weather.current.time)}</p>
      </div>

     <div class="flex items-center gap-4">
        <img
          src="./assets/images/icon-${iconName}.webp"
          alt="${iconName}"
          class="w-14 h-14 sm:w-20 sm:h-20"
        />
       <p id="temperature" class="text-4xl sm:text-6xl font-bold">${Math.round(weather.current.temperature_2m)}°</p>
     </div>
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

    saveLocation(location);

    weatherData = await getWeather(location.latitude, location.longitude);

    updateCurrentWeather(location, weatherData);
    updateWeatherStats(weatherData);
    updateDailyForecast(weatherData);
    populateDaySelector(weatherData.daily);
    updateHourlyForecast(weatherData, 0);
    searchInput.value = "";
  } catch (error) {
    showError(error.message || "City not found");
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
    "w-full",
    "sm:w-[140px]",
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
    "p-3",
    "text-center",
    "w-full",
    "h-[150px]",
    "flex",
    "flex-col",
    "items-center",
  );

  forecastCard.innerHTML = `
    <p class="forecast-day">${dailyForecast.day}</p>

    <img
      src="./assets/images/icon-${dailyForecast.icon}.webp"
      alt="${dailyForecast.icon}"
      class="w-12 h-12 object-contain my-2"
    />

    <div class="flex justify-between items-center w-full mt-auto">
      <span>${dailyForecast.high}°</span>
      <span class="text-[hsl(240,6%,70%)]">${dailyForecast.low}°</span>
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

function updateHourlyForecast(data, dayIndex = 0) {
  const hourlyData = data.hourly;
  fullHourlyData = hourlyData;

  const start = dayIndex * 24;
  const end = start + 24;

  hourlyForecasts = [];

  for (let i = start; i < end && i < hourlyData.time.length; i++) {
    const time = new Date(hourlyData.time[i]);

    hourlyForecasts.push({
      time: time.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      }),
      icon: getWeatherIcon(hourlyData.weather_code[i]),
      temperature: Math.round(hourlyData.temperature_2m[i]),
    });
  }

  renderHourly();
}

unitsBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  unitsMenu.classList.toggle("hidden");
});

document.addEventListener("click", () => {
  unitsMenu.classList.add("hidden");
});

unitsMenu.addEventListener("click", (e) => {
  e.stopPropagation();
});

unitButton.addEventListener("click", () => {
  if (unitButton.dataset.system === "metric") {
    units = {
      temperature: "fahrenheit",
      wind: "mph",
      precipitation: "inch",
    };

    unitButton.dataset.system = "imperial";
    unitButton.textContent = "Switch to Metric";
  } else {
    units = {
      temperature: "celsius",
      wind: "kmh",
      precipitation: "mm",
    };

    unitButton.dataset.system = "metric";
    unitButton.textContent = "Switch to Imperial";
  }

  applyUnits();
});

document.querySelectorAll(".unit-option").forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.type;
    const value = btn.dataset.value;

    units[type] = value;
    applyUnits();
  });
});

loadInitialData();
