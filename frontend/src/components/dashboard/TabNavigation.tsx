import { motion } from "framer-motion";
import { Home, BarChart3, Leaf, Lightbulb, Cloud, Brain, MessageCircle, TrendingUp, Calculator } from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "farm", label: "My Farm", icon: Home, emoji: "🌾" },
  { id: "sensors", label: "Sensors", icon: BarChart3, emoji: "📊" },
  { id: "crops", label: "Crops", icon: Leaf, emoji: "🌱" },

  { id: "market", label: "Market", icon: TrendingUp, emoji: "💰" },
  { id: "yield", label: "Predict Yield", icon: Calculator, emoji: "🌾" },
  { id: "recommendations", label: "Recommend", icon: Lightbulb, emoji: "💡" },
  { id: "weather", label: "Weather", icon: Cloud, emoji: "🌦" },
  { id: "insights", label: "Insights", icon: Brain, emoji: "🧠" },
  { id: "chatbot", label: "AI Chat", icon: MessageCircle, emoji: "🤖" },
];

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <nav className="flex gap-2 p-2 min-w-max">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-primary rounded-xl"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.emoji}</span>
              </span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

export default TabNavigation;