import React, { useState } from 'react';
import { 
  Lightbulb, Apple, Brain, Moon, Droplet, Activity, 
  Sun, Shield, Sparkles, RefreshCw, Zap
} from 'lucide-react';

interface Tip {
  category: string;
  icon: any;
  color: string;
  title: string;
  text: string;
}

export const HealthTips: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [dailyTipIdx, setDailyTipIdx] = useState(0);

  const allTips: Tip[] = [
    { category: 'Nutrition', icon: Apple, color: 'emerald', title: 'Eat the Rainbow', text: 'Fill half your plate with colorful fruits and vegetables. Different colors provide different antioxidants and phytonutrients.' },
    { category: 'Nutrition', icon: Apple, color: 'emerald', title: 'Mindful Portions', text: 'Use smaller plates and eat slowly. It takes ~20 minutes for your brain to register fullness.' },
    { category: 'Nutrition', icon: Apple, color: 'emerald', title: 'Limit Added Sugar', text: 'Keep added sugar under 25g/day. Read labels — sugar hides in sauces, breads, and "healthy" snacks.' },
    { category: 'Fitness', icon: Activity, color: 'orange', title: 'Move Every Hour', text: 'Set a timer to stand and stretch every 60 minutes. Sitting too long increases health risks even if you exercise.' },
    { category: 'Fitness', icon: Activity, color: 'orange', title: 'Strength Training', text: 'Include resistance training 2-3x/week. Muscle boosts metabolism and protects bones as you age.' },
    { category: 'Fitness', icon: Activity, color: 'orange', title: '10,000 Steps Goal', text: 'Aim for daily walking. Even brisk 30-minute walks dramatically reduce cardiovascular risk.' },
    { category: 'Sleep', icon: Moon, color: 'indigo', title: 'Consistent Schedule', text: 'Sleep and wake at the same time daily — even weekends. It strengthens your circadian rhythm.' },
    { category: 'Sleep', icon: Moon, color: 'indigo', title: 'Cool & Dark Room', text: 'Keep your bedroom at 18-20°C and pitch black. Darkness triggers melatonin production for deeper sleep.' },
    { category: 'Sleep', icon: Moon, color: 'indigo', title: 'No Screens Before Bed', text: 'Avoid screens 1 hour before sleep. Blue light suppresses melatonin and delays your sleep cycle.' },
    { category: 'Mental', icon: Brain, color: 'purple', title: 'Practice Gratitude', text: 'Write down 3 things you\'re grateful for each day. It rewires your brain toward positivity over time.' },
    { category: 'Mental', icon: Brain, color: 'purple', title: 'Deep Breathing', text: 'Try box breathing (4-4-4-4) when stressed. It activates the parasympathetic nervous system to calm you.' },
    { category: 'Mental', icon: Brain, color: 'purple', title: 'Digital Detox', text: 'Take regular breaks from social media. Constant scrolling raises anxiety and disrupts focus.' },
    { category: 'Hydration', icon: Droplet, color: 'sky', title: 'Start With Water', text: 'Drink a glass of water first thing in the morning to rehydrate after sleep and kickstart metabolism.' },
    { category: 'Hydration', icon: Droplet, color: 'sky', title: 'Carry a Bottle', text: 'Keep a reusable water bottle nearby. Visual cues make you drink 30% more throughout the day.' },
    { category: 'Prevention', icon: Shield, color: 'rose', title: 'Regular Checkups', text: 'Don\'t skip annual health screenings. Early detection is key for blood pressure, cholesterol, and cancer.' },
    { category: 'Prevention', icon: Shield, color: 'rose', title: 'Sun Protection', text: 'Apply SPF 30+ daily, even on cloudy days. UV exposure is the top cause of premature aging and skin cancer.' },
    { category: 'Prevention', icon: Shield, color: 'rose', title: 'Wash Hands Often', text: 'Proper handwashing for 20 seconds prevents most common infections and illnesses.' },
    { category: 'Mental', icon: Sun, color: 'purple', title: 'Get Morning Sunlight', text: 'Spend 10-15 minutes in morning sunlight. It regulates mood, vitamin D, and your sleep-wake cycle.' }
  ];

  const categories = ['All', 'Nutrition', 'Fitness', 'Sleep', 'Mental', 'Hydration', 'Prevention'];

  const colorMap: { [key: string]: { bg: string; text: string; light: string } } = {
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50' },
    indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', light: 'bg-indigo-50' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50' },
    sky: { bg: 'bg-sky-500', text: 'text-sky-600', light: 'bg-sky-50' },
    rose: { bg: 'bg-rose-500', text: 'text-rose-600', light: 'bg-rose-50' }
  };

  const filteredTips = activeCategory === 'All' ? allTips : allTips.filter(t => t.category === activeCategory);
  const dailyTip = allTips[dailyTipIdx];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
          <Lightbulb className="text-amber-500 w-7 h-7" /> Daily Health Tips
        </h1>
        <p className="text-sm text-slate-500 mt-1">Curated, science-backed wellness advice to build healthier habits one day at a time.</p>
      </div>

      {/* Featured Daily Tip */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute left-1/4 bottom-0 -mb-20 w-72 h-72 bg-yellow-300 opacity-20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Tip of the Moment
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl flex-shrink-0">
              <dailyTip.icon className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-extrabold">{dailyTip.title}</h2>
              <p className="text-sm sm:text-base text-orange-50 mt-1.5 leading-relaxed max-w-2xl">{dailyTip.text}</p>
              <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">{dailyTip.category}</span>
            </div>
          </div>
          <button onClick={() => setDailyTipIdx(prev => (prev + 1) % allTips.length)} className="mt-5 bg-white/20 hover:bg-white/30 backdrop-blur-sm font-bold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4" /> Show Me Another Tip
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full transition-all ${activeCategory === cat ? 'bg-amber-500 text-white shadow-md' : 'bg-white border border-slate-150 text-slate-600 hover:bg-slate-50'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTips.map((tip, idx) => {
          const c = colorMap[tip.color];
          return (
            <div key={idx} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 ${c.light} ${c.text} rounded-2xl`}>
                  <tip.icon className="w-5 h-5" />
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${c.light} ${c.text}`}>{tip.category}</span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">{tip.title}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{tip.text}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Wins Banner */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5 mb-4">
          <Zap className="w-5 h-5 text-amber-500" /> 5 Quick Wins You Can Do Right Now
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { emoji: '💧', text: 'Drink a glass of water' },
            { emoji: '🧘', text: 'Take 5 deep breaths' },
            { emoji: '🚶', text: 'Stand up & stretch' },
            { emoji: '☀️', text: 'Step into sunlight' },
            { emoji: '😊', text: 'Text someone you love' }
          ].map((win, idx) => (
            <div key={idx} className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl text-center hover:shadow-md transition-shadow">
              <span className="text-3xl">{win.emoji}</span>
              <p className="text-xs font-bold text-slate-700 mt-2">{win.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
