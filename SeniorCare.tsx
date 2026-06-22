import React, { useState } from 'react';
import { 
  Heart, Database, Info, ExternalLink, CheckCircle2, 
  AlertCircle, Phone, MapPin, Users, Calendar,
  TrendingUp, Award, Activity, HandHeart, Brain, Eye
} from 'lucide-react';

export const SeniorCare: React.FC = () => {
  const [showDatasetInfo, setShowDatasetInfo] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<string>('');

  const datasetInfo = {
    name: 'Integrated Programme for Older Persons — GOI Grant Data',
    author: 'Tamil Nadu, Social Welfare and Nutritious Meal Programme Department, Directorate of Social Welfare',
    source: 'IndiaAI',
    sector: 'Social',
    license: 'Open Government License, India',
    generated: 'Sun Nov 30 2025',
    quality: '⭐⭐⭐⭐⭐',
    frequency: 'Annually',
    coverage: 'Tamil Nadu',
    link: 'https://aikosh.indiaai.gov.in/home/datasets/details/integrated_programme_for_older_persons_goi_grant_data.html',
    purpose: 'This dataset helps evaluate how government grants under the Integrated Programme for Older Persons are distributed and utilized — enabling analysis of support provided to elderly citizens and assessing reach, equity, and effectiveness of elderly welfare initiatives.'
  };

  const schemes = [
    {
      id: 'ras',
      name: 'Rashtriya Vayoshri Yojana',
      description: 'Provides free assistive devices (hearing aids, wheelchairs, dentures, spectacles) to elderly BPL citizens.',
      eligibility: 'Age 60+ | Below Poverty Line (BPL)',
      benefits: ['Free hearing aids', 'Wheelchairs', 'Dentures', 'Spectacles', 'Walkers'],
      contact: 'District Social Welfare Office'
    },
    {
      id: 'ignops',
      name: 'Indira Gandhi National Old Age Pension Scheme',
      description: 'Monthly pension for elderly BPL citizens. Central + State contribution.',
      eligibility: 'Age 60-79: ₹300/month | Age 80+: ₹500/month',
      benefits: ['Monthly pension', 'Direct bank transfer', 'State top-up available'],
      contact: 'Block Development Officer'
    },
    {
      id: 'maintenance',
      name: 'Maintenance & Welfare of Parents Act',
      description: 'Legal protection for elderly parents. Children legally obligated to provide maintenance.',
      eligibility: 'All senior citizens facing neglect',
      benefits: ['Legal recourse', 'Monthly maintenance orders', 'Protection from abuse', 'Tribunal access'],
      contact: 'Senior Citizens Tribunal'
    },
    {
      id: 'health',
      name: 'Ayushman Bharat - PMJAY (Senior Citizens)',
      description: 'Health insurance coverage of ₹5 lakh per family per year for secondary and tertiary care.',
      eligibility: 'Age 60+ | BPL families',
      benefits: ['₹5 lakh coverage', 'Cashless treatment', 'Pre & post hospitalization', '1,400+ procedures covered'],
      contact: 'Ayushman Bharat Helpline: 14555'
    }
  ];

  const healthTips = [
    {
      category: 'Nutrition',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      tips: [
        'Eat calcium-rich foods: milk, yogurt, ragi, sesame seeds',
        'Include vitamin D sources: sunlight exposure (15-20 min daily)',
        'Consume omega-3 fatty acids: walnuts, flaxseeds, fish',
        'Stay hydrated: 6-8 glasses of water daily',
        'Limit salt intake to prevent hypertension',
        'Eat fiber-rich foods to prevent constipation'
      ]
    },
    {
      category: 'Exercise',
      icon: Activity,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      tips: [
        'Daily walking: 20-30 minutes (start slow)',
        'Gentle yoga: Tadasana, Vajrasana, Pawanmuktasana',
        'Breathing exercises: Anulom Vilom, Bhramari',
        'Chair exercises for mobility',
        'Avoid strenuous activities',
        'Balance training to prevent falls'
      ]
    },
    {
      category: 'Mental Wellness',
      icon: Brain,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      tips: [
        'Stay socially connected with family and friends',
        'Engage in hobbies: reading, gardening, music',
        'Practice meditation daily',
        'Join senior citizen clubs or community centers',
        'Limit screen time, especially before bed',
        'Seek help for depression or anxiety'
      ]
    },
    {
      category: 'Preventive Care',
      icon: Eye,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      tips: [
        'Annual health checkups: BP, sugar, cholesterol',
        'Regular eye exams for cataracts and glaucoma',
        'Dental checkups every 6 months',
        'Bone density test (DEXA) for osteoporosis',
        'Keep vaccinations updated (flu, pneumonia)',
        'Monitor medications and follow prescriptions'
      ]
    }
  ];

  const emergencyContacts = [
    { name: 'Elderline (National Helpline)', number: '14567', description: '24/7 support for senior citizens' },
    { name: 'Ayushman Bharat Helpline', number: '14555', description: 'Health insurance queries' },
    { name: 'Police Emergency', number: '100', description: 'Immediate assistance' },
    { name: 'Medical Emergency', number: '108', description: 'Ambulance services' }
  ];

  const commonAilments = [
    {
      condition: 'Hypertension (High BP)',
      prevention: ['Low-salt diet', 'Regular walking', 'Stress management', 'Limit alcohol'],
      warningSigns: ['Severe headache', 'Chest pain', 'Shortness of breath', 'Vision changes']
    },
    {
      condition: 'Diabetes',
      prevention: ['Control carbohydrate intake', 'Regular exercise', 'Monitor blood sugar', 'Maintain healthy weight'],
      warningSigns: ['Excessive thirst', 'Frequent urination', 'Blurred vision', 'Slow wound healing']
    },
    {
      condition: 'Osteoporosis',
      prevention: ['Calcium-rich diet', 'Vitamin D exposure', 'Weight-bearing exercises', 'Avoid smoking'],
      warningSigns: ['Back pain', 'Loss of height', 'Fractures from minor falls', 'Stooped posture']
    },
    {
      condition: 'Arthritis',
      prevention: ['Gentle exercise', 'Maintain healthy weight', 'Anti-inflammatory diet', 'Joint protection techniques'],
      warningSigns: ['Joint pain and stiffness', 'Swelling', 'Reduced range of motion', 'Morning stiffness']
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <HandHeart className="text-purple-500 w-7 h-7" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Senior Citizens Care & Welfare</h1>
        </div>
        <button 
          onClick={() => setShowDatasetInfo(!showDatasetInfo)}
          className="text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
        >
          <Database className="w-3.5 h-3.5" /> Dataset Info
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm text-slate-500">Powered by </p>
        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full border border-purple-100">
          🤝 IndiaAI • Ministry of Social Justice
        </span>
        <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-full border border-violet-100">
          📊 Integrated Programme for Older Persons — GOI Grant Data
        </span>
      </div>

      {/* Dataset Info Panel */}
      {showDatasetInfo && (
        <div className="bg-gradient-to-br from-purple-50 to-violet-50/50 border border-purple-100 p-5 rounded-3xl shadow-sm animate-fadeIn">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 bg-purple-500 text-white rounded-2xl">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-extrabold text-slate-800">{datasetInfo.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{datasetInfo.author}</p>
              <p className="text-[10px] text-purple-600 font-semibold mt-1">Source: {datasetInfo.source} • Sector: {datasetInfo.sector}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Generated: {datasetInfo.generated} • License: {datasetInfo.license}</p>
            </div>
            <span className="text-xs">{datasetInfo.quality}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-white p-3 rounded-2xl border border-purple-100 text-center">
              <Calendar className="w-5 h-5 mx-auto mb-1 text-purple-500" />
              <p className="text-sm font-extrabold text-purple-700">{datasetInfo.generated.split(' ').slice(1).join(' ')}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase">Generated</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-purple-100 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-purple-500" />
              <p className="text-sm font-extrabold text-purple-700">{datasetInfo.frequency}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase">Frequency</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-purple-100 text-center">
              <MapPin className="w-5 h-5 mx-auto mb-1 text-purple-500" />
              <p className="text-sm font-extrabold text-purple-700">{datasetInfo.coverage}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase">Coverage</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-purple-100 text-center">
              <Award className="w-5 h-5 mx-auto mb-1 text-purple-500" />
              <p className="text-xs font-extrabold text-purple-700">Open Govt</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase">License</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-purple-100 mb-4">
            <p className="text-[10px] font-bold text-purple-600 uppercase mb-1">About This Dataset</p>
            <p className="text-xs text-slate-600 leading-relaxed">{datasetInfo.purpose}</p>
          </div>

          <a href={datasetInfo.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700">
            <ExternalLink className="w-4 h-4" /> View Dataset on IndiaAI
          </a>
        </div>
      )}

      {/* Government Schemes */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
          <Award className="w-5 h-5 text-purple-500" /> Government Schemes for Senior Citizens
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {schemes.map(scheme => (
            <button
              key={scheme.id}
              onClick={() => setSelectedScheme(scheme.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedScheme === scheme.id ? 'bg-purple-50 border-purple-500' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
            >
              <p className="text-sm font-extrabold text-slate-800">{scheme.name}</p>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{scheme.description}</p>
              <p className="text-[9px] text-purple-600 font-bold mt-2">{scheme.eligibility}</p>
            </button>
          ))}
        </div>

        {selectedScheme && (
          <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100">
            {(() => {
              const scheme = schemes.find(s => s.id === selectedScheme);
              if (!scheme) return null;
              return (
                <>
                  <h3 className="text-lg font-extrabold text-purple-700 mb-2">{scheme.name}</h3>
                  <p className="text-xs text-slate-700 mb-4">{scheme.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-700 mb-2">Benefits</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {scheme.benefits.map((b, i) => (
                        <div key={i} className="flex items-start gap-2 bg-white/70 p-2.5 rounded-lg">
                          <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-700">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white/70 p-3 rounded-lg">
                    <Phone className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-700">Contact</p>
                      <p className="text-xs text-slate-600">{scheme.contact}</p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Health Tips Grid */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
          <Heart className="w-5 h-5 text-purple-500" /> Essential Health Tips for Seniors
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {healthTips.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div key={idx} className={`${section.bgColor} p-4 rounded-2xl border border-slate-100`}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-5 h-5 ${section.color}`} />
                  <h3 className="text-sm font-extrabold text-slate-800">{section.category}</h3>
                </div>
                <ul className="space-y-2">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${section.color} flex-shrink-0 mt-0.5`} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Common Ailments */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
          <AlertCircle className="w-5 h-5 text-amber-500" /> Common Age-Related Conditions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commonAilments.map((ailment, idx) => (
            <div key={idx} className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
              <h3 className="text-sm font-extrabold text-slate-800 mb-3">{ailment.condition}</h3>
              
              <div className="mb-3">
                <p className="text-[10px] font-bold text-emerald-700 uppercase mb-1.5">Prevention</p>
                <div className="space-y-1">
                  {ailment.prevention.map((p, i) => (
                    <div key={i} className="flex items-start gap-1.5 bg-white/70 p-2 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-red-700 uppercase mb-1.5">Warning Signs</p>
                <div className="space-y-1">
                  {ailment.warningSigns.map((w, i) => (
                    <div key={i} className="flex items-start gap-1.5 bg-white/70 p-2 rounded-lg">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700">{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-6 rounded-3xl shadow-xl">
        <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
          <Phone className="w-6 h-6" /> Emergency Helplines for Senior Citizens
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {emergencyContacts.map((contact, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              <p className="text-sm font-extrabold">{contact.name}</p>
              <p className="text-2xl font-extrabold mt-1">{contact.number}</p>
              <p className="text-xs opacity-90 mt-1">{contact.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
        <p className="text-xs text-amber-800 leading-relaxed flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Disclaimer:</strong> Information provided is for general awareness based on GOI schemes and health guidelines. Scheme details may vary by state. Always verify with official sources and consult healthcare professionals for medical advice. This is not a substitute for professional medical or legal consultation.
          </span>
        </p>
      </div>
    </div>
  );
};
