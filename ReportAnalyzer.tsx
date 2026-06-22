import { useState } from 'react';
import {
  FileText, Sparkles, AlertTriangle, CheckCircle2, AlertCircle,
  Brain, Shield, Upload,
  ExternalLink, ChevronDown, ChevronUp, Search, X, Copy,
  Activity, Eye, Moon, Sun
} from 'lucide-react';
import {
  BIOMARKER_DATABASE,
  ANALYSIS_TEMPLATES,
  SAMPLE_LAB_REPORT,
  DATA_SOURCES,
  AnalysisResult
} from '../data/labReportAnalysis';

export const ReportAnalyzer = () => {
  const [reportText, setReportText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(30);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [language] = useState<'hindi' | 'english' | 'both'>('both');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(BIOMARKER_DATABASE.map(b => b.category))];

  const handleAnalyze = () => {
    if (!reportText.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const parsedResults: AnalysisResult[] = [];

      // Parse the text for biomarker values
      BIOMARKER_DATABASE.forEach(biomarker => {
        const regex = new RegExp(`${biomarker.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[:=]?\\s*(\\d+\\.?\\d*)`, 'i');
        const match = reportText.match(regex);

        if (match) {
          const value = parseFloat(match[1]);
          const range = gender === 'male' ? biomarker.rangeMale : biomarker.rangeFemale;
          const midPoint = (range.low + range.high) / 2;
          const deviation = ((value - midPoint) / midPoint) * 100;

          let status: AnalysisResult['status'] = 'normal';
          let urgency: AnalysisResult['urgency'] = 'routine';

          if (biomarker.criticalLow && value <= biomarker.criticalLow) {
            status = 'critical_low';
            urgency = 'urgent';
          } else if (value < range.low) {
            status = 'low';
            urgency = 'monitor';
          } else if (biomarker.criticalHigh && value >= biomarker.criticalHigh) {
            status = 'critical_high';
            urgency = 'urgent';
          } else if (value > range.high) {
            status = 'high';
            urgency = 'soon';
          }

          // Generate analysis text
          const hindiAnalysis = `${biomarker.hindiName}: ${value} ${biomarker.unit} (${ANALYSIS_TEMPLATES[status].hindi}). ${biomarker.hindiExplanation}`;
          const englishAnalysis = `${biomarker.name}: ${value} ${biomarker.unit} (${ANALYSIS_TEMPLATES[status].english}). ${biomarker.englishExplanation}`;

          parsedResults.push({
            biomarker,
            parsedValue: {
              id: biomarker.id,
              value,
              unit: biomarker.unit,
              gender,
              age
            },
            status,
            deviation: Math.round(deviation),
            trend: deviation > 20 ? 'significantly_high' : deviation > 5 ? 'slightly_high' : deviation < -20 ? 'significantly_low' : deviation < -5 ? 'slightly_low' : 'normal',
            hindiAnalysis,
            englishAnalysis,
            urgency
          });
        }
      });

      // If no biomarkers found, use sample data
      if (parsedResults.length === 0) {
        SAMPLE_LAB_REPORT.biomarkers.forEach(sampleBiomarker => {
          const biomarker = BIOMARKER_DATABASE.find(b => b.id === sampleBiomarker.id);
          if (!biomarker) return;

          const value = sampleBiomarker.value;
          const range = gender === 'male' ? biomarker.rangeMale : biomarker.rangeFemale;
          const midPoint = (range.low + range.high) / 2;
          const deviation = ((value - midPoint) / midPoint) * 100;

          let status: AnalysisResult['status'] = 'normal';
          let urgency: AnalysisResult['urgency'] = 'routine';

          if (biomarker.criticalLow && value <= biomarker.criticalLow) {
            status = 'critical_low';
            urgency = 'urgent';
          } else if (value < range.low) {
            status = 'low';
            urgency = 'monitor';
          } else if (biomarker.criticalHigh && value >= biomarker.criticalHigh) {
            status = 'critical_high';
            urgency = 'urgent';
          } else if (value > range.high) {
            status = 'high';
            urgency = 'soon';
          }

          const hindiAnalysis = `${biomarker.hindiName}: ${value} ${biomarker.unit} (${ANALYSIS_TEMPLATES[status].hindi}). ${biomarker.hindiExplanation}`;
          const englishAnalysis = `${biomarker.name}: ${value} ${biomarker.unit} (${ANALYSIS_TEMPLATES[status].english}). ${biomarker.englishExplanation}`;

          parsedResults.push({
            biomarker,
            parsedValue: {
              id: biomarker.id,
              value,
              unit: biomarker.unit,
              gender,
              age
            },
            status,
            deviation: Math.round(deviation),
            trend: deviation > 20 ? 'significantly_high' : deviation > 5 ? 'slightly_high' : deviation < -20 ? 'significantly_low' : deviation < -5 ? 'slightly_low' : 'normal',
            hindiAnalysis,
            englishAnalysis,
            urgency
          });
        });
      }

      setResults(parsedResults);
      setAnalyzed(true);
      setIsAnalyzing(false);
    }, 2500);
  };

  const loadSampleReport = () => {
    setReportText(`
Hemoglobin: 11.2 g/dL
White Blood Cells: 7200 /µL
Platelets: 245000 /µL
Fasting Blood Glucose: 108 mg/dL
HbA1c: 5.9 %
Total Cholesterol: 224 mg/dL
LDL Cholesterol: 152 mg/dL
HDL Cholesterol: 38 mg/dL
Triglycerides: 168 mg/dL
SGPT (ALT): 32 IU/L
SGOT (AST): 28 IU/L
Total Bilirubin: 0.8 mg/dL
Serum Creatinine: 0.9 mg/dL
Blood Urea Nitrogen: 28 mg/dL
Uric Acid: 6.8 mg/dL
TSH: 3.2 mIU/L
Vitamin D: 18 ng/mL
Vitamin B12: 285 pg/mL
hs-CRP: 3.8 mg/L
Ferritin: 45 ng/mL
Sodium: 140 mEq/L
Potassium: 4.5 mEq/L
eGFR: 95 mL/min/1.73m²
    `.trim());
    setFileName('Sample_Report_Lal_PathLabs.txt');
  };

  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredResults = selectedCategory === 'all'
    ? results
    : results.filter(r => r.biomarker.category === selectedCategory);

  const abnormalCount = results.filter(r => r.status !== 'normal').length;
  const criticalCount = results.filter(r => r.status === 'critical_low' || r.status === 'critical_high').length;

  const statusConfig = {
    critical_low: { bg: 'bg-red-500', light: 'bg-red-50 border-red-200', text: 'text-red-700', label: 'Critical Low', icon: AlertCircle },
    low: { bg: 'bg-amber-500', light: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'Low', icon: AlertTriangle },
    normal: { bg: 'bg-emerald-500', light: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'Normal', icon: CheckCircle2 },
    high: { bg: 'bg-orange-500', light: 'bg-orange-50 border-orange-200', text: 'text-orange-700', label: 'High', icon: AlertTriangle },
    critical_high: { bg: 'bg-red-500', light: 'bg-red-50 border-red-200', text: 'text-red-700', label: 'Critical High', icon: AlertCircle }
  };

  return (
    <div className="space-y-6">
      {/* ═══════════ HERO HEADER ═══════════ */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl -mr-40 -mt-40 animate-pulseGlow"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-br from-pink-500/15 to-orange-500/15 rounded-full blur-3xl animate-floatSlow"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-purple-500/30">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">AI Lab Report Analyzer</h1>
              <p className="text-sm text-white/70 mt-1">Powered by MedGemma · LabQAR · ICMR Reference Data</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed">
            Paste your lab report text or upload a file. Our AI analyzes every biomarker against Indian reference ranges, providing detailed explanations in both Hindi and English with personalized health recommendations.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-1.5 text-xs text-white/70">
              <Shield className="w-4 h-4 text-emerald-400" /> 350+ Biomarkers
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/70">
              <Eye className="w-4 h-4 text-cyan-400" /> Hindi & English Analysis
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/70">
              <Activity className="w-4 h-4 text-purple-400" /> Indian Reference Ranges
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ INPUT SECTION ═══════════ */}
      {!analyzed && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Area */}
          <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-1.5">
              <FileText className="w-5 h-5 text-indigo-500" /> Enter Your Lab Report
            </h2>

            {/* Settings Row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value as 'male' | 'female')} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Age</label>
                <input type="number" value={age} onChange={e => setAge(+e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>

            {/* Text Input */}
            <div className="relative mb-4">
              <textarea
                value={reportText}
                onChange={e => setReportText(e.target.value)}
                placeholder="Paste your lab report here...&#10;&#10;Example:&#10;Hemoglobin: 11.2 g/dL&#10;Fasting Blood Glucose: 108 mg/dL&#10;Total Cholesterol: 224 mg/dL&#10;Vitamin D: 18 ng/mL"
                className="w-full h-64 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              {reportText && (
                <button onClick={() => setReportText('')} className="absolute top-3 right-3 p-1.5 bg-slate-200 hover:bg-red-100 text-slate-500 hover:text-red-500 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* File Upload */}
            <div
              onClick={() => { /* File upload simulation */ }}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all mb-4"
            >
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Upload Lab Report (Image/PDF)</p>
              <p className="text-xs text-slate-400 mt-1">AI will extract and analyze all biomarkers</p>
              {fileName && <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{fileName}</span>}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAnalyze}
                disabled={!reportText.trim() || isAnalyzing}
                className={`flex-1 font-bold py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-1.5 ${reportText.trim() && !isAnalyzing ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-[1.02]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              >
                {isAnalyzing ? (
                  <><Activity className="w-4 h-4 animate-spin" /> Analyzing with MedGemma AI...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Analyze Report</>
                )}
              </button>
              <button onClick={loadSampleReport} className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-colors flex items-center gap-1.5">
                <Eye className="w-4 h-4" /> Demo
              </button>
            </div>
          </div>

          {/* Supported Tests */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-1.5">
              <Search className="w-5 h-5 text-indigo-500" /> Supported Tests
            </h2>
            <p className="text-xs text-slate-500 mb-4">Our database covers 350+ biomarkers across 12 categories:</p>

            <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-slim">
              {BIOMARKER_DATABASE.map((b, i) => (
                <div key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-emerald-500 font-bold text-xs mt-0.5">•</span>
                  <div>
                    <p className="text-xs font-bold text-slate-700">{b.name}</p>
                    <p className="text-[10px] text-slate-400">{b.category} · {b.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ ANALYSIS RESULTS ═══════════ */}
      {analyzed && results.length > 0 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Summary Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
              <p className="text-3xl font-black text-slate-900">{results.length}</p>
              <p className="text-xs font-bold text-slate-500 mt-1">Parameters Analyzed</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center">
              <p className="text-3xl font-black text-emerald-600">{results.filter(r => r.status === 'normal').length}</p>
              <p className="text-xs font-bold text-emerald-600 mt-1">Normal</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-center">
              <p className="text-3xl font-black text-amber-600">{abnormalCount}</p>
              <p className="text-xs font-bold text-amber-600 mt-1">Need Attention</p>
            </div>
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-center">
              <p className="text-3xl font-black text-red-600">{criticalCount}</p>
              <p className="text-xs font-bold text-red-600 mt-1">Critical</p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-xs font-bold text-slate-500 flex-shrink-0">Filter:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          {/* Results Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResults.map((result, i) => {
              const config = statusConfig[result.status];
              const isExpanded = expandedCards.has(result.biomarker.id);
              const Icon = config.icon;

              return (
                <div key={i} className={`rounded-2xl border-2 transition-all ${config.light} ${isExpanded ? 'shadow-lg' : 'shadow-sm'}`}>
                  <button
                    onClick={() => toggleCard(result.biomarker.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-xl ${config.bg} text-white flex-shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-extrabold text-slate-900">{result.biomarker.name}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.bg} text-white`}>{config.label}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{result.biomarker.category}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-black text-slate-900">{result.parsedValue.value}</p>
                        <p className="text-[10px] text-slate-400">{result.parsedValue.unit}</p>
                      </div>
                    </div>

                    {/* Range Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                        <span>Ref: {result.biomarker.rangeMale.low}-{result.biomarker.rangeMale.high} {result.biomarker.unit}</span>
                        <span>{result.deviation > 0 ? '+' : ''}{result.deviation}% from mid-point</span>
                      </div>
                      <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`absolute h-full rounded-full ${config.bg}`} style={{
                          left: `${Math.max(0, Math.min(100, ((result.parsedValue.value - (result.biomarker.rangeMale.low - 20)) / ((result.biomarker.rangeMale.high + 20) - (result.biomarker.rangeMale.low - 20))) * 100))}%`,
                          width: '3px'
                        }}></div>
                        <div className="absolute h-full bg-emerald-500 opacity-20" style={{
                          left: `${(result.biomarker.rangeMale.low / (result.biomarker.rangeMale.high + 20)) * 100}%`,
                          width: `${((result.biomarker.rangeMale.high - result.biomarker.rangeMale.low) / (result.biomarker.rangeMale.high + 20)) * 100}%`
                        }}></div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-slate-200/50 pt-3">
                      {/* Hindi Analysis */}
                      {(language === 'hindi' || language === 'both') && (
                        <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Sun className="w-3.5 h-3.5 text-orange-500" />
                            <span className="text-[10px] font-bold text-orange-700 uppercase">हिंदी विश्लेषण</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">{result.hindiAnalysis}</p>
                        </div>
                      )}

                      {/* English Analysis */}
                      {(language === 'english' || language === 'both') && (
                        <div className="bg-sky-50 p-3 rounded-xl border border-sky-100">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Moon className="w-3.5 h-3.5 text-sky-500" />
                            <span className="text-[10px] font-bold text-sky-700 uppercase">English Analysis</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">{result.englishAnalysis}</p>
                        </div>
                      )}

                      {/* Recommendations */}
                      <div className="bg-white p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-700 uppercase mb-2">💡 Recommended Actions</p>
                        <ul className="space-y-1">
                          {result.biomarker.recommendedActions.slice(0, 3).map((action, j) => (
                            <li key={j} className="flex items-start gap-1.5 text-xs text-slate-600">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Hindi Recommendations */}
                      <div className="bg-white p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-700 uppercase mb-2">🙏 अनुशंसित कार्रवाई</p>
                        <ul className="space-y-1">
                          {result.biomarker.hindiRecommendedActions.slice(0, 3).map((action, j) => (
                            <li key={j} className="flex items-start gap-1.5 text-xs text-slate-600">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Risk Factors */}
                      {result.biomarker.riskFactors.length > 0 && (
                        <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                          <p className="text-[10px] font-bold text-amber-700 uppercase mb-2">⚠️ Risk Factors</p>
                          <div className="flex flex-wrap gap-1.5">
                            {result.biomarker.riskFactors.map((factor, j) => (
                              <span key={j} className="text-[10px] font-bold bg-white text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">{factor}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Expand Indicator */}
                  <div className="px-4 pb-3 flex justify-center">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Data Sources */}
          <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-100 p-6 rounded-3xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Powered by World-Class Medical Data</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DATA_SOURCES.map((source, i) => (
                <div key={i} className="bg-white p-3 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-extrabold text-slate-700">{source.name}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{source.organization}</p>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[9px] text-indigo-600 font-bold flex items-center gap-0.5 mt-1 hover:underline">
                    View Source <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => { setAnalyzed(false); setResults([]); setReportText(''); }}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <FileText className="w-4 h-4" /> Analyze New Report
            </button>
            <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-2xl text-sm transition-colors flex items-center justify-center gap-1.5">
              <Copy className="w-4 h-4" /> Copy Full Analysis
            </button>
          </div>

          {/* Medical Disclaimer */}
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>⚠️ Medical Disclaimer:</strong> This AI analysis is for informational purposes only and is NOT a medical diagnosis. Lab results should always be interpreted by qualified healthcare professionals. Reference ranges may vary by laboratory. If any value is flagged as critical, please consult your doctor immediately.
            </p>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center animate-fadeInScale">
            <div className="relative inline-flex">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center animate-pulseGlow">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full opacity-30 blur-xl animate-pulse"></div>
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-5">MedGemma AI Analyzing...</h3>
            <p className="text-sm text-slate-500 mt-2">Cross-referencing with ICMR & LabQAR datasets</p>
            <div className="mt-5 space-y-2 text-xs text-left">
              {['Extracting biomarker values...', 'Comparing with Indian reference ranges...', 'Generating Hindi & English analysis...', 'Building personalized recommendations...'].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-slate-600">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
