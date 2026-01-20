import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Sprout } from "lucide-react";
import TabNavigation from "@/components/dashboard/TabNavigation";
import MyFarmTab from "@/components/dashboard/MyFarmTab";
import SensorsTab from "@/components/dashboard/SensorsTab";
import CropsTab from "@/components/dashboard/CropsTab";
import RecommendationsTab from "@/components/dashboard/RecommendationsTab";
import WeatherTab from "@/components/dashboard/WeatherTab";
import InsightsTab from "@/components/dashboard/InsightsTab";
import ChatbotTab from "@/components/dashboard/ChatbotTab";
import MarketRatesTab from "@/components/dashboard/MarketRatesTab";
import YieldPredictionTab from "@/components/dashboard/YieldPredictionTab";

interface FarmerData {
  name: string;
  mobile: string;
  location: string;
  mainCrop?: string;
  farmSize?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("farm");
  const [farmerData, setFarmerData] = useState<FarmerData>({
    name: "",
    mobile: "",
    location: "",
  });

  // Cached Data States
  const [weatherData, setWeatherData] = useState<{ stats: any, weekly: any[] } | null>(null);
  const [marketData, setMarketData] = useState<any[] | null>(null);
  const [insightsData, setInsightsData] = useState<any | null>(null);
  const [weatherAnalysisData, setWeatherAnalysisData] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("farmerData");
    if (stored) {
      setFarmerData(JSON.parse(stored));
    }
  }, []);

  // Fetch Data Lazy Loading (only when tab is active and data is missing)
  useEffect(() => {
    if (!farmerData.location) return;

    const fetchWeatherData = async () => {
      if (weatherData) return; // Already cached
      console.log("Dashboard: Fetching weather data for", farmerData.location);
      try {
        const rawLocation = farmerData.location || "New Delhi";
        const locationQuery = rawLocation.split(',')[0].trim();

        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${locationQuery}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();

        if (geoData.results) {
          const { latitude, longitude } = geoData.results[0];
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,visibility,uv_index&daily=temperature_2m_max,precipitation_sum,uv_index_max&past_days=7&forecast_days=1`
          );
          const wData = await weatherRes.json();

          const stats = {
            temperature: wData.current.temperature_2m,
            humidity: wData.current.relative_humidity_2m,
            windSpeed: wData.current.wind_speed_10m,
            soilMoisture: Math.round(wData.current.relative_humidity_2m * 0.9 + (Math.random() * 5)),
            visibility: Math.round(wData.current.visibility / 1000),
            uvIndex: wData.current.uv_index
          };

          const daily = wData.daily;
          const weekly = daily.time.slice(0, 7).map((date: string, i: number) => ({
            day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            moisture: 60 + Math.random() * 20,
            temp: daily.temperature_2m_max[i],
            rainfall: daily.precipitation_sum[i]
          }));

          setWeatherData({ stats, weekly });
        } else {
          console.warn("Dashboard: Location not found for", locationQuery);
        }
      } catch (e) {
        console.error("Dashboard: Error fetching weather", e);
      }
    };

    const fetchMarketData = async () => {
      if (marketData) return; // Already cached
      try {
        const parts = farmerData.location.split(",").map(s => s.trim());
        const district = parts.length >= 2 ? parts[0] : "";
        const state = parts.length >= 2 ? parts[1] : "";

        const response = await fetch("http://localhost:8000/api/market-rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ state, district }),
        });
        if (response.ok) {
          const data = await response.json();
          setMarketData(data);
        }
      } catch (e) {
        console.error("Dashboard: Error fetching market rates", e);
      }
    };

    const fetchInsightsData = async () => {
      if (insightsData) return; // Already cached
      try {
        const response = await fetch("http://localhost:8000/api/general-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: farmerData.location || "India",
            count: 5
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setInsightsData(data);
        }
      } catch (e) {
        console.error("Dashboard: Error fetching insights", e);
      }
    };

    const fetchWeatherAnalysis = async () => {
      if (weatherAnalysisData) return; // Already cached
      try {
        const response = await fetch("http://localhost:8000/api/weather-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: farmerData.location || "Delhi",
            crop: farmerData.mainCrop || "Wheat"
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setWeatherAnalysisData(data);
        }
      } catch (e) {
        console.error("Dashboard: Error fetching weather analysis", e);
      }
    };

    // Trigger fetch based on active tab
    switch (activeTab) {
      case "farm":
        fetchWeatherData();
        break;
      case "market":
        fetchMarketData();
        break;
      case "insights":
        fetchInsightsData();
        break;
      case "weather":
        fetchWeatherAnalysis();
        break;
      default:
        // By default, if we land on dashboard, we usually show farm tab first
        // But if activeTab handles it, the case 'farm' covers it if it's the initial state.
        // If initial state is "farm", this runs.
        if (activeTab === 'farm') fetchWeatherData();
        break;
    }

  }, [farmerData.location, activeTab, weatherData, marketData, insightsData, weatherAnalysisData]); // Dependencies include state to avoid infinite loops but checks are guarded

  const handleLogout = () => {
    localStorage.removeItem("farmerData");
    navigate("/");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "farm":
        return <MyFarmTab farmerData={farmerData} cachedWeather={weatherData} />;
      case "sensors":
        return <SensorsTab />;
      case "crops":
        return <CropsTab />;
      case "market":
        return <MarketRatesTab farmerData={farmerData} cachedMarketData={marketData} />;
      case "yield":
        return <YieldPredictionTab />;
      case "recommendations":
        return <RecommendationsTab farmerData={farmerData} />;
      case "weather":
        return <WeatherTab farmerData={farmerData} cachedWeatherAnalysis={weatherAnalysisData} />;
      case "insights":
        return <InsightsTab farmerData={farmerData} cachedInsights={insightsData} />;
      case "chatbot":
        return <ChatbotTab farmerData={farmerData} messages={chatMessages} setMessages={setChatMessages} />;
      default:
        return <MyFarmTab farmerData={farmerData} cachedWeather={weatherData} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-gradient-primary hidden sm:inline">
                Krishi-Mate
              </span>
            </motion.div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{farmerData.name || "Farmer"}</p>
                <p className="text-xs text-muted-foreground">{farmerData.location || "Location"}</p>
              </div>
              <motion.button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-3 -mx-4 px-4 overflow-x-auto">
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Padding */}
      <div className="h-20 md:h-0" />
    </div>
  );
};

export default Dashboard;