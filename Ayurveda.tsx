import React, { useState } from 'react';
import { 
  Leaf, Database, Info, ExternalLink,
  CheckCircle2, AlertCircle, BookOpen, Flower, Flame,
  Sparkles, Users, Wind
} from 'lucide-react';

export const Ayurveda: React.FC = () => {
  const [showDatasetInfo, setShowDatasetInfo] = useState(false);
  const [activeDosha, setActiveDosha] = useState<string>('vata');
  const [selectedRemedy, setSelectedRemedy] = useState<string>('');

  const datasetInfo = {
    name: 'BhashaBench-Ayur (BBA)',
    description: "India's first comprehensive Ayurvedic AI Benchmark",
    author: 'BharatGen',
    source: 'BharatGen',
    license: 'Attribution 4.0 International (CC BY-4.0)',
    generated: 'Tue Dec 09 2025',
    quality: '⭐⭐⭐⭐⭐',
    link: 'https://aikosh.indiaai.gov.in/home/datasets/details/bhashabench_ayur.html',
    questions: '14,963',
    exams: '50+',
    domains: '15+',
    languages: 'English, Hindi + Sanskrit (planned)'
  };

  const doshaData = {
    vata: {
      name: 'Vata',
      element: 'Air + Ether',
      icon: Wind,
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      qualities: ['Light', 'Cold', 'Dry', 'Rough', 'Mobile', 'Clear'],
      bodyTypes: ['Thin frame', 'Dry skin', 'Cold hands/feet', 'Irregular appetite', 'Quick learner, quick forgetter'],
      balanced: ['Creative', 'Energetic', 'Flexible', 'Enthusiastic'],
      imbalanced: ['Anxiety', 'Insomnia', 'Constipation', 'Joint pain', 'Dry skin'],
      foods: ['Warm cooked meals', 'Root vegetables', 'Ghee', 'Sesame oil', 'Sweet/sour/salty tastes', 'Nuts and seeds'],
      herbs: ['Ashwagandha', 'Shatavari', 'Ginger', 'Cumin', 'Cardamom'],
      lifestyle: ['Regular routine', 'Warm oil massage (Abhyanga)', 'Gentle yoga', 'Early bedtime (10 PM)', 'Meditation']
    },
    pitta: {
      name: 'Pitta',
      element: 'Fire + Water',
      icon: Flame,
      color: 'from-red-400 to-orange-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      qualities: ['Hot', 'Sharp', 'Light', 'Oily', 'Spreading', 'Liquid'],
      bodyTypes: ['Medium build', 'Warm body temperature', 'Strong appetite', 'Sharp intellect', 'Good digestion'],
      balanced: ['Intelligent', 'Courageous', 'Good leader', 'Clear skin'],
      imbalanced: ['Anger', 'Inflammation', 'Acidity', 'Skin rashes', 'Excessive sweating'],
      foods: ['Cooling foods', 'Sweet fruits', 'Leafy greens', 'Coconut water', 'Bitter/astringent tastes', 'Avoid spicy/sour'],
      herbs: ['Brahmi', 'Neem', 'Coriander', 'Fennel', 'Rose'],
      lifestyle: ['Avoid midday sun', 'Cooling breathwork', 'Swimming', 'Moderate exercise', 'Forgiveness practices']
    },
    kapha: {
      name: 'Kapha',
      element: 'Earth + Water',
      icon: Flower,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      qualities: ['Heavy', 'Slow', 'Cold', 'Oily', 'Smooth', 'Dense'],
      bodyTypes: ['Strong build', 'Smooth skin', 'Slow metabolism', 'Calm demeanor', 'Good stamina'],
      balanced: ['Loving', 'Patient', 'Stable', 'Strong immunity'],
      imbalanced: ['Weight gain', 'Lethargy', 'Congestion', 'Attachment', 'Slow digestion'],
      foods: ['Light foods', 'Spices (ginger, pepper)', 'Honey', 'Bitter greens', 'Pungent/astringent tastes', 'Avoid dairy/sweets'],
      herbs: ['Tulsi', 'Turmeric', 'Ginger', 'Triphala', 'Guggulu'],
      lifestyle: ['Vigorous exercise', 'Wake early (6 AM)', 'Dry massage', 'Variety in routine', 'Social engagement']
    }
  };

  const remedies = [
    {
      id: 'headache',
      condition: 'Headache / Migraine',
      ayurvedic: 'Shirashool',
      dosha: 'Primarily Vata, can be Pitta',
      remedies: [
        'Apply sesame oil to scalp and feet before sleep',
        'Drink warm water with ginger and cardamom',
        'Nasya: 2 drops of warm ghee in each nostril',
        'Shirodhara (oil pouring on forehead) by practitioner',
        'Avoid cold foods and late nights'
      ],
      herbs: ['Brahmi oil', 'Jatamansi', 'Shankhpushpi']
    },
    {
      id: 'digestion',
      condition: 'Indigestion / Bloating',
      ayurvedic: 'Ajeerna',
      dosha: 'All doshas (Agni imbalance)',
      remedies: [
        'Drink warm water with lemon and ginger before meals',
        'Chew fennel seeds after meals',
        'Avoid incompatible food combinations (viruddha ahara)',
        'Practice Vajrasana (thunderbolt pose) after eating',
        'Eat mindfully in a calm environment'
      ],
      herbs: ['Triphala', 'Ginger', 'Cumin', 'Ajwain']
    },
    {
      id: 'insomnia',
      condition: 'Insomnia / Sleep Issues',
      ayurvedic: 'Anidra',
      dosha: 'Vata imbalance',
      remedies: [
        'Warm milk with nutmeg and cardamom before bed',
        'Foot massage with warm sesame oil',
        'Avoid screens 1 hour before sleep',
        'Practice Nadi Shodhana (alternate nostril breathing)',
        'Maintain consistent sleep schedule'
      ],
      herbs: ['Ashwagandha', 'Jatamansi', 'Brahmi', 'Shankhpushpi']
    },
    {
      id: 'immunity',
      condition: 'Low Immunity',
      ayurvedic: 'Ojas depletion',
      dosha: 'All doshas',
      remedies: [
        'Daily Chyawanprash (1 tsp with warm milk)',
        'Practice Pranayama (breathing exercises)',
        'Regular Abhyanga (self-massage with oil)',
        'Adequate sleep and stress management',
        'Seasonal cleansing (Ritucharya)'
      ],
      herbs: ['Chyawanprash', 'Giloy', 'Tulsi', 'Ashwagandha', 'Amalaki']
    },
    {
      id: 'stress',
      condition: 'Stress / Anxiety',
      ayurvedic: 'Chitta Vikshepa',
      dosha: 'Vata-Pitta imbalance',
      remedies: [
        'Daily meditation (even 10 minutes)',
        'Warm oil massage (Abhyanga) before bath',
        'Practice Sheetali cooling breath',
        'Spend time in nature',
        'Limit caffeine and processed foods'
      ],
      herbs: ['Brahmi', 'Ashwagandha', 'Jatamansi', 'Tulsi']
    },
    {
      id: 'joint-pain',
      condition: 'Joint Pain / Arthritis',
      ayurvedic: 'Sandhivata',
      dosha: 'Vata imbalance',
      remedies: [
        'Apply warm sesame oil or Mahanarayan oil to joints',
        'Drink warm water with turmeric and ginger',
        'Gentle yoga (avoid overstretching)',
        'Epsom salt baths',
        'Avoid cold and dry foods'
      ],
      herbs: ['Shallaki (Boswellia)', 'Guggulu', 'Nirgundi', 'Ashwagandha']
    }
  ];

  const currentDosha = doshaData[activeDosha as keyof typeof doshaData];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Leaf className="text-green-500 w-7 h-7" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Ayurveda & Traditional Wellness</h1>
        </div>
        <button 
          onClick={() => setShowDatasetInfo(!showDatasetInfo)}
          className="text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
        >
          <Database className="w-3.5 h-3.5" /> Dataset Info
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm text-slate-500">Powered by </p>
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
          🌿 BhashaBench-Ayur • BharatGen
        </span>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
          📚 14,963 validated Ayurvedic questions • 50+ authentic exams
        </span>
      </div>

      {/* Dataset Info Panel */}
      {showDatasetInfo && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 border border-green-100 p-5 rounded-3xl shadow-sm animate-fadeIn">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 bg-green-500 text-white rounded-2xl">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-extrabold text-slate-800">{datasetInfo.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{datasetInfo.description}</p>
              <p className="text-[10px] text-green-600 font-semibold mt-1">Author: {datasetInfo.author} • Source: {datasetInfo.source}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Generated: {datasetInfo.generated} • License: {datasetInfo.license}</p>
            </div>
            <span className="text-xs">{datasetInfo.quality}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-white p-3 rounded-2xl border border-green-100 text-center">
              <p className="text-xl font-extrabold text-green-700">{datasetInfo.questions}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase">Questions</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-green-100 text-center">
              <p className="text-xl font-extrabold text-green-700">{datasetInfo.exams}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase">Exams</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-green-100 text-center">
              <p className="text-xl font-extrabold text-green-700">{datasetInfo.domains}+</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase">Domains</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-green-100 text-center">
              <p className="text-xs font-extrabold text-green-700">EN/HI</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase">Languages</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-green-100 mb-4">
            <p className="text-[10px] font-bold text-green-600 uppercase mb-1">About BhashaBench-Ayur</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              BBA is India's first comprehensive benchmark designed to evaluate AI models on traditional Ayurvedic knowledge and practice. It rigorously tests AI models' ability to comprehend and apply Ayurvedic concepts, drawing from authentic government examinations, institutional assessments, and standardized Ayurvedic education curricula across India.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              <strong>Purpose:</strong> Evaluating AI systems for traditional medicine applications, developing culturally-aware healthcare AI solutions, preserving ancient medical knowledge, and supporting evidence-based integration of traditional and modern medicine.
            </p>
          </div>

          <a href={datasetInfo.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 hover:text-green-700">
            <ExternalLink className="w-4 h-4" /> View BhashaBench-Ayur Dataset
          </a>
        </div>
      )}

      {/* Dosha Selector */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
          <Users className="w-5 h-5 text-green-500" /> Understand Your Dosha
        </h2>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          {Object.entries(doshaData).map(([key, dosha]) => {
            const Icon = dosha.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveDosha(key)}
                className={`p-4 rounded-2xl border-2 transition-all ${activeDosha === key ? `${dosha.bgColor} ${dosha.textColor} border-current` : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-extrabold">{dosha.name}</p>
                <p className="text-[10px] font-medium opacity-75">{dosha.element}</p>
              </button>
            );
          })}
        </div>

        {/* Dosha Details */}
        <div className={`${currentDosha.bgColor} p-5 rounded-2xl`}>
          <h3 className={`text-lg font-extrabold ${currentDosha.textColor} mb-4 flex items-center gap-2`}>
            <currentDosha.icon className="w-6 h-6" />
            {currentDosha.name} Dosha ({currentDosha.element})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white/70 backdrop-blur p-4 rounded-xl">
              <p className="text-xs font-bold text-slate-700 mb-2">Key Qualities</p>
              <div className="flex flex-wrap gap-1.5">
                {currentDosha.qualities.map((q, i) => (
                  <span key={i} className={`${currentDosha.textColor} bg-white/80 text-xs font-bold px-2.5 py-1 rounded-full`}>{q}</span>
                ))}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur p-4 rounded-xl">
              <p className="text-xs font-bold text-slate-700 mb-2">Physical Traits</p>
              <ul className="space-y-1">
                {currentDosha.bodyTypes.map((t, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-emerald-100/70 backdrop-blur p-4 rounded-xl">
              <p className="text-xs font-bold text-emerald-700 mb-2">When Balanced</p>
              <ul className="space-y-1">
                {currentDosha.balanced.map((b, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-100/70 backdrop-blur p-4 rounded-xl">
              <p className="text-xs font-bold text-red-700 mb-2">When Imbalanced</p>
              <ul className="space-y-1">
                {currentDosha.imbalanced.map((im, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                    {im}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/70 backdrop-blur p-4 rounded-xl">
              <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-green-500" /> Recommended Foods
              </p>
              <ul className="space-y-1">
                {currentDosha.foods.map((f, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                    <span className="text-green-500">🌿</span> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/70 backdrop-blur p-4 rounded-xl">
              <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Flower className="w-4 h-4 text-purple-500" /> Beneficial Herbs
              </p>
              <ul className="space-y-1">
                {currentDosha.herbs.map((h, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                    <span className="text-purple-500">🌸</span> {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/70 backdrop-blur p-4 rounded-xl">
              <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Lifestyle Tips
              </p>
              <ul className="space-y-1">
                {currentDosha.lifestyle.map((l, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                    <span className="text-amber-500">✨</span> {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Ayurvedic Remedies */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
          <BookOpen className="w-5 h-5 text-green-500" /> Ayurvedic Home Remedies
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {remedies.map(remedy => (
            <button
              key={remedy.id}
              onClick={() => setSelectedRemedy(remedy.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedRemedy === remedy.id ? 'bg-green-50 border-green-500' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
            >
              <p className="text-sm font-extrabold text-slate-800">{remedy.condition}</p>
              <p className="text-[10px] text-slate-500 mt-1 italic">{remedy.ayurvedic} ({remedy.dosha})</p>
            </button>
          ))}
        </div>

        {selectedRemedy && (
          <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
            {(() => {
              const remedy = remedies.find(r => r.id === selectedRemedy);
              if (!remedy) return null;
              return (
                <>
                  <h3 className="text-lg font-extrabold text-green-700 mb-3">{remedy.condition}</h3>
                  <p className="text-xs text-slate-600 mb-4 italic">{remedy.ayurvedic} • {remedy.dosha}</p>
                  
                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Recommended Practices
                    </p>
                    <ul className="space-y-2">
                      {remedy.remedies.map((r, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-white/70 p-2.5 rounded-lg">
                          <span className="bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">{i + 1}</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Flower className="w-4 h-4 text-purple-500" /> Key Herbs
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {remedy.herbs.map((h, i) => (
                        <span key={i} className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full">
                          🌿 {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
        <p className="text-xs text-amber-800 leading-relaxed flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Disclaimer:</strong> Ayurvedic information is provided for educational purposes based on traditional knowledge and BhashaBench-Ayur dataset. It is not a substitute for professional medical advice. Always consult a qualified Ayurvedic practitioner (BAMS/MD Ayurveda) before starting any treatment, especially if you have existing health conditions or are taking medications.
          </span>
        </p>
      </div>
    </div>
  );
};
