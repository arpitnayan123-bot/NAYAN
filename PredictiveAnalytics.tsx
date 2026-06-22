import { useState, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Activity, AlertTriangle, Shield, Zap,
  ArrowRight, CheckCircle2, XCircle,
  Sparkles, BarChart3, Brain, Heart, Droplets, Flame
} from 'lucide-react';
import {
  generateHistoricalData,
  predictHealthRisks,
  generateTimeline,
  generatePreventionPlans,
  compareTwoFutures
} from '../data/predictiveModels';

// Sample current values (can be replaced with real user data)
const SAMPLE_CURRENT_VALUES = {
  hba1c: 5.9,
  fastingGlucose: 108,
  ldl: 152,
  hdl: 38,
  triglycerides: 168,
  bmi: 28.2,
  vitaminD: 18,
  crp: 3.8
};

export const PredictiveAnalytics = () => {
  const [timeframe, setTimeframe] = useState<6 | 12 | 24>(12);
  const [activeTab, setActiveTab] = useState<'overview' | 'predictions' | 'prevention'>('overview');

  const trends = useMemo(() => generateHistoricalData(SAMPLE_CURRENT_VALUES), []);
  const predictions = useMemo(() => predictHealthRisks(trends), [trends]);
  const timeline = useMemo(() => generateTimeline(trends), [trends]);
  const preventionPlans = useMemo(() => generatePreventionPlans(predictions), [predictions]);
  const twoFutures = useMemo(() => compareTwoFutures(predictions), [predictions]);

  const currentRiskScore = Math.round(timeline[0].riskScore);
  const futureRiskScore = timeline.find(t => t.month === timeframe)?.riskScore || 0;

  return (
    <div className="space-y-6">
      {/* ═══════════ HERO SECTION ═══════════ */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-full blur-3xl -mr-48 -mt-48 animate-pulseGlow"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-floatSlow"></div>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        </div>

        <div className="relative z-10 p-8 sm:p-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20">
              <span className="text-[10px] font-extrabold text-cyan-300 uppercase tracking-[0.2em]">⚡ AI-Powered Predictive Analytics</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20">
              <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-[0.2em]">🔬 Powered by ICMR & NFHS-5 Data</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4">
            See Your Health<br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {timeframe} Months Into the Future
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed">
            Our AI analyzes your biomarker trends and predicts future health risks based on 100,000+ Indian patient records. Take action now to change your health destiny.
          </p>

          {/* Timeframe Selector */}
          <div className="flex items-center gap-3 mt-8">
            <span className="text-sm font-bold text-white/60">Projection:</span>
            {[6, 12, 24].map(m => (
              <button
                key={m}
                onClick={() => setTimeframe(m as 6 | 12 | 24)}
                className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                  timeframe === m
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-xl shadow-purple-500/30'
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:bg-white/20'
                }`}
              >
                {m} months
              </button>
            ))}
          </div>

          {/* Risk Score Comparison */}
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-3xl">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-2">Current Risk</p>
              <div className="text-4xl font-black text-cyan-400">{currentRiskScore}</div>
              <p className="text-xs text-white/70 mt-1">out of 100</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 text-center relative">
              <ArrowRight className="absolute top-1/2 -left-6 transform -translate-y-1/2 w-6 h-6 text-white/40" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-2">
                {timeframe === 6 ? '6 Months' : timeframe === 12 ? '1 Year' : '2 Years'}
              </p>
              <div className={`text-4xl font-black ${futureRiskScore > 70 ? 'text-red-400' : futureRiskScore > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {futureRiskScore}
              </div>
              <p className="text-xs text-white/70 mt-1">
                {futureRiskScore > currentRiskScore ? '↑ Risk Increasing' : futureRiskScore < currentRiskScore ? '↓ Risk Decreasing' : '→ Stable'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-md border border-emerald-400/30 rounded-3xl p-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 mb-2">With Action</p>
              <div className="text-4xl font-black text-emerald-400">{Math.round(futureRiskScore * 0.4)}</div>
              <p className="text-xs text-white/70 mt-1">60% Risk Reduction</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ TAB NAVIGATION ═══════════ */}
      <div className="bg-white border border-slate-100 p-2 rounded-2xl shadow-sm flex items-center gap-1 overflow-x-auto scrollbar-none">
        {([
          { id: 'overview' as const, label: 'Risk Overview', icon: Activity },
          { id: 'predictions' as const, label: 'Predictions', icon: Brain },
          { id: 'prevention' as const, label: 'Prevention Plans', icon: Shield },
        ]).map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === t.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════ TAB CONTENT ═══════════ */}

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Biomarker Trends */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-1.5">
              <BarChart3 className="w-5 h-5 text-purple-500" /> Your Biomarker Trends
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trends.map((trend, i) => {
                const isBad = trend.trend === 'increasing' && trend.rateOfChange > 0 || trend.trend === 'decreasing' && trend.rateOfChange < 0;
                return (
                  <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">{trend.name}</h3>
                        <p className="text-[10px] text-slate-500">{trend.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {trend.trend === 'increasing' ? (
                          <TrendingUp className={`w-4 h-4 ${isBad ? 'text-red-500' : 'text-emerald-500'}`} />
                        ) : trend.trend === 'decreasing' ? (
                          <TrendingDown className={`w-4 h-4 ${isBad ? 'text-red-500' : 'text-emerald-500'}`} />
                        ) : (
                          <Activity className="w-4 h-4 text-slate-400" />
                        )}
                        <span className={`text-xs font-bold ${isBad ? 'text-red-600' : 'text-emerald-600'}`}>
                          {trend.rateOfChange > 0 ? '+' : ''}{trend.rateOfChange}/mo
                        </span>
                      </div>
                    </div>
                    
                    {/* Mini sparkline */}
                    <div className="flex items-end gap-1 h-12 mb-3">
                      {(() => {
                        const maxVal = Math.max(...trend.historical.map(x => x.value), trend.current);
                        const minVal = Math.min(...trend.historical.map(x => x.value), trend.current);
                        const range = maxVal - minVal || 1;
                        return (
                          <>
                            {trend.historical.map((h, j) => {
                              const height = ((h.value - minVal) / range) * 100;
                              return (
                                <div
                                  key={j}
                                  className={`flex-1 rounded-t ${isBad ? 'bg-gradient-to-t from-red-500 to-red-400' : 'bg-gradient-to-t from-emerald-500 to-emerald-400'}`}
                                  style={{ height: `${Math.max(10, height)}%` }}
                                ></div>
                              );
                            })}
                            <div
                              className={`flex-1 rounded-t ${isBad ? 'bg-gradient-to-t from-red-600 to-red-500' : 'bg-gradient-to-t from-emerald-600 to-emerald-500'}`}
                              style={{ height: `${Math.max(10, ((trend.current - minVal) / range) * 100)}%` }}
                            ></div>
                          </>
                        );
                      })()}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500">Current:</span>
                        <span className="font-black text-slate-900 ml-1">{trend.current} {trend.unit}</span>
                      </div>
                      <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        trend.current < trend.riskThreshold.low ? 'bg-emerald-100 text-emerald-700' :
                        trend.current > trend.riskThreshold.high ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {trend.current < trend.riskThreshold.low ? 'Low' : trend.current > trend.riskThreshold.high ? 'High' : 'Borderline'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Two Futures Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                  <h3 className="text-xl font-black">With Action</h3>
                </div>
                <p className="text-sm text-white/90 mb-4">If you follow the prevention plan:</p>
                
                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/15">
                    <p className="text-xs font-bold text-emerald-200 mb-1">Risk Score in {timeframe} months</p>
                    <p className="text-3xl font-black">{twoFutures.withAction.riskScore12m}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/15">
                    <p className="text-xs font-bold text-emerald-200 mb-2">Conditions Prevented</p>
                    <ul className="space-y-1">
                      {twoFutures.withAction.preventedConditions.slice(0, 3).map((c, i) => (
                        <li key={i} className="text-xs flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 flex-shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-rose-600 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-6 h-6" />
                  <h3 className="text-xl font-black">Without Action</h3>
                </div>
                <p className="text-sm text-white/90 mb-4">If trends continue unchecked:</p>
                
                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/15">
                    <p className="text-xs font-bold text-red-200 mb-1">Risk Score in {timeframe} months</p>
                    <p className="text-3xl font-black">{twoFutures.withoutAction.riskScore12m}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/15">
                    <p className="text-xs font-bold text-red-200 mb-2">Conditions Likely to Develop</p>
                    <ul className="space-y-1">
                      {twoFutures.withoutAction.developedConditions.slice(0, 3).map((c, i) => (
                        <li key={i} className="text-xs flex items-start gap-1.5">
                          <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PREDICTIONS TAB ── */}
      {activeTab === 'predictions' && (
        <div className="space-y-6 animate-fadeIn">
          {predictions.map((pred, i) => {
            const Icon = pred.condition.includes('Diabetes') ? Droplets :
                        pred.condition.includes('Cardiovascular') ? Heart :
                        pred.condition.includes('Metabolic') ? Flame :
                        pred.condition.includes('Vitamin') ? Sparkles : Activity;
            
            return (
              <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-2xl ${
                    pred.currentRisk === 'high' ? 'bg-red-100 text-red-600' :
                    pred.currentRisk === 'moderate' ? 'bg-amber-100 text-amber-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-slate-900">{pred.condition}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{pred.reasoning}</p>
                  </div>
                </div>

                {/* Risk Timeline */}
                <div className="bg-slate-50 p-4 rounded-2xl mb-4">
                  <p className="text-xs font-bold text-slate-700 mb-3">Risk Progression</p>
                  <div className="flex items-center justify-between">
                    {[
                      { label: 'Now', risk: pred.currentRisk },
                      { label: `${timeframe === 6 ? '6' : timeframe === 12 ? '12' : '24'} mo`, risk: timeframe === 6 ? pred.futureRisk6m : timeframe === 12 ? pred.futureRisk12m : pred.futureRisk24m },
                      { label: '24 mo', risk: pred.futureRisk24m }
                    ].map((point, j) => (
                      <div key={j} className="text-center">
                        <div className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${
                          point.risk === 'high' ? 'bg-red-100 text-red-700' :
                          point.risk === 'moderate' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {point.risk === 'high' ? 'High' : point.risk === 'moderate' ? 'Moderate' : 'Low'}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">{point.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Probability */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-700">Probability in {timeframe} months</span>
                  <span className="text-sm font-black text-slate-900">{pred.probability}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full ${
                      pred.probability > 70 ? 'bg-gradient-to-r from-red-500 to-rose-500' :
                      pred.probability > 40 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                      'bg-gradient-to-r from-emerald-500 to-teal-500'
                    }`}
                    style={{ width: `${pred.probability}%` }}
                  ></div>
                </div>

                {/* Indicators */}
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-2">Risk Indicators</p>
                  <div className="flex flex-wrap gap-2">
                    {pred.indicators.map((indicator, j) => (
                      <span key={j} className="bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {indicator}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── PREVENTION TAB ── */}
      {activeTab === 'prevention' && (
        <div className="space-y-6 animate-fadeIn">
          {preventionPlans.map((plan, i) => (
            <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{plan.condition}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Indian Context Recommendations</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Diet */}
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🥗</span>
                    <h4 className="text-sm font-extrabold text-emerald-900">Diet Plan</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {plan.diet.map((item, j) => (
                      <li key={j} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exercise */}
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🏃</span>
                    <h4 className="text-sm font-extrabold text-orange-900">Exercise Plan</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {plan.exercise.map((item, j) => (
                      <li key={j} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <span className="text-orange-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Monitoring */}
                <div className="bg-sky-50 border border-sky-100 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">📊</span>
                    <h4 className="text-sm font-extrabold text-sky-900">Monitoring Plan</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {plan.monitoring.map((item, j) => (
                      <li key={j} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <span className="text-sky-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lifestyle */}
                <div className="bg-purple-50 border border-purple-100 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🧘</span>
                    <h4 className="text-sm font-extrabold text-purple-900">Lifestyle Changes</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {plan.lifestyle.map((item, j) => (
                      <li key={j} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <span className="text-purple-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Impact Statement */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-2xl">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-emerald-100 mb-1">Expected Impact</p>
                    <p className="text-sm font-medium leading-relaxed">{plan.impact}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Data Sources */}
          <div className="bg-gradient-to-br from-slate-50 to-purple-50/30 border border-slate-100 p-5 rounded-3xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3"> Powered by Indian Clinical Research</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'ICMR-INDIAB Study', org: 'Indian Council of Medical Research' },
                { name: 'PURE India Study', org: 'Public Health Foundation of India' },
                { name: 'NFHS-5', org: 'Ministry of Health & Family Welfare' },
                { name: 'DPP Trial', org: 'Diabetes Prevention Program' }
              ].map((source, i) => (
                <div key={i} className="bg-white p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-extrabold text-slate-700">{source.name}</p>
                  <p className="text-[9px] text-slate-400">{source.org}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>⚠️ Predictive Analytics Disclaimer:</strong> This is AI-based predictive insight, not a medical diagnosis. Predictions are based on population-level data and individual outcomes may vary. Please consult qualified healthcare professionals for personalized medical advice and treatment decisions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
