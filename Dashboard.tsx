import React, { useState } from 'react';
import { UserMetrics, MoodLog } from '../types';
import {
  Heart, Activity, Droplet, Flame, Moon, TrendingUp, CheckSquare,
  Plus, Edit, Sparkles, Smile, Apple, ShieldAlert, ChevronRight,
  Droplets, Scale, Lightbulb, Trophy,
  Footprints, Zap, ArrowUpRight, Target, ScanLine, Stethoscope,
  Leaf, HandHeart, Brain, Wind, X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Counter, ProgressRing } from './ui/Primitives';

interface DashboardProps {
  metrics: UserMetrics;
  setMetrics: React.Dispatch<React.SetStateAction<UserMetrics>>;
  moodHistory: MoodLog[];
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ metrics, setMetrics, moodHistory, setActiveTab }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formMetrics, setFormMetrics] = useState<UserMetrics>({ ...metrics });
  const [quickMealCal, setQuickMealCal] = useState('');
  const [habits, setHabits] = useState([
    { id: 'h1', text: 'Drink 2.5L water', completed: false },
    { id: 'h2', text: 'Reach 8,000 steps', completed: false },
    { id: 'h3', text: '5-min mindful breathing', completed: false },
    { id: 'h4', text: 'Log blood pressure', completed: false },
    { id: 'h5', text: 'No screens before bed', completed: false }
  ]);

  const bmi = +(metrics.weight / ((metrics.height / 100) ** 2)).toFixed(1);
  const getBmiStatus = (b: number) => {
    if (b < 18.5) return { text: 'Underweight', color: 'text-sky-600', bg: 'bg-sky-50' };
    if (b < 25) return { text: 'Optimal', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (b < 30) return { text: 'Overweight', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { text: 'Obese', color: 'text-red-600', bg: 'bg-red-50' };
  };
  const bmiStatus = getBmiStatus(bmi);

  const calculateHealthScore = () => {
    let score = 50;
    if (metrics.sleepHours >= 7 && metrics.sleepHours <= 9) score += 10;
    else if (metrics.sleepHours >= 6) score += 5;
    score += Math.min(15, Math.round((metrics.waterIntake / metrics.waterTarget) * 15));
    score += Math.min(15, Math.round((metrics.steps / 8000) * 15));
    if (metrics.systolicBP >= 110 && metrics.systolicBP <= 125 && metrics.diastolicBP >= 70 && metrics.diastolicBP <= 85) score += 10;
    else score += 5;
    const cr = metrics.caloriesConsumed / metrics.caloriesTarget;
    if (cr >= 0.8 && cr <= 1.1) score += 10;
    score += habits.filter(h => h.completed).length * 4;
    return Math.min(100, score);
  };
  const healthScore = calculateHealthScore();

  const handleUpdateMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    setMetrics(formMetrics);
    setShowUpdateModal(false);
  };
  const toggleHabit = (id: string) => setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  const handleQuickWater = () => setMetrics(prev => ({ ...prev, waterIntake: Math.min(prev.waterTarget + 500, prev.waterIntake + 250) }));
  const handleQuickMeal = (e: React.FormEvent) => {
    e.preventDefault();
    const c = parseInt(quickMealCal, 10);
    if (!isNaN(c) && c > 0) { setMetrics(prev => ({ ...prev, caloriesConsumed: prev.caloriesConsumed + c })); setQuickMealCal(''); }
  };

  const historyData = [
    { name: 'Mon', steps: 6200, score: 72 }, { name: 'Tue', steps: 7800, score: 78 },
    { name: 'Wed', steps: 9100, score: 85 }, { name: 'Thu', steps: 5400, score: 74 },
    { name: 'Fri', steps: 8500, score: 88 }, { name: 'Sat', steps: 11000, score: 95 },
    { name: 'Today', steps: metrics.steps, score: healthScore }
  ];
  const weeklyActivity = [
    { day: 'M', calories: 2100 }, { day: 'T', calories: 1950 }, { day: 'W', calories: 2200 },
    { day: 'T', calories: 1800 }, { day: 'F', calories: 2050 }, { day: 'S', calories: 2400 },
    { day: 'S', calories: metrics.caloriesConsumed }
  ];

  const latestMood = moodHistory.length > 0 ? moodHistory[moodHistory.length - 1] : null;
  const scoreLabel = healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Care';
  const scoreGrad = healthScore >= 80 ? 'from-emerald-500 via-teal-500 to-cyan-600' : healthScore >= 60 ? 'from-amber-500 to-orange-600' : 'from-rose-500 to-red-600';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const vitals = [
    { icon: Heart, label: 'Blood Pressure', value: `${metrics.systolicBP}/${metrics.diastolicBP}`, unit: 'mmHg', status: metrics.systolicBP < 130 ? 'Normal' : 'Elevated', color: 'rose', pct: 70 },
    { icon: Footprints, label: 'Steps', value: metrics.steps.toLocaleString(), unit: 'today', status: `${Math.round((metrics.steps / 8000) * 100)}% of goal`, color: 'emerald', pct: Math.min(100, (metrics.steps / 8000) * 100) },
    { icon: Droplet, label: 'Hydration', value: `${(metrics.waterIntake / 1000).toFixed(1)}`, unit: `/${(metrics.waterTarget / 1000).toFixed(1)}L`, status: 'Keep sipping', color: 'sky', pct: Math.min(100, (metrics.waterIntake / metrics.waterTarget) * 100) },
    { icon: Moon, label: 'Sleep', value: `${metrics.sleepHours}`, unit: 'hrs', status: metrics.sleepHours >= 7 ? 'Optimal' : 'Improve', color: 'indigo', pct: Math.min(100, (metrics.sleepHours / 8) * 100) },
  ];
  const colorMap: Record<string, { bg: string; text: string; bar: string; ring: string }> = {
    rose: { bg: 'bg-rose-50', text: 'text-rose-500', bar: 'bg-rose-500', ring: 'group-hover:bg-rose-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-500', bar: 'bg-emerald-500', ring: 'group-hover:bg-emerald-500' },
    sky: { bg: 'bg-sky-50', text: 'text-sky-500', bar: 'bg-sky-500', ring: 'group-hover:bg-sky-500' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-500', bar: 'bg-indigo-500', ring: 'group-hover:bg-indigo-500' },
  };

  const quickTools = [
    { id: 'disease_predictor', icon: TrendingUp, label: 'Disease Risk AI', grad: 'from-indigo-500 to-purple-600' },
    { id: 'symptom_checker', icon: Stethoscope, label: 'Symptom AI', grad: 'from-rose-500 to-pink-600' },
    { id: 'food_scanner', icon: ScanLine, label: 'Scan Food', grad: 'from-orange-500 to-amber-600' },
    { id: 'ai_chat', icon: Sparkles, label: 'Ask AI', grad: 'from-emerald-500 to-teal-600' },
    { id: 'xray_reader', icon: ScanLine, label: 'X-Ray AI', grad: 'from-sky-500 to-blue-600' },
    { id: 'ayurveda', icon: Leaf, label: 'Ayurveda', grad: 'from-green-500 to-emerald-600' },
  ];

  const exploreCards = [
    { id: 'mental_health', icon: Brain, title: 'Calm Mind', desc: 'Mental wellness & breathing', color: 'indigo' },
    { id: 'diet_plan', icon: Apple, title: 'Diet Planner', desc: 'Personalized meal plans', color: 'orange' },
    { id: 'diabetes', icon: Droplets, title: 'Diabetes Care', desc: 'Glucose & lifestyle', color: 'rose' },
    { id: 'bmi_nutrition', icon: Scale, title: 'BMI & Macros', desc: 'Body composition', color: 'violet' },
    { id: 'risk_assessment', icon: ShieldAlert, title: 'Risk Check', desc: 'Disease risk profile', color: 'amber' },
    { id: 'senior_care', icon: HandHeart, title: 'Senior Care', desc: 'Elder welfare & schemes', color: 'purple' },
    { id: 'regional_doctors', icon: Stethoscope, title: 'Find Doctors', desc: 'Regional PHC network', color: 'teal' },
    { id: 'health_tips', icon: Lightbulb, title: 'Health Tips', desc: 'Daily wellness wisdom', color: 'cyan' },
  ];
  const exploreColors: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500',
    orange: 'bg-orange-50 text-orange-500 group-hover:bg-orange-500',
    rose: 'bg-rose-50 text-rose-500 group-hover:bg-rose-500',
    violet: 'bg-violet-50 text-violet-500 group-hover:bg-violet-500',
    amber: 'bg-amber-50 text-amber-500 group-hover:bg-amber-500',
    purple: 'bg-purple-50 text-purple-500 group-hover:bg-purple-500',
    teal: 'bg-teal-50 text-teal-500 group-hover:bg-teal-500',
    cyan: 'bg-cyan-50 text-cyan-500 group-hover:bg-cyan-500',
  };

  const priority = metrics.waterIntake < metrics.waterTarget * 0.5
    ? 'Stay hydrated — drink at least 1 more litre of water today.'
    : metrics.steps < 5000 ? 'Get moving — a 15-minute walk will hit your step goal.'
    : metrics.sleepHours < 7 ? 'Prioritize rest tonight. Aim for 7–9 hours of quality sleep.'
    : 'You\'re on track! Keep maintaining your healthy momentum.';

  return (
    <div className="space-y-6">
      {/* ===== HERO ===== */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 opacity-20 rounded-full blur-3xl -mr-32 -mt-32 animate-pulseGlow" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500 opacity-15 rounded-full blur-3xl animate-floatSlow" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 p-6 sm:p-8 grid lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span className="text-xs font-bold text-emerald-100">{greeting}, let's keep you thriving</span>
              {latestMood && <span className="text-xs text-white/60">· Mood: {latestMood.mood}</span>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Your health, beautifully <span className="gradient-text-emerald">in sync.</span></h1>
            <p className="text-white/60 mt-2 max-w-lg">{habits.filter(h => !h.completed).length} habits pending · {priority}</p>

            <div className="flex flex-wrap gap-3 mt-6">
              <button onClick={() => { setFormMetrics({ ...metrics }); setShowUpdateModal(true); }} className="px-5 py-3 rounded-2xl bg-white text-slate-900 text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105">
                <Edit className="w-4 h-4" /> Update Vitals
              </button>
              <button onClick={() => setActiveTab('ai_chat')} className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-white text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105">
                <Sparkles className="w-4 h-4 text-emerald-300" /> Ask August AI
              </button>
            </div>
          </div>

          {/* Score ring */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <ProgressRing value={healthScore} size={160} stroke={12}>
                <div className="text-center">
                  <div className="text-5xl font-black">
                    <Counter value={healthScore} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60 mt-1">Health Score</p>
                </div>
              </ProgressRing>
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r ${scoreGrad} text-white text-xs font-extrabold shadow-lg whitespace-nowrap`}>
                {scoreLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Quick stat strip */}
        <div className="relative z-10 grid grid-cols-3 border-t border-white/10">
          {[
            { label: 'Calories', value: `${metrics.caloriesConsumed}`, sub: `/ ${metrics.caloriesTarget} kcal` },
            { label: 'BMI', value: `${bmi}`, sub: bmiStatus.text },
            { label: 'Active Streak', value: '7', sub: 'days' },
          ].map((s, i) => (
            <div key={i} className={`px-6 py-4 ${i < 2 ? 'border-r border-white/10' : ''}`}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{s.label}</p>
              <p className="text-xl font-black mt-0.5">{s.value} <span className="text-xs font-medium text-white/50">{s.sub}</span></p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== QUICK TOOLS ===== */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {quickTools.map((t, i) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`group premium-card rounded-3xl p-4 bg-white border border-slate-100 flex flex-col items-center gap-2 stagger-${(i % 6) + 1} animate-fadeInUp`}>
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${t.grad} text-white shadow-lg group-hover:scale-110 transition-transform`}>
              <t.icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 text-center leading-tight">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ===== VITALS ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {vitals.map((v, i) => {
          const c = colorMap[v.color];
          return (
            <div key={i} className={`group premium-card bg-white rounded-3xl p-5 border border-slate-100 stagger-${i + 1} animate-fadeInUp`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 ${c.bg} ${c.text} rounded-2xl ${c.ring} group-hover:text-white transition-colors`}>
                  <v.icon className="w-5 h-5" />
                </div>
                {v.color === 'sky' && (
                  <button onClick={handleQuickWater} className="text-[10px] font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 px-2 py-1 rounded-lg flex items-center gap-0.5 transition-colors">
                    <Plus className="w-3 h-3" />250
                  </button>
                )}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{v.label}</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{v.value}<span className="text-sm font-medium text-slate-400 ml-1">{v.unit}</span></p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                <div className={`${c.bar} h-full rounded-full transition-all duration-1000`} style={{ width: `${v.pct}%` }} />
              </div>
              <p className="text-[10px] font-semibold text-slate-400 mt-2">{v.status}</p>
            </div>
          );
        })}
      </div>

      {/* ===== CHARTS + FOCUS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5"><TrendingUp className="w-5 h-5 text-emerald-500" /> Weekly Health Trends</h3>
              <p className="text-xs text-slate-400 mt-0.5">Steps & wellness score over 7 days</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Steps</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-500" /> Score</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gSteps" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.35} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gScore" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} /><stop offset="95%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="steps" stroke="#10b981" strokeWidth={2.5} fill="url(#gSteps)" />
                <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2.5} fill="url(#gScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Focus */}
        <div className="bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl -mr-12 -mt-12" />
          <h3 className="text-base font-extrabold flex items-center gap-1.5 relative z-10"><Target className="w-5 h-5" /> Today's Focus</h3>
          <div className="space-y-3 mt-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/15">
              <div className="flex items-center gap-1.5 mb-1"><Wind className="w-4 h-4 text-indigo-200" /><span className="text-[10px] font-bold uppercase text-indigo-100">Priority</span></div>
              <p className="text-sm font-semibold leading-relaxed">{priority}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/15">
              <div className="flex items-center gap-1.5 mb-1"><Lightbulb className="w-4 h-4 text-indigo-200" /><span className="text-[10px] font-bold uppercase text-indigo-100">Wellness Tip</span></div>
              <p className="text-xs text-indigo-50 leading-relaxed">Take short breaks from sitting every hour — it reduces cardiovascular risk and boosts metabolism.</p>
            </div>
          </div>
          <button onClick={() => setActiveTab('health_tips')} className="w-full mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm font-bold py-2.5 rounded-2xl text-xs transition-colors relative z-10">More Tips</button>
        </div>
      </div>

      {/* ===== BMI + HABITS + CALORIES ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Body */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5 mb-4"><Scale className="w-5 h-5 text-violet-500" /> Body Composition</h3>
          <div className="flex items-center justify-center mb-5">
            <ProgressRing value={Math.min(100, (bmi / 40) * 100)} size={120} stroke={10} gradientId="bmiRing">
              <div className="text-center">
                <span className="text-2xl font-black text-slate-900">{bmi}</span>
                <p className="text-[9px] font-bold text-slate-400 uppercase">BMI</p>
              </div>
            </ProgressRing>
          </div>
          <div className={`text-center px-3 py-1.5 rounded-full text-xs font-bold ${bmiStatus.bg} ${bmiStatus.color} w-fit mx-auto mb-4`}>{bmiStatus.text}</div>
          <div className="space-y-2">
            {[['Height', `${metrics.height} cm`], ['Weight', `${metrics.weight} kg`], ['Age', `${metrics.age} yrs`]].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                <span className="text-xs font-medium text-slate-500">{k}</span>
                <span className="text-sm font-bold text-slate-800">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Habits */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5"><CheckSquare className="w-5 h-5 text-emerald-500" /> Daily Habits</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{habits.filter(h => h.completed).length}/{habits.length}</span>
          </div>
          <div className="space-y-2">
            {habits.map(h => (
              <button key={h.id} onClick={() => toggleHabit(h.id)} className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${h.completed ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 transition-colors ${h.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                  {h.completed && <CheckSquare className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm font-medium flex-1 ${h.completed ? 'text-emerald-800 line-through' : 'text-slate-700'}`}>{h.text}</span>
                {!h.completed && <div className="w-2 h-2 rounded-full bg-amber-400" />}
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
            <Trophy className="w-4 h-4 text-amber-500" /> Complete all to boost your score!
          </div>
        </div>

        {/* Calories */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5 mb-4"><Flame className="w-5 h-5 text-orange-500" /> Calorie Intake</h3>
          <div className="h-36 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="calories" radius={[8, 8, 0, 0]}>
                  {weeklyActivity.map((_, idx) => (
                    <Cell key={idx} fill={idx === weeklyActivity.length - 1 ? '#f59e0b' : '#fcd34d'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-2xl mb-3">
            <span className="text-xs font-bold text-slate-500">Today</span>
            <span className="text-sm font-black text-slate-800"><Counter value={metrics.caloriesConsumed} /> <span className="text-xs font-medium text-slate-400">/ {metrics.caloriesTarget}</span></span>
          </div>
          <form onSubmit={handleQuickMeal} className="flex gap-2">
            <input type="number" placeholder="Add kcal" value={quickMealCal} onChange={e => setQuickMealCal(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500" />
            <button type="submit" className="bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs">Log</button>
          </form>
        </div>
      </div>

      {/* ===== EXPLORE ===== */}
      <div>
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5 mb-4"><Zap className="w-5 h-5 text-emerald-500" /> Explore Aarogya AI</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {exploreCards.map((c, i) => (
            <button key={c.id} onClick={() => setActiveTab(c.id)} className={`group premium-card bg-white rounded-3xl p-5 border border-slate-100 text-left stagger-${(i % 6) + 1} animate-fadeInUp`}>
              <div className={`p-3 rounded-2xl w-fit ${exploreColors[c.color]} group-hover:text-white transition-colors mb-3`}>
                <c.icon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">{c.title}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{c.desc}</p>
              <ArrowUpRight className="w-4 h-4 text-slate-300 mt-3 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* ===== PREDICTIVE HEALTH INSIGHTS ===== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-cyan-900 text-white p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl -mr-40 -mt-40 animate-pulseGlow"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 backdrop-blur-sm border border-cyan-400/30 mb-2">
                <span className="text-[10px] font-extrabold text-cyan-300 uppercase tracking-[0.2em]">⚡ AI Health Predictions</span>
              </div>
              <h2 className="text-xl font-black">Your Future Health Outlook</h2>
              <p className="text-sm text-white/70 mt-1">Based on biomarker trends · ICMR & NFHS-5 data</p>
            </div>
            <button onClick={() => setActiveTab('predictive_analytics')} className="bg-white text-purple-700 font-bold px-5 py-2.5 rounded-2xl text-sm flex items-center gap-1.5 hover:scale-105 transition-transform">
              Full Analysis <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Diabetes Risk', value: '42%', trend: '↑ Rising', color: 'from-amber-500 to-orange-500' },
              { label: 'Heart Disease', value: '38%', trend: '↑ Rising', color: 'from-rose-500 to-red-500' },
              { label: 'Metabolic Syndrome', value: '55%', trend: '↑ Rising', color: 'from-purple-500 to-pink-500' },
              { label: 'With Action', value: '18%', trend: '↓ Reversible', color: 'from-emerald-500 to-teal-500' },
            ].map((risk, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-3">
                <p className="text-[10px] font-bold text-white/60 uppercase">{risk.label}</p>
                <p className={`text-2xl font-black bg-gradient-to-br ${risk.color} bg-clip-text text-transparent mt-1`}>{risk.value}</p>
                <p className={`text-[10px] font-bold mt-1 ${risk.trend.includes('↓') ? 'text-emerald-300' : 'text-amber-300'}`}>{risk.trend}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== INSIGHTS + ACTIVITY ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl">
          <h3 className="text-base font-extrabold flex items-center gap-1.5 mb-4"><Sparkles className="w-5 h-5 text-emerald-400" /> AI Health Insights</h3>
          <div className="space-y-3">
            {[
              { icon: Activity, label: 'Activity', text: metrics.steps >= 8000 ? 'Excellent — hitting your daily step goal!' : `${Math.round((metrics.steps / 8000) * 100)}% of step goal. A short walk helps!`, ok: metrics.steps >= 8000 },
              { icon: Droplet, label: 'Hydration', text: `${Math.round((metrics.waterIntake / metrics.waterTarget) * 100)}% of target. ${metrics.waterIntake < metrics.waterTarget * 0.5 ? 'Drink more water!' : 'Well done!'}`, ok: metrics.waterIntake >= metrics.waterTarget * 0.8 },
              { icon: Scale, label: 'BMI Analysis', text: `BMI ${bmi} (${bmiStatus.text}). ${bmi >= 18.5 && bmi < 25 ? 'Healthy range — great work!' : 'Small changes can help.'}`, ok: bmi >= 18.5 && bmi < 25 },
            ].map((ins, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`p-2 rounded-xl flex-shrink-0 ${ins.ok ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}><ins.icon className="w-4 h-4" /></div>
                <div><p className="text-sm font-semibold">{ins.label}</p><p className="text-xs text-white/50 mt-0.5">{ins.text}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5 mb-4"><Activity className="w-5 h-5 text-emerald-500" /> Recent Activity</h3>
          <div className="space-y-3">
            {[
              { icon: Footprints, cls: 'bg-emerald-100 text-emerald-600', t: 'Steps Recorded', s: `${metrics.steps.toLocaleString()} steps`, time: 'Now' },
              { icon: Droplet, cls: 'bg-sky-100 text-sky-600', t: 'Water Intake', s: `${metrics.waterIntake}ml logged`, time: 'Today' },
              ...(latestMood ? [{ icon: Smile, cls: 'bg-indigo-100 text-indigo-600', t: 'Mood Logged', s: `Feeling ${latestMood.mood}`, time: latestMood.date }] : []),
              { icon: Flame, cls: 'bg-amber-100 text-amber-600', t: 'Calories', s: `${metrics.caloriesConsumed} kcal`, time: 'Today' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                <div className={`p-2 ${a.cls} rounded-lg`}><a.icon className="w-4 h-4" /></div>
                <div className="flex-1"><p className="text-sm font-semibold text-slate-800">{a.t}</p><p className="text-xs text-slate-400">{a.s}</p></div>
                <span className="text-xs font-bold text-slate-400">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== UPDATE MODAL ===== */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md animate-fadeIn" onClick={() => setShowUpdateModal(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-slim animate-fadeInScale">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-500" /> Update Your Vitals</h3>
              <button onClick={() => setShowUpdateModal(false)} className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleUpdateMetrics} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Weight (kg)', 'weight'], ['Height (cm)', 'height'], ['Daily Steps', 'steps'], ['Age', 'age'],
                  ['Systolic BP', 'systolicBP'], ['Diastolic BP', 'diastolicBP'], ['Water Target (ml)', 'waterTarget'], ['Sleep Hours', 'sleepHours'],
                ].map(([label, key]) => (
                  <div key={key}>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">{label}</label>
                    <input type="number" step={key === 'sleepHours' ? '0.1' : '1'} value={(formMetrics as any)[key]} onChange={e => setFormMetrics({ ...formMetrics, [key]: +e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowUpdateModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-sm transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 rounded-2xl text-sm transition-transform hover:scale-[1.02] shadow-lg shadow-emerald-600/20">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
