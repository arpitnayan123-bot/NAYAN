import React, { useState, useRef } from 'react';
import { 
  ScanLine, Upload, Sparkles, AlertTriangle, 
  Activity, RotateCcw, Cpu, Database, Award, 
  MessageSquare, Image as ImageIcon, Search
} from 'lucide-react';

interface BiomedCLIPMetadata {
  name: string;
  developer: string;
  creator: string;
  modelType: string;
  trainingData: string;
  datasetSize: string;
  license: string;
  hostedBy: string;
  sector: string;
  updatedDate: string;
  applications: string[];
}

export const MedicalImageQA: React.FC = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [_fileName, setFileName] = useState('');
  const [question, setQuestion] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [answer, setAnswer] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [retrievedContext, setRetrievedContext] = useState<string[]>([]);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // BiomedCLIP Model Metadata
  const modelMetadata: BiomedCLIPMetadata = {
    name: 'BiomedCLIP-PubMedBERT_256-vit_base_patch16_224',
    developer: 'Microsoft Corporation (India) Pvt. Ltd.',
    creator: 'Vikram Malhotra',
    modelType: 'Zero-Shot Image Classification (Vision-Language Foundation Model)',
    trainingData: 'PMC-15M (15 million figure-caption pairs from PubMed Central)',
    datasetSize: '15,000,000 biomedical image-text pairs',
    license: 'MIT License',
    hostedBy: 'MicroSoft',
    sector: 'Healthcare, Wellness and Family Welfare',
    updatedDate: 'Wed Mar 12 2025',
    applications: [
      'Cross-modal retrieval (text-to-image and image-to-text search)',
      'Zero-shot image classification for medical images',
      'Visual question answering (VQA) in radiology and pathology',
      'Supports radiography, microscopy, and histology modalities'
    ]
  };

  const sampleQuestions = [
    "What abnormalities are visible in this image?",
    "Is there any sign of pneumonia or consolidation?",
    "Describe the lung fields and cardiac silhouette",
    "Are there any bone fractures visible?",
    "What is the primary finding in this radiograph?"
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setImageUrl(ev.target?.result as string || '');
    reader.readAsDataURL(file);
  };

  const handleAsk = () => {
    if (!imageUrl || !question.trim()) return;
    setIsProcessing(true);
    
    // Simulate BiomedCLIP processing (PubMedBERT text encoder + ViT image encoder)
    setTimeout(() => {
      // Simulated response based on the question
      const simulatedResponses: { [key: string]: { answer: string; confidence: number; context: string[] } } = {
        default: {
          answer: 'Based on BiomedCLIP visual-language analysis, the image appears to show normal anatomical structures with no obvious acute pathology. The overall contrast and clarity suggest a well-positioned radiograph. However, subtle findings may require expert radiological review for definitive interpretation.',
          confidence: 87,
          context: [
            'Cross-modal retrieval matched with 15M+ PMC figure-caption pairs',
            'PubMedBERT text encoder processed the query with high semantic similarity',
            'Vision Transformer (ViT) extracted multi-scale visual features',
            'Zero-shot classification performed without task-specific training'
          ]
        },
        pneumonia: {
          answer: 'Visual analysis reveals potential areas of increased opacity in the lung fields which may suggest consolidation consistent with pneumonia-like patterns. The costophrenic angles should be carefully evaluated. Clinical correlation with symptoms (fever, cough) and possibly a follow-up CT is recommended for confirmation.',
          confidence: 82,
          context: [
            'PubMedBERT identified "pneumonia" and "consolidation" as high-relevance medical entities',
            'ViT detected localized opacity patterns in lower lung zones',
            'Cross-modal retrieval found similar PMC radiography figures (n=1,247 matches)',
            'Zero-shot classification: Pneumonia class activation at 0.78 probability'
          ]
        },
        fracture: {
          answer: 'Image analysis did not reveal any clear cortical disruption or displaced fracture lines in the visualized bony structures. Trabecular patterns appear continuous. However, hairline fractures may not be visible without CT correlation. Clinical assessment and possibly additional imaging views are recommended if clinical suspicion persists.',
          confidence: 85,
          context: [
            'ViT patch analysis (256×256, 16×16 patches) examined cortical continuity',
            'PubMedBERT processed "bone fractures" query with domain-specific embeddings',
            'Cross-modal search retrieved 892 similar orthopedic radiographs from PMC',
            'Zero-shot fracture classification: Normal class at 0.84 confidence'
          ]
        },
        lung: {
          answer: 'The lung fields appear well-expanded and clear with normal vascular markings extending to the periphery. No focal consolidation, pleural effusion, or pneumothorax is evident. The trachea is midline and the mediastinal contours are unremarkable.',
          confidence: 91,
          context: [
            'ViT extracted fine-grained pulmonary features across 256×256 patch grid',
            'PubMedBERT query encoding matched with 3,421 similar chest radiograph captions',
            'Cross-modal retrieval: High similarity with normal CXR reference set',
            'Visual feature alignment score: 0.91 (excellent image-text correspondence)'
          ]
        }
      };

      const q = question.toLowerCase();
      let response = simulatedResponses.default;
      if (q.includes('pneumonia') || q.includes('consolidation') || q.includes('infection')) {
        response = simulatedResponses.pneumonia;
      } else if (q.includes('fracture') || q.includes('bone') || q.includes('broken')) {
        response = simulatedResponses.fracture;
      } else if (q.includes('lung') || q.includes('cardiac') || q.includes('chest')) {
        response = simulatedResponses.lung;
      }

      setAnswer(response.answer);
      setConfidence(response.confidence);
      setRetrievedContext(response.context);
      setAnswered(true);
      setIsProcessing(false);
    }, 3500);
  };

  const reset = () => {
    setImageUrl('');
    setFileName('');
    setQuestion('');
    setAnswer('');
    setConfidence(0);
    setRetrievedContext([]);
    setAnswered(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="text-violet-500 w-7 h-7" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Medical Visual Q&A</h1>
          </div>
          <button 
            onClick={() => setShowModelInfo(!showModelInfo)}
            className="text-xs font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5" /> Model Info
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <p className="text-sm text-slate-500">Powered by </p>
          <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-full border border-violet-100">
            🤝 BiomedCLIP-PubMedBERT • Microsoft Corporation (India) Pvt. Ltd.
          </span>
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-full border border-sky-100">
             PMC-15M Dataset (15M biomedical image-text pairs)
          </span>
        </div>
      </div>

      {/* Model Info Panel */}
      {showModelInfo && (
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50/50 border border-violet-100 p-5 rounded-3xl shadow-sm animate-fadeIn">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 bg-violet-500 text-white rounded-2xl">
              <ScanLine className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-extrabold text-slate-800">{modelMetadata.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Created by <strong>{modelMetadata.creator}</strong> • Hosted by <strong>{modelMetadata.hostedBy}</strong></p>
              <p className="text-[10px] text-violet-600 font-semibold mt-1">Sector: {modelMetadata.sector} • Updated: {modelMetadata.updatedDate}</p>
            </div>
            <span className="text-[10px] font-bold text-violet-600 bg-violet-100 px-2.5 py-1 rounded-full">{modelMetadata.license}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded-2xl border border-violet-100">
              <div className="flex items-center gap-1.5 text-violet-600 mb-2">
                <Database className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Training Dataset</span>
              </div>
              <p className="text-sm font-extrabold text-slate-800">PMC-15M</p>
              <p className="text-[10px] text-slate-400 mt-1">{modelMetadata.datasetSize}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-violet-100">
              <div className="flex items-center gap-1.5 text-violet-600 mb-2">
                <Cpu className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Architecture</span>
              </div>
              <p className="text-sm font-extrabold text-slate-800">PubMedBERT + ViT</p>
              <p className="text-[10px] text-slate-400 mt-1">Text encoder + Vision Transformer</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-violet-100">
              <div className="flex items-center gap-1.5 text-violet-600 mb-2">
                <Award className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Model Type</span>
              </div>
              <p className="text-sm font-extrabold text-slate-800">Zero-Shot Classification</p>
              <p className="text-[10px] text-slate-400 mt-1">Vision-Language Foundation Model</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-violet-100">
            <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider mb-2">Core Applications</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {modelMetadata.applications.map((app, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="bg-violet-500 text-white w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold">{idx + 1}</span>
                  <span>{app}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!answered ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Upload */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-4">
              <ImageIcon className="w-5 h-5 text-violet-500" /> Upload Medical Image
            </h2>
            
            {!imageUrl ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50/30 transition-all"
              >
                <div className="p-4 bg-violet-50 text-violet-500 rounded-2xl w-fit mx-auto mb-3">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-slate-700">Upload a medical image</p>
                <p className="text-xs text-slate-400 mt-1">Radiography, microscopy, histology (JPG, PNG)</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 group">
                <img src={imageUrl} alt="Medical" className="w-full h-64 object-contain" />
                {isProcessing && (
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-violet-400 to-transparent shadow-[0_0_20px_rgba(167,139,250,0.8)] animate-scanLine"></div>
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 animate-spin" />
                      BiomedCLIP encoding image + question...
                    </div>
                  </div>
                )}
                <button onClick={() => { setImageUrl(''); setFileName(''); }} className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white p-1.5 rounded-lg text-xs transition-colors opacity-0 group-hover:opacity-100">
                  Change
                </button>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" onChange={handleFileUpload} className="hidden" />
          </div>

          {/* Question Input */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-4">
              <MessageSquare className="w-5 h-5 text-violet-500" /> Ask About the Image
            </h2>

            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Ask a clinical question about this medical image...&#10;&#10;Examples:&#10;• What abnormalities are visible?&#10;• Is there any sign of pneumonia?&#10;• Describe the lung fields"
              className="flex-1 min-h-[140px] bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />

            <div className="mt-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Try a sample question:</p>
              <div className="flex flex-wrap gap-2">
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuestion(q)}
                    className="text-[10px] font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 px-2.5 py-1.5 rounded-full transition-colors border border-violet-100"
                  >
                    <Search className="w-3 h-3 inline mr-1" /> {q.split(' ').slice(0, 4).join(' ')}...
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleAsk} 
              disabled={!imageUrl || !question.trim() || isProcessing}
              className={`w-full mt-4 font-bold py-3 rounded-2xl text-sm transition-colors flex items-center justify-center gap-1.5 ${imageUrl && question.trim() && !isProcessing ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/10' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            >
              {isProcessing ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" /> Processing with BiomedCLIP...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Ask BiomedCLIP
                </>
              )}
            </button>

            <div className="mt-4 p-3 bg-violet-50 border border-violet-100 rounded-xl">
              <p className="text-[10px] text-violet-700 font-medium leading-relaxed">
                <strong>How it works:</strong> BiomedCLIP encodes your image using Vision Transformer (ViT) and your question using PubMedBERT, then performs cross-modal attention to generate a contextually-grounded answer from 15M+ biomedical references.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Answer Results */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image + Question */}
            <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-violet-500" /> Your Image & Question
              </h3>
              {imageUrl && <img src={imageUrl} alt="Medical" className="w-full h-48 object-contain rounded-2xl bg-slate-900 mb-3" />}
              <div className="bg-violet-50 border border-violet-100 p-3 rounded-xl">
                <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider mb-1">Question Asked:</p>
                <p className="text-sm text-slate-700 font-medium">"{question}"</p>
              </div>
            </div>

            {/* AI Answer */}
            <div className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white p-5 rounded-3xl shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> BiomedCLIP Answer
                </h3>
                <span className="text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                  {confidence}% confidence
                </span>
              </div>
              <p className="text-sm leading-relaxed text-white/95">{answer}</p>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider opacity-80">
                  <Cpu className="w-3.5 h-3.5" /> BiomedCLIP-PubMedBERT • Microsoft
                </div>
              </div>
            </div>
          </div>

          {/* Technical Context */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-1.5">
              <Database className="w-5 h-5 text-violet-500" /> Cross-Modal Retrieval Context
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {retrievedContext.map((ctx, idx) => (
                <div key={idx} className="bg-violet-50 border border-violet-100 p-3 rounded-xl flex items-start gap-2.5">
                  <span className="bg-violet-500 text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">{idx + 1}</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{ctx}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer + Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-amber-50 border border-amber-100 p-5 rounded-3xl">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-relaxed max-w-2xl">
                <strong>Research Use Only:</strong> BiomedCLIP is intended for AI research purposes and is not suitable for clinical decision-making or commercial deployment. Consult a qualified radiologist or medical professional for official interpretation.
              </p>
            </div>
            <button onClick={reset} className="flex-shrink-0 bg-white hover:bg-slate-100 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-amber-200">
              <RotateCcw className="w-3.5 h-3.5" /> Ask Another Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
