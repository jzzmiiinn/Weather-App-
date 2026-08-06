const stats = document.getElementById("weatherStats");
const daily = document.getElementById("dailyForecast");
const hourly = document.getElementById("hourlyForecast");
const place = document.getElementById("place");
const date = document.getElementById("date");
const temperature = document.getElementById("temperature");

const weatherStats = [
  {
    title: "Feels Like",
    value: "18°",
  },
  {
    title: "Humidity",
    value: "46%",
  },
  {
    title: "Wind",
    value: "14 km/h",
  },
  {
    title: "Precipitation",
    value: "0 mm",
  },
];

const dailyForecasts = [
  {
    day: "Tue",
    icon: "rain",
    high: 20,
    low: 14,
  },
  {
    day: "Wed",
    icon: "storm",
    high: 21,
    low: 15,
  },
  {
    day: "Thu",
    icon: "sunny",
    high: 24,
    low: 14,
  },
  {
    day: "Fri",
    icon: "partly-cloudy",
    high: 25,
    low: 13,
  },
  {
    day: "Sat",
    icon: "storm",
    high: 21,
    low: 15,
  },
  {
    day: "Sun",
    icon: "snow",
    high: 25,
    low: 16,
  },
  {
    day: "Mon",
    icon: "fog",
    high: 24,
    low: 15,
  },
];

const hourlyForecasts = [
  {
    time: "3 PM",
    icon: "overcast",
    temperature: 20,
  },
  {
    time: "4 PM",
    icon: "partly-cloudy",
    temperature: 20,
  },
  {
    time: "5 PM",
    icon: "sunny",
    temperature: 20,
  },
  {
    time: "6 PM",
    icon: "overcast",
    temperature: 19,
  },
  {
    time: "7 PM",
    icon: "snow",
    temperature: 18,
  },
  {
    time: "8 PM",
    icon: "fog",
    temperature: 18,
  },
  {
    time: "9 PM",
    icon: "rain",
    temperature: 17,
  },
  {
    time: "10 PM",
    icon: "overcast",
    temperature: 17,
  },
];

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

function renderStats() {
  stats.innerHTML = "";
  for (let stat of weatherStats) {
    stats.append(createWeatherItems(stat));
  }
}

function renderDaily() {
  daily.innerHTML = "";
  for (let dailyForecast of dailyForecasts) {
    daily.append(createDailyItems(dailyForecast));
  }
}

function renderHourly() {
  hourly.innerHTML = "";
  for (let hourlyForecast of hourlyForecasts) {
    hourly.append(createHourlyItems(hourlyForecast));
  }
}

renderStats();
renderDaily();
renderHourly();
