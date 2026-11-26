const apiKey = "30078e83c5a3a2b3337c72e9afbd17d9";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherIcon = document.getElementById("weather-icon");
const dashboard = document.getElementById("dashboard");
const errorMsg = document.getElementById("error-msg");

// Initialize Native Dark Map (Works directly from file:// without blocking)
let map = L.map('map').setView([6.9271, 79.8612], 11);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; Esri',
    maxZoom: 16
}).addTo(map);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16
}).addTo(map);

// Custom Glowing Blue Pin Icon
const glowingPin = L.divIcon({
    className: 'custom-pin',
    html: `<div style="
        width: 22px;
        height: 22px;
        background: #38bdf8;
        border: 3px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 20px #38bdf8, 0 0 40px #2563eb;
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
});

let marker = L.marker([6.9271, 79.8612], { icon: glowingPin }).addTo(map);

async function checkWeather(city) {
    if (!city) return;

    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

        if (!response.ok) {
            if (response.status === 401) {
                errorMsg.querySelector("p").innerText = "API Key Not Active ";
            } else {
                errorMsg.querySelector("p").innerText = "Invalid city name. Please try again!";
            }
            errorMsg.style.display = "block";
            dashboard.style.display = "none";
            return;
        }

        const data = await response.json();

        document.getElementById("city").innerText = data.name;
        document.getElementById("country").innerText = data.sys.country;
        document.getElementById("temp").innerText = Math.round(data.main.temp) + "°C";
        document.getElementById("description").innerText = data.weather[0].description;
        document.getElementById("humidity").innerText = data.main.humidity + "%";
        document.getElementById("wind").innerText = data.wind.speed + " km/h";

        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        dashboard.style.display = "grid";
        errorMsg.style.display = "none";

        // Update Map Location
        const lat = data.coord.lat;
        const lon = data.coord.lon;

        setTimeout(() => {
            map.invalidateSize();
            map.flyTo([lat, lon], 11, { duration: 1.5 });
            marker.setLatLng([lat, lon]).bindPopup(`<b>${data.name}</b><br>${Math.round(data.main.temp)}°C`).openPopup();
        }, 100);

    } catch (error) {
        console.error("Error fetching weather data:", error);
        errorMsg.querySelector("p").innerText = "Network error!.";
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

checkWeather("Colombo");