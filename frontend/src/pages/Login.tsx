import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, User, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FloatingLeaf, FloatingSun, FloatingCloud, FloatingWheat, GrowingSeed } from "@/components/FloatingElements";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    location: "",
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store farmer data in localStorage for demo
    localStorage.setItem("farmerData", JSON.stringify(formData));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-sky/20 via-background to-crop-light/20">
      {/* Animated Background Elements */}
      <FloatingSun className="top-10 right-10 md:right-20" />
      <FloatingCloud className="top-20 left-10" delay={0} />
      <FloatingCloud className="top-32 right-1/4" delay={2} />
      <FloatingLeaf className="top-1/4 left-20" delay={0.5} />
      <FloatingLeaf className="top-1/3 right-32" delay={1} />
      <FloatingLeaf className="bottom-1/4 left-1/4" delay={1.5} />
      <FloatingWheat className="bottom-0 left-10" delay={0} />
      <FloatingWheat className="bottom-0 left-24" delay={0.3} />
      <FloatingWheat className="bottom-0 right-10" delay={0.6} />
      <FloatingWheat className="bottom-0 right-24" delay={0.9} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Logo & Title */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sprout className="w-10 h-10 text-primary" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-2">
              Krishi-Mate
            </h1>
            <p className="text-muted-foreground text-lg">
              Your Smart Farming Companion 🌾
            </p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            className="glass-card-strong p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">
              Welcome, Farmer! 👋
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-11 h-12 bg-background/50 border-border/50 focus:border-primary rounded-xl"
                    required
                  />
                </div>
              </motion.div>

              {/* Mobile Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="pl-11 h-12 bg-background/50 border-border/50 focus:border-primary rounded-xl"
                    required
                  />
                </div>
              </motion.div>

              {/* Location Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Location (Village / District)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="pl-11 h-12 bg-background/50 border-border/50 focus:border-primary rounded-xl"
                    required
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="pt-2"
              >
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow transition-all duration-300"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <motion.span
                    className="flex items-center gap-2"
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                  >
                    Enter My Farm
                    <GrowingSeed className="w-6 h-6" />
                  </motion.span>
                </Button>
              </motion.div>
            </form>

            {/* Language Toggle */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
                🌐 English | हिंदी
              </button>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.p
            className="text-center mt-6 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Empowering farmers with smart technology 🌱
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;