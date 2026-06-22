import React, { useState } from 'react';
import { UserMetrics } from '../types';
import { 
  ShieldAlert, Heart, Droplets, Activity, Cigarette, Wine, 
  CheckCircle2, AlertTriangle, RotateCcw, ClipboardCheck
} from 'lucide-react';

interface RiskAssessmentProps {
  metrics: UserMetrics;
}

interface Answers {
  smoking: string;
  alcohol: string;
  exercise: string;
  familyHistory: string;
  diet: string;
  stress: string;
  bpHistory: string;
  sleepQuality: string;
}

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ metrics }) => {
  const [answers, setAnswers] = useState<Answers>({
    smoking: '', alcohol: '', exercise: '', familyHistory: '',
    diet: '', stress: '', bpHistory: '', sleepQuality: ''
  });
  const [showResults, setShowResults] = useState(false);

  const bmi = +(metrics.weight / ((metrics.height / 100) ** 2)).toFixed(1);

  const questions = [
    { key: 'smoking', label: 'Do you smoke tobacco?', icon: Cigarette, options: [{ v: 'never', t: 'Never', s: 0 }, { v: 'former', t: 'Former smoker', s: 1 }, { v: 'current', t: 'Currently smoke', s: 3 }] },
    { key: 'alcohol', label: 'How often do you consume alcohol?', icon: Wine, options: [{ v: 'never', t: 'Never/Rarely', s: 0 }, { v: 'moderate', t: 'Moderate (weekly)', s: 1 }, { v: 'heavy', t: 'Heavy (daily)', s: 3 }] },
    { key: 'exercise', label: 'How often do you exercise?', icon: Activity, options: [{ v: 'regular', t: '4+ times/week', s: 0 }, { v: 'sometimes', t: '1-3 times/week', s: 1 }, { v: 'rarely', t: 'Rarely/Never', s: 3 }] },
    { key: 'familyHistory', label: 'Family history of heart disease/diabetes?', icon: Heart, options: [{ v: 'none', t: 'No history', s: 0 }, { v: 'some', t: 'One relative', s: 2 }, { v: 'strong', t: 'Multiple relatives', s: 3 }] },
    { key: 'diet', label: 'How would you rate your diet?', icon: CheckCircle2, options: [{ v: 'healthy', t: 'Mostly whole foods', s: 0 }, { v: 'mixed', t: 'Mixed/Average', s: 1 }, { v: 'poor', t: 'Mostly processed', s: 3 }] },
    { key: 'stress', label: 'Your typical stress level?', icon: AlertTriangle, options: [{ v: 'low', t: 'Low/Managed', s: 0 }, { v: 'moderate', t: 'Moderate', s: 1 }, { v: 'high', t: 'High/Chronic', s: 3 }] },
    { key: 'bpHistory', label: 'History of high blood pressure?', icon: Droplets, options: [{ v: 'no', t: 'No', s: 0 }, { v: 'borderline', t: 'Borderline', s: 2 }, { v: 'yes', t: 'Yes, diagnosed', s: 3 }] },
    { key: 'sleepQuality', label: 'How is your sleep quality?', icon: Activity, options: [{ v: 'good', t: 'Good (7-9 hrs)', s: 0 }, { v: 'okay', t: 'Okay (6 hrs)', s: 1 }, { v: 'poor', t: 'Poor (<6 hrs)', s: 2 }] }
  ];

  const setAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const allAnswered = Object.values(answers).every(a => a !== '');

  // Calculate risk scores
  const calculateScores = () => {
    let lifestyleScore = 0;
    questions.forEach(q => {
      const selected = q.options.find(o => o.v === answers[q.key as keyof Answers]);
      if (selected) lifestyleScore += selected.s;
    });

    // BMI contribution
    let bmiScore = 0;
    if (bmi >= 30) bmiScore = 3;
    else if (bmi >= 25) bmiScore = 2;
    else if (bmi < 18.5) bmiScore = 1;

    // BP contribution
    let bpScore = 0;
    if (metrics.systolicBP >= 140 || metrics.diastolicBP >= 90) bpScore = 3;
    else if (metrics.systolicBP >= 130) bpScore = 2;

    const totalScore = lifestyleScore + bmiScore + bpScore;
    const maxScore = 24 + 3 + 3; // approx

    // Specific risk areas
    const heartRisk = Math.min(100, Math.round(((
      (answers.smoking === 'current' ? 3 : answers.smoking === 'former' ? 1 : 0) +
      (answers.familyHistory === 'strong' ? 3 : answers.familyHistory === 'some' ? 2 : 0) +
      bpScore + bmiScore +
      (answers.exercise === 'rarely' ? 3 : answers.exercise === 'sometimes' ? 1 : 0)
    ) / 15) * 100));

    const diabetesRisk = Math.min(100, Math.round(((
      bmiScore +
      (answers.familyHistory === 'strong' ? 3 : answers.familyHistory === 'some' ? 2 : 0) +
      (answers.diet === 'poor' ? 3 : answers.diet === 'mixed' ? 1 : 0) +
      (answers.exercise === 'rarely' ? 3 : answers.exercise === 'sometimes' ? 1 : 0)
    ) / 12) * 100));

    const mentalRisk = Math.min(100, Math.round(((
      (answers.stress === 'high' ? 3 : answers.stress === 'moderate' ? 1 : 0) +
      (answers.sleepQuality === 'poor' ? 2 : answers.sleepQuality === 'okay' ? 1 : 0) +
      (answers.alcohol === 'heavy' ? 3 : answers.alcohol === 'moderate' ? 1 : 0)
    ) / 8) * 100));

    const overallPct = Math.round((totalScore / maxScore) * 100);

    return { overallPct, heartRisk, diabetesRisk, mentalRisk };
  };

  const scores = showResults ? calculateScores() : null;

  const getRiskLevel = (pct: number) => {
    if (pct < 30) return { text: 'Low Risk', color: 'text-emerald-600', bg: 'bg-emerald-500', light: 'bg-emerald-50' };
    if (pct < 60) return { text: 'Moderate Risk', color: 'text-amber-600', bg: 'bg-amber-500', light: 'bg-amber-50' };
    return { text: 'High Risk', color: 'text-red-600', bg: 'bg-red-500', light: 'bg-red-50' };
  };

  const reset = () => {
    setAnswers({ smoking: '', alcohol: '', exercise: '', familyHistory: '', diet: '', stress: '', bpHistory: '', sleepQuality: '' });
    setShowResults(false);
  };

  const riskCategories = scores ? [
    { title: 'Cardiovascular Disease', icon: Heart, pct: scores.heartRisk, advice: scores.heartRisk >= 60 ? 'Consult a cardiologist. Reduce sodium, quit smoking, and increase cardio exercise.' : scores.heartRisk >= 30 ? 'Maintain regular check-ups and a heart-healthy diet rich in omega-3s.' : 'Excellent heart health profile. Keep up your healthy habits!' },
    { title: 'Type 2 Diabetes', icon: Droplets, pct: scores.diabetesRisk, advice: scores.diabetesRisk >= 60 ? 'Get an HbA1c screening. Adopt a low-glycemic diet and lose excess weight.' : scores.diabetesRisk >= 30 ? 'Watch sugar intake and stay active to maintain insulin sensitivity.' : 'Low diabetes risk. Continue your balanced nutrition approach.' },
    { title: 'Mental & Stress Health', icon: Activity, pct: scores.mentalRisk, advice: scores.mentalRisk >= 60 ? 'Prioritize stress reduction, therapy, and sleep hygiene. Visit the Calm Mind Sanctuary.' : scores.mentalRisk >= 30 ? 'Incorporate daily mindfulness and ensure consistent sleep schedules.' : 'Strong mental resilience. Keep nurturing your wellbeing.' }
  ] : [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
          <ShieldAlert className="text-violet-500 w-7 h-7" /> Health Risk Assessment
        </h1>
        <p className="text-sm text-slate-500 mt-1">Answer a few questions to receive an AI-powered analysis of your disease risk factors.</p>
      </div>

      {!showResults ? (
        /* Questionnaire */
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <ClipboardCheck className="w-5 h-5 text-violet-500" />
            <h2 className="text-base font-bold text-slate-800">Lifestyle & Health Questionnaire</h2>
            <span className="ml-auto text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
              {Object.values(answers).filter(a => a !== '').length}/{questions.length} answered
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {questions.map((q) => (
              <div key={q.key} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-violet-100 text-violet-600 rounded-lg">
                    <q.icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">{q.label}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {q.options.map(opt => (
                    <button key={opt.v} onClick={() => setAnswer(q.key, opt.v)} className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${answers[q.key as keyof Answers] === opt.v ? 'bg-violet-500 text-white border-violet-500' : 'bg-white border-slate-200 text-slate-600 hover:border-violet-300'}`}>
                      {opt.t}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button onClick={() => setShowResults(true)} disabled={!allAnswered} className={`flex-1 font-bold py-3 rounded-2xl text-sm transition-colors flex items-center justify-center gap-1.5 ${allAnswered ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/10' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
              <ShieldAlert className="w-4 h-4" /> {allAnswered ? 'Generate My Risk Report' : 'Answer all questions to continue'}
            </button>
          </div>
        </div>
      ) : (
        /* Results */
        scores && (
          <div className="space-y-6">
            {/* Overall Score Banner */}
            <div className={`p-6 rounded-3xl shadow-xl text-white relative overflow-hidden bg-gradient-to-r ${scores.overallPct < 30 ? 'from-emerald-500 to-teal-600' : scores.overallPct < 60 ? 'from-amber-500 to-orange-600' : 'from-red-500 to-rose-600'}`}>
              <div className="absolute right-0 top-0 -mr-12 -mt-12 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80">Overall Health Risk Profile</p>
                  <h2 className="text-3xl font-extrabold mt-1">{getRiskLevel(scores.overallPct).text}</h2>
                  <p className="text-sm opacity-90 mt-1">Composite score based on lifestyle, BMI ({bmi}), and vitals.</p>
                </div>
                <div className="relative flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" className="stroke-white/20" strokeWidth="8" fill="transparent" />
                    <circle cx="48" cy="48" r="40" className="stroke-white transition-all duration-1000" strokeWidth="8" fill="transparent" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - scores.overallPct / 100)} strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-2xl font-extrabold">{scores.overallPct}%</span>
                </div>
              </div>
            </div>

            {/* Individual Risk Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {riskCategories.map((cat, idx) => {
                const level = getRiskLevel(cat.pct);
                return (
                  <div key={idx} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 ${level.light} ${level.color} rounded-2xl`}>
                        <cat.icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs font-bold ${level.color}`}>{level.text}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-800">{cat.title}</h3>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className={`${level.bg} h-full rounded-full transition-all duration-1000`} style={{ width: `${cat.pct}%` }}></div>
                      </div>
                      <span className="text-sm font-extrabold text-slate-700">{cat.pct}%</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">{cat.advice}</p>
                  </div>
                );
              })}
            </div>

            {/* Disclaimer + Retake */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-500 leading-relaxed max-w-2xl">
                  This assessment is a wellness screening tool and not a medical diagnosis. For elevated risk areas, please consult a qualified physician through the Telehealth Consults section.
                </p>
              </div>
              <button onClick={reset} className="flex-shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" /> Retake Assessment
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};
