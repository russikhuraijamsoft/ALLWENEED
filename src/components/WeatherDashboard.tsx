import React, { useState } from 'react';
import WeatherCard from './WeatherCard';

type GeoResult = {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
};

type Forecast = {
  latitude: number;
  longitude: number;
  timezone: string;
  current_weather?: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  };
};

export default function WeatherDashboard() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);

  async function searchLocation() {
    if (!query.trim()) return;
    setError(null);
    setLoading(true);
    setSuggestions([]);
    setForecast(null);

    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query
      )}&count=5&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Geocoding failed');
      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        setError('No locations found.');
        setLoading(false);
        return;
      }
      const results: GeoResult[] = data.results.map((r: any) => ({
        name: r.name,
        country: r.country,
        latitude: r.latitude,
        longitude: r.longitude,
        timezone: r.timezone,
      }));
      setSuggestions(results);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }

  async function pickLocation(loc: GeoResult) {
    setError(null);
    setLoading(true);
    setSuggestions([]);
    setForecast(null);
    setLocationLabel(`${loc.name}${loc.country ? ', ' + loc.country : ''}`);

    try {
      const lat = loc.latitude;
      const lon = loc.longitude;
      const params = new URLSearchParams({
        latitude: String(lat),
        longitude: String(lon),
        current_weather: 'true',
        timezone: 'auto',
        daily: ['temperature_2m_max', 'temperature_2m_min', 'weathercode'].join(','),
      });
      const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather fetch failed');
      const data = await res.json();
      setForecast(data);
    } catch (err: any) {
      setError(err.message || 'Forecast failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="dashboard">
      <div className="search">
        <input
          aria-label="Search city"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') searchLocation();
          }}
          placeholder="Search city (e.g., London, Tokyo)"
        />
        <button onClick={searchLocation} disabled={loading}>
          Search
        </button>
      </div>

      {loading && <div className="status">Loading…</div>}
      {error && <div className="status error">{error}</div>}

      {suggestions.length > 0 && (
        <div className="suggestions">
          <h3>Choose location</h3>
          <ul>
            {suggestions.map((s, i) => (
              <li key={i}>
                <button className="link-button" onClick={() => pickLocation(s)}>
                  {s.name}
                  {s.country ? `, ${s.country}` : ''} — {s.latitude.toFixed(2)}, {s.longitude.toFixed(2)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {forecast && (
        <div className="results">
          <h2>{locationLabel}</h2>
          <WeatherCard forecast={forecast} />
        </div>
      )}
    </section>
  );
}
