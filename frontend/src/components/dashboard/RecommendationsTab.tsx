import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Droplets, Sun, Leaf, Loader2 } from "lucide-react";

interface RecommendationsTabProps {
  farmerData: {
    location: string;
  };
}

interface Recommendation {
  id: number;
  crop: string;
  suitability: number;
  expectedYield: string;
  reasons: string[];
  isBestChoice: boolean;
  emoji: string;
}

const reasonIcons: Record<string, { icon: typeof Leaf; label: string }> = {
  soil: { icon: Leaf, label: "Based on Soil" },
  weather: { icon: Sun, label: "Based on Weather" },
  season: { icon: Droplets, label: "Based on Season" },
  "past crops": { icon: TrendingUp, label: "Based on History" },
};

const RecommendationsTab = ({ farmerData }: RecommendationsTabProps) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
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

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { district, state } = parseLocation(farmerData.location);

        const response = await fetch("http://localhost:8000/api/crop-recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            district: district || "Pune",
            state: state || "Maharashtra"
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch recommendations");

        const data = await response.json();

        // combine favorable and unfavorable (if we want to show both, or just top ones)
        // For now, let's just show favorable ones as the UI is designed for "Recommendations"
        const allRecs = [...data.favorable];

        const mappedRecs: Recommendation[] = allRecs.map((rec: any, index: number) => {
          // Extract percentage from reason string: "High suitability (98%) ..."
          const match = rec.reason.match(/\((\d+)%\)/);
          const suitability = match ? parseInt(match[1]) : (80 - index * 5); // Fallback logic

          // Extract emoji and name
          // Backend returns format "🌾 Rice"
          const parts = rec.name.split(" ");
          const emoji = parts.length > 0 ? parts[0] : "🌱";
          const cropName = parts.length > 1 ? parts.slice(1).join(" ") : rec.name;

          return {
            id: index,
            crop: cropName,
            suitability: suitability,
            expectedYield: "20-25 quintals/acre", // Mocked for now
            reasons: ["weather", "season", "soil"], // Mocked tags
            isBestChoice: index === 0,
            emoji: emoji
          };
        });

        setRecommendations(mappedRecs);
      } catch (err) {
        console.error(err);
        setError("Could not generate recommendations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [farmerData.location]);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2"><Loader2 className="w-6 h-6 animate-spin" /> Analyzing soil and weather data...</div>;
  }

  if (error || recommendations.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {error || "No suitable crops found for your location at this time."}
        <br />
        (Try updating your location profile)
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