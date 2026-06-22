import React, { useState } from 'react';
import { UserMetrics } from '../types';
import { 
  Droplets, AlertTriangle, CheckCircle2, Plus, TrendingUp, 
  BookOpen, Utensils, Footprints, HeartPulse, Info
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

interface DiabetesProps {
  metrics: UserMetrics;
}

interface GlucoseReading {
  id: string;
  value: number;
  context: 'fasting' | 'post_meal' | 'random';
  time: string;
}

export const Diabetes: React.FC<DiabetesProps> = ({ metrics }) => {
  const [readings, setReadings] = useState<GlucoseReading[]>([
    { id: 'g1', value: 95, context: 'fasting', time: 'Mon 8AM' },
    { id: 'g2', value: 140, context: 'post_meal', time: 'Mon 2PM' },
    { id: 'g3', value: 102, context: 'fasting', time: 'Tue 8AM' },
    { id: 'g4', value: 135, context: 'post_meal', time: 'Tue 2PM' },
    { id: 'g5', value: 98, context: 'fasting', time: 'Wed 8AM' },
    { id: 'g6', value: 128, context: 'post_meal', time: 'Wed 2PM' }
  ]);
  const [newValue, setNewValue] = useState('');
  const [newContext, setNewContext] = useState<'fasting' | 'post_meal' | 'random'>('fasting');

  const addReading = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newValue, 10);
    if (isNaN(val) || val <= 0) return;
    const now = new Date();
    setReadings(prev => [...prev, {
      id: `g-${Date.now()}`,
      value: val,
      context: newContext,
      time: now.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewValue('');
  };

  const latestFasting = [...readings].reverse().find(r => r.context === 'fasting')?.value || 0;
  
  const getGlucoseStatus = (val: number) => {
    if (val === 0) return { text: 'No data', color: 'text-slate-400 bg-slate-50' };
    if (val < 100) return { text: 'Normal', color: 'text-emerald-600 bg-emerald-50' };
    if (val < 126) return { text: 'Prediabetes', color: 'text-amber-600 bg-amber-50' };
    return { text: 'Diabetes Range', color: 'text-red-600 bg-red-50' };
  };
  const fastingStatus = getGlucoseStatus(latestFasting);

  const chartData = readings.map(r => ({ time: r.time, value: r.value, context: r.context }));

  const diabetesTypes = [
    {
      title: 'Type 1 Diabetes',
      desc: 'An autoimmune condition where the body attacks insulin-producing beta cells in the pancreas. Requires lifelong insulin therapy. Usually diagnosed in childhood/adolescence.',
      tag: 'Insulin Dependent',
      tagClass: 'bg-rose-100 text-rose-700'
    },
    {
      title: 'Type 2 Diabetes',
      desc: 'The most common form (90% of cases) where the body becomes resistant to insulin or doesn\'t produce enough. Strongly linked to lifestyle, weight, and genetics. Often manageable with diet and exercise.',
      tag: 'Lifestyle Linked',
      tagClass: 'bg-amber-100 text-amber-700'
    },
    {
      title: 'Gestational Diabetes',
      desc: 'High blood sugar that develops during pregnancy and usually resolves after birth. Requires monitoring to protect both mother and baby. Increases future Type 2 risk.',
      tag: 'Pregnancy Related',
      tagClass: 'bg-purple-100 text-purple-700'
    },
    {
      title: 'Prediabetes',
      desc: 'Blood sugar levels are higher than normal but not high enough for a Type 2 diagnosis. A critical reversible warning stage — lifestyle changes can prevent progression.',
      tag: 'Reversible Stage',
      tagClass: 'bg-sky-100 text-sky-700'
    }
  ];

  const symptoms = [
    'Frequent urination (polyuria)', 'Excessive thirst (polydipsia)', 'Unexplained weight loss',
    'Extreme fatigue & weakness', 'Blurred vision', 'Slow-healing wounds',
    'Tingling/numbness in hands or feet', 'Increased hunger (polyphagia)', 'Recurrent infections'
  ];

  const managementTips = [
    { icon: Utensils, title: 'Low Glycemic Diet', text: 'Prioritize whole grains, legumes, leafy greens, and lean proteins. Avoid refined sugars and white carbs.' },
    { icon: Footprints, title: 'Regular Movement', text: 'Aim for 150 min/week of moderate activity. Exercise increases insulin sensitivity dramatically.' },
    { icon: Droplets, title: 'Monitor Glucose', text: 'Track fasting & post-meal readings consistently to understand your body\'s patterns and triggers.' },
    { icon: HeartPulse, title: 'Manage Stress & Sleep', text: 'Chronic stress raises cortisol and blood sugar. Aim for 7-9 hours of quality sleep nightly.' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
          <Droplets className="text-red-500 w-7 h-7" /> Diabetes Care Center
        </h1>
        <p className="text-sm text-slate-500 mt-1">Comprehensive education, glucose telemetry tracking, and clinical management protocols.</p>
      </div>

      {/* Top Stats + Glucose Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Glucose Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-5 h-5 text-red-500" /> Blood Glucose Trends
              </h2>
              <p className="text-xs text-slate-400">mg/dL readings over recent logs (Green zone = healthy fasting)</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${fastingStatus.color}`}>
              Fasting: {latestFasting} mg/dL • {fastingStatus.text}
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[60, 200]} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <ReferenceArea y1={70} y2={100} fill="#10b981" fillOpacity={0.08} />
                <ReferenceArea y1={126} y2={200} fill="#ef4444" fillOpacity={0.06} />
                <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: '#ef4444' }} name="Glucose (mg/dL)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Glucose Logger */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-1">
            <Plus className="w-5 h-5 text-red-500" /> Log Glucose Reading
          </h2>
          <p className="text-xs text-slate-400 mb-4">Record your blood sugar measurements.</p>
          <form onSubmit={addReading} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Reading (mg/dL)</label>
              <input type="number" value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="e.g. 95" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Context</label>
              <select value={newContext} onChange={e => setNewContext(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
                <option value="fasting">Fasting (before meal)</option>
                <option value="post_meal">Post-Meal (2hr after)</option>
                <option value="random">Random</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Reading
            </button>
          </form>
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div className="bg-emerald-50 rounded-xl py-2">
              <p className="text-[9px] font-bold text-emerald-600 uppercase">Normal</p>
              <p className="text-[10px] font-bold text-slate-700 mt-0.5">&lt;100</p>
            </div>
            <div className="bg-amber-50 rounded-xl py-2">
              <p className="text-[9px] font-bold text-amber-600 uppercase">Pre-DB</p>
              <p className="text-[10px] font-bold text-slate-700 mt-0.5">100-125</p>
            </div>
            <div className="bg-red-50 rounded-xl py-2">
              <p className="text-[9px] font-bold text-red-600 uppercase">Diabetes</p>
              <p className="text-[10px] font-bold text-slate-700 mt-0.5">≥126</p>
            </div>
          </div>
        </div>
      </div>

      {/* Types of Diabetes */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5 mb-4">
          <BookOpen className="w-5 h-5 text-red-500" /> Understanding Diabetes Types
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {diabetesTypes.map((type, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-extrabold text-slate-800">{type.title}</h3>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${type.tagClass}`}>{type.tag}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{type.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Symptoms + Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Warning Symptoms */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> Warning Signs & Symptoms
          </h2>
          <p className="text-xs text-slate-400 mb-4">Recognize these early indicators and consult a physician for screening.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {symptoms.map((symptom, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-700">{symptom}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Management Protocol */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Management & Prevention
          </h2>
          <p className="text-xs text-slate-400 mb-4">Evidence-based strategies to control or reverse blood sugar issues.</p>
          <div className="space-y-3">
            {managementTips.map((tip, idx) => (
              <div key={idx} className="flex gap-3 bg-emerald-50/40 border border-emerald-100 p-3 rounded-2xl">
                <div className="p-2 bg-emerald-500 text-white rounded-xl h-fit">
                  <tip.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">{tip.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{tip.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personalized Insight Banner */}
      <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex items-start gap-3">
          <Info className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-extrabold">Your Personalized Diabetes Risk Insight</h3>
            <p className="text-sm text-rose-50 mt-1 leading-relaxed">
              Based on your BMI of <strong>{(metrics.weight / ((metrics.height / 100) ** 2)).toFixed(1)}</strong>, age <strong>{metrics.age}</strong>, and activity logs, 
              {(metrics.weight / ((metrics.height / 100) ** 2)) > 25 
                ? ' your elevated BMI may increase Type 2 risk. Focus on the management protocols above and consider an HbA1c screening.' 
                : ' your metrics fall within a healthy range. Maintain your active lifestyle and balanced nutrition to keep insulin sensitivity optimal.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
