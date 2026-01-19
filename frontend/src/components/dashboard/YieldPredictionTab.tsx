import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sprout, Calculator, TrendingUp, MapPin, Calendar, Scale } from "lucide-react";

interface Metadata {
    states: string[];
    districts: string[];
    crops: string[];
    seasons: string[];
    state_district_map: Record<string, string[]>;
}

interface PredictionResult {
    predicted_yield: number;
    predicted_production: number;
}

const YieldPredictionTab = () => {
    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [loading, setLoading] = useState(true);
    const [predicting, setPredicting] = useState(false);
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        state: "",
        district: "",
        season: "",
        crop: "",
        area: "",
    });

    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

    useEffect(() => {
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/yield-metadata");
            if (!response.ok) throw new Error("Failed to load data");
            const data = await response.json();
            setMetadata(data);
        } catch (err) {
            setError("Could not load form data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const state = e.target.value;
        setFormData((prev) => ({ ...prev, state, district: "" }));
        if (metadata && state) {
            setAvailableDistricts(metadata.state_district_map[state] || []);
        } else {
            setAvailableDistricts([]);
        }
    };

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        setPredicting(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch("http://localhost:8000/api/yield-prediction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    area: parseFloat(formData.area),
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || "Prediction failed");
            }

            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setPredicting(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading yield data...</div>;
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
                <h2 className="text-2xl font-bold text-foreground">Crop Yield Prediction</h2>
                <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <Calculator className="w-6 h-6 text-primary" />
                </motion.span>
            </div>

            <p className="text-muted-foreground">
                Estimate your crop production based on historical data and farming conditions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Form */}
                <motion.div
                    className="glass-card p-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <form onSubmit={handlePredict} className="space-y-4">

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" /> State
                            </label>
                            <select
                                className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                value={formData.state}
                                onChange={handleStateChange}
                                required
                            >
                                <option value="">Select State</option>
                                {metadata?.states.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" /> District
                            </label>
                            <select
                                className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                value={formData.district}
                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                required
                                disabled={!formData.state}
                            >
                                <option value="">Select District</option>
                                {availableDistricts.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" /> Season
                                </label>
                                <select
                                    className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                    value={formData.season}
                                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                                    required
                                >
                                    <option value="">Select Season</option>
                                    {metadata?.seasons.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Sprout className="w-4 h-4 text-primary" /> Crop
                                </label>
                                <select
                                    className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                    value={formData.crop}
                                    onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                                    required
                                >
                                    <option value="">Select Crop</option>
                                    {metadata?.crops.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                <Scale className="w-4 h-4 text-primary" /> Area (in Hectares)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                placeholder="Ex. 2.5"
                                value={formData.area}
                                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={predicting}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {predicting ? (
                                "Predicting..."
                            ) : (
                                <>
                                    <Calculator className="w-5 h-5" /> Calculate Yield
                                </>
                            )}
                        </button>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </form>
                </motion.div>

                {/* Result Display */}
                <div className="space-y-6">
                    <motion.div
                        className="glass-card p-6 h-full flex flex-col justify-center items-center text-center relative overflow-hidden"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {!result ? (
                            <div className="text-muted-foreground flex flex-col items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                                    <TrendingUp className="w-10 h-10 text-muted-foreground/50" />
                                </div>
                                <p>Enter details and click Calculate to see prediction results.</p>
                            </div>
                        ) : (
                            <div className="w-full space-y-6 relative z-10">
                                <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center animate-in zoom-in duration-500">
                                    <TrendingUp className="w-10 h-10 text-primary" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Predicted Yield</h3>
                                    <p className="text-4xl font-bold text-foreground">
                                        {result.predicted_yield.toFixed(2)}
                                        <span className="text-lg font-normal text-muted-foreground ml-2">tons/hectare</span>
                                    </p>
                                </div>

                                <div className="h-px bg-border w-1/2 mx-auto" />

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Production</h3>
                                    <p className="text-3xl font-bold text-primary">
                                        {result.predicted_production.toFixed(2)}
                                        <span className="text-lg font-normal text-muted-foreground ml-2">tons</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 p-32 bg-accent/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default YieldPredictionTab;
