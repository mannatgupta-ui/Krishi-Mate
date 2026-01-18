import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle, ChevronRight } from "lucide-react";

const insights = [
  {
    id: 1,
    type: "tip",
    title: "Optimal Fertilizer Timing",
    description: "Apply nitrogen fertilizer in split doses for wheat crop. First dose now, second after 3 weeks.",
    priority: "high",
    icon: Lightbulb,
  },
  {
    id: 2,
    type: "success",
    title: "Crop Health Improving",
    description: "Your rice paddies show 15% better growth compared to last month. Keep up the good work!",
    priority: "medium",
    icon: TrendingUp,
  },
  {
    id: 3,
    type: "warning",
    title: "Pest Alert",
    description: "Aphid activity detected in nearby farms. Consider preventive spraying within 5 days.",
    priority: "high",
    icon: AlertCircle,
  },
  {
    id: 4,
    type: "tip",
    title: "Water Conservation",
    description: "Switch to drip irrigation for vegetable beds to save 30% water during dry season.",
    priority: "medium",
    icon: Lightbulb,
  },
  {
    id: 5,
    type: "success",
    title: "Soil Quality Report",
    description: "Soil organic matter has increased by 8% since adding crop residues. Continue this practice.",
    priority: "low",
    icon: CheckCircle,
  },
];

const priorityColors = {
  high: "bg-destructive/10 text-destructive border-destructive/30",
  medium: "bg-accent/10 text-accent border-accent/30",
  low: "bg-primary/10 text-primary border-primary/30",
};

const typeStyles = {
  tip: { bg: "bg-sun/10", icon: "text-sun", border: "border-sun/30" },
  success: { bg: "bg-primary/10", icon: "text-primary", border: "border-primary/30" },
  warning: { bg: "bg-wheat/10", icon: "text-wheat", border: "border-wheat/30" },
};

const InsightsTab = () => {
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
        AI-powered recommendations to optimize your farming practices.
      </p>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Tips Applied", value: 12, color: "text-primary" },
          { label: "Issues Resolved", value: 8, color: "text-accent" },
          { label: "Active Alerts", value: 2, color: "text-wheat" },
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
          const Icon = insight.icon;
          const style = typeStyles[insight.type as keyof typeof typeStyles];

          return (
            <motion.div
              key={insight.id}
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
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        priorityColors[insight.priority as keyof typeof priorityColors]
                      }`}
                    >
                      {insight.priority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Load More */}
      <motion.button
        className="w-full p-4 text-center text-muted-foreground hover:text-primary transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        Load more insights...
      </motion.button>
    </motion.div>
  );
};

export default InsightsTab;