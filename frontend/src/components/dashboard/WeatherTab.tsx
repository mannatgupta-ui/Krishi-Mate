import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Cloud, CloudRain, Wind, Droplets, AlertTriangle, CloudLightning, Loader2 } from "lucide-react";

interface WeatherTabProps {
  farmerData: {
    location: string;
  };
  cachedWeatherAnalysis?: any | null;
}

interface CurrentWeather {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
}

interface ForecastDay {
  day: string;
  temp: number;
  rain: number;
  condition: string;
}

interface Insight {
  type: string;
  message: string;
  action: string;
}

const WeatherTab = ({ farmerData, cachedWeatherAnalysis }: WeatherTabProps) => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(cachedWeatherAnalysis?.currentWeather || null);
  const [forecast, setForecast] = useState<ForecastDay[]>(cachedWeatherAnalysis?.forecast || []);
  const [insights, setInsights] = useState<Insight[]>(cachedWeatherAnalysis?.insights || []);
  const [loading, setLoading] = useState(!cachedWeatherAnalysis);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedWeatherAnalysis) {
      setCurrentWeather(cachedWeatherAnalysis.currentWeather);
      setForecast(cachedWeatherAnalysis.forecast);
      setInsights(cachedWeatherAnalysis.insights);
      setLoading(false);
    }
  }, [cachedWeatherAnalysis]);

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes("rain") || c.includes("showers")) return CloudRain;
    if (c.includes("cloud")) return Cloud;
    if (c.includes("storm") || c.includes("thunder")) return CloudLightning;
    if (c.includes("wind")) return Wind;
    return Sun;
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2"><Loader2 className="w-6 h-6 animate-spin" /> Loading weather insights...</div>;
  }

  if (error || !currentWeather) {
    return <div className="p-8 text-center text-destructive">{error || "No data available."}</div>;
  }

  const TodayIcon = getWeatherIcon(currentWeather.condition);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-foreground">Weather Insights 🌦</h2>

      {/* Current Weather Card */}
      <motion.div
        className="glass-card p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky/20 via-transparent to-sun/10" />

        {/* Animated Sun/Clouds */}
        <motion.div
          className="absolute top-4 right-4 opacity-30"
          animate={{ y: [-5, 5, -5], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <TodayIcon className="w-32 h-32 text-sun" />
        </motion.div>

        <div className="relative z-10">
          <p className="text-muted-foreground mb-2">{farmerData.location || "Local"} Weather</p>
          <div className="flex items-end gap-4">
            <motion.span
              className="text-6xl md:text-8xl font-bold text-foreground"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {currentWeather.temperature.toFixed(1)}°
            </motion.span>
            <div className="mb-2">
              <p className="text-xl font-semibold text-foreground capitalize">{currentWeather.condition}</p>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Droplets className="w-4 h-4" />
                  {currentWeather.humidity}%
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="w-4 h-4" />
                  {currentWeather.windSpeed} km/h
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weekly Forecast */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-semibold text-lg mb-4 text-foreground">7-Day Forecast</h3>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {forecast.map((day, index) => {
            const Icon = getWeatherIcon(day.condition);
            const isToday = index === 0;

            return (
              <motion.div
                key={index}
                className={`flex flex-col items-center p-3 rounded-xl transition-colors ${isToday ? "bg-primary/10" : "hover:bg-muted/50"
                  }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className={`text-sm font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                  {day.day}
                </span>
                <motion.div
                  animate={
                    day.condition.toLowerCase().includes("sun")
                      ? { rotate: [0, 10, -10, 0] }
                      : day.condition.toLowerCase().includes("rain")
                        ? { y: [0, -3, 0] }
                        : {}
                  }
                  transition={{ duration: 3, repeat: Infinity }}
                  className="my-2"
                >
                  <Icon
                    className={`w-8 h-8 ${day.condition.toLowerCase().includes("sun")
                      ? "text-sun"
                      : day.condition.toLowerCase().includes("rain")
                        ? "text-accent"
                        : "text-muted-foreground"
                      }`}
                  />
                </motion.div>
                <span className="text-lg font-bold text-foreground">{day.temp}°</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <CloudRain className="w-3 h-3" />
                  {day.rain}mm
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Weather Alerts/Insights */}
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            className={`glass-card p-4 border-l-4 ${insight.type === "warning" ? "border-destructive" :
              insight.type === "success" ? "border-primary" : "border-accent"
              }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + (index * 0.1) }}
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle className={`w-5 h-5 ${insight.type === "warning" ? "text-destructive" :
                  insight.type === "success" ? "text-primary" : "text-accent"
                  }`} />
              </motion.div>
              <div>
                <h4 className="font-medium text-foreground">{insight.message}</h4>
                <p className="text-sm text-muted-foreground">{insight.action}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WeatherTab;