import { motion } from "framer-motion";
import { Sun, Cloud, CloudRain, Wind, Droplets, AlertTriangle } from "lucide-react";

const weeklyForecast = [
  { day: "Today", icon: Sun, temp: 28, condition: "Sunny", humidity: 45 },
  { day: "Tue", icon: Sun, temp: 30, condition: "Clear", humidity: 40 },
  { day: "Wed", icon: Cloud, temp: 26, condition: "Cloudy", humidity: 55 },
  { day: "Thu", icon: CloudRain, temp: 24, condition: "Rain", humidity: 75 },
  { day: "Fri", icon: CloudRain, temp: 22, condition: "Showers", humidity: 80 },
  { day: "Sat", icon: Cloud, temp: 25, condition: "Partly Cloudy", humidity: 60 },
  { day: "Sun", icon: Sun, temp: 27, condition: "Sunny", humidity: 50 },
];

const alerts = [
  {
    type: "rain",
    message: "Rain expected on Thursday and Friday. Consider irrigation planning.",
    severity: "info",
  },
];

const WeatherTab = () => {
  const today = weeklyForecast[0];
  const TodayIcon = today.icon;

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
          <p className="text-muted-foreground mb-2">Current Weather</p>
          <div className="flex items-end gap-4">
            <motion.span
              className="text-6xl md:text-8xl font-bold text-foreground"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {today.temp}°
            </motion.span>
            <div className="mb-2">
              <p className="text-xl font-semibold text-foreground">{today.condition}</p>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Droplets className="w-4 h-4" />
                  {today.humidity}%
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="w-4 h-4" />
                  12 km/h
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
        <div className="grid grid-cols-7 gap-2">
          {weeklyForecast.map((day, index) => {
            const Icon = day.icon;
            const isToday = index === 0;
            
            return (
              <motion.div
                key={day.day}
                className={`flex flex-col items-center p-3 rounded-xl transition-colors ${
                  isToday ? "bg-primary/10" : "hover:bg-muted/50"
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
                    day.icon === Sun
                      ? { rotate: [0, 10, -10, 0] }
                      : day.icon === CloudRain
                      ? { y: [0, -3, 0] }
                      : {}
                  }
                  transition={{ duration: 3, repeat: Infinity }}
                  className="my-2"
                >
                  <Icon
                    className={`w-8 h-8 ${
                      day.icon === Sun
                        ? "text-sun"
                        : day.icon === CloudRain
                        ? "text-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                </motion.div>
                <span className="text-lg font-bold text-foreground">{day.temp}°</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Droplets className="w-3 h-3" />
                  {day.humidity}%
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Weather Alerts */}
      {alerts.length > 0 && (
        <motion.div
          className="glass-card p-4 border-l-4 border-accent"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle className="w-5 h-5 text-accent" />
            </motion.div>
            <div>
              <h4 className="font-medium text-foreground">Weather Alert</h4>
              <p className="text-sm text-muted-foreground">{alerts[0].message}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Farming Tips */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-semibold text-lg mb-3 text-foreground">Weather-Based Tips 🌾</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Good conditions for spraying pesticides today
          </li>
          <li className="flex items-center gap-2 text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Delay irrigation until after Thursday's rain
          </li>
          <li className="flex items-center gap-2 text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-wheat" />
            Cover seedbeds before expected showers
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default WeatherTab;