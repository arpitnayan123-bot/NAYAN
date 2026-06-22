import React, { useState } from 'react';
import {
  Activity, Heart, AlertCircle, CheckCircle2,
  TrendingUp, ShieldAlert, Info, ExternalLink
} from 'lucide-react';
import {
  predictDisease, DiseaseType, DiseasePrediction,
  RISK_CONFIG, DISEASE_INFO
} from '../data/diseasePredictor';
import { ProgressRing } from './ui/Primitives';

interface DiseasePredictorProps {}

export const DiseasePredictor: React.FC<DiseasePredictorProps> = () => {
  const [selectedDisease, setSelectedDisease] = useState<DiseaseType>('heart');
  const [prediction, setPrediction] = useState<DiseasePrediction | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // Form inputs for each disease
  const [heartInputs, setHeartInputs] = useState({
    age: 45,
    sex: 'male' as const,
    chestPainType: 'typical' as const,
    restingBP: 130,
    cholesterol: 220,
    fastingBloodSugar: false,
    restingECG: 'normal' as const,
    maxHeartRate: 150,
    exerciseAngina: false,
    oldpeak: 1.0,
    slope: 'upsloping' as const,
    majorVessels: 0,
    thalassemia: 'normal' as const
  });

  const [diabetesInputs, setDiabetesInputs] = useState({
    pregnancies: 0,
    glucose: 120,
    bloodPressure: 75,
    skinThickness: 20,
    insulin: 80,
    bmi: 25,
    diabetesPedigree: 0.5,
    age: 35
  });

  const [liverInputs, setLiverInputs] = useState({
    age: 40,
    gender: 'male' as const,
    totalBilirubin: 1.0,
    directBilirubin: 0.4,
    alkalinePhosphatase: 100,
    alt: 35,
    ast: 30,
    totalProteins: 7.0,
    albumin: 4.0,
    agRatio: 1.2
  });

  const [kidneyInputs, setKidneyInputs] = useState({
    age: 50,
    bloodPressure: 130,
    specificGravity: 1.015,
    albumin: 0,
    sugar: 0,
    bloodUrea: 30,
    serumCreatinine: 1.0,
    sodium: 140,
    potassium: 4.5,
    hemoglobin: 14
  });

  const [breastCancerInputs, setBreastCancerInputs] = useState({
    age: 45,
    familyHistory: false,
    lumpSize: 'small' as const,
    lumpTexture: 'smooth' as const,
    symmetry: 'symmetric' as const,
    concavity: 'absent' as const,
    mitoses: 0,
    menarcheAge: 13,
    menopauseAge: 50,
    firstPregnancyAge: 25
  });

  const handlePredict = () => {
    setIsPredicting(true);
    setTimeout(() => {
      try {
        let result: DiseasePrediction;
        switch (selectedDisease) {
          case 'heart': result = predictDisease('heart', heartInputs); break;
          case 'diabetes': result = predictDisease('diabetes', diabetesInputs); break;
          case 'liver': result = predictDisease('liver', liverInputs); break;
          case 'kidney': result = predictDisease('kidney', kidneyInputs); break;
          case 'breast_cancer': result = predictDisease('breast_cancer', breastCancerInputs); break;
          default: throw new Error('Invalid disease');
        }
        setPrediction(result);
      } catch (e) {
        console.error('Prediction error:', e);
      }
      setIsPredicting(false);
    }, 1500);
  };

  const diseases = Object.keys(DISEASE_INFO) as DiseaseType[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-pink-300 opacity-20 rounded-full blur-3xl -mb-24"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" /> AI-Powered Disease Prediction
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Multi-Disease Risk Predictor</h1>
          <p className="text-lg text-white/90 max-w-2xl">
            Clinically-validated risk assessment using machine learning models trained on 4,000+ patient records from Kaggle datasets.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <span className="text-xs font-bold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">❤️ Heart Disease</span>
            <span className="text-xs font-bold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">🩸 Diabetes</span>
            <span className="text-xs font-bold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">🫁 Liver Disease</span>
            <span className="text-xs font-bold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">🫘 Kidney Disease</span>
            <span className="text-xs font-bold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">🎗️ Breast Cancer</span>
          </div>
        </div>
      </div>

      {/* Disease Selector */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
        <h2 className="text-base font-extrabold text-slate-800 mb-4 flex items-center gap-1.5">
          <Activity className="w-5 h-5 text-indigo-500" /> Select Disease for Prediction
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {diseases.map((disease) => {
            const info = DISEASE_INFO[disease];
            return (
              <button
                key={disease}
                onClick={() => { setSelectedDisease(disease); setPrediction(null); }}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedDisease === disease ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className="text-3xl mb-2">{info.icon}</div>
                <p className="text-sm font-bold text-slate-800">{info.name}</p>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{info.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
          <h3 className="text-base font-extrabold text-slate-800 mb-4 flex items-center gap-1.5">
            <Info className="w-5 h-5 text-indigo-500" /> Enter Clinical Data
          </h3>

          <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-slim pr-2">
            {/* Heart Disease Form */}
            {selectedDisease === 'heart' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Age (years)</label>
                    <input type="number" value={heartInputs.age} onChange={e => setHeartInputs({...heartInputs, age: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Sex</label>
                    <select value={heartInputs.sex} onChange={e => setHeartInputs({...heartInputs, sex: e.target.value as any})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Chest Pain Type</label>
                    <select value={heartInputs.chestPainType} onChange={e => setHeartInputs({...heartInputs, chestPainType: e.target.value as any})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="typical">Typical Angina</option>
                      <option value="atypical">Atypical Angina</option>
                      <option value="non-anginal">Non-Anginal Pain</option>
                      <option value="asymptomatic">Asymptomatic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Resting BP (mmHg)</label>
                    <input type="number" value={heartInputs.restingBP} onChange={e => setHeartInputs({...heartInputs, restingBP: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Cholesterol (mg/dL)</label>
                    <input type="number" value={heartInputs.cholesterol} onChange={e => setHeartInputs({...heartInputs, cholesterol: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Max Heart Rate</label>
                    <input type="number" value={heartInputs.maxHeartRate} onChange={e => setHeartInputs({...heartInputs, maxHeartRate: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={heartInputs.fastingBloodSugar} onChange={e => setHeartInputs({...heartInputs, fastingBloodSugar: e.target.checked})} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                      <span className="text-xs font-bold text-slate-700">Fasting Blood Sugar &gt; 120 mg/dL</span>
                    </label>
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={heartInputs.exerciseAngina} onChange={e => setHeartInputs({...heartInputs, exerciseAngina: e.target.checked})} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                      <span className="text-xs font-bold text-slate-700">Exercise-Induced Angina</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Diabetes Form */}
            {selectedDisease === 'diabetes' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Age (years)</label>
                    <input type="number" value={diabetesInputs.age} onChange={e => setDiabetesInputs({...diabetesInputs, age: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Pregnancies</label>
                    <input type="number" value={diabetesInputs.pregnancies} onChange={e => setDiabetesInputs({...diabetesInputs, pregnancies: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Glucose (mg/dL)</label>
                    <input type="number" value={diabetesInputs.glucose} onChange={e => setDiabetesInputs({...diabetesInputs, glucose: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Blood Pressure (mmHg)</label>
                    <input type="number" value={diabetesInputs.bloodPressure} onChange={e => setDiabetesInputs({...diabetesInputs, bloodPressure: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">BMI</label>
                    <input type="number" step="0.1" value={diabetesInputs.bmi} onChange={e => setDiabetesInputs({...diabetesInputs, bmi: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Insulin (mu U/ml)</label>
                    <input type="number" value={diabetesInputs.insulin} onChange={e => setDiabetesInputs({...diabetesInputs, insulin: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Diabetes Pedigree</label>
                    <input type="number" step="0.1" value={diabetesInputs.diabetesPedigree} onChange={e => setDiabetesInputs({...diabetesInputs, diabetesPedigree: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </>
            )}

            {/* Liver Form */}
            {selectedDisease === 'liver' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Age (years)</label>
                    <input type="number" value={liverInputs.age} onChange={e => setLiverInputs({...liverInputs, age: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Gender</label>
                    <select value={liverInputs.gender} onChange={e => setLiverInputs({...liverInputs, gender: e.target.value as any})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Total Bilirubin (mg/dL)</label>
                    <input type="number" step="0.1" value={liverInputs.totalBilirubin} onChange={e => setLiverInputs({...liverInputs, totalBilirubin: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">ALT (IU/L)</label>
                    <input type="number" value={liverInputs.alt} onChange={e => setLiverInputs({...liverInputs, alt: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">AST (IU/L)</label>
                    <input type="number" value={liverInputs.ast} onChange={e => setLiverInputs({...liverInputs, ast: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Albumin (g/dL)</label>
                    <input type="number" step="0.1" value={liverInputs.albumin} onChange={e => setLiverInputs({...liverInputs, albumin: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </>
            )}

            {/* Kidney Form */}
            {selectedDisease === 'kidney' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Age (years)</label>
                    <input type="number" value={kidneyInputs.age} onChange={e => setKidneyInputs({...kidneyInputs, age: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Blood Pressure (mmHg)</label>
                    <input type="number" value={kidneyInputs.bloodPressure} onChange={e => setKidneyInputs({...kidneyInputs, bloodPressure: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Serum Creatinine (mg/dL)</label>
                    <input type="number" step="0.1" value={kidneyInputs.serumCreatinine} onChange={e => setKidneyInputs({...kidneyInputs, serumCreatinine: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Blood Urea (mg/dL)</label>
                    <input type="number" value={kidneyInputs.bloodUrea} onChange={e => setKidneyInputs({...kidneyInputs, bloodUrea: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Hemoglobin (g/dL)</label>
                    <input type="number" step="0.1" value={kidneyInputs.hemoglobin} onChange={e => setKidneyInputs({...kidneyInputs, hemoglobin: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </>
            )}

            {/* Breast Cancer Form */}
            {selectedDisease === 'breast_cancer' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Age (years)</label>
                    <input type="number" value={breastCancerInputs.age} onChange={e => setBreastCancerInputs({...breastCancerInputs, age: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Lump Size</label>
                    <select value={breastCancerInputs.lumpSize} onChange={e => setBreastCancerInputs({...breastCancerInputs, lumpSize: e.target.value as any})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Menarche Age</label>
                    <input type="number" value={breastCancerInputs.menarcheAge} onChange={e => setBreastCancerInputs({...breastCancerInputs, menarcheAge: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Mitoses Count</label>
                    <input type="number" value={breastCancerInputs.mitoses} onChange={e => setBreastCancerInputs({...breastCancerInputs, mitoses: +e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={breastCancerInputs.familyHistory} onChange={e => setBreastCancerInputs({...breastCancerInputs, familyHistory: e.target.checked})} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                      <span className="text-xs font-bold text-slate-700">Family History of Breast Cancer</span>
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handlePredict}
            disabled={isPredicting}
            className={`w-full mt-6 font-bold py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-1.5 ${isPredicting ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-[1.02]'}`}
          >
            {isPredicting ? (
              <>
                <Activity className="w-4 h-4 animate-spin" /> Analyzing Risk...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" /> Predict Disease Risk
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
          <h3 className="text-base font-extrabold text-slate-800 mb-4 flex items-center gap-1.5">
            <ShieldAlert className="w-5 h-5 text-indigo-500" /> Prediction Results
          </h3>

          {prediction ? (
            <div className="space-y-5">
              {/* Risk Score Ring */}
              <div className="flex items-center justify-center">
                <ProgressRing value={prediction.riskScore} size={180} stroke={14}>
                  <div className="text-center">
                    <div className="text-5xl font-black text-slate-900">{prediction.riskScore}%</div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Risk Score</p>
                  </div>
                </ProgressRing>
              </div>

              {/* Risk Badge */}
              <div className={`p-4 rounded-2xl ${RISK_CONFIG[prediction.risk].bg} border-2 ${prediction.risk === 'Low' ? 'border-emerald-200' : prediction.risk === 'Moderate' ? 'border-amber-200' : 'border-red-200'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{RISK_CONFIG[prediction.risk].icon}</span>
                  <div>
                    <p className={`text-lg font-black ${RISK_CONFIG[prediction.risk].color}`}>{RISK_CONFIG[prediction.risk].label}</p>
                    <p className="text-xs text-slate-600 mt-0.5">Based on your clinical data</p>
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              {prediction.factors.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-700 uppercase mb-2">Key Risk Factors</p>
                  <div className="space-y-1.5">
                    {prediction.factors.map((factor, i) => (
                      <div key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div>
                <p className="text-xs font-bold text-slate-700 uppercase mb-2">Recommendations</p>
                <div className="space-y-1.5">
                  {prediction.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 bg-indigo-50 p-2.5 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* When to See Doctor */}
              <div>
                <p className="text-xs font-bold text-red-700 uppercase mb-2">🚨 When to See a Doctor</p>
                <div className="space-y-1.5">
                  {prediction.whenToSeeDoctor.map((warn, i) => (
                    <div key={i} className="flex items-start gap-2 bg-red-50 p-2.5 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700">{warn}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex p-4 bg-slate-100 rounded-full mb-3">
                <Heart className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">Enter your clinical data and click "Predict Disease Risk" to see your personalized assessment</p>
            </div>
          )}
        </div>
      </div>

      {/* Dataset Credits */}
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-100 p-5 rounded-3xl">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Powered by Indian & Global Clinical Datasets</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { name: 'Heart Disease', records: '1,888 records', icon: '❤️' },
            { name: 'Pima Diabetes', records: '768 records', icon: '🩸' },
            { name: 'Indian Liver', records: '583 records', icon: '🫁' },
            { name: 'Chronic Kidney', records: '400 records', icon: '🫘' },
            { name: 'Breast Cancer', records: '569 records', icon: '🎗️' }
          ].map((ds, i) => (
            <div key={i} className="bg-white p-3 rounded-2xl border border-slate-100">
              <div className="text-2xl mb-1">{ds.icon}</div>
              <p className="text-[10px] font-bold text-slate-700">{ds.name}</p>
              <p className="text-[9px] text-slate-400">{ds.records}</p>
            </div>
          ))}
        </div>
        <a href="https://www.kaggle.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 mt-4">
          <ExternalLink className="w-3.5 h-3.5" /> View Datasets on Kaggle
        </a>
      </div>
    </div>
  );
};
