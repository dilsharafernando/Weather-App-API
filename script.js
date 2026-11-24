const apiKey = "30078e83c5a3a2b3337c72e9afbd17d9";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherIcon = document.getElementById("weather-icon");
const weatherBox = document.getElementById("weather-box");
const errorMsg = document.getElementById("error-msg");

async function checkWeather(city) {
    if (!city) return;

    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

        if (!response.ok) {
            if (response.status === 401) {
                errorMsg.querySelector("p").innerText = "API Key Not Valid! Please check your API key.";
            } else {
                errorMsg.querySelector("p").innerText = "Invalid city name. Please try again!";
            }
            errorMsg.style.display = "block";
            weatherBox.style.display = "none";
            return;
        }

        const data = await response.json();

        document.getElementById("city").innerHTML = data.name;
        document.getElementById("temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.getElementById("description").innerHTML = data.weather[0].description;
        document.getElementById("humidity").innerHTML = data.main.humidity + "%";
        document.getElementById("wind").innerHTML = data.wind.speed + " km/h";

        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        weatherBox.style.display = "block";
        errorMsg.style.display = "none";
    } catch (error) {
        console.error("Error fetching weather data:", error);
        errorMsg.querySelector("p").innerText = "Network error! Internet connection eka check karanna.";
        errorMsg.style.display = "block";
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value.trim());
});

searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value.trim());
    }
});