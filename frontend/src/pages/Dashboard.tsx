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

interface FarmerData {
  name: string;
  mobile: string;
  location: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("farm");
  const [farmerData, setFarmerData] = useState<FarmerData>({
    name: "",
    mobile: "",
    location: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("farmerData");
    if (stored) {
      setFarmerData(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("farmerData");
    navigate("/");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "farm":
        return <MyFarmTab farmerData={farmerData} />;
      case "sensors":
        return <SensorsTab />;
      case "crops":
        return <CropsTab />;
      case "market":
        return <MarketRatesTab />;
      case "recommendations":
        return <RecommendationsTab />;
      case "weather":
        return <WeatherTab />;
      case "insights":
        return <InsightsTab />;
      case "chatbot":
        return <ChatbotTab />;
      default:
        return <MyFarmTab farmerData={farmerData} />;
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