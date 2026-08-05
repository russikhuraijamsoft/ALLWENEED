import React from 'react';

function weatherCodeToEmoji(code: number) {
  // Simplified mapping from Open-Meteo weathercode
  if (code === 0) return '☀️ Clear';
  if (code === 1 || code === 2 || code === 3) return '⛅ Partly Cloudy';
  if (code >= 45 && code <= 48) return '🌫️ Fog';
  if (code >= 51 && code <= 67) return '🌦️ Drizzle/Rain';
  if (code >= 71 && code <= 77) return '🌨️ Snow';
  if (code >= 80 && code <= 82) return '🌧️ Rain showers';
  if (code >= 85 && code <= 86) return '❄️ Heavy snow';
  if (code >= 95 && code <= 99) return '⛈️ Thunderstorm';
  return '🌈';
}

export default function WeatherCard({ forecast }: { forecast: any }) {
  const current = forecast.current_weather;
  const daily = forecast.daily;

  return (
    <div className="card">
      {current ? (
        <div className="current">
          <div className="current-left">
            <div className="temp">{Math.round(current.temperature)}°C</div>
            <div className="desc">{weatherCodeToEmoji(current.weathercode)}</div>
          </div>
          <div className="current-right">
            <div>Wind: {Math.round(current.windspeed)} km/h</div>
            <div>Direction: {Math.round(current.winddirection)}°</div>
            <div>Time: {new Date(current.time).toLocaleString()}</div>
          </div>
        </div>
      ) : (
        <div>No current weather available.</div>
      )}

      {daily ? (
        <div className="daily">
          <h3>7-day forecast</h3>
          <div className="daily-grid">
            {daily.time.map((t: string, i: number) => (
              <div key={t} className="day">
                <div className="day-date">{new Date(t).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}</div>
                <div className="day-emoji">{weatherCodeToEmoji(daily.weathercode[i] ?? 0)}</div>
                <div className="day-temp">
                  <span className="max">{Math.round(daily.temperature_2m_max[i])}°</span>
                  <span className="min">{Math.round(daily.temperature_2m_min[i])}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
