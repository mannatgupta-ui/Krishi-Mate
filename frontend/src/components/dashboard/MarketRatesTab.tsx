import { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RefreshCw,
  IndianRupee,
  MapPin,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

interface CropPrice {
  id: string;
  name: string;
  emoji: string;
  currentPrice: number;
  previousPrice: number;
  unit: string;
  mandi: string;
  lastUpdated: string;
  priceHistory: { date: string; price: number }[];
}

const cropPrices: CropPrice[] = [
  {
    id: "wheat",
    name: "Wheat",
    emoji: "🌾",
    currentPrice: 2275,
    previousPrice: 2250,
    unit: "quintal",
    mandi: "Karnal",
    lastUpdated: "2 hours ago",
    priceHistory: [
      { date: "Jan 1", price: 2200 },
      { date: "Jan 5", price: 2220 },
      { date: "Jan 10", price: 2180 },
      { date: "Jan 15", price: 2250 },
      { date: "Jan 18", price: 2275 },
    ],
  },
  {
    id: "rice",
    name: "Rice (Basmati)",
    emoji: "🍚",
    currentPrice: 4500,
    previousPrice: 4650,
    unit: "quintal",
    mandi: "Karnal",
    lastUpdated: "3 hours ago",
    priceHistory: [
      { date: "Jan 1", price: 4800 },
      { date: "Jan 5", price: 4700 },
      { date: "Jan 10", price: 4600 },
      { date: "Jan 15", price: 4650 },
      { date: "Jan 18", price: 4500 },
    ],
  },
  {
    id: "mustard",
    name: "Mustard",
    emoji: "🌻",
    currentPrice: 5650,
    previousPrice: 5600,
    unit: "quintal",
    mandi: "Jaipur",
    lastUpdated: "1 hour ago",
    priceHistory: [
      { date: "Jan 1", price: 5400 },
      { date: "Jan 5", price: 5500 },
      { date: "Jan 10", price: 5550 },
      { date: "Jan 15", price: 5600 },
      { date: "Jan 18", price: 5650 },
    ],
  },
  {
    id: "maize",
    name: "Maize",
    emoji: "🌽",
    currentPrice: 1962,
    previousPrice: 1950,
    unit: "quintal",
    mandi: "Indore",
    lastUpdated: "4 hours ago",
    priceHistory: [
      { date: "Jan 1", price: 1900 },
      { date: "Jan 5", price: 1920 },
      { date: "Jan 10", price: 1940 },
      { date: "Jan 15", price: 1950 },
      { date: "Jan 18", price: 1962 },
    ],
  },
  {
    id: "cotton",
    name: "Cotton",
    emoji: "☁️",
    currentPrice: 6800,
    previousPrice: 6850,
    unit: "quintal",
    mandi: "Rajkot",
    lastUpdated: "2 hours ago",
    priceHistory: [
      { date: "Jan 1", price: 6900 },
      { date: "Jan 5", price: 6850 },
      { date: "Jan 10", price: 6800 },
      { date: "Jan 15", price: 6850 },
      { date: "Jan 18", price: 6800 },
    ],
  },
  {
    id: "soybean",
    name: "Soybean",
    emoji: "🫘",
    currentPrice: 4350,
    previousPrice: 4200,
    unit: "quintal",
    mandi: "Indore",
    lastUpdated: "1 hour ago",
    priceHistory: [
      { date: "Jan 1", price: 4100 },
      { date: "Jan 5", price: 4150 },
      { date: "Jan 10", price: 4200 },
      { date: "Jan 15", price: 4250 },
      { date: "Jan 18", price: 4350 },
    ],
  },
];

const getPriceChange = (current: number, previous: number) => {
  const change = current - previous;
  const percentage = ((change / previous) * 100).toFixed(1);
  return { change, percentage, isUp: change > 0, isDown: change < 0 };
};

const MarketRatesTab = () => {
  const [selectedCrop, setSelectedCrop] = useState<CropPrice>(cropPrices[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Market Rates 💰
          </h2>
          <p className="text-sm text-muted-foreground">Live mandi prices from across India</p>
        </div>
        <motion.button
          onClick={handleRefresh}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isRefreshing ? { rotate: 360 } : {}}
          transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? "text-primary" : "text-muted-foreground"}`} />
        </motion.button>
      </div>

      {/* Selected Crop Chart */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{selectedCrop.emoji}</span>
            <div>
              <h3 className="text-xl font-bold text-foreground">{selectedCrop.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {selectedCrop.mandi} Mandi
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-3xl font-bold text-foreground">
              <IndianRupee className="w-7 h-7" />
              {selectedCrop.currentPrice.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">per {selectedCrop.unit}</p>
            {(() => {
              const { change, percentage, isUp, isDown } = getPriceChange(
                selectedCrop.currentPrice,
                selectedCrop.previousPrice
              );
              return (
                <div className={`flex items-center gap-1 text-sm ${
                  isUp ? "text-primary" : isDown ? "text-destructive" : "text-muted-foreground"
                }`}>
                  {isUp ? <ArrowUpRight className="w-4 h-4" /> : isDown ? <ArrowDownRight className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                  ₹{Math.abs(change)} ({percentage}%)
                </div>
              );
            })()}
          </div>
        </div>

        {/* Price Chart */}
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={selectedCrop.priceHistory}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Crop Price Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cropPrices.map((crop, index) => {
          const { change, percentage, isUp, isDown } = getPriceChange(
            crop.currentPrice,
            crop.previousPrice
          );
          const isSelected = crop.id === selectedCrop.id;

          return (
            <motion.div
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className={`glass-card p-4 cursor-pointer transition-all ${
                isSelected ? "ring-2 ring-primary" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{crop.emoji}</span>
                  <div>
                    <h4 className="font-semibold text-foreground">{crop.name}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {crop.mandi}
                    </p>
                  </div>
                </div>
                <div className={`p-1.5 rounded-full ${
                  isUp ? "bg-primary/10" : isDown ? "bg-destructive/10" : "bg-muted"
                }`}>
                  {isUp ? (
                    <TrendingUp className="w-4 h-4 text-primary" />
                  ) : isDown ? (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  ) : (
                    <Minus className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-center text-xl font-bold text-foreground">
                    <IndianRupee className="w-5 h-5" />
                    {crop.currentPrice.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">per {crop.unit}</p>
                </div>
                <div className={`text-sm font-medium ${
                  isUp ? "text-primary" : isDown ? "text-destructive" : "text-muted-foreground"
                }`}>
                  {isUp ? "+" : ""}{percentage}%
                </div>
              </div>

              {/* Mini Sparkline */}
              <div className="h-[40px] mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={crop.priceHistory}>
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={isUp ? "hsl(var(--primary))" : isDown ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))"}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <Clock className="w-3 h-3" />
                {crop.lastUpdated}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Market Summary */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Market Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-primary/10">
            <p className="text-sm text-muted-foreground">Gainers Today</p>
            <p className="text-2xl font-bold text-primary">4</p>
            <p className="text-xs text-primary">+1.2% avg</p>
          </div>
          <div className="p-4 rounded-xl bg-destructive/10">
            <p className="text-sm text-muted-foreground">Losers Today</p>
            <p className="text-2xl font-bold text-destructive">2</p>
            <p className="text-xs text-destructive">-0.8% avg</p>
          </div>
          <div className="p-4 rounded-xl bg-muted">
            <p className="text-sm text-muted-foreground">Best Performer</p>
            <p className="text-2xl font-bold text-foreground">Soybean 🫘</p>
            <p className="text-xs text-primary">+3.6%</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MarketRatesTab;
