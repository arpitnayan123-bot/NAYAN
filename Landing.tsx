import React from 'react';
import {
  HeartPulse, Sparkles, ArrowRight, ShieldCheck, Star, Brain,
  ScanLine, Stethoscope, Leaf, Activity, Globe, Zap, Play,
  CheckCircle2, TrendingUp, Users, Clock
} from 'lucide-react';
import { Counter, MeshBackground } from './ui/Primitives';

interface LandingProps {
  onEnter: () => void;
  onOpenSection: (id: string) => void;
}

export const Landing: React.FC<LandingProps> = ({ onEnter, onOpenSection }) => {
  const features = [
    { id: 'disease_predictor', icon: TrendingUp, title: 'Multi-Disease Risk Predictor', desc: 'ML-powered risk scoring for heart, diabetes, liver, kidney & breast cancer — trained on 4,000+ patient records.', gradient: 'from-indigo-500 to-purple-600', glow: 'indigo' },
    { id: 'symptom_checker', icon: Stethoscope, title: 'AI Symptom Triage', desc: '300+ symptoms · 11 Indian languages. Instant insights, home remedies & doctor guidance.', gradient: 'from-rose-500 to-pink-600', glow: 'rose' },
    { id: 'xray_reader', icon: ScanLine, title: 'X-Ray AI Reader', desc: 'Upload radiographs for AI-assisted preliminary screening powered by BiomedVLP-CXR-BERT.', gradient: 'from-sky-500 to-blue-600', glow: 'sky' },
    { id: 'food_scanner', icon: Activity, title: 'Food & Nutrition Scanner', desc: 'Scan or search any food to reveal full nutrition facts blended with Ayurvedic wisdom.', gradient: 'from-orange-500 to-amber-600', glow: 'orange' },
    { id: 'ai_chat', icon: Brain, title: 'August AI Companion', desc: 'A compassionate conversational health coach available 24/7 for guidance & triage.', gradient: 'from-emerald-500 to-teal-600', glow: 'emerald' },
    { id: 'ayurveda', icon: Leaf, title: 'Ayurveda Intelligence', desc: 'Dosha analysis, herbal remedies & traditional wisdom via BhashaBench-Ayur benchmark.', gradient: 'from-green-500 to-emerald-600', glow: 'green' },
    { id: 'regional_doctors', icon: Globe, title: 'Regional Doctor Network', desc: 'Find verified doctors near you with transparent PHC healthcare access data.', gradient: 'from-violet-500 to-indigo-600', glow: 'violet' },
  ];

  const stats = [
    { value: 11, suffix: '+', label: 'Indian Languages', icon: Globe },
    { value: 15, suffix: '+', label: 'AI Health Tools', icon: Zap },
    { value: 14963, suffix: '', label: 'Ayurvedic Records', icon: Leaf },
    { value: 99, suffix: '%', label: 'Uptime SLA', icon: TrendingUp },
  ];

  const partners = ['Microsoft', 'IndiaAI', 'BharatGen', 'AI4Bharat', 'BHASHINI', 'MoHFW', 'PMC-15M'];

  return (
    <div className="relative min-h-screen aurora-bg overflow-hidden">
      <MeshBackground />

      {/* Nav */}
      <nav className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg shadow-emerald-500/30">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div className="absolute -inset-1 bg-emerald-400 rounded-2xl blur-lg opacity-30 animate-pulseGlow -z-10" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Aarogya<span className="gradient-text-emerald"> AI</span></h1>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Healthcare Intelligence</p>
          </div>
        </div>
        <button onClick={onEnter} className="group relative px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-sm font-bold overflow-hidden transition-transform hover:scale-105">
          <span className="relative z-10 flex items-center gap-2">Launch App <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-10 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-200/50 mb-6">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-slate-700">India's Sovereign Healthcare AI · Live in 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
            Your entire health,
            <br />
            <span className="gradient-text">intelligently cared for.</span>
          </h1>

          <p className="text-lg text-slate-600 mt-6 max-w-xl leading-relaxed">
            From AI symptom triage and X-ray analysis to Ayurvedic wisdom, nutrition scanning, and senior care — one platform, eleven languages, infinite peace of mind.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button onClick={onEnter} className="group relative px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-base font-bold shadow-xl shadow-emerald-500/30 overflow-hidden transition-transform hover:scale-105">
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Start Free Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button onClick={() => onOpenSection('ai_chat')} className="px-6 py-4 rounded-2xl glass border border-slate-200 text-slate-700 text-base font-bold flex items-center gap-2 transition-transform hover:scale-105">
              <Play className="w-4 h-4 text-emerald-600" /> Talk to AI
            </button>
          </div>

          <div className="flex items-center gap-6 mt-10">
            <div className="flex -space-x-3">
              {['😊', '🧑‍⚕️', '👵', '👨', '🧕'].map((e, i) => (
                <div key={i} className="w-10 h-10 rounded-full glass border-2 border-white flex items-center justify-center text-lg shadow-md">{e}</div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                <span className="text-sm font-bold text-slate-700 ml-1">4.9/5</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Trusted by health-conscious users</p>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative animate-fadeInScale">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl glow-ring">
            <img src="/images/hero-health.jpg" alt="Aarogya AI" className="w-full h-[420px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />

            {/* Floating cards */}
            <div className="absolute top-6 left-6 glass rounded-2xl px-4 py-3 shadow-xl animate-float">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500 text-white rounded-xl"><HeartPulse className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Health Score</p>
                  <p className="text-lg font-black text-slate-900">94<span className="text-xs text-emerald-600">/100</span></p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 right-6 glass rounded-2xl px-4 py-3 shadow-xl animate-float" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-sky-500 text-white rounded-xl"><Brain className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">AI Analysis</p>
                  <p className="text-sm font-black text-slate-900">All clear ✓</p>
                </div>
              </div>
            </div>
          </div>

          {/* glow */}
          <div className="absolute -inset-8 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 blur-3xl -z-10 rounded-full" />
        </div>
      </section>

      {/* Trust marquee */}
      <section className="relative z-10 py-6 border-y border-white/40 glass overflow-hidden">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4">Powered by India's leading AI institutions</p>
        <div className="flex overflow-hidden">
          <div className="flex items-center gap-12 animate-[marquee_25s_linear_infinite] whitespace-nowrap pr-12">
            {[...partners, ...partners].map((p, i) => (
              <span key={i} className="text-lg font-extrabold text-slate-400/80 tracking-tight">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <div key={i} className={`glass premium-card rounded-3xl p-6 text-center stagger-${i + 1} animate-fadeInUp`}>
              <div className="inline-flex p-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl mb-3 shadow-lg shadow-emerald-500/20">
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <p className="text-xs font-bold text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-emerald-600 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> One platform, every need
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Healthcare superpowers, <span className="gradient-text">unlocked</span></h2>
          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">Fifteen AI-driven tools working in harmony — diagnostics, nutrition, mental wellness, traditional medicine, and care for every generation.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <button
              key={f.id}
              onClick={() => onOpenSection(f.id)}
              className={`group relative glass premium-card rounded-3xl p-6 text-left overflow-hidden stagger-${(i % 6) + 1} animate-fadeInUp`}
            >
              <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${f.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-25 transition-opacity`} />
              <div className={`relative inline-flex p-3.5 bg-gradient-to-br ${f.gradient} text-white rounded-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{f.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 mt-4 group-hover:gap-2 transition-all">
                Explore <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Value props */}
      <section className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <div className="glass rounded-[2.5rem] p-8 sm:p-12 grid md:grid-cols-3 gap-8 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-300 opacity-20 rounded-full blur-3xl" />
          {[
            { icon: ShieldCheck, title: 'Privacy First', desc: 'Your data stays on your device. HIPAA-aligned, encrypted, and never sold.' },
            { icon: Clock, title: '24/7 Available', desc: 'Round-the-clock AI health guidance — no appointments, no waiting rooms.' },
            { icon: Users, title: 'Built for Bharat', desc: 'Designed for every Indian — 11 languages, rural access data, traditional medicine.' },
          ].map((v, i) => (
            <div key={i} className="relative">
              <div className="inline-flex p-3 bg-white rounded-2xl shadow-md mb-4"><v.icon className="w-6 h-6 text-emerald-600" /></div>
              <h3 className="text-lg font-extrabold text-slate-900">{v.title}</h3>
              <p className="text-sm text-slate-500 mt-2">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 py-16">
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-10 sm:p-16 text-center overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-300 opacity-20 rounded-full blur-3xl -ml-24 -mb-24" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Ready to take control of your health?</h2>
            <p className="text-emerald-50 mt-4 text-lg max-w-xl mx-auto">Join thousands using Aarogya AI for smarter, faster, more compassionate healthcare.</p>
            <button onClick={onEnter} className="group mt-8 px-8 py-4 rounded-2xl bg-white text-emerald-700 text-base font-extrabold shadow-xl inline-flex items-center gap-2 transition-transform hover:scale-105">
              Enter Aarogya AI <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center justify-center gap-6 mt-8 text-emerald-50 text-sm font-semibold flex-wrap">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Free forever</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> No signup required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Instant access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-10 border-t border-white/40 text-center">
        <p className="text-sm font-bold text-slate-700">Aarogya AI — Healthcare Intelligence for Bharat</p>
        <p className="text-xs text-slate-400 mt-2 max-w-2xl mx-auto">A wellness companion, not a substitute for professional medical care. Powered by Microsoft, IndiaAI, BharatGen, AI4Bharat & MoHFW datasets.</p>
        <p className="text-[10px] text-slate-400 mt-3">© 2026 Aarogya AI. Built with care for India.</p>
      </footer>
    </div>
  );
};
