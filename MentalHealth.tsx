import React, { useState, useEffect, useRef } from 'react';
import { MoodLog, Message } from '../types';
import { simulateMentalChatReply } from '../utils/aiSimulator';
import { 
  Smile, Frown, Sparkles, Send, Heart, Play, Pause, RefreshCw, 
  Plus, MessageSquare, Compass, CheckCircle2 
} from 'lucide-react';

interface MentalHealthProps {
  moodHistory: MoodLog[];
  setMoodHistory: React.Dispatch<React.SetStateAction<MoodLog[]>>;
}

export const MentalHealth: React.FC<MentalHealthProps> = ({ moodHistory, setMoodHistory }) => {
  // Mood states
  const [currentMood, setCurrentMood] = useState<'happy' | 'stressed' | 'anxious' | 'calm' | 'tired' | 'energetic'>('calm');
  const [moodNote, setMoodNote] = useState('');
  
  // Affirmations
  const affirmations = [
    "I am doing the best I can, and that is more than enough.",
    "This feeling is temporary. I am safe, and I will get through this.",
    "I have control over how I respond to my thoughts and emotions.",
    "I choose to be kind and compassionate to myself today.",
    "I am worthy of peace, love, and emotional safety.",
    "My worth is not defined by my productivity.",
    "I am letting go of things I cannot control."
  ];
  const [affirmationIdx, setAffirmationIdx] = useState(0);

  // Chat states
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'mental-welc',
      sender: 'ai',
      text: "Welcome to your Calm Mind sanctuary. I am specialized in anxiety coaching, stress regulation, and somatic mindfulness. How are you holding up today?",
      timestamp: new Date(),
      suggestions: ['Start breathing bubble', 'I feel anxious', 'Daily Affirmations']
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Breathing Bubble States
  const [breathState, setBreathState] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [breathTimer, setBreathTimer] = useState(4);
  const [breathCycleCount, setBreathCycleCount] = useState(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Breathing bubble logic loop
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (breathState !== 'idle') {
      if (breathTimer > 0) {
        timerId = setTimeout(() => {
          setBreathTimer(prev => prev - 1);
        }, 1000);
      } else {
        if (breathState === 'inhale') {
          setBreathState('hold');
          setBreathTimer(4);
        } else if (breathState === 'hold') {
          setBreathState('exhale');
          setBreathTimer(4);
        } else if (breathState === 'exhale') {
          setBreathState('inhale');
          setBreathTimer(4);
          setBreathCycleCount(prev => prev + 1);
        }
      }
    }
    return () => clearTimeout(timerId);
  }, [breathState, breathTimer]);

  const handleMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: MoodLog = {
      id: `mood-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' }),
      mood: currentMood,
      note: moodNote.trim() || 'No notes added'
    };
    setMoodHistory(prev => [newLog, ...prev]);
    setMoodNote('');
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = simulateMentalChatReply(text, currentMood);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply.text,
        timestamp: new Date(),
        suggestions: reply.suggestions
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === 'Start breathing bubble') {
      setBreathState('inhale');
      setBreathTimer(4);
    } else if (suggestion === 'Daily Affirmations') {
      triggerNewAffirmation();
    } else {
      handleSendMessage(suggestion);
    }
  };

  const triggerNewAffirmation = () => {
    setAffirmationIdx(prev => (prev + 1) % affirmations.length);
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'stressed': return '😰';
      case 'anxious': return '🥺';
      case 'calm': return '🧘';
      case 'tired': return '😴';
      case 'energetic': return '⚡';
      default: return '✨';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Welcome Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
          <Heart className="text-indigo-500 w-7 h-7" /> Calm Mind Sanctuary
        </h1>
        <p className="text-sm text-slate-500 mt-1">Nurturing emotional regulation, stress mitigation, and cellular mindfulness.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Mood Tracker and Breathing Exercise Bubble */}
        <div className="space-y-6 lg:col-span-1">
          {/* Mood Logging Panel */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-3">
              <Smile className="w-5 h-5 text-indigo-500" /> Log Daily Mood
            </h2>
            <form onSubmit={handleMoodSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {(['happy', 'stressed', 'anxious', 'calm', 'tired', 'energetic'] as const).map(mood => (
                  <button key={mood} type="button" onClick={() => setCurrentMood(mood)} className={`flex flex-col items-center p-2 rounded-2xl border text-center transition-all ${currentMood === mood ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold scale-[1.03]' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>
                    <span className="text-xl mb-1">{getMoodEmoji(mood)}</span>
                    <span className="text-[10px] capitalize font-medium">{mood}</span>
                  </button>
                ))}
              </div>

              <div>
                <input type="text" placeholder="Add optional mental wellness notes..." value={moodNote} onChange={e => setMoodNote(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1">
                <Plus className="w-4 h-4" /> Save Mood Entry
              </button>
            </form>

            {/* Mood Logs History */}
            {moodHistory.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 max-h-36 overflow-y-auto space-y-2 pr-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mood Log History</span>
                {moodHistory.map(log => (
                  <div key={log.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{getMoodEmoji(log.mood)}</span>
                      <div>
                        <p className="text-xs font-bold text-slate-700 capitalize">{log.mood}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{log.note}</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-400 whitespace-nowrap">{log.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Guided Breathing Bubble */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col items-center text-center">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-2 w-full justify-start">
              <Compass className="w-5 h-5 text-indigo-500" /> Somatic Vagus Nerve Breathing
            </h2>
            <p className="text-xs text-slate-400 mb-6 w-full text-left">Paced box-breathing to rapidly shift active states of stress.</p>

            {/* Breathing Sphere */}
            <div className="relative flex items-center justify-center w-40 h-40 mb-6">
              {/* Outer Pulsing Glow */}
              <div className={`absolute rounded-full bg-indigo-500/10 transition-all duration-1000 ${breathState === 'inhale' ? 'w-36 h-36 scale-125' : breathState === 'hold' ? 'w-36 h-36 scale-110' : breathState === 'exhale' ? 'w-24 h-24' : 'w-28 h-28'}`}></div>
              
              {/* Main Sphere */}
              <div className={`rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-xl ${breathState === 'inhale' ? 'w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 scale-125 text-white' : breathState === 'hold' ? 'w-32 h-32 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white scale-110' : breathState === 'exhale' ? 'w-24 h-24 bg-gradient-to-br from-indigo-400 to-indigo-500 text-white' : 'w-28 h-28 bg-slate-100 text-slate-500 border border-slate-200'}`}>
                <span className="text-sm font-bold capitalize">
                  {breathState === 'idle' ? 'Start' : breathState}
                </span>
                {breathState !== 'idle' && (
                  <span className="text-2xl font-extrabold mt-1">{breathTimer}s</span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3 w-full">
              {breathState === 'idle' ? (
                <button onClick={() => { setBreathState('inhale'); setBreathTimer(4); }} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1">
                  <Play className="w-3.5 h-3.5" /> Start Pacing
                </button>
              ) : (
                <button onClick={() => setBreathState('idle')} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1">
                  <Pause className="w-3.5 h-3.5" /> Pause Exercise
                </button>
              )}
            </div>

            {breathCycleCount > 0 && (
              <span className="text-[10px] text-indigo-600 font-bold mt-3 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Successfully logged {breathCycleCount} cycles!
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Empathetic Chat Companion - Col 2-3 */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col h-[70vh] overflow-hidden">
          {/* Affirmations Carousel header */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50/50 p-4 border-b border-indigo-100/50 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex-1">
              <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Positivity Anchor
              </span>
              <p className="text-xs italic text-indigo-900 font-semibold mt-1">"{affirmations[affirmationIdx]}"</p>
            </div>
            <button onClick={triggerNewAffirmation} className="flex-shrink-0 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Shift Mindset
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`p-2.5 rounded-2xl w-fit h-fit ${msg.sender === 'user' ? 'bg-indigo-50 text-indigo-700' : 'bg-purple-50 text-purple-700'}`}>
                  {msg.sender === 'user' ? <Frown className="w-4 h-4" /> : <Smile className="w-4 h-4" />}
                </div>
                <div className="space-y-1.5">
                  <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none whitespace-pre-line'}`}>
                    {msg.text}
                  </div>
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.suggestions.map((suggestion, idx) => (
                        <button key={idx} onClick={() => handleSuggestionClick(suggestion)} className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-700 text-slate-600 font-semibold text-xs px-3 py-1.5 rounded-full shadow-sm hover:shadow transition-all">
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-700 w-fit h-fit">
                  <Smile className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-3xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat input */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/30">
            <form onSubmit={e => { e.preventDefault(); handleSendMessage(chatInput); }} className="flex gap-2">
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Share what is bothering you or select stress/anxiety tools above..." className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" disabled={isTyping} />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-indigo-600/10 transition-colors flex items-center justify-center" disabled={isTyping || !chatInput.trim()}>
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold justify-center mt-3">
              <MessageSquare className="w-3 h-3" /> Calm Mind AI is ready to listen to whatever is in your heart.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
