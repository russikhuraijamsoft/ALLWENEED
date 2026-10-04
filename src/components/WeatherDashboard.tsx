import React, { useState } from 'react';
import WeatherCard from './WeatherCard';

interface GeoResult {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

interface Forecast {
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
}

export default function WeatherDashboard() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);

  async function searchLocation() {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('Please enter a city name');
      return;
    }

    setError(null);
    setLoading(true);
    setSuggestions([]);
    setForecast(null);

    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        trimmedQuery
      )}&count=5&language=en&format=json`;
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Geocoding API error: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (!data.results || data.results.length === 0) {
        setError('No locations found. Try a different city name.');
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
      console.error('Search error:', err);
      setError(err.message || 'Failed to search locations. Please try again.');
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
      
      if (!res.ok) {
        throw new Error(`Weather API error: ${res.status}`);
      }
      
      const data = await res.json();
      setForecast(data);
    } catch (err: any) {
      console.error('Forecast error:', err);
      setError(err.message || 'Failed to fetch weather forecast. Please try again.');
      setLocationLabel(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="dashboard">
      <div className="search">
        <input
          aria-label="Search city"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              searchLocation();
            }
          }}
          placeholder="Search city (e.g., London, Tokyo)"
          disabled={loading}
        />
        <button onClick={searchLocation} disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>

      {loading && <div className="status">Loading…</div>}
      {error && <div className="status error">{error}</div>}

      {suggestions.length > 0 && (
        <div className="suggestions">
          <h3>Choose location</h3>
          <ul>
            {suggestions.map((s) => (
              <li key={`${s.latitude}-${s.longitude}`}>
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
