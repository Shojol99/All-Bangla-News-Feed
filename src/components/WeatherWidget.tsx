import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, MapPin, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('Dhaka');

  useEffect(() => {
    async function fetchWeather() {
      try {
        // Dhaka coordinates
        const lat = 23.8103;
        const lon = 90.4125;
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
        const data = await response.json();
        setWeather(data.current_weather);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-5 h-5 text-brand-gold" />;
    if (code <= 3) return <Cloud className="w-5 h-5 text-text-muted" />;
    return <CloudRain className="w-5 h-5 text-brand-red" />;
  };

  if (loading) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 md:gap-4 px-2 md:px-3 py-1 md:py-1.5 bg-bg-surface/50 rounded-full border border-border-subtle/50"
    >
      <div className="flex items-center gap-1 md:gap-1.5 text-[8px] md:text-[10px] font-bold text-text-secondary">
        <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3 text-brand-red" />
        <span>{location}</span>
      </div>
      
      {weather && (
        <div className="flex items-center gap-1.5 md:gap-2 border-l border-border-subtle/50 pl-2 md:pl-3">
          <div className="scale-75 md:scale-100">
            {getWeatherIcon(weather.weathercode)}
          </div>
          <span className="text-[10px] md:text-xs font-black text-text-primary">{Math.round(weather.temperature)}°C</span>
        </div>
      )}

      <div className="flex items-center gap-1 md:gap-1.5 border-l border-border-subtle/50 pl-2 md:pl-3 text-[8px] md:text-[10px] font-bold text-text-muted">
        <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 text-brand-green" />
        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </motion.div>
  );
}
