import { motion } from "framer-motion";
import { Thermometer, Droplets, Wind, Leaf, Activity, Zap } from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis
} from "recharts";

const sensorData = [
  {
    id: "temperature",
    label: "Temperature",
    value: 28,
    unit: "°C",
    icon: Thermometer,
    status: "optimal",
    color: "from-orange-400 to-red-500",
    bgColor: "bg-orange-50",
    chartColor: "#f97316",
    range: { min: 15, max: 40 },
    history: [
      { time: "6AM", value: 22 },
      { time: "9AM", value: 25 },
      { time: "12PM", value: 30 },
      { time: "3PM", value: 32 },
      { time: "6PM", value: 28 },
      { time: "9PM", value: 24 },
    ],
  },
  {
    id: "moisture",
    label: "Soil Moisture",
    value: 72,
    unit: "%",
    icon: Droplets,
    status: "healthy",
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-blue-50",
    chartColor: "#3b82f6",
    range: { min: 0, max: 100 },
    history: [
      { time: "6AM", value: 75 },
      { time: "9AM", value: 73 },
      { time: "12PM", value: 70 },
      { time: "3PM", value: 68 },
      { time: "6PM", value: 72 },
      { time: "9PM", value: 74 },
    ],
  },
  {
    id: "humidity",
    label: "Humidity",
    value: 65,
    unit: "%",
    icon: Wind,
    status: "good",
    color: "from-teal-400 to-green-500",
    bgColor: "bg-teal-50",
    chartColor: "#14b8a6",
    range: { min: 0, max: 100 },
    history: [
      { time: "6AM", value: 70 },
      { time: "9AM", value: 68 },
      { time: "12PM", value: 60 },
      { time: "3PM", value: 55 },
      { time: "6PM", value: 62 },
      { time: "9PM", value: 68 },
    ],
  },
  {
    id: "nutrients",
    label: "Soil Nutrients (NPK)",
    value: 85,
    unit: "%",
    icon: Leaf,
    status: "excellent",
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50",
    chartColor: "#22c55e",
    range: { min: 0, max: 100 },
    history: [
      { time: "6AM", value: 85 },
      { time: "9AM", value: 85 },
      { time: "12PM", value: 84 },
      { time: "3PM", value: 84 },
      { time: "6PM", value: 85 },
      { time: "9PM", value: 85 },
    ],
  },
];

const npkData = [
  { name: "Nitrogen", value: 82, fill: "hsl(142 70% 45%)" },
  { name: "Phosphorus", value: 75, fill: "hsl(30 80% 55%)" },
  { name: "Potassium", value: 88, fill: "hsl(200 80% 50%)" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "excellent":
    case "healthy":
      return "text-primary bg-primary/10";
    case "optimal":
    case "good":
      return "text-accent bg-accent/10";
    case "warning":
      return "text-wheat bg-wheat/10";
    case "alert":
      return "text-destructive bg-destructive/10";
    default:
      return "text-muted-foreground bg-muted";
  }
};

const SensorsTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Live Sensor Data 📊</h2>
        <motion.span
          className="flex items-center gap-2 text-sm text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="w-2 h-2 bg-primary rounded-full" />
          Live
        </motion.span>
      </div>

      {/* Sensor Cards Grid with Mini Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sensorData.map((sensor, index) => {
          const Icon = sensor.icon;
          const percentage = ((sensor.value - sensor.range.min) / (sensor.range.max - sensor.range.min)) * 100;

          return (
            <motion.div
              key={sensor.id}
              className="glass-card p-6 hover-lift"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    className={`p-3 rounded-xl ${sensor.bgColor}`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                  >
                    <Icon className="w-6 h-6 text-foreground" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-foreground">{sensor.label}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getStatusColor(sensor.status)}`}>
                      {sensor.status}
                    </span>
                  </div>
                </div>
                <motion.span
                  className="text-3xl font-bold text-foreground"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {sensor.value}
                  <span className="text-lg text-muted-foreground">{sensor.unit}</span>
                </motion.span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-muted rounded-full overflow-hidden mb-4">
                <motion.div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${sensor.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                />
              </div>

              {/* Mini Line Chart */}
              <div className="h-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sensor.history}>
                    <defs>
                      <linearGradient id={`gradient-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={sensor.chartColor} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={sensor.chartColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={sensor.chartColor}
                      strokeWidth={2}
                      fill={`url(#gradient-${sensor.id})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Range Labels */}
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{sensor.range.min}{sensor.unit}</span>
                <span>{sensor.range.max}{sensor.unit}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* NPK Analysis with Radial Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-wheat" />
            NPK Nutrient Levels
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="100%"
                data={npkData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {npkData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name}: {item.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Farm Health Score */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Overall Farm Health
          </h3>
          <div className="flex items-center gap-6">
            <motion.div
              className="relative w-32 h-32"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="10"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#healthGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${92 * 2.83} ${100 * 2.83}`}
                  transform="rotate(-90 50 50)"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-foreground">92%</span>
              </div>
            </motion.div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Soil Quality</span>
                <span className="text-sm font-medium text-primary">Excellent</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Water Status</span>
                <span className="text-sm font-medium text-primary">Optimal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Crop Health</span>
                <span className="text-sm font-medium text-primary">Thriving</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Weather Impact</span>
                <span className="text-sm font-medium text-accent">Good</span>
              </div>
            </div>
          </div>
          <motion.p
            className="text-sm text-muted-foreground mt-4 p-3 bg-primary/5 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            🌟 Your farm is in excellent condition! All sensors reporting optimal values. Keep up the great work!
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SensorsTab;
