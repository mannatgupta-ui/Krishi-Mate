import { motion } from "framer-motion";
import { MapPin, Calendar, Ruler, Droplets, Thermometer, Wind, Eye, Sun } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import farmOverview from "@/assets/farm-overview.jpg";

interface FarmerData {
  name: string;
  location: string;
}

interface MyFarmTabProps {
  farmerData: FarmerData;
}

const weeklyData = [
  { day: "Mon", moisture: 68, temp: 26, humidity: 62 },
  { day: "Tue", moisture: 72, temp: 28, humidity: 65 },
  { day: "Wed", moisture: 70, temp: 27, humidity: 63 },
  { day: "Thu", moisture: 75, temp: 25, humidity: 68 },
  { day: "Fri", moisture: 72, temp: 28, humidity: 65 },
  { day: "Sat", moisture: 74, temp: 29, humidity: 70 },
  { day: "Sun", moisture: 72, temp: 28, humidity: 67 },
];

const cropGrowthData = [
  { week: "W1", growth: 15 },
  { week: "W2", growth: 28 },
  { week: "W3", growth: 42 },
  { week: "W4", growth: 55 },
  { week: "W5", growth: 68 },
  { week: "W6", growth: 78 },
];

const MyFarmTab = ({ farmerData }: MyFarmTabProps) => {
  const farmStats = {
    farmSize: "5.2 Acres",
    currentSeason: "Rabi (Winter)",
    soilMoisture: 72,
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    visibility: "10 km",
    uvIndex: "Moderate",
    lastUpdated: "2 hours ago",
  };

  const getMoistureColor = (moisture: number) => {
    if (moisture >= 70) return "text-primary";
    if (moisture >= 40) return "text-wheat";
    return "text-destructive";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Welcome Banner with Realistic Farm Image */}
      <motion.div
        className="relative overflow-hidden rounded-2xl h-[280px]"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        {/* Background Image */}
        <img 
          src={farmOverview} 
          alt="Farm Overview" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        
        {/* Animated Light Rays */}
        <motion.div
          className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-yellow-400/10 to-transparent"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-6">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Welcome back, {farmerData.name || "Farmer"}! 👋
          </motion.h2>
          <motion.p
            className="text-white/80 flex items-center gap-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <MapPin className="w-4 h-4" />
            {farmerData.location || "Your Farm"}
          </motion.p>
          
          {/* Live Stats Overlay */}
          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Thermometer className="w-4 h-4 text-orange-300" />
              <span className="text-white text-sm">{farmStats.temperature}°C</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Droplets className="w-4 h-4 text-blue-300" />
              <span className="text-white text-sm">{farmStats.soilMoisture}% Moisture</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Wind className="w-4 h-4 text-teal-300" />
              <span className="text-white text-sm">{farmStats.windSpeed} km/h</span>
            </div>
          </motion.div>
        </div>

        {/* Status Badge */}
        <motion.div
          className="absolute top-4 right-4 flex items-center gap-2 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-sm font-medium text-white">Healthy</span>
        </motion.div>
      </motion.div>

      {/* Farm Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Ruler, label: "Farm Size", value: farmStats.farmSize, color: "text-secondary" },
          { icon: Calendar, label: "Season", value: farmStats.currentSeason, color: "text-accent" },
          { icon: Eye, label: "Visibility", value: farmStats.visibility, color: "text-sky" },
          { icon: Sun, label: "UV Index", value: farmStats.uvIndex, color: "text-wheat" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="glass-card p-4 hover-lift"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-lg font-semibold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Conditions Chart */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-primary" />
            Weekly Conditions
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="moisture"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#moistureGradient)"
                  name="Moisture %"
                />
                <Area
                  type="monotone"
                  dataKey="humidity"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  fill="url(#humidityGradient)"
                  name="Humidity %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Crop Growth Chart */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🌱 Crop Growth Progress
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropGrowthData}>
                <defs>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 70% 45%)" stopOpacity={1} />
                    <stop offset="95%" stopColor="hsl(142 70% 45%)" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="growth"
                  fill="url(#growthGradient)"
                  radius={[4, 4, 0, 0]}
                  name="Growth %"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* 3D-like Farm Visualization */}
      <motion.div
        className="glass-card p-6 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4">Farm Zones 🗺️</h3>
        <div className="relative h-[200px] rounded-xl overflow-hidden bg-gradient-to-b from-sky/20 to-soil/30">
          {/* Isometric Grid Effect */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute h-px bg-foreground/30"
                style={{
                  top: `${10 + i * 10}%`,
                  left: 0,
                  right: 0,
                  transform: "skewY(-5deg)",
                }}
              />
            ))}
          </div>
          
          {/* Farm Zones */}
          <div className="absolute inset-0 flex items-end justify-around p-4 gap-2">
            {[
              { name: "Zone A", crop: "🌾 Wheat", health: 92, size: "1.5 acres" },
              { name: "Zone B", crop: "🌻 Mustard", health: 88, size: "1.2 acres" },
              { name: "Zone C", crop: "🍚 Rice", health: 95, size: "1.5 acres" },
              { name: "Zone D", crop: "🌽 Maize", health: 85, size: "1.0 acres" },
            ].map((zone, i) => (
              <motion.div
                key={zone.name}
                className="flex-1 relative group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
              >
                <div
                  className="h-24 rounded-lg relative overflow-hidden"
                  style={{
                    background: `linear-gradient(to top, hsl(142 ${50 + zone.health * 0.3}% ${30 + i * 5}%), hsl(142 ${40 + zone.health * 0.3}% ${45 + i * 5}%))`,
                    transform: "perspective(500px) rotateX(10deg)",
                    transformOrigin: "bottom",
                  }}
                >
                  {/* Animated rows */}
                  {[...Array(5)].map((_, j) => (
                    <motion.div
                      key={j}
                      className="absolute h-0.5 bg-white/20"
                      style={{ top: `${20 + j * 15}%`, left: "5%", right: "5%" }}
                      animate={{ opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 2, delay: j * 0.2, repeat: Infinity }}
                    />
                  ))}
                </div>
                
                {/* Zone Info Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-card shadow-lg rounded-lg p-3 whitespace-nowrap z-20">
                  <p className="font-semibold text-sm">{zone.name}</p>
                  <p className="text-xs text-muted-foreground">{zone.crop}</p>
                  <p className="text-xs text-muted-foreground">{zone.size}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-primary">Health: {zone.health}%</span>
                  </div>
                </div>
                
                <p className="text-center text-xs font-medium mt-2 text-foreground">{zone.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MyFarmTab;
