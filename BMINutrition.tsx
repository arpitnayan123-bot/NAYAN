import React, { useState } from 'react';
import { UserMetrics } from '../types';
import { 
  Scale, Calculator, Apple, Flame, Beef, Wheat, Droplet, 
  TrendingUp, Target, Info, Salad
} from 'lucide-react';

interface BMINutritionProps {
  metrics: UserMetrics;
}

export const BMINutrition: React.FC<BMINutritionProps> = ({ metrics }) => {
  const [weight, setWeight] = useState(metrics.weight);
  const [height, setHeight] = useState(metrics.height);
  const [age, setAge] = useState(metrics.age);
  const [gender, setGender] = useState(metrics.gender.toLowerCase());
  const [activity, setActivity] = useState('moderate');

  const bmi = +(weight / ((height / 100) ** 2)).toFixed(1);

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-sky-600', bar: 'bg-sky-500', pos: (bmi / 40) * 100 };
    if (bmi < 25) return { text: 'Normal / Healthy', color: 'text-emerald-600', bar: 'bg-emerald-500', pos: (bmi / 40) * 100 };
    if (bmi < 30) return { text: 'Overweight', color: 'text-amber-600', bar: 'bg-amber-500', pos: (bmi / 40) * 100 };
    return { text: 'Obese', color: 'text-red-600', bar: 'bg-red-500', pos: Math.min(100, (bmi / 40) * 100) };
  };
  const category = getBmiCategory(bmi);

  // BMR via Mifflin-St Jeor
  const bmr = gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  const activityMultipliers: { [key: string]: number } = {
    sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9
  };
  const tdee = Math.round(bmr * activityMultipliers[activity]);

  // Macronutrient targets (balanced split)
  const proteinGrams = Math.round((tdee * 0.30) / 4);
  const carbGrams = Math.round((tdee * 0.45) / 4);
  const fatGrams = Math.round((tdee * 0.25) / 9);
  const waterLiters = +(weight * 0.033).toFixed(1);

  // Ideal weight range (BMI 18.5-24.9)
  const idealMin = Math.round(18.5 * ((height / 100) ** 2));
  const idealMax = Math.round(24.9 * ((height / 100) ** 2));

  const nutritionGuide = [
    { icon: Beef, title: 'Protein', target: `${proteinGrams}g/day`, color: 'bg-indigo-500', sources: 'Eggs, chicken, fish, lentils, Greek yogurt, tofu', tip: 'Builds & repairs muscle, keeps you full.' },
    { icon: Wheat, title: 'Carbohydrates', target: `${carbGrams}g/day`, color: 'bg-emerald-500', sources: 'Oats, brown rice, quinoa, fruits, vegetables', tip: 'Primary energy source — choose complex carbs.' },
    { icon: Droplet, title: 'Healthy Fats', target: `${fatGrams}g/day`, color: 'bg-amber-500', sources: 'Avocado, nuts, olive oil, salmon, seeds', tip: 'Supports brain & hormone function.' },
    { icon: Droplet, title: 'Hydration', target: `${waterLiters}L/day`, color: 'bg-sky-500', sources: 'Water, herbal teas, water-rich fruits', tip: 'Vital for metabolism & detoxification.' }
  ];

  const superfoods = [
    { emoji: '🥬', name: 'Leafy Greens', benefit: 'Iron, folate, fiber' },
    { emoji: '🫐', name: 'Berries', benefit: 'Antioxidants, low GI' },
    { emoji: '🥑', name: 'Avocado', benefit: 'Healthy monounsaturated fats' },
    { emoji: '🐟', name: 'Fatty Fish', benefit: 'Omega-3, protein' },
    { emoji: '🥜', name: 'Nuts & Seeds', benefit: 'Healthy fats, magnesium' },
    { emoji: '🍠', name: 'Sweet Potato', benefit: 'Complex carbs, vitamin A' },
    { emoji: '🥦', name: 'Broccoli', benefit: 'Vitamin C, fiber' },
    { emoji: '🫘', name: 'Legumes', benefit: 'Plant protein, fiber' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
          <Scale className="text-emerald-500 w-7 h-7" /> BMI & Nutrition Calculator
        </h1>
        <p className="text-sm text-slate-500 mt-1">Calculate your BMI, daily calorie needs (TDEE), and personalized macronutrient targets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-4">
            <Calculator className="w-5 h-5 text-emerald-500" /> Your Measurements
          </h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Weight (kg)</label>
                <input type="number" value={weight} onChange={e => setWeight(+e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Height (cm)</label>
                <input type="number" value={height} onChange={e => setHeight(+e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Age</label>
                <input type="number" value={age} onChange={e => setAge(+e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Activity Level</label>
              <select value={activity} onChange={e => setActivity(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="sedentary">Sedentary (little/no exercise)</option>
                <option value="light">Light (1-3 days/week)</option>
                <option value="moderate">Moderate (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="very_active">Very Active (athlete/physical job)</option>
              </select>
            </div>
          </div>
        </div>

        {/* BMI Result + Gauge */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5 text-emerald-500" /> Your BMI Result
            </h2>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-slate-800">{bmi}</span>
              <span className={`block text-xs font-bold ${category.color}`}>{category.text}</span>
            </div>
          </div>

          {/* BMI gauge bar */}
          <div className="mt-6 mb-2">
            <div className="relative h-4 rounded-full overflow-hidden flex">
              <div className="bg-sky-400" style={{ width: '46.25%' }}></div>
              <div className="bg-emerald-400" style={{ width: '16.25%' }}></div>
              <div className="bg-amber-400" style={{ width: '12.5%' }}></div>
              <div className="bg-red-400" style={{ width: '25%' }}></div>
            </div>
            <div className="relative h-4">
              <div className="absolute -top-1 transform -translate-x-1/2 transition-all duration-500" style={{ left: `${Math.min(100, Math.max(0, category.pos))}%` }}>
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-slate-800"></div>
              </div>
            </div>
            <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-1">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </div>

          {/* Quick facts */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-emerald-50 p-4 rounded-2xl">
              <div className="flex items-center gap-1.5 text-emerald-700">
                <Target className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Ideal Weight Range</span>
              </div>
              <p className="text-lg font-extrabold text-slate-800 mt-1">{idealMin} - {idealMax} kg</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl">
              <div className="flex items-center gap-1.5 text-orange-700">
                <Flame className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Daily Calorie Needs</span>
              </div>
              <p className="text-lg font-extrabold text-slate-800 mt-1">{tdee} kcal</p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 bg-slate-50 p-3 rounded-2xl">
            <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Your BMR (resting calories) is <strong>{Math.round(bmr)} kcal</strong>. TDEE accounts for activity. To lose weight, eat ~500 kcal below TDEE; to gain, eat above.
            </p>
          </div>
        </div>
      </div>

      {/* Macronutrient Breakdown */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5 mb-1">
          <Apple className="w-5 h-5 text-emerald-500" /> Your Daily Nutrition Targets
        </h2>
        <p className="text-xs text-slate-400 mb-4">Recommended macronutrient distribution based on your {tdee} kcal target.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nutritionGuide.map((item, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 ${item.color} text-white rounded-xl`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-lg font-extrabold text-slate-800">{item.target}</span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">{item.title}</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.tip}</p>
              <p className="text-[10px] text-slate-400 mt-2 italic">Sources: {item.sources}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Superfoods */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-100 p-6 rounded-3xl shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5 mb-4">
          <Salad className="w-5 h-5 text-emerald-500" /> Nutrient-Dense Superfoods to Add
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {superfoods.map((food, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-emerald-100 text-center hover:shadow-md transition-shadow">
              <span className="text-3xl">{food.emoji}</span>
              <h4 className="text-xs font-extrabold text-slate-800 mt-2">{food.name}</h4>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">{food.benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
