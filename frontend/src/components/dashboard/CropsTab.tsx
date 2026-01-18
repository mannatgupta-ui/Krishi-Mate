import { motion } from "framer-motion";

const crops = [
  {
    id: 1,
    name: "Wheat",
    stage: "Growing",
    progress: 65,
    daysToHarvest: 45,
    health: "Excellent",
    emoji: "🌾",
  },
  {
    id: 2,
    name: "Rice",
    stage: "Flowering",
    progress: 80,
    daysToHarvest: 25,
    health: "Good",
    emoji: "🌾",
  },
  {
    id: 3,
    name: "Tomatoes",
    stage: "Fruiting",
    progress: 90,
    daysToHarvest: 10,
    health: "Excellent",
    emoji: "🍅",
  },
  {
    id: 4,
    name: "Potatoes",
    stage: "Seedling",
    progress: 25,
    daysToHarvest: 80,
    health: "Growing",
    emoji: "🥔",
  },
];

const stageColors: Record<string, string> = {
  Seedling: "bg-emerald-100 text-emerald-700",
  Growing: "bg-green-100 text-green-700",
  Flowering: "bg-yellow-100 text-yellow-700",
  Fruiting: "bg-orange-100 text-orange-700",
  Harvest: "bg-amber-100 text-amber-700",
};

const CropsTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-foreground">Current Crops 🌱</h2>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crops.map((crop, index) => (
          <motion.div
            key={crop.id}
            className="glass-card p-6 hover-lift"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.span
                  className="text-4xl"
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {crop.emoji}
                </motion.span>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{crop.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${stageColors[crop.stage]}`}>
                    {crop.stage}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Harvest in</p>
                <p className="text-lg font-bold text-primary">{crop.daysToHarvest} days</p>
              </div>
            </div>

            {/* Growth Visualization */}
            <div className="relative mb-4">
              <div className="flex items-end justify-center gap-1 h-24">
                {[...Array(5)].map((_, i) => {
                  const isGrown = (i + 1) * 20 <= crop.progress;
                  const isGrowing = (i + 1) * 20 <= crop.progress + 20 && (i + 1) * 20 > crop.progress;
                  
                  return (
                    <motion.div
                      key={i}
                      className="flex flex-col items-center"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: index * 0.1 + i * 0.1, duration: 0.5 }}
                      style={{ originY: 1 }}
                    >
                      <motion.div
                        className={`w-6 rounded-t-full ${
                          isGrown
                            ? "bg-primary"
                            : isGrowing
                            ? "bg-primary/50"
                            : "bg-muted"
                        }`}
                        style={{ height: 20 + i * 15 }}
                        animate={isGrowing ? { opacity: [0.5, 1, 0.5] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Ground line */}
              <div className="h-2 bg-gradient-to-r from-soil/30 via-soil/50 to-soil/30 rounded-full mt-1" />
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Growth Progress</span>
                <span className="font-medium text-foreground">{crop.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-crop rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${crop.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </div>

            {/* Health Badge */}
            <motion.div
              className="mt-4 flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              <span className="text-sm text-muted-foreground">Health Status</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {crop.health} ✨
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Add Crop Button */}
      <motion.button
        className="w-full p-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        + Add New Crop
      </motion.button>
    </motion.div>
  );
};

export default CropsTab;