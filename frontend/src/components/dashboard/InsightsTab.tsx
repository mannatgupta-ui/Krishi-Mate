import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle, ChevronRight, Loader2, RefreshCw } from "lucide-react";

interface InsightsTabProps {
  farmerData: {
    location: string;
  };
  cachedInsights?: any | null;
}

interface Insight {
  type: "tip" | "success" | "warning";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

const priorityColors = {
  high: "bg-destructive/10 text-destructive border-destructive/30",
  medium: "bg-accent/10 text-accent border-accent/30",
  low: "bg-primary/10 text-primary border-primary/30",
};

const typeStyles = {
  tip: { bg: "bg-sun/10", icon: "text-sun", border: "border-sun/30", iconType: Lightbulb },
  success: { bg: "bg-primary/10", icon: "text-primary", border: "border-primary/30", iconType: TrendingUp },
  warning: { bg: "bg-wheat/10", icon: "text-wheat", border: "border-wheat/30", iconType: AlertCircle },
};

const InsightsTab = ({ farmerData, cachedInsights }: InsightsTabProps) => {
  const [insights, setInsights] = useState<Insight[]>(cachedInsights?.insights || []);
  const [loading, setLoading] = useState(!cachedInsights);
  const [loadingMore, setLoadingMore] = useState(false);

  // Stats state
  const [activeAlerts, setActiveAlerts] = useState(cachedInsights?.stats?.activeAlerts || 0);

  const fetchInsights = async (isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);

      const response = await fetch("http://localhost:8000/api/general-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: farmerData.location || "India",
          count: 5
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch insights");

      const data = await response.json();

      if (isLoadMore) {
        setInsights(prev => [...prev, ...data.insights]);
        // Update stats based on total new list
        const totalAlerts = [...insights, ...data.insights].filter(
          i => i.type === "warning" || i.priority === "high"
        ).length;
        setActiveAlerts(totalAlerts);
      } else {
        setInsights(data.insights);
        setActiveAlerts(data.stats.activeAlerts);
      }

    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      if (isLoadMore) setLoadingMore(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    if (cachedInsights) {
      setInsights(cachedInsights.insights);
      setActiveAlerts(cachedInsights.stats.activeAlerts);
      setLoading(false);
      return;
    }
    fetchInsights();
  }, [farmerData.location, cachedInsights]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
        <p>Analyzing farm data...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold text-foreground">Smart Insights</h2>
        <motion.span
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🧠
        </motion.span>
      </div>

      <p className="text-muted-foreground">
        AI-powered recommendations to optimize your farming practices in <strong>{farmerData.location || "your region"}</strong>.
      </p>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Tips Applied", value: 0, color: "text-primary" }, // Hardcoded 0 as requested
          { label: "Issues Resolved", value: 0, color: "text-accent" }, // Hardcoded 0 as requested
          { label: "Active Alerts", value: activeAlerts, color: "text-wheat" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="glass-card p-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.span
              className={`text-3xl font-bold ${stat.color}`}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: index * 0.1 }}
            >
              {stat.value}
            </motion.span>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight, index) => {
          // Fallback if icon type is unknown, though strict typing should prevent this
          const style = typeStyles[insight.type] || typeStyles.tip;
          const Icon = style.iconType;

          return (
            <motion.div
              key={index} // generating random key might be better if ID not present, here using index is safe enough for simple list
              className={`glass-card p-5 border-l-4 ${style.border} hover-lift cursor-pointer`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className={`p-2 rounded-xl ${style.bg}`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                >
                  <Icon className={`w-5 h-5 ${style.icon}`} />
                </motion.div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{insight.title}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[insight.priority]
                        }`}
                    >
                      {insight.priority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Load More */}
      <motion.button
        onClick={() => fetchInsights(true)}
        disabled={loadingMore}
        className="w-full p-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {loadingMore ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Finding more insights...
          </>
        ) : (
          "Load more insights..."
        )}
      </motion.button>
    </motion.div>
  );
};

export default InsightsTab;