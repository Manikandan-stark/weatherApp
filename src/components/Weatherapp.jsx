import "./Weather.css";
import clear_icons from "../assets/clear.png";
import cloud_icons from "../assets/cloud.png";
import drizzle_icons from "../assets/drizzle.png";
import humidity_icons from "../assets/humidity.png";
import rain_icons from "../assets/rain.png";
import search_icons from "../assets/search.png";
import wind_icons from "../assets/wind.png";
import { useEffect, useRef, useState } from "react";

const Weatherapp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const allIcons = {
    "01d": clear_icons,
    "01n": clear_icons,
    "02d": cloud_icons,
    "02n": cloud_icons,
    "03d": drizzle_icons,
    "03n": drizzle_icons,
    "04d": cloud_icons,
    "04n": cloud_icons,
    "09d": rain_icons,
    "09n": rain_icons,
    "10d": rain_icons,
    "10n": rain_icons,
    "13d": clear_icons,
    "13n": clear_icons,
  };

  const search = async (city) => {
    if (!city) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch weather data");
      }

      const weatherIcon = allIcons[data.weather[0].icon] || clear_icons;
      setWeatherData({
        humidity: data.main.humidity,
        wind: data.wind.speed,
        temperature: Math.floor(data.main.temp), // Fixed Math.floor
        location: data.name,
        icon: weatherIcon,
      });
    } catch (error) {
      setError(error.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search(""); // Default city
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      search(inputRef.current.value);
    }
  };

  return (
    <div className="Weather">
      <h1>Weather App</h1>

      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search location"
          onKeyDown={handleKeyPress}
        />
        <img
          src={search_icons}
          alt="Search"
          onClick={() => search(inputRef.current.value)}
          tabIndex={0}
          onKeyDown={handleKeyPress}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weatherData && (
        <>
          <img src={weatherData.icon} alt="Weather" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="city">{weatherData.location}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icons} alt="Humidity" />
              <p>{weatherData.humidity}%</p>
              <p>Humidity</p>
            </div>
            <div className="col">
              <img src={wind_icons} alt="Wind speed" />
              <p>{weatherData.wind} km/h</p>
              <p>Wind Speed</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weatherapp;
