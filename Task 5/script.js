// Weather App - Task 5
// API Configuration
const API_KEY = 'be25024f2f17c8dd32cea770b739ce49'; 
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const AIR_QUALITY_API_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';
const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';

// DOM Elements
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const currentLocationBtn = document.getElementById('current-location-btn');
const weatherCard = document.getElementById('weather-card');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const forecastContainer = document.getElementById('forecast-container');

// Weather Data Elements
const locationName = document.getElementById('location-name');
const dateTime = document.getElementById('date-time');
const weatherIconImg = document.getElementById('weather-icon-img');
const temperatureEl = document.getElementById('temperature');
const weatherDescriptionEl = document.getElementById('weather-description');
const feelsLikeEl = document.getElementById('feels-like');
const windSpeedEl = document.getElementById('wind-speed');
const humidityEl = document.getElementById('humidity');
const pressureEl = document.getElementById('pressure');
const visibilityEl = document.getElementById('visibility');
const sunriseTimeEl = document.getElementById('sunrise-time');
const sunsetTimeEl = document.getElementById('sunset-time');
const airQualityIndex = document.getElementById('air-quality-index');
const airQualityCircle = document.getElementById('air-quality-circle');
const airQualityText = document.getElementById('air-quality-text');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    searchBtn.addEventListener('click', handleSearch);
    currentLocationBtn.addEventListener('click', handleCurrentLocation);
    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Initial load - use default city
    getWeatherData('Vadodara');
});

// Handle search button click
function handleSearch() {
    const location = locationInput.value.trim();
    if (location) {
        getWeatherData(location);
    } else {
        showError('Please enter a location');
    }
}

// Handle current location button click
function handleCurrentLocation() {
    if (navigator.geolocation) {
        showLoader();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherDataByCoords(latitude, longitude);
            },
            (error) => {
                hideLoader();
                showError('Could not get your location. Please allow location access or enter location manually.');
                console.error(error);
            }
        );
    } else {
        showError('Geolocation is not supported by your browser');
    }
}

// Fetch weather data by city name
async function getWeatherData(city) {
    try {
        showLoader();
        hideError();
        
        if (!city || city.trim() === '') {
            throw new Error('Please enter a valid city name');
        }
        
        // Current weather
        const weatherResponse = await fetch(`${WEATHER_API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
        
        if (!weatherResponse.ok) {
            throw new Error(await handleApiError(weatherResponse));
        }
        
        const weatherData = await weatherResponse.json();
        
        try {
            // Forecast data
            const forecastData = await getForecastData(city);
            
            // Air quality data
            const airQualityData = await getAirQualityData(weatherData.coord.lat, weatherData.coord.lon);
            
            // Update UI with fetched data
            updateUI(weatherData, forecastData, airQualityData);
        } catch (forecastError) {
            console.error('Error fetching forecast or air quality:', forecastError);
            // Still update UI with the weather data we have
            updateUI(weatherData, null, null);
        }
        
        hideLoader();
    } catch (error) {
        hideLoader();
        showError(error.message || 'Failed to fetch weather data');
        console.error(error);
    }
}

// Fetch weather data by coordinates
async function getWeatherDataByCoords(lat, lon) {
    try {
        showLoader();
        hideError();
        
        if (!lat || !lon) {
            throw new Error('Invalid coordinates provided');
        }
        
        // Current weather
        const weatherResponse = await fetch(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        if (!weatherResponse.ok) {
            throw new Error(await handleApiError(weatherResponse));
        }
        
        const weatherData = await weatherResponse.json();
        
        try {
            // Forecast data
            const forecastData = await getForecastDataByCoords(lat, lon);
            
            // Air quality data
            const airQualityData = await getAirQualityData(lat, lon);
            
            // Update UI with fetched data
            updateUI(weatherData, forecastData, airQualityData);
        } catch (forecastError) {
            console.error('Error fetching forecast or air quality:', forecastError);
            // Still update UI with the weather data we have
            updateUI(weatherData, null, null);
        }
        
        hideLoader();
    } catch (error) {
        hideLoader();
        showError(error.message || 'Failed to fetch weather data');
        console.error(error);
    }
}

// Fetch 5-day forecast data
async function getForecastData(city) {
    const response = await fetch(`${FORECAST_API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    
    if (!response.ok) {
        throw new Error(await handleApiError(response));
    }
    
    return await response.json();
}

// Fetch 5-day forecast data by coordinates
async function getForecastDataByCoords(lat, lon) {
    const response = await fetch(`${FORECAST_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    
    if (!response.ok) {
        throw new Error(await handleApiError(response));
    }
    
    return await response.json();
}

// Fetch air quality data
async function getAirQualityData(lat, lon) {
    try {
        const response = await fetch(`${AIR_QUALITY_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        
        if (!response.ok) {
            return null; // Air quality data is optional, don't fail the whole request
        }
        
        return await response.json();
    } catch (error) {
        console.error('Air quality data fetch failed:', error);
        return null; // Return null for optional data
    }
}

// Handle API errors
async function handleApiError(response) {
    try {
        const errorData = await response.json();
        return errorData.message || 'Unknown error occurred';
    } catch (e) {
        return `HTTP error! Status: ${response.status}`;
    }
}

// Update UI with weather data
function updateUI(weatherData, forecastData, airQualityData) {
    // Update current weather
    locationName.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
    dateTime.textContent = formatDateTime(new Date());
    
    // Weather icon
    weatherIconImg.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    weatherIconImg.alt = weatherData.weather[0].description;
    
    // Temperature and description
    temperatureEl.textContent = Math.round(weatherData.main.temp);
    weatherDescriptionEl.textContent = capitalizeFirstLetter(weatherData.weather[0].description);
    feelsLikeEl.textContent = `Feels like: ${Math.round(weatherData.main.feels_like)} °C`;
    
    // Weather details
    windSpeedEl.textContent = `${weatherData.wind.speed} m/s`;
    humidityEl.textContent = `${weatherData.main.humidity}%`;
    pressureEl.textContent = `${weatherData.main.pressure} hPa`;
    visibilityEl.textContent = `${(weatherData.visibility / 1000).toFixed(1)} km`;
    
    // Sunrise and sunset
    sunriseTimeEl.textContent = formatTime(new Date(weatherData.sys.sunrise * 1000));
    sunsetTimeEl.textContent = formatTime(new Date(weatherData.sys.sunset * 1000));
    
    // Update forecast
    updateForecast(forecastData);
    
    // Update air quality if available
    if (airQualityData && airQualityData.list && airQualityData.list.length > 0) {
        updateAirQuality(airQualityData.list[0].main.aqi);
    } else {
        airQualityIndex.textContent = '--';
        airQualityCircle.className = 'air-quality-circle';
        airQualityText.textContent = 'Air quality data not available';
    }
    
    // Change background based on weather condition
    updateBackgroundBasedOnWeather(weatherData);
    
    // Show weather card with animation
    weatherCard.style.display = 'block';
    
    // Check if elements exist before trying to show them
    const forecastSection = document.querySelector('.forecast-section');
    const weatherSecondary = document.querySelector('.weather-secondary');
    
    if (forecastSection) forecastSection.style.display = 'block';
    if (weatherSecondary) weatherSecondary.style.display = 'flex';
}

// Update background based on weather condition
function updateBackgroundBasedOnWeather(weatherData) {
    const weatherMain = weatherData.weather[0].main.toLowerCase();
    const weatherId = weatherData.weather[0].id;
    const isDay = weatherData.weather[0].icon.includes('d');
    const temp = weatherData.main.temp;
    
    // Remove all previous weather classes
    document.body.classList.remove('clear', 'clouds', 'rain', 'thunderstorm', 'snow', 'mist', 'fog', 'haze', 'dust', 'sand');
    document.body.classList.remove('day', 'night', 'hot', 'cold');
    
    // Add current weather class
    document.body.classList.add(weatherMain);
    
    // Add time of day class
    document.body.classList.add(isDay ? 'day' : 'night');
    
    // Add temperature class
    if (temp > 30) {
        document.body.classList.add('hot');
    } else if (temp < 0) {
        document.body.classList.add('cold');
    }
    
   
}

// Update 5-day forecast
function updateForecast(forecastData) {
    // Clear existing forecast
    if (!forecastContainer) return;
    forecastContainer.innerHTML = '';
    
    // Safety check for forecast data
    if (!forecastData || !forecastData.list || forecastData.list.length === 0) {
        const noDataMessage = document.createElement('div');
        noDataMessage.className = 'forecast-error';
        noDataMessage.textContent = 'Forecast data is not available';
        forecastContainer.appendChild(noDataMessage);
        return;
    }
    
    // Group forecast data by day
    const dailyForecasts = groupForecastByDay(forecastData.list);
    
    // Create forecast cards (limit to 5 days)
    const days = Object.keys(dailyForecasts).slice(0, 5);
    
    // Handle case where no daily forecasts are available
    if (days.length === 0) {
        const noDataMessage = document.createElement('div');
        noDataMessage.className = 'forecast-error';
        noDataMessage.textContent = 'No forecast data available for the next 5 days';
        forecastContainer.appendChild(noDataMessage);
        return;
    }
    
    days.forEach(day => {
        // Use mid-day forecast for each day (or first available)
        const dayData = getDayForecast(dailyForecasts[day]);
        
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        
        forecastCard.innerHTML = `
            <div class="forecast-day">${formatDay(new Date(dayData.dt * 1000))}</div>
            <div class="forecast-icon">
                <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png" alt="${dayData.weather[0].description}">
            </div>
            <div class="forecast-temp">${Math.round(dayData.main.temp)}°C</div>
            <div class="forecast-desc">${capitalizeFirstLetter(dayData.weather[0].description)}</div>
        `;
        
        forecastContainer.appendChild(forecastCard);
    });
}

// Get representative forecast for a day (prefer mid-day)
function getDayForecast(dayForecasts) {
    // Look for a forecast around noon (12:00 - 15:00)
    const midDayForecast = dayForecasts.find(forecast => {
        const hour = new Date(forecast.dt * 1000).getHours();
        return hour >= 12 && hour <= 15;
    });
    
    // If no mid-day forecast, return the middle item from the array or the first one
    return midDayForecast || dayForecasts[Math.floor(dayForecasts.length / 2)] || dayForecasts[0];
}

// Group forecast data by day
function groupForecastByDay(forecastList) {
    const dailyForecasts = {};
    
    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toISOString().split('T')[0];
        
        if (!dailyForecasts[day]) {
            dailyForecasts[day] = [];
        }
        
        dailyForecasts[day].push(forecast);
    });
    
    return dailyForecasts;
}

// Update air quality indicator
function updateAirQuality(aqi) {
    const airQualityMap = {
        1: { text: 'Good', color: 'var(--air-good)', description: 'Air quality is good. Enjoy your outdoor activities.' },
        2: { text: 'Fair', color: 'var(--air-fair)', description: 'Air quality is fair. Most people can enjoy outdoor activities.' },
        3: { text: 'Moderate', color: 'var(--air-moderate)', description: 'Air quality is moderate. Sensitive individuals should limit prolonged outdoor activities.' },
        4: { text: 'Poor', color: 'var(--air-poor)', description: 'Air quality is poor. Everyone should reduce outdoor activities.' },
        5: { text: 'Very Poor', color: 'var(--air-very-poor)', description: 'Air quality is very poor. Avoid outdoor activities if possible.' }
    };
    
    const quality = airQualityMap[aqi] || { text: 'Unknown', color: 'var(--primary-color)', description: 'Air quality data is unavailable or cannot be interpreted.' };
    
    airQualityIndex.textContent = aqi;
    airQualityCircle.style.backgroundColor = quality.color;
    airQualityText.textContent = quality.text;
    
    // Add the description if the element exists
    const descElement = document.querySelector('.air-quality-description');
    if (descElement) {
        descElement.textContent = quality.description;
    }
}

// Helper Functions
function formatDateTime(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatDay(date) {
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// UI Helper Functions
function showLoader() {
    loader.style.display = 'flex';
    weatherCard.style.display = 'none';
    
    // Check if elements exist before trying to hide them
    const forecastSection = document.querySelector('.forecast-section');
    const weatherSecondary = document.querySelector('.weather-secondary');
    
    if (forecastSection) forecastSection.style.display = 'none';
    if (weatherSecondary) weatherSecondary.style.display = 'none';
    
    hideError();
}

function hideLoader() {
    loader.style.display = 'none';
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
    errorMessage.style.animation = 'fade-in 0.3s ease-out forwards';
}

function hideError() {
    errorMessage.style.display = 'none';
} 
