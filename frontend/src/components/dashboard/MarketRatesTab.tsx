import { useState, useEffect } from "react";
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
  ArrowDownRight,
  Loader2
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

interface MarketRatesTabProps {
  farmerData: {
    location: string;
  };
  cachedMarketData?: any[] | null;
}

interface MarketRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

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

const commodityEmojis: Record<string, string> = {
  "Wheat": "🌾",
  "Paddy(Dhan)": "🍚",
  "Rice": "🍚",
  "Mustard": "🌻",
  "Maize": "🌽",
  "Cotton": "☁️",
  "Soyabean": "🫘",
  "Potato": "🥔",
  "Tomato": "🍅",
  "Onion": "🧅",
  "Banana": "🍌",
  "Apple": "🍎",
  "Mango": "🥭",
  "Grapes": "🍇",
  "Orange": "🍊",
  "Garlic": "🧄",
  "Ginger(Dry)": "🪴",
  "Turmeric": "🟡",
  "Sugarcane": "🎋"
};

const getPriceChange = (current: number, previous: number) => {
  const change = current - previous;
  const percentage = ((change / previous) * 100).toFixed(1);
  return { change, percentage, isUp: change > 0, isDown: change < 0 };
};

const MarketRatesTab = ({ farmerData, cachedMarketData }: MarketRatesTabProps) => {
  const [cropPrices, setCropPrices] = useState<CropPrice[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<CropPrice | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to parse location "District, State"
  const parseLocation = (loc: string) => {
    const parts = loc.split(",").map(s => s.trim());
    if (parts.length >= 2) {
      return { district: parts[0], state: parts[1] };
    }
    return { district: "", state: "" }; // Fallback
  };

  const fetchMarketRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const { district, state } = parseLocation(farmerData.location);

      const response = await fetch("http://localhost:8000/api/market-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: state,
          district: district
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch market rates");

      const data: MarketRecord[] = await response.json();

      if (data.length === 0) {
        console.warn("API returned empty list, falling back to demo data.");
        // Fallback to demo data
        const fallbackData = [
          { commodity: "Wheat", market: "Local Mandi", modal_price: "2100", arrival_date: new Date().toISOString() },
          { commodity: "Rice", market: "District Center", modal_price: "3200", arrival_date: new Date().toISOString() },
          { commodity: "Maize", market: "City Market", modal_price: "1850", arrival_date: new Date().toISOString() },
          { commodity: "Potato", market: "Sabzi Mandi", modal_price: "1200", arrival_date: new Date().toISOString() },
          { commodity: "Onion", market: "Sabzi Mandi", modal_price: "2500", arrival_date: new Date().toISOString() },
          { commodity: "Tomato", market: "Sabzi Mandi", modal_price: "1500", arrival_date: new Date().toISOString() },
        ];
        processData(fallbackData, true);
        return;
      }

      processData(data, false);

    } catch (err) {
      console.error(err);
      // Fallback on error too
      const fallbackData = [
        { commodity: "Wheat", market: "Local Mandi", modal_price: "2100", arrival_date: new Date().toISOString() },
        { commodity: "Rice", market: "District Center", modal_price: "3200", arrival_date: new Date().toISOString() },
        { commodity: "Maize", market: "City Market", modal_price: "1850", arrival_date: new Date().toISOString() },
      ];
      processData(fallbackData, true);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const processData = (data: any[], isDemo: boolean) => {
    // Map backend data to frontend model
    const mappedData: CropPrice[] = data.map((record, index) => {
      const currentPrice = parseFloat(record.modal_price);
      const previousPrice = currentPrice * (1 + (Math.random() * 0.1 - 0.05)); // Simulate prev price

      // Parse date safely (handle DD/MM/YYYY)
      let dateObj = new Date(record.arrival_date);
      if (isNaN(dateObj.getTime())) {
        // Try parsing DD/MM/YYYY manually
        const parts = record.arrival_date.split('/');
        if (parts.length === 3) {
          // specific to dd/mm/yyyy
          dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      }
      // If still invalid, fallback to today
      if (isNaN(dateObj.getTime())) dateObj = new Date();

      // Simulate history
      const history = [];
      for (let i = 5; i >= 0; i--) {
        const histDate = new Date(dateObj);
        histDate.setDate(dateObj.getDate() - i);

        history.push({
          date: histDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          price: currentPrice * (1 + (Math.random() * 0.1 - 0.05))
        });
      }
      history[history.length - 1].price = currentPrice; // Ensure last point matches current

      return {
        id: `${record.commodity}-${index}`,
        name: record.commodity,
        emoji: commodityEmojis[record.commodity] || "🌱",
        currentPrice: currentPrice,
        previousPrice: previousPrice,
        unit: "quintal",
        mandi: record.market,
        lastUpdated: isDemo ? "Demo Data" : dateObj.toLocaleDateString(),
        priceHistory: history
      };
    });

    setCropPrices(mappedData);
    if (mappedData.length > 0) {
      setSelectedCrop(mappedData[0]);
    }
    if (isDemo) setError("v"); // Hack to trigger demo UI state if needed, or better add a state
  };

  useEffect(() => {
    if (cachedMarketData) {
      if (cachedMarketData.length === 0) {
        console.warn("Cached market data is empty, using fallback.");
        const fallbackData = [
          { commodity: "Wheat", market: "Local Mandi", modal_price: "2100", arrival_date: new Date().toISOString() },
          { commodity: "Rice", market: "District Center", modal_price: "3200", arrival_date: new Date().toISOString() },
          { commodity: "Maize", market: "City Market", modal_price: "1850", arrival_date: new Date().toISOString() },
          { commodity: "Potato", market: "Sabzi Mandi", modal_price: "1200", arrival_date: new Date().toISOString() },
          { commodity: "Onion", market: "Sabzi Mandi", modal_price: "2500", arrival_date: new Date().toISOString() },
          { commodity: "Tomato", market: "Sabzi Mandi", modal_price: "1500", arrival_date: new Date().toISOString() },
        ];
        processData(fallbackData, true);
      } else {
        processData(cachedMarketData, false);
      }
      setLoading(false);
    }
    // Do nothing if no data, wait for Dashboard to provide it
  }, [cachedMarketData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchMarketRates();
  };

  if (loading && !isRefreshing) {
    return <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2"><Loader2 className="w-6 h-6 animate-spin" /> Loading market prices...</div>;
  }

  if (error && cropPrices.length === 0) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-destructive">{error}</p>
        <button onClick={fetchMarketRates} className="text-primary hover:underline">Try Again</button>
      </div>
    );
  }

  // If no data loaded yet (and no error??), safe check
  if (!selectedCrop) return null;

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
          <p className="text-sm text-muted-foreground">Live mandi prices near {farmerData.location || "you"}</p>
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
        key={selectedCrop.id} // Re-animate on change
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
                <div className={`flex items-center gap-1 text-sm ${isUp ? "text-primary" : isDown ? "text-destructive" : "text-muted-foreground"
                  }`}>
                  {isUp ? <ArrowUpRight className="w-4 h-4" /> : isDown ? <ArrowDownRight className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                  ₹{Math.abs(change).toFixed(0)} ({percentage}%)
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
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={['auto', 'auto']} />
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
          const { percentage, isUp, isDown } = getPriceChange(
            crop.currentPrice,
            crop.previousPrice
          );
          const isSelected = crop.id === selectedCrop.id;

          return (
            <motion.div
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className={`glass-card p-4 cursor-pointer transition-all ${isSelected ? "ring-2 ring-primary" : ""
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
                <div className={`p-1.5 rounded-full ${isUp ? "bg-primary/10" : isDown ? "bg-destructive/10" : "bg-muted"
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
                <div className={`text-sm font-medium ${isUp ? "text-primary" : isDown ? "text-destructive" : "text-muted-foreground"
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
    </motion.div>
  );
};

export default MarketRatesTab;
