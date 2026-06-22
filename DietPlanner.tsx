import React, { useState } from 'react';
import { UserMetrics, MedicalGoal, DietPlan, Meal } from '../types';
import { generateDietPlan } from '../utils/aiSimulator';
import { 
  Apple, Flame, CheckCircle, ChevronRight, ShoppingCart, 
  Sparkles, CheckCircle2, ChevronLeft, Calendar 
} from 'lucide-react';

interface DietPlannerProps {
  metrics: UserMetrics;
  setMetrics: React.Dispatch<React.SetStateAction<UserMetrics>>;
  activePlan: DietPlan | null;
  setActivePlan: React.Dispatch<React.SetStateAction<DietPlan | null>>;
}

export const DietPlanner: React.FC<DietPlannerProps> = ({ metrics, setMetrics, activePlan, setActivePlan }) => {
  // Questionnaire states
  const [goal, setGoal] = useState<MedicalGoal>({
    goal: 'weight_loss',
    dietPreference: 'balanced',
    allergies: [],
    activityLevel: 'moderate'
  });

  const [formStep, setFormStep] = useState<number>(0);
  const [currentDay, setCurrentDay] = useState<string>('Monday');
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [loggedMeals, setLoggedMeals] = useState<{ [key: string]: boolean }>({});

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const plan = generateDietPlan(goal, metrics);
    setActivePlan(plan);
    setFormStep(1); // advance to show plan
  };

  const handleLogMeal = (meal: Meal, mealKey: string) => {
    if (loggedMeals[mealKey]) return; // already logged

    setMetrics(prev => ({
      ...prev,
      caloriesConsumed: prev.caloriesConsumed + meal.calories
    }));

    setLoggedMeals(prev => ({
      ...prev,
      [mealKey]: true
    }));
  };

  const toggleShoppingItem = (item: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
          <Apple className="text-emerald-500 w-7 h-7" /> AI Diet & Nutrition Planner
        </h1>
        <p className="text-sm text-slate-500 mt-1">Generates custom clinical meal templates aligned with BMI analytics and physical activity targets.</p>
      </div>

      {formStep === 0 && !activePlan ? (
        /* Step 1: Questionnaire form */
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Aarogya Nutrition Synthesis Engine
            </div>
            <h2 className="text-xl font-bold text-slate-800">Configure Your Personalized Goal</h2>
            <p className="text-xs text-slate-400 mt-1">Our AI processes BMI indices, caloric caps, and active lifestyle rates to map a structured weekly routine.</p>
          </div>

          <form onSubmit={handleGoalSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">What is your primary health goal?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  { key: 'weight_loss', title: 'Sustainable Weight Loss', desc: 'Promotes gradual fat reduction' },
                  { key: 'muscle_gain', title: 'Lean Muscle Gain', desc: 'Sustains anabolic recovery & protein synthesis' },
                  { key: 'maintenance', title: 'Weight Maintenance', desc: 'Maintains optimal body homeostasis' },
                  { key: 'diabetes_mgmt', title: 'Manage Diabetes', desc: 'Aims for insulin and glucose stability' },
                  { key: 'hypertension_mgmt', title: 'Manage Hypertension', desc: 'Focuses on DASH & sodium regulation' }
                ] as const).map(item => (
                  <button key={item.key} type="button" onClick={() => setGoal({ ...goal, goal: item.key })} className={`p-4 rounded-2xl border text-left transition-all ${goal.goal === item.key ? 'bg-emerald-50/50 border-emerald-500 text-emerald-800 font-semibold' : 'bg-slate-50/50 border-slate-150 hover:bg-slate-50'}`}>
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="text-[11px] text-slate-400 font-normal mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Dietary Preference</label>
                <select value={goal.dietPreference} onChange={e => setGoal({ ...goal, dietPreference: e.target.value as any })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="balanced">Balanced / Everything</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan / Plant-Based</option>
                  <option value="keto">Keto / High-Fat</option>
                  <option value="gluten_free">Gluten-Free</option>
                  <option value="mediterranean">Mediterranean</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Active Exercise Level</label>
                <select value={goal.activityLevel} onChange={e => setGoal({ ...goal, activityLevel: e.target.value as any })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="sedentary">Sedentary (No formal exercise)</option>
                  <option value="moderate">Moderate (Exercise 1-3 times / week)</option>
                  <option value="active">Active (Exercise 3-5 times / week)</option>
                  <option value="highly_active">Highly Active (Intense training / daily)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-600/10 transition-colors flex items-center justify-center gap-1.5">
              Generate 7-Day Diet Plan <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Step 2: Show generated plan */
        activePlan && (
          <div className="space-y-6">
            {/* Plan Info Card */}
            <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" /> Customized Nutrition Regimen
                </div>
                <h2 className="text-xl font-bold text-slate-800 mt-2">{activePlan.title}</h2>
                <p className="text-xs text-slate-500 max-w-xl">{activePlan.description}</p>
              </div>

              <div className="flex gap-4">
                <div className="bg-emerald-50 p-3 rounded-2xl text-center min-w-[100px]">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Target Energy</span>
                  <span className="text-xl font-extrabold text-slate-800 mt-1">{activePlan.dailyCalories} kcal</span>
                </div>
                <button onClick={() => setFormStep(0)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-4 py-2 rounded-2xl text-xs transition-colors self-center flex items-center gap-1">
                  <ChevronLeft className="w-3.5 h-3.5" /> Adjust Goals
                </button>
              </div>
            </div>

            {/* Macro Breakdown & Tips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Macro bars */}
              <div className="md:col-span-2 bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">Macro Ratios Breakdown</h3>
                <div className="space-y-4">
                  {/* Protein */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-indigo-600 flex items-center gap-1">🔷 Protein Intake</span>
                      <span className="text-slate-700">{activePlan.proteinTarget}</span>
                    </div>
                    <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>

                  {/* Carbs */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-emerald-600 flex items-center gap-1">🔷 Carb Intake</span>
                      <span className="text-slate-700">{activePlan.carbsTarget}</span>
                    </div>
                    <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>

                  {/* Fats */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-amber-600 flex items-center gap-1">🔷 Fats Intake</span>
                      <span className="text-slate-700">{activePlan.fatTarget}</span>
                    </div>
                    <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Diet Guidelines */}
              <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide mb-3">AI General Guidelines</h3>
                <ul className="space-y-2.5">
                  {activePlan.generalAdvice.map((advice, idx) => (
                    <li key={idx} className="text-xs text-slate-500 flex items-start gap-2">
                      <span className="p-1 bg-emerald-50 text-emerald-600 rounded-md mt-0.5 font-bold text-[9px]">{idx + 1}</span>
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Main Menu Scheduler */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Daily Meal Schedule */}
              <div className="lg:col-span-2 space-y-4">
                {/* Day selector slider */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 pr-1 scrollbar-thin">
                  {daysOfWeek.map(day => (
                    <button key={day} onClick={() => setCurrentDay(day)} className={`flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${currentDay === day ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      <Calendar className="w-3.5 h-3.5" /> {day}
                    </button>
                  ))}
                </div>

                {/* Day Meals Details */}
                <div className="space-y-3.5">
                  {Object.entries(activePlan.days[currentDay]).map(([mealType, meal]) => {
                    const mealKey = `${currentDay}-${mealType}`;
                    return (
                      <div key={mealType} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1 flex-1">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{mealType}</span>
                          <h4 className="text-sm font-extrabold text-slate-800">{meal.name}</h4>
                          <p className="text-xs text-slate-400 mt-1">{meal.description}</p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-semibold">{meal.calories} kcal</span>
                            <span className="bg-indigo-50 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">P: {meal.protein}</span>
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">C: {meal.carbs}</span>
                            <span className="bg-amber-50 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">F: {meal.fat}</span>
                          </div>
                        </div>

                        <button onClick={() => handleLogMeal(meal, mealKey)} className={`flex-shrink-0 w-full sm:w-auto text-xs font-bold py-2 px-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${loggedMeals[mealKey] ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'}`} disabled={loggedMeals[mealKey]}>
                          {loggedMeals[mealKey] ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Calorie Logged
                            </>
                          ) : (
                            <>
                              <Flame className="w-3.5 h-3.5" /> Log Meal to Dashboard
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shoppable Groceries List */}
              <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm h-fit">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 mb-2.5">
                  <ShoppingCart className="w-4 h-4 text-emerald-500" /> Curated Shopping List
                </h3>
                <p className="text-xs text-slate-400 mb-4">Stock your kitchen for the upcoming week based on chosen preference ({goal.dietPreference.toUpperCase()}).</p>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {activePlan.shoppingList.map((item, idx) => (
                    <div key={idx} onClick={() => toggleShoppingItem(item)} className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer border border-dashed transition-colors ${checkedItems[item] ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800 line-through' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                      <input type="checkbox" checked={!!checkedItems[item]} readOnly className="w-3.5 h-3.5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 pointer-events-none" />
                      <span className="text-xs font-semibold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
