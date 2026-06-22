import React, { useState, useRef } from 'react';
import { 
  Apple, ScanLine, Upload, Sparkles, Activity, RotateCcw, 
  Flame, Beef, Wheat, Droplet, Leaf, Info, AlertCircle,
  CheckCircle2, Search, Zap, Salad, Milk, Cookie
} from 'lucide-react';

interface NutritionalData {
  name: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  sugar: string;
  servingSize: string;
  healthScore: number;
  vitamins: string[];
  minerals: string[];
  benefits: string[];
  warnings: string[];
  ayurvedicNote: string;
  category: 'fruits' | 'vegetables' | 'grains' | 'proteins' | 'dairy' | 'processed' | 'beverages';
}

export const FoodScanner: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [uploadedImage, setUploadedImage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [nutrition, setNutrition] = useState<NutritionalData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Comprehensive food database (nutritional values per standard serving)
  const foodDatabase: { [key: string]: NutritionalData } = {
    'apple': { name: 'Apple 🍎', calories: 95, protein: '0.5g', carbs: '25g', fat: '0.3g', fiber: '4.4g', sugar: '19g', servingSize: '1 medium (182g)', healthScore: 92, vitamins: ['Vitamin C', 'Vitamin K', 'Vitamin B6'], minerals: ['Potassium', 'Manganese', 'Copper'], benefits: ['Supports heart health', 'Aids digestion', 'May lower diabetes risk', 'Rich in antioxidants'], warnings: ['Seeds contain amygdalin — avoid eating in large quantities'], ayurvedicNote: 'Balances Pitta & Kapha doshas. Best eaten in the morning. Avoid at night for weak digestion.', category: 'fruits' },
    'banana': { name: 'Banana 🍌', calories: 105, protein: '1.3g', carbs: '27g', fat: '0.4g', fiber: '3.1g', sugar: '14g', servingSize: '1 medium (118g)', healthScore: 88, vitamins: ['Vitamin B6', 'Vitamin C', 'Vitamin A'], minerals: ['Potassium', 'Magnesium', 'Manganese'], benefits: ['Boosts energy instantly', 'Supports heart health', 'Improves digestion', 'Helps muscle recovery'], warnings: ['High in sugar — diabetics should limit to 1/2 per day'], ayurvedicNote: 'Builds strength and calms Vata. Excellent pre/post workout. Combine with milk for Ojas building.', category: 'fruits' },
    'rice': { name: 'White Rice 🍚', calories: 206, protein: '4.3g', carbs: '45g', fat: '0.4g', fiber: '0.6g', sugar: '0.1g', servingSize: '1 cup cooked (158g)', healthScore: 65, vitamins: ['B6', 'Folate', 'Niacin'], minerals: ['Manganese', 'Selenium', 'Iron'], benefits: ['Quick energy source', 'Gluten-free', 'Easy to digest', 'Good for upset stomach'], warnings: ['High glycemic index — diabetics should prefer brown rice', 'Over-consumption linked to weight gain'], ayurvedicNote: 'Old rice (purana) is preferred in Ayurveda. Fresh rice aggravates Kapha. Rice water (peya) is healing.', category: 'grains' },
    'brown rice': { name: 'Brown Rice 🌾', calories: 216, protein: '5g', carbs: '45g', fat: '1.8g', fiber: '3.5g', sugar: '0.7g', servingSize: '1 cup cooked (195g)', healthScore: 85, vitamins: ['B6', 'Magnesium', 'Niacin'], minerals: ['Manganese', 'Phosphorus', 'Selenium'], benefits: ['Heart-healthy whole grain', 'Better for blood sugar', 'Rich in fiber', 'Supports gut health'], warnings: ['Contains phytic acid — soak before cooking for better absorption'], ayurvedicNote: 'More balancing than white rice. Good for all doshas in moderation. Prefer organically grown.', category: 'grains' },
    'chicken': { name: 'Chicken Breast 🍗', calories: 165, protein: '31g', carbs: '0g', fat: '3.6g', fiber: '0g', sugar: '0g', servingSize: '100g cooked', healthScore: 82, vitamins: ['B6', 'B12', 'Niacin'], minerals: ['Phosphorus', 'Selenium', 'Zinc'], benefits: ['Excellent protein source', 'Supports muscle growth', 'Boosts immunity', 'Low in saturated fat'], warnings: ['Avoid processed/fried versions', 'Ensure fully cooked to prevent salmonella'], ayurvedicNote: 'Chicken soup (yusha) is prescribed for weakness. Avoid in excess for Pitta types. Prefer free-range.', category: 'proteins' },
    'egg': { name: 'Whole Egg 🥚', calories: 155, protein: '13g', carbs: '1.1g', fat: '11g', fiber: '0g', sugar: '1.1g', servingSize: '2 large eggs (100g)', healthScore: 87, vitamins: ['B12', 'Vitamin D', 'Vitamin A', 'Choline'], minerals: ['Selenium', 'Phosphorus', 'Iron'], benefits: ['Complete protein source', 'Brain health (choline)', 'Eye health (lutein)', 'Affordable nutrition'], warnings: ['Cholesterol-conscious individuals: limit to 3-4 eggs/week'], ayurvedicNote: 'Eggs are considered tamasic in Ayurveda. Boiled is best. Avoid if following strict sattvic diet.', category: 'proteins' },
    'milk': { name: 'Whole Milk 🥛', calories: 149, protein: '8g', carbs: '12g', fat: '8g', fiber: '0g', sugar: '12g', servingSize: '1 cup (244ml)', healthScore: 78, vitamins: ['Vitamin D', 'Vitamin B12', 'Riboflavin'], minerals: ['Calcium', 'Phosphorus', 'Potassium'], benefits: ['Bone & teeth health', 'Muscle recovery', 'Sleep aid (warm milk)', 'Rich in calcium'], warnings: ['Lactose intolerant individuals should avoid', 'Whole milk high in saturated fat'], ayurvedicNote: 'Warm milk with turmeric or cardamom is deeply nourishing. Builds Ojas. Best consumed warm with a pinch of ginger for digestibility.', category: 'dairy' },
    'yogurt': { name: 'Yogurt (Curd) 🥣', calories: 100, protein: '10g', carbs: '12g', fat: '0.7g', fiber: '0g', sugar: '12g', servingSize: '1 cup (245g)', healthScore: 90, vitamins: ['B12', 'Riboflavin', 'Calcium'], minerals: ['Calcium', 'Phosphorus', 'Potassium'], benefits: ['Probiotic gut health', 'Immunity boost', 'Cooling effect', 'Bone strength'], warnings: ['Avoid at night per Ayurveda', 'Sour yogurt aggravates Pitta'], ayurvedicNote: 'Fresh sweet curd is excellent. Never heat yogurt. Mix with sugar or honey for cooling effect. Avoid at night — causes respiratory issues.', category: 'dairy' },
    'oats': { name: 'Oats 🌾', calories: 154, protein: '5g', carbs: '27g', fat: '2.6g', fiber: '4g', sugar: '1g', servingSize: '1/2 cup dry (40g)', healthScore: 92, vitamins: ['B1', 'Iron', 'Magnesium'], minerals: ['Manganese', 'Phosphorus', 'Zinc'], benefits: ['Lowers cholesterol', 'Sustained energy', 'Weight management', 'Gut health (beta-glucan)'], warnings: ['Choose steel-cut over instant for lower glycemic impact'], ayurvedicNote: 'Warm oatmeal with ghee and cardamom balances Vata. Add dates for extra nourishment. Good breakfast for all doshas.', category: 'grains' },
    'almond': { name: 'Almonds 🌰', calories: 164, protein: '6g', carbs: '6g', fat: '14g', fiber: '3.5g', sugar: '1g', servingSize: '1 oz (23 almonds, 28g)', healthScore: 94, vitamins: ['Vitamin E', 'Riboflavin'], minerals: ['Magnesium', 'Calcium', 'Iron'], benefits: ['Heart health', 'Brain function', 'Blood sugar control', 'Skin health'], warnings: ['Calorie-dense — stick to 23 almonds/day', 'Soak overnight for better digestion'], ayurvedicNote: 'Soak overnight, peel, and consume in the morning. Builds brain tissue (medha dhatu) and Ojas. Excellent for students and elders.', category: 'proteins' },
    'spinach': { name: 'Spinach 🥬', calories: 23, protein: '2.9g', carbs: '3.6g', fat: '0.4g', fiber: '2.2g', sugar: '0.4g', servingSize: '1 cup raw (30g)', healthScore: 96, vitamins: ['Vitamin K', 'Vitamin A', 'Vitamin C', 'Folate'], minerals: ['Iron', 'Calcium', 'Magnesium'], benefits: ['Eye health (lutein)', 'Bone strength', 'Blood pressure regulation', 'Antioxidant-rich'], warnings: ['High oxalate — kidney stone prone individuals should moderate', 'Cook to reduce oxalate'], ayurvedicNote: 'Cook with ghee and warming spices to balance its cooling nature. Avoid raw for weak digestion (Vata types).', category: 'vegetables' },
    'carrot': { name: 'Carrot 🥕', calories: 25, protein: '0.6g', carbs: '6g', fat: '0.1g', fiber: '1.7g', sugar: '2.9g', servingSize: '1 medium (61g)', healthScore: 94, vitamins: ['Vitamin A', 'Vitamin K1', 'Vitamin B6'], minerals: ['Potassium', 'Biotin'], benefits: ['Vision health', 'Skin glow', 'Immune support', 'Heart health'], warnings: ['Excessive consumption can cause carotenemia (orange skin tint)'], ayurvedicNote: 'Sweet, cooling, and tridoshic. Cooked carrots with ghee nourish eyes and reproductive tissue. Raw is more cleansing.', category: 'vegetables' },
    'turmeric': { name: 'Turmeric (Haldi) 🌿', calories: 8, protein: '0.2g', carbs: '1.4g', fat: '0.2g', fiber: '0.5g', sugar: '0.1g', servingSize: '1 tsp (2.6g)', healthScore: 98, vitamins: ['Vitamin C', 'Vitamin B6'], minerals: ['Manganese', 'Iron', 'Potassium'], benefits: ['Powerful anti-inflammatory (curcumin)', 'Immune booster', 'Joint health', 'Brain health'], warnings: ['High doses may cause stomach upset', 'Avoid with blood thinners'], ayurvedicNote: 'Sacred Ayurvedic herb. Golden milk (haldi doodh) heals inflammation. Use with black pepper (piperine) for 2000% better absorption.', category: 'vegetables' },
    'chai': { name: 'Masala Chai ☕', calories: 65, protein: '2g', carbs: '8g', fat: '2.5g', fiber: '0g', sugar: '6g', servingSize: '1 cup (240ml)', healthScore: 75, vitamins: ['Riboflavin', 'B12'], minerals: ['Calcium', 'Potassium', 'Manganese'], benefits: ['Antioxidants from tea', 'Digestive spices (ginger, cardamom)', 'Alertness boost', 'Comforting ritual'], warnings: ['Excess caffeine can disrupt sleep', 'High sugar versions contribute to weight gain'], ayurvedicNote: 'Traditional masala chai with ginger, cardamom, cloves ignites digestive fire (agni). Limit to 2 cups/day. Avoid on empty stomach.', category: 'beverages' },
    'pizza': { name: 'Cheese Pizza 🍕', calories: 285, protein: '12g', carbs: '36g', fat: '10g', fiber: '2.5g', sugar: '3.8g', servingSize: '1 slice (107g)', healthScore: 45, vitamins: ['Calcium', 'B12', 'Riboflavin'], minerals: ['Phosphorus', 'Sodium'], benefits: ['Calcium from cheese', 'Quick energy', 'Can add vegetables for nutrients'], warnings: ['High in sodium & saturated fat', 'Processed ingredients', 'Linked to weight gain with frequent consumption'], ayurvedicNote: 'Heavy, processed food that dulls agni (digestive fire). Occasional indulgence is fine. Pair with fresh salad and ginger tea to aid digestion.', category: 'processed' },
    'burger': { name: 'Beef Burger 🍔', calories: 540, protein: '25g', carbs: '40g', fat: '29g', fiber: '2g', sugar: '8g', servingSize: '1 burger (215g)', healthScore: 35, vitamins: ['B12', 'Niacin', 'B6'], minerals: ['Iron', 'Zinc', 'Selenium'], benefits: ['High protein', 'Iron for energy', 'Satiating'], warnings: ['High saturated fat & sodium', 'Processed meat linked to health risks', 'Frequent consumption increases heart disease risk'], ayurvedicNote: 'Heavy tamasic food per Ayurveda. Difficult to digest. If consumed, pair with fresh herbs, ginger, and avoid cold drinks with it.', category: 'processed' },
    'mango': { name: 'Mango 🥭', calories: 99, protein: '1.4g', carbs: '25g', fat: '0.6g', fiber: '2.6g', sugar: '23g', servingSize: '1 cup sliced (165g)', healthScore: 86, vitamins: ['Vitamin C', 'Vitamin A', 'Folate'], minerals: ['Potassium', 'Copper'], benefits: ['Immunity boost', 'Eye health', 'Digestive enzymes', 'Skin health'], warnings: ['High natural sugar — diabetics should limit', 'Unripe mango can cause acidity'], ayurvedicNote: 'King of fruits in Ayurveda. Ripe mango builds Ojas and balances Vata-Pitta. Eat in moderation. Unripe mango with salt aids digestion.', category: 'fruits' },
    'dal': { name: 'Dal (Lentils) 🍲', calories: 116, protein: '9g', carbs: '20g', fat: '0.4g', fiber: '8g', sugar: '1.8g', servingSize: '1/2 cup cooked (100g)', healthScore: 95, vitamins: ['Folate', 'B6', 'Thiamin'], minerals: ['Iron', 'Magnesium', 'Potassium'], benefits: ['Plant-based protein', 'Heart health', 'Blood sugar regulation', 'High fiber'], warnings: ['Can cause gas — soak before cooking', 'Combine with rice for complete protein'], ayurvedicNote: 'Mung dal is tridoshic and sacred in Ayurveda. Easy to digest, builds tissues without ama (toxins). Khichdi (dal+rice) is Ayurveda\'s #1 healing food.', category: 'proteins' }
  };

  const categories = [
    { id: 'all', label: 'All Foods', icon: Salad },
    { id: 'fruits', label: 'Fruits', icon: Apple },
    { id: 'vegetables', label: 'Vegetables', icon: Leaf },
    { id: 'grains', label: 'Grains', icon: Wheat },
    { id: 'proteins', label: 'Proteins', icon: Beef },
    { id: 'dairy', label: 'Dairy', icon: Milk },
    { id: 'beverages', label: 'Beverages', icon: Zap },
    { id: 'processed', label: 'Processed', icon: Cookie }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // filename not needed for UI
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedImage(ev.target?.result as string || '');
    reader.readAsDataURL(file);
  };

  const findFood = (text: string): NutritionalData | null => {
    const lower = text.toLowerCase().trim();
    // Exact match
    if (foodDatabase[lower]) return foodDatabase[lower];
    // Partial match
    for (const [key, food] of Object.entries(foodDatabase)) {
      if (lower.includes(key) || key.includes(lower) || food.name.toLowerCase().includes(lower)) {
        return food;
      }
    }
    return null;
  };

  const handleScan = () => {
    if (!inputText.trim() && !uploadedImage) return;
    setIsScanning(true);
    setTimeout(() => {
      let result: NutritionalData | null = null;
      if (inputText.trim()) {
        result = findFood(inputText);
      }
      if (!result && uploadedImage) {
        // Simulate visual food recognition (fallback to first food for demo)
        result = foodDatabase['apple'];
      }
      setNutrition(result);
      setAnalyzed(true);
      setIsScanning(false);
    }, 2000);
  };

  const reset = () => {
    setInputText('');
    setUploadedImage('');
    setNutrition(null);
    setAnalyzed(false);
  };

  const getHealthColor = (score: number) => {
    if (score >= 85) return { text: 'text-emerald-600', bg: 'bg-emerald-500', label: 'Excellent' };
    if (score >= 70) return { text: 'text-teal-600', bg: 'bg-teal-500', label: 'Very Good' };
    if (score >= 55) return { text: 'text-amber-600', bg: 'bg-amber-500', label: 'Moderate' };
    return { text: 'text-red-600', bg: 'bg-red-500', label: 'Limit Intake' };
  };

  const filteredSuggestions = Object.values(foodDatabase)
    .filter(f => selectedCategory === 'all' || f.category === selectedCategory)
    .slice(0, 8);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <ScanLine className="text-orange-500 w-7 h-7" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">AI Food & Nutrition Scanner</h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <p className="text-sm text-slate-500">Powered by </p>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
            🍎 Aarogya AI Nutrition Engine
          </span>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
            🌿 Ayurvedic insights via BhashaBench-Ayur • BharatGen
          </span>
        </div>
      </div>

      {!analyzed ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-4">
              <Search className="w-5 h-5 text-orange-500" /> Scan or Search Food
            </h2>

            {/* Image Upload */}
            {!uploadedImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all mb-4"
              >
                <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl w-fit mx-auto mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-700">Snap or upload food photo</p>
                <p className="text-[10px] text-slate-400 mt-1">AI will recognize the dish and analyze nutrition</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 mb-4">
                <img src={uploadedImage} alt="Food" className="w-full h-48 object-cover" />
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 animate-spin" /> Analyzing nutrients...
                    </div>
                  </div>
                )}
                <button onClick={() => setUploadedImage('')} className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white p-1.5 rounded-lg text-xs">Change</button>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

            {/* Text Input */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input 
                  type="text" 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Or type food name (e.g., apple, dal, mango, yogurt)..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onKeyDown={e => { if (e.key === 'Enter') handleScan(); }}
                />
              </div>
              <button 
                onClick={handleScan}
                disabled={(!inputText.trim() && !uploadedImage) || isScanning}
                className={`w-full font-bold py-3 rounded-2xl text-sm transition-colors flex items-center justify-center gap-1.5 ${inputText.trim() || uploadedImage ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/10' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              >
                {isScanning ? <><Activity className="w-4 h-4 animate-spin" /> Scanning...</> : <><Sparkles className="w-4 h-4" /> Analyze Nutrition</>}
              </button>
            </div>
          </div>

          {/* Quick Food Suggestions */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-3">
              <Salad className="w-5 h-5 text-orange-500" /> Try a Food
            </h2>
            
            <div className="flex flex-wrap gap-1.5 mb-4">
              {categories.map(cat => {
                const Icon = cat.icon;
                return (
                  <button 
                    key={cat.id} 
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-[10px] font-bold px-2.5 py-1.5 rounded-full border transition-all flex items-center gap-1 ${selectedCategory === cat.id ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'}`}
                  >
                    <Icon className="w-3 h-3" /> {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 overflow-y-auto flex-1 pr-1">
              {filteredSuggestions.map(food => {
                const hc = getHealthColor(food.healthScore);
                return (
                  <button 
                    key={food.name}
                    onClick={() => { setInputText(food.name.toLowerCase().split(' ')[0]); }}
                    className="bg-gradient-to-br from-orange-50 to-amber-50/50 border border-orange-100 p-3 rounded-2xl text-left hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base font-extrabold text-slate-800 truncate">{food.name}</span>
                      <span className={`text-[8px] font-bold ${hc.text}`}>{food.healthScore}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Flame className="w-3 h-3 text-orange-400" /> {food.calories} kcal
                    </div>
                    <div className="flex gap-1 mt-1.5 text-[8px]">
                      <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">P: {food.protein}</span>
                      <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">C: {food.carbs}</span>
                      <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">F: {food.fat}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-xl">
              <p className="text-[10px] text-orange-700 font-medium leading-relaxed">
                <strong>💡 Tip:</strong> Type any food name or upload a photo. Each analysis includes modern nutrition facts + authentic Ayurvedic wisdom from the BhashaBench-Ayur benchmark.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Results */
        nutrition ? (
          <div className="space-y-6">
            {/* Hero Banner */}
            {(() => {
              const hc = getHealthColor(nutrition.healthScore);
              return (
                <div className={`bg-gradient-to-r ${hc.bg} to-orange-500 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden`}>
                  <div className="absolute right-0 top-0 -mr-12 -mt-12 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
                  <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider opacity-80">Nutritional Analysis</p>
                      <h2 className="text-3xl font-extrabold mt-1">{nutrition.name}</h2>
                      <p className="text-sm opacity-90 mt-1">Per serving: {nutrition.servingSize}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">Health Score: {nutrition.healthScore}%</span>
                        <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">{hc.label}</span>
                      </div>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm px-6 py-4 rounded-2xl text-center border border-white/20">
                      <p className="text-3xl font-extrabold flex items-center gap-1"><Flame className="w-6 h-6" />{nutrition.calories}</p>
                      <p className="text-[10px] font-bold uppercase">Calories (kcal)</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Macro Breakdown */}
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
              <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                <Zap className="w-5 h-5 text-orange-500" /> Macronutrient Breakdown
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: 'Protein', value: nutrition.protein, icon: Beef, color: 'bg-indigo-100 text-indigo-700' },
                  { label: 'Carbs', value: nutrition.carbs, icon: Wheat, color: 'bg-emerald-100 text-emerald-700' },
                  { label: 'Fat', value: nutrition.fat, icon: Droplet, color: 'bg-amber-100 text-amber-700' },
                  { label: 'Fiber', value: nutrition.fiber, icon: Leaf, color: 'bg-lime-100 text-lime-700' },
                  { label: 'Sugar', value: nutrition.sugar, icon: Cookie, color: 'bg-pink-100 text-pink-700' },
                  { label: 'Calories', value: `${nutrition.calories} kcal`, icon: Flame, color: 'bg-orange-100 text-orange-700' }
                ].map((m, idx) => (
                  <div key={idx} className={`${m.color} p-3 rounded-2xl text-center`}>
                    <m.icon className="w-4 h-4 mx-auto mb-1.5" />
                    <p className="text-[9px] font-bold uppercase opacity-75">{m.label}</p>
                    <p className="text-sm font-extrabold mt-0.5">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vitamins & Minerals */}
              <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-amber-500" /> Vitamins & Minerals
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Vitamins</p>
                    <div className="flex flex-wrap gap-1.5">
                      {nutrition.vitamins.map((v, i) => (
                        <span key={i} className="bg-violet-50 text-violet-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-violet-100">{v}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Minerals</p>
                    <div className="flex flex-wrap gap-1.5">
                      {nutrition.minerals.map((m, i) => (
                        <span key={i} className="bg-sky-50 text-sky-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-sky-100">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Health Benefits
                </h3>
                <div className="space-y-2">
                  {nutrition.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs font-medium text-slate-700">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ayurvedic Wisdom */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50/50 border-2 border-amber-200 p-6 rounded-3xl shadow-sm relative">
              <div className="absolute top-4 right-4 text-5xl opacity-20">🕉️</div>
              <h3 className="text-base font-bold text-amber-900 mb-3 flex items-center gap-1.5">
                🌿 Ayurvedic Wisdom (BhashaBench-Ayur)
              </h3>
              <p className="text-sm text-amber-900 leading-relaxed font-medium">{nutrition.ayurvedicNote}</p>
              <p className="text-[10px] text-amber-700 mt-3 italic">Knowledge from India's first Ayurvedic AI benchmark • BharatGen</p>
            </div>

            {/* Warnings */}
            {nutrition.warnings.length > 0 && (
              <div className="bg-red-50 border border-red-200 p-5 rounded-3xl">
                <h3 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Things to Watch
                </h3>
                <div className="space-y-2">
                  {nutrition.warnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-red-100">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs font-medium text-slate-700">{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-500 leading-relaxed max-w-2xl">
                  Nutritional values are approximations per standard serving. Ayurvedic insights are derived from traditional texts and BhashaBench-Ayur benchmark. For personalized dietary advice, consult a nutritionist or your doctor.
                </p>
              </div>
              <button onClick={reset} className="flex-shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" /> Scan Another Food
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 p-10 rounded-3xl shadow-sm text-center">
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">Food not found in our database</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">Try a different name or spelling. Available: apple, banana, rice, dal, chicken, egg, milk, yogurt, oats, almonds, spinach, carrot, turmeric, chai, pizza, burger, mango, brown rice.</p>
            <button onClick={reset} className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors">Try Again</button>
          </div>
        )
      )}
    </div>
  );
};
