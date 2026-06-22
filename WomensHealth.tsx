import React, { useState } from 'react';
import { 
  Flower2, Calendar, Heart, Baby, Shield, Sparkles, 
  CircleDot, Droplet, Moon, Sun, Activity, BookHeart
} from 'lucide-react';

export const WomensHealth: React.FC = () => {
  // Menstrual cycle tracker state
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [prediction, setPrediction] = useState<{ next: string; ovulation: string; fertileStart: string; fertileEnd: string } | null>(null);

  const calculateCycle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastPeriodDate) return;
    const last = new Date(lastPeriodDate);
    const next = new Date(last);
    next.setDate(last.getDate() + cycleLength);
    const ovulation = new Date(last);
    ovulation.setDate(last.getDate() + (cycleLength - 14));
    const fertileStart = new Date(ovulation);
    fertileStart.setDate(ovulation.getDate() - 5);
    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(ovulation.getDate() + 1);

    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setPrediction({
      next: fmt(next),
      ovulation: fmt(ovulation),
      fertileStart: fmt(fertileStart),
      fertileEnd: fmt(fertileEnd)
    });
  };

  const cyclePhases = [
    { phase: 'Menstrual Phase', days: 'Days 1-5', icon: Droplet, color: 'bg-rose-100 text-rose-600', desc: 'Uterine lining sheds. Energy may be low. Focus on iron-rich foods, rest, and gentle movement.' },
    { phase: 'Follicular Phase', days: 'Days 1-13', icon: Sun, color: 'bg-amber-100 text-amber-600', desc: 'Estrogen rises, energy increases. Great time for high-intensity workouts and new projects.' },
    { phase: 'Ovulation Phase', days: 'Day 14', icon: CircleDot, color: 'bg-emerald-100 text-emerald-600', desc: 'Egg is released, peak fertility. Energy and mood are typically at their highest.' },
    { phase: 'Luteal Phase', days: 'Days 15-28', icon: Moon, color: 'bg-purple-100 text-purple-600', desc: 'Progesterone rises. PMS symptoms may appear. Prioritize magnesium, sleep, and self-care.' }
  ];

  const healthTopics = [
    {
      icon: Baby,
      title: 'Reproductive & Pregnancy Health',
      color: 'bg-pink-500',
      points: ['Prenatal vitamins (folic acid 400mcg+) before & during pregnancy', 'Regular prenatal checkups & screenings', 'Trimester-based nutrition and weight guidance', 'Postpartum recovery and mental health support']
    },
    {
      icon: Shield,
      title: 'Preventive Screenings',
      color: 'bg-rose-500',
      points: ['Pap smear every 3 years (ages 21-65)', 'Mammogram annually after age 40', 'Bone density (DEXA) scan post-menopause', 'Regular pelvic & breast self-examinations']
    },
    {
      icon: Flower2,
      title: 'Hormonal Health (PCOS/Thyroid)',
      color: 'bg-purple-500',
      points: ['Monitor irregular periods or excessive hair growth', 'PCOS management via diet, exercise & insulin control', 'Thyroid function testing (TSH) if fatigued', 'Balance blood sugar to regulate hormones']
    },
    {
      icon: BookHeart,
      title: 'Menopause & Midlife Wellness',
      color: 'bg-fuchsia-500',
      points: ['Manage hot flashes & night sweats naturally', 'Calcium + Vitamin D for bone protection', 'Cardiovascular health becomes critical', 'Hormone therapy options — consult your gynecologist']
    }
  ];

  const wellnessTips = [
    { icon: Heart, text: 'Iron & folate intake is critical due to menstrual blood loss — include spinach, lentils & lean red meat.' },
    { icon: Activity, text: 'Weight-bearing exercise protects bone density and reduces osteoporosis risk after menopause.' },
    { icon: Moon, text: 'Track mood across your cycle — hormonal shifts naturally affect emotional wellbeing.' },
    { icon: Sparkles, text: 'Stay hydrated and limit caffeine/salt before your period to reduce bloating and cramps.' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
          <Flower2 className="text-pink-500 w-7 h-7" /> Women's Healthcare Hub
        </h1>
        <p className="text-sm text-slate-500 mt-1">Holistic care for menstrual cycles, reproductive health, hormonal balance, and lifelong wellness.</p>
      </div>

      {/* Cycle Tracker + Prediction */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tracker form */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-1">
            <Calendar className="w-5 h-5 text-pink-500" /> Cycle Predictor
          </h2>
          <p className="text-xs text-slate-400 mb-4">Track and forecast your menstrual cycle.</p>
          <form onSubmit={calculateCycle} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">First Day of Last Period</label>
              <input type="date" value={lastPeriodDate} onChange={e => setLastPeriodDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cycle Length</label>
                <input type="number" value={cycleLength} onChange={e => setCycleLength(+e.target.value)} min={20} max={45} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Period Length</label>
                <input type="number" value={periodLength} onChange={e => setPeriodLength(+e.target.value)} min={2} max={10} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
              </div>
            </div>
            <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Predict My Cycle
            </button>
          </form>
        </div>

        {/* Predictions display */}
        <div className="lg:col-span-2 bg-gradient-to-br from-pink-50 to-rose-50/40 border border-pink-100 p-5 rounded-3xl shadow-sm">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-4">
            <CircleDot className="w-5 h-5 text-pink-500" /> Your Cycle Forecast
          </h2>
          {prediction ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-rose-100">
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Next Period Expected</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">{prediction.next}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Ovulation Day</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">{prediction.ovulation}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-purple-100 sm:col-span-2">
                <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">Fertile Window (Highest Conception Chance)</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">{prediction.fertileStart} → {prediction.fertileEnd}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-10 text-pink-400">
              <Flower2 className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm font-semibold">Enter your cycle details to see personalized predictions</p>
              <p className="text-xs text-slate-400 mt-1">Forecasts your next period, ovulation, and fertile window.</p>
            </div>
          )}
        </div>
      </div>

      {/* Cycle Phases Education */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5 mb-4">
          <Moon className="w-5 h-5 text-pink-500" /> The 4 Phases of Your Cycle
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cyclePhases.map((phase, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl hover:shadow-md transition-shadow">
              <div className={`p-2.5 rounded-xl w-fit ${phase.color}`}>
                <phase.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-800 mt-3">{phase.phase}</h3>
              <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider mt-0.5">{phase.days}</p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{phase.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Women's Health Topics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {healthTopics.map((topic, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2.5 ${topic.color} text-white rounded-2xl`}>
                <topic.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">{topic.title}</h3>
            </div>
            <ul className="space-y-2.5">
              {topic.points.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <CircleDot className="w-3.5 h-3.5 text-pink-400 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Wellness Tips Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 -mr-12 -mb-12 w-56 h-56 bg-white opacity-10 rounded-full blur-3xl"></div>
        <h3 className="text-lg font-extrabold flex items-center gap-2 relative z-10">
          <Sparkles className="w-5 h-5" /> Daily Women's Wellness Wisdom
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 relative z-10">
          {wellnessTips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2.5 bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/15">
              <tip.icon className="w-4 h-4 flex-shrink-0 mt-0.5 text-pink-100" />
              <p className="text-xs text-pink-50 font-medium leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
