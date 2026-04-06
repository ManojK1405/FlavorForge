import { useState } from 'react';
import { ChefHat, Music, Quote, Timer, Plus, X, Heart, Wind, Star, Sun, CloudRain, Flame, UtensilsCrossed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface Recipe {
  dishName: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  difficulty: string;
}

interface Vibe {
  quote: string;
  musicGenre: string;
  playlistRecommendation: string;
  trackRecommendations?: string[];
  vibeCheck: string;
}

interface OrchestratedResult {
  recipe: Recipe;
  vibe: Vibe;
}

const moods = [
  { label: 'Relaxed', icon: <Wind size={18} />, color: 'from-blue-400 to-cyan-500' },
  { label: 'Energized', icon: <Flame size={18} />, color: 'from-orange-400 to-red-500' },
  { label: 'Productive', icon: <Star size={18} />, color: 'from-yellow-400 to-amber-500' },
  { label: 'Adventurous', icon: <Sun size={18} />, color: 'from-purple-400 to-pink-500' },
  { label: 'Cozy', icon: <CloudRain size={18} />, color: 'from-gray-400 to-slate-500' },
];

const cuisines = [
  { label: 'Indian', emoji: '🇮🇳' },
  { label: 'Italian', emoji: '🇮🇹' },
  { label: 'Mexican', emoji: '🇲🇽' },
  { label: 'Japanese', emoji: '🇯🇵' },
  { label: 'Mediterranean', emoji: '🫒' },
  { label: 'French', emoji: '🇫🇷' },
  { label: 'American', emoji: '🇺🇸' },
  { label: 'Thai', emoji: '🇹🇭' },
];

function App() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [mood, setMood] = useState('Relaxed');
  const [cuisine, setCuisine] = useState('Indian');
  const [foodDescription, setFoodDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrchestratedResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (ing: string) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  const generateRecipe = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);
    setResult(null);
    setCurrentStep(0);
    try {
      const response = await fetch('http://localhost:5005/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, mood, cuisine, foodDescription: foodDescription.trim() || undefined }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error generating recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative pb-20 px-4 flex flex-col items-center">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-60">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent-primary/30 blur-[150px] rounded-full animate-float" />
        <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-accent-secondary/20 blur-[130px] rounded-full animate-float-slow" />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-accent-highlight/15 blur-[120px] rounded-full animate-float" />
      </div>

      {/* Header */}
      <header className="max-w-4xl w-full pt-16 mb-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <div className="p-3 bg-accent-primary/20 rounded-2xl glass border-accent-primary/30">
            <ChefHat className="text-accent-primary" size={32} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Flavor<span className="gradient-text">Forge</span>
          </h1>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-foreground/70 text-lg md:text-xl font-light"
        >
          Toss in your ingredients. Set the mood. Let AI forge your perfect dish.
        </motion.p>
      </header>

      <main className={`w-full grid grid-cols-1 gap-8 transition-all duration-700 ${result ? 'max-w-[1400px] lg:grid-cols-3' : 'max-w-4xl md:grid-cols-2'}`}>
        {/* Left Side: Inputs */}
        <section className="space-y-8">
          {/* Ingredients Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6 rounded-3xl"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plus size={20} className="text-accent-secondary" />
              Your Pantry
            </h2>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
                placeholder="Add ingredient..."
                className="flex-1 bg-white/8 border border-white/15 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all placeholder:text-white/30"
              />
              <button 
                onClick={addIngredient}
                className="bg-accent-primary hover:bg-accent-primary/80 text-white p-3 rounded-xl transition-all shadow-lg"
              >
                <Plus size={24} />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 min-h-[50px]">
              <AnimatePresence>
                {ingredients.map((ing) => (
                  <motion.span 
                    key={ing}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 bg-white/12 border border-white/10 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-all cursor-default group"
                  >
                    {ing}
                    <button onClick={() => removeIngredient(ing)} className="text-white/40 group-hover:text-accent-highlight transition-colors">
                      <X size={14} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
              {ingredients.length === 0 && (
                <p className="text-white/30 text-sm italic">Start adding some items from your kitchen.</p>
              )}
            </div>

            {/* Optional Description */}
            <div className="mt-5">
              <label className="text-sm text-white/50 mb-2 block uppercase tracking-wider">What are you craving? <span className="text-white/30 normal-case tracking-normal">(optional)</span></label>
              <textarea
                value={foodDescription}
                onChange={(e) => setFoodDescription(e.target.value)}
                placeholder="e.g. Something spicy and creamy, a light salad, comfort food..."
                rows={2}
                className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all placeholder:text-white/25 text-sm text-white/90 resize-none"
              />
            </div>
          </motion.div>

          {/* Vibe Selector */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-3xl"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Wind size={20} className="text-accent-primary" />
              Set the Vibe
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm text-white/50 mb-3 block uppercase tracking-wider">Current Mood</label>
                <div className="grid grid-cols-3 gap-3">
                  {moods.map((m) => (
                    <button
                      key={m.label}
                      onClick={() => setMood(m.label)}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all ${
                        mood === m.label 
                          ? `bg-gradient-to-br ${m.color} border-white/20 text-white` 
                          : 'bg-white/8 border-white/10 text-white/60 hover:bg-white/15'
                      }`}
                    >
                      {m.icon}
                      <span className="text-xs font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-white/50 mb-3 block uppercase tracking-wider flex items-center gap-2">
                  <UtensilsCrossed size={14} /> Preferred Cuisine
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {cuisines.map(c => (
                    <button
                      key={c.label}
                      onClick={() => setCuisine(c.label)}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${
                        cuisine === c.label
                          ? 'bg-accent-primary/20 border-accent-primary/40 text-white shadow-lg shadow-accent-primary/10'
                          : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
                      }`}
                    >
                      <span>{c.emoji}</span>
                      <span className="text-xs">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <button
            onClick={generateRecipe}
            disabled={loading || ingredients.length === 0}
            className={`w-full py-5 rounded-3xl font-bold text-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-2xl ${
              loading 
                ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                : 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:shadow-accent-primary/30 hover:shadow-xl'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <ChefHat className="animate-spin" /> Alchemy in Progress...
              </span>
            ) : (
              <>
                <Heart size={24} /> Create Magic
              </>
            )}
          </button>
        </section>

        {/* Right Side: Output */}
        <section className={`relative transition-all duration-700 ${result ? 'lg:col-span-2' : ''}`}>
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center glass rounded-3xl p-12 border-dashed border-white/15"
              >
                <div className="w-20 h-20 bg-accent-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Star size={40} className="text-accent-primary/40" />
                </div>
                <h3 className="text-2xl font-semibold text-white/50 mb-2">Ready to Cook?</h3>
                <p className="text-white/30 max-w-[200px]">Enter your ingredients and pick a vibe to generate your AI Fusion dish.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center space-y-6 glass rounded-3xl p-8"
              >
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 border-4 border-accent-primary/20 rounded-full" />
                  <motion.div 
                    className="absolute inset-0 border-4 border-accent-secondary border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ChefHat className="text-accent-secondary" size={48} />
                  </div>
                </div>
                <p className="text-accent-secondary font-medium animate-pulse text-lg tracking-widest uppercase">Flavorizing...</p>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
              >
                {/* Vibe Quote */}
                <div className="glass p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Quote size={80} />
                  </div>
                  <p className="text-2xl font-serif leading-relaxed italic text-white/95">
                    "{result.vibe?.quote}"
                  </p>
                  <div className="mt-6 flex flex-col gap-6 border-t border-white/10 pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex items-start gap-3 text-accent-secondary shrink-0 md:max-w-[40%]">
                        <Music size={22} className="shrink-0 mt-1" />
                        <span className="text-lg font-medium leading-snug">{result.vibe?.musicGenre}</span>
                      </div>
                      <div className="hidden md:block h-1.5 w-1.5 bg-white/30 rounded-full shrink-0 mt-3" />
                      <span className="text-xs text-white/50 uppercase tracking-widest leading-loose flex-1">{result.vibe?.vibeCheck}</span>
                    </div>
                    
                    {result.vibe?.trackRecommendations && result.vibe.trackRecommendations.length > 0 && (
                      <div className="flex flex-col gap-4 bg-white/5 p-6 rounded-3xl border border-white/10 mt-2">
                        <span className="text-xs font-bold text-accent-secondary/70 uppercase tracking-widest">🎵 Suggested Tracks</span>
                        <div className="flex flex-col gap-3">
                          {result.vibe.trackRecommendations.map((track, i) => (
                            <div key={i} className="bg-white/8 hover:bg-white/15 transition-all px-5 py-4 rounded-2xl flex items-center gap-4 border border-white/10 shadow-sm w-full hover:border-accent-secondary/30 hover:shadow-accent-secondary/5 hover:shadow-md">
                               <Music size={16} className="text-accent-secondary shrink-0" /> 
                               <span className="text-sm text-white/90 leading-relaxed">{track}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dish Card */}
                <div className="glass p-8 rounded-3xl bg-gradient-to-br from-accent-primary/10 via-accent-highlight/5 to-transparent">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{result.recipe?.dishName}</h2>
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1 text-sm text-white/60">
                          <Timer size={14} /> {result.recipe?.cookingTime}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-white/60 capitalize">
                          <Star size={14} /> {result.recipe?.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg">AI Recommended</div>
                  </div>
                  
                  <p className="text-white/80 mb-8 leading-relaxed">{result.recipe?.description}</p>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold uppercase text-accent-secondary mb-4 tracking-[0.2em]">Ingredients</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {result.recipe?.ingredients?.map((ing, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-white/85 border-l-2 border-accent-secondary/40 pl-3">
                            {ing}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold uppercase text-accent-primary tracking-[0.2em]">Method</h4>
                        <span className="text-xs font-medium text-accent-secondary bg-accent-secondary/10 py-1.5 px-4 rounded-full border border-accent-secondary/20">
                          Step {currentStep + 1} of {result.recipe?.instructions?.length || 0}
                        </span>
                      </div>
                      
                      <div className="p-6 md:p-8 rounded-3xl bg-white/8 border border-white/12 min-h-[140px] flex md:items-center relative overflow-hidden mb-6 shadow-xl">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="flex gap-5 w-full items-start md:items-center"
                          >
                            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary text-white flex items-center justify-center text-base font-bold shadow-lg shadow-accent-primary/20">
                              {currentStep + 1}
                            </span>
                            <p className="text-white/90 text-lg leading-relaxed flex-1 font-medium">{result.recipe?.instructions?.[currentStep]}</p>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      <div className="flex gap-4 mt-2">
                        <button 
                          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                          disabled={currentStep === 0}
                          className="flex-1 py-4 px-6 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-white/80 rounded-2xl transition-all border border-white/10 disabled:cursor-not-allowed font-medium shadow-sm"
                        >
                          Previous
                        </button>
                        <button 
                          onClick={() => setCurrentStep(prev => Math.min((result.recipe?.instructions?.length || 1) - 1, prev + 1))}
                          disabled={currentStep === (result.recipe?.instructions?.length || 1) - 1}
                          className="flex-1 py-4 px-6 bg-gradient-to-r from-accent-primary to-accent-secondary hover:opacity-90 disabled:opacity-30 text-white rounded-2xl transition-all shadow-lg disabled:cursor-not-allowed font-medium"
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
      
      <footer className="mt-20 text-white/30 text-xs tracking-widest uppercase pb-12">
        Forged with ❤️ by Gemini AI ✨
      </footer>
    </div>
  );
}

export default App;
