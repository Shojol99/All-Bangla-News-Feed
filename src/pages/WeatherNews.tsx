import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Cloud, CloudRain, CloudLightning, Wind, Droplets, Thermometer, Calendar, Clock, ChevronRight, MapPin, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import AdBanner from '../components/AdBanner';

interface WeatherData {
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
  hourly: {
    time: string[];
    weathercode: number[];
    temperature_2m: number[];
    relativehumidity_2m: number[];
    windspeed_10m: number[];
  };
}

const getWeatherIcon = (code: number, className: string = "w-8 h-8") => {
  if (code <= 1) return <Sun className={`${className} text-yellow-400`} />;
  if (code <= 3) return <Cloud className={`${className} text-gray-400`} />;
  if (code <= 65) return <CloudRain className={`${className} text-blue-400`} />;
  return <CloudLightning className={`${className} text-purple-400`} />;
};

const getWeatherDescription = (code: number) => {
  if (code === 0) return 'Clear Sky';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 55) return 'Drizzle';
  if (code <= 65) return 'Rainy';
  if (code <= 77) return 'Snowy';
  if (code <= 82) return 'Rain Showers';
  return 'Thunderstorm';
};

export default function WeatherNews() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      // Dhaka coordinates
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto'
      );
      if (!res.ok) throw new Error('Failed to fetch weather data');
      const data = await res.json();
      setWeather(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError('Could not load weather data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const selectedDayHourly = weather ? weather.hourly.time
    .map((time, i) => ({
      time,
      temp: weather.hourly.temperature_2m[i],
      code: weather.hourly.weathercode[i],
      humidity: weather.hourly.relativehumidity_2m[i],
      wind: weather.hourly.windspeed_10m[i],
    }))
    .filter((item) => {
      const dayDate = weather.daily.time[selectedDayIndex];
      return item.time.startsWith(dayDate);
    }) : [];

  if (error) {
    return (
      <div className="min-h-screen bg-bg-main pt-12 sm:pt-20 md:pt-32 pb-12 sm:pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-4 tracking-tight">
              Dhaka Weather <span className="text-brand-red">Forecast</span>
            </h1>
          </header>
          
          <div className="max-w-md w-full bg-bg-surface p-8 rounded-brand-2xl border border-border-subtle shadow-brand-lg text-center mx-auto">
            <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-brand-red" />
            </div>
            <h2 className="text-2xl font-black text-text-primary mb-2">Weather Unavailable</h2>
            <p className="text-text-secondary mb-8">{error}</p>
            <button 
              onClick={fetchWeather}
              className="w-full py-4 bg-brand-red text-white font-bold rounded-brand-xl hover:bg-brand-red/90 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main pt-12 sm:pt-20 md:pt-32 pb-12 sm:pb-20 px-4">
      <Helmet>
        <title>Weather News & Forecast | All Bangla News Feed</title>
        <meta name="description" content="Get the latest weather news and a detailed 7-day forecast for Dhaka and across Bangladesh. Accurate hourly updates for temperature, wind, and humidity." />
        <meta name="keywords" content="Dhaka weather, Bangladesh weather forecast, hourly weather Dhaka, 7 day weather forecast Bangladesh" />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red/10 text-brand-red rounded-full text-sm font-bold mb-4"
          >
            <CloudRain className="w-4 h-4" />
            <span>Live Weather Updates</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-4 tracking-tight">
            Dhaka Weather <span className="text-brand-red">Forecast</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Stay ahead of the weather with our detailed weekly and hourly reports. 
            Accurate data for planning your week in Bangladesh.
          </p>
        </header>

        <AdBanner position="hero" currentPage="weather" />

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-20 bg-bg-surface rounded-brand-xl border border-border-subtle animate-pulse" />
              ))}
            </div>
            <div className="lg:col-span-2">
              <div className="bg-bg-surface rounded-brand-2xl border border-border-subtle p-8 h-[600px] animate-pulse" />
            </div>
          </div>
        ) : !weather ? (
          <div className="text-center py-20">
            <p className="text-text-muted">No weather data available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weekly Overview */}
            <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-text-primary flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-red" />
                7-Day Forecast
              </h2>
              <span className="lg:hidden text-[10px] font-bold text-text-muted uppercase tracking-widest animate-pulse">
                Swipe →
              </span>
            </div>
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide snap-x snap-mandatory">
              {weather.daily.time.map((date, i) => (
                <motion.button
                  key={date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedDayIndex(i)}
                  className={`flex-shrink-0 w-64 lg:w-full flex items-center justify-between p-4 rounded-brand-xl border transition-all snap-start ${
                    selectedDayIndex === i
                      ? 'bg-brand-red text-white border-brand-red shadow-brand-lg scale-[1.02]'
                      : 'bg-bg-surface text-text-primary border-border-subtle hover:border-brand-red/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${selectedDayIndex === i ? 'bg-white/20' : 'bg-bg-main'}`}>
                      {getWeatherIcon(weather.daily.weathercode[i], "w-6 h-6")}
                    </div>
                    <div className="text-left">
                      <p className="font-bold">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}
                      </p>
                      <p className={`text-xs ${selectedDayIndex === i ? 'text-white/80' : 'text-text-muted'}`}>
                        {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg">{Math.round(weather.daily.temperature_2m_max[i])}°</p>
                    <p className={`text-xs ${selectedDayIndex === i ? 'text-white/80' : 'text-text-muted'}`}>
                      {Math.round(weather.daily.temperature_2m_min[i])}°
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Hourly Details */}
          <div className="lg:col-span-2">
            <div className="bg-bg-surface rounded-brand-2xl border border-border-subtle p-6 md:p-8 shadow-brand-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-black text-text-primary flex items-center gap-2">
                    <Clock className="w-6 h-6 text-brand-red" />
                    Hourly Breakdown
                  </h2>
                  <p className="text-text-muted text-sm mt-1">
                    Detailed report for {new Date(weather.daily.time[selectedDayIndex]).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-4 bg-bg-main px-4 py-2 rounded-full border border-border-subtle">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary">
                    <MapPin className="w-3.5 h-3.5 text-brand-red" />
                    Dhaka, BD
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <AnimatePresence mode="wait">
                  {selectedDayHourly.map((hour, i) => {
                    const hourDate = new Date(hour.time);
                    const now = new Date();
                    const isCurrentHour = 
                      hourDate.getHours() === now.getHours() && 
                      hourDate.getDate() === now.getDate() && 
                      hourDate.getMonth() === now.getMonth() && 
                      hourDate.getFullYear() === now.getFullYear();

                    return (
                      <motion.div
                        key={hour.time}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.02 }}
                        className={`p-4 rounded-brand-xl border transition-all group relative ${
                          isCurrentHour 
                            ? 'bg-brand-red/5 border-brand-red shadow-brand-sm ring-1 ring-brand-red/20' 
                            : 'bg-bg-main border-border-subtle hover:border-brand-red/20'
                        }`}
                      >
                        {isCurrentHour && (
                          <div className="absolute -top-2 -right-2 bg-brand-red text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-brand-sm z-10">
                            Current
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs font-black uppercase tracking-widest ${isCurrentHour ? 'text-brand-red' : 'text-text-muted'}`}>
                            {hourDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {getWeatherIcon(hour.code, "w-5 h-5")}
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-2xl font-black text-text-primary">{Math.round(hour.temp)}°C</p>
                            <p className="text-[10px] font-bold text-brand-red uppercase tracking-tighter">
                              {getWeatherDescription(hour.code)}
                            </p>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted">
                              <Droplets className="w-3 h-3 text-blue-400" />
                              {hour.humidity}%
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted">
                              <Wind className="w-3 h-3 text-brand-green" />
                              {Math.round(hour.wind)} km/h
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Weather News Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-brand-red/5 to-transparent p-6 rounded-brand-2xl border border-brand-red/10">
                <h3 className="font-black text-text-primary mb-2">Weather Alert</h3>
                <p className="text-sm text-text-secondary">
                  No major alerts for Dhaka today. Expect clear skies in the evening with a slight breeze from the North.
                </p>
              </div>
              <div className="bg-gradient-to-br from-brand-green/5 to-transparent p-6 rounded-brand-2xl border border-brand-green/10">
                <h3 className="font-black text-text-primary mb-2">Agriculture Tip</h3>
                <p className="text-sm text-text-secondary">
                  Ideal conditions for irrigation today. Humidity levels are optimal for seasonal crops in the central region.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
