import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Droplets, Sun, Leaf } from "lucide-react";

const recommendations = [
  {
    id: 1,
    crop: "Rice",
    suitability: 99,
    expectedYield: "20-25 quintals/acre",
    reasons: ["soil", "weather", "season"],
    isBestChoice: true,
    emoji: "🌾",
  },
  {
    id: 2,
    crop: "Maize",
    suitability: 92,
    expectedYield: "15-20 quintals/acre",
    reasons: ["soil", "weather"],
    isBestChoice: false,
    emoji: "🌽",
  },
  {
    id: 3,
    crop: "Coffee",
    suitability: 85,
    expectedYield: "5-8 quintals/acre",
    reasons: ["weather", "season"],
    isBestChoice: false,
    emoji: "☕",
  },
  {
    id: 4,
    crop: "Cotton",
    suitability: 78,
    expectedYield: "10-12 quintals/acre",
    reasons: ["soil"],
    isBestChoice: false,
    emoji: "☁️",
  },
];

const reasonIcons: Record<string, { icon: typeof Leaf; label: string }> = {
  soil: { icon: Leaf, label: "Based on Soil" },
  weather: { icon: Sun, label: "Based on Weather" },
  season: { icon: Droplets, label: "Based on Season" },
  "past crops": { icon: TrendingUp, label: "Based on History" },
};

const RecommendationsTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold text-foreground">Crop Recommendations</h2>
        <motion.span
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💡
        </motion.span>
      </div>

      <p className="text-muted-foreground">
        AI-powered suggestions based on your soil, weather, and farming history.
      </p>

      {/* Recommendations Grid */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            className={`glass-card p-6 relative overflow-hidden hover-lift ${rec.isBestChoice ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
              }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Best Choice Badge */}
            {rec.isBestChoice && (
              <motion.div
                className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-xl text-sm font-medium flex items-center gap-1"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4" />
                Best Choice
              </motion.div>
            )}

            <div className="flex items-start gap-4">
              {/* Emoji */}
              <motion.span
                className="text-5xl"
                animate={rec.isBestChoice ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {rec.emoji}
              </motion.span>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-foreground">{rec.crop}</h3>
                  <div className="text-right">
                    <motion.span
                      className="text-2xl font-bold text-primary"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      {rec.suitability}%
                    </motion.span>
                    <p className="text-xs text-muted-foreground">Suitability</p>
                  </div>
                </div>

                {/* Suitability Bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                  <motion.div
                    className={`h-full rounded-full ${rec.isBestChoice
                        ? "bg-gradient-to-r from-primary via-accent to-primary"
                        : "bg-primary"
                      }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${rec.suitability}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>

                {/* Expected Yield */}
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-sm text-foreground">
                    Expected Yield: <strong>{rec.expectedYield}</strong>
                  </span>
                </div>

                {/* Reason Badges */}
                <div className="flex flex-wrap gap-2">
                  {rec.reasons.map((reason) => {
                    const { icon: Icon, label } = reasonIcons[reason];
                    return (
                      <motion.span
                        key={reason}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground"
                        whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.1)" }}
                      >
                        <Icon className="w-3 h-3" />
                        {label}
                      </motion.span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sparkle effect for best choice */}
            {rec.isBestChoice && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-sun rounded-full"
                    style={{
                      top: `${20 + i * 30}%`,
                      right: `${10 + i * 5}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecommendationsTab;