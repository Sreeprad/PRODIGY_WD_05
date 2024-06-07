async function getWeather() {
  const city = document.getElementById("city-input").value;
  const apiKey = "810b31b64bc622e70f9f8e7fc744782a"; // Your OpenWeatherMap API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    alert(error.message);
  }
}

function displayWeather(data) {
  const weatherInfo = document.getElementById("weather-info");

  // Calculate Indian Standard Time (IST)
  let now = new Date();
  let istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  let indianTime = new Date(now.getTime() + istOffset);
  let hours = indianTime.getUTCHours();
  let minutes = indianTime.getUTCMinutes().toString().padStart(2, "0");
  let period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format
  let indianTimeString = `${hours}:${minutes} ${period}`;

  weatherInfo.innerHTML = `
    <div class="weather-header">
        <h2 class="city-name">${data.name}, ${data.sys.country}</h2>
        <p class="indian-time" style="font-size: 24px;"> ${indianTimeString}</p>
    </div>
    <div class="temperature">
        <p>${data.main.temp}°C</p>
    </div>
    <div class="extra-info">
        <div class="humidity">
            <img id="humidity-icon" src="Humidity.png" alt="Humidity Icon">
            <p id="humidity-text">${data.main.humidity}%</p>
        </div>
        <div class="wind-speed">
            <img id="wind-speed-icon" src="Wind_Speed.png" alt="Wind Speed Icon">
            <p id="wind-speed-text">${data.wind.speed} m/s</p>
        </div>
    </div>
    <div class="weather-icon">
        <img id="temp-icon" src="" alt="Weather Icon">
    </div>
`;

  weatherInfo.style.display = "block";

  const tempIcon = document.getElementById("temp-icon");

  // TempIcons code
  if (data.weather[0].id < 250) {
    // Thunderstorm
    tempIcon.src = `Weather_Icons/THUNDER.png`;
  } else if (data.weather[0].id < 350) {
    // Drizzle
    if (data.weather[0].id >= 300 && data.weather[0].id < 310) {
      // Light intensity drizzle rain
      tempIcon.src = `Weather_Icons/MOON_CLOUDS_RAIN.png`;
    } else {
      tempIcon.src = `Weather_Icons/MOON_CLOUDS_RAIN_THUNDER.png`;
    }
  } else if (data.weather[0].id < 550) {
    // Rain
    if (data.weather[0].id >= 500 && data.weather[0].id < 510) {
      // Light rain
      tempIcon.src = `Weather_Icons/CLOUDS_RAIN.png`;
    } else {
      tempIcon.src = `Weather_Icons/SUN_CLOUDS_RAIN.png`;
    }
  } else if (data.weather[0].id < 650) {
    // Snow
    if (data.weather[0].id >= 600 && data.weather[0].id < 610) {
      // Light snow
      tempIcon.src = `Weather_Icons/CLOUDS_SNOW.png`;
    } else {
      tempIcon.src = `Weather_Icons/SUN_CLOUDS_SNOW.png`;
    }
  } else if (data.weather[0].id < 800) {
    // Atmosphere (e.g., mist, smoke, haze)
    tempIcon.src = `Weather_Icons/WINDS.png`;
  } else if (data.weather[0].id === 800) {
    // Clear
    if (data.sys.pod === "n") {
      // Night
      tempIcon.src = `Weather_Icons/CLEAR_NIGHT_SKY.png`;
    } else {
      // Day
      tempIcon.src = `Weather_Icons/CLEAR_DAY_SKY.png`;
    }
  } else if (data.weather[0].id > 800) {
    // Clouds
    if (data.sys.pod === "n") {
      // Night
      tempIcon.src = `Weather_Icons/MOON_CLOUDS.png`;
    } else {
      // Day
      tempIcon.src = `Weather_Icons/SUN_CLOUDS.png`;
    }
  }
}

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get the input element
  const input = document.getElementById("city-input");

  // Add an event listener for keypress events on the input element
  input.addEventListener("keypress", function (event) {
    // Check if the Enter key is pressed
    if (event.key === "Enter") {
      // Prevent the default action (form submission, etc.)
      event.preventDefault();
      // Trigger the getWeather function
      getWeather();
    }
  });
});
