import React, { useState, useRef, useEffect } from 'react';
import { UserMetrics, Message, ChatSession } from '../types';
import { simulateHealthChatReply } from '../utils/aiSimulator';
import { 
  Send, Plus, MessageSquare, ShieldAlert, Bot, User, 
  HelpCircle, Trash2, ArrowRight, Globe 
} from 'lucide-react';

interface AIChatProps {
  metrics: UserMetrics;
  setTab: (tab: string) => void;
}

export const AIChat: React.FC<AIChatProps> = ({ metrics, setTab }) => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('aarogya_chat_sessions');
    if (saved) {
      try {
        return JSON.parse(saved).map((s: any) => ({
          ...s,
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
        }));
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: 'session-default',
        title: 'Initial Symptoms Assessment',
        category: 'general',
        updatedAt: new Date(),
        messages: [
          {
            id: 'welcome-msg',
            sender: 'ai',
            text: 'Hello! I am Aarogya AI, your conversational health assistant. I can help analyze your symptoms, give sleep/nutrition tips, or coordinate with doctors. What health questions do you have today?',
            timestamp: new Date(),
            suggestions: ['Analyze my headache', 'What is a healthy BMI?', 'Go to AI Diet Planner']
          }
        ]
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>('session-default');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('aarogya_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId, isTyping]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    // Update active session with user message
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: [...s.messages, userMsg],
          updatedAt: new Date(),
          title: s.messages.length === 1 && s.messages[0].id === 'welcome-msg' ? textToSend.substring(0, 30) + '...' : s.title
        };
      }
      return s;
    }));

    setInputText('');
    setIsTyping(true);

    // Simulate smart AI response delay
    setTimeout(() => {
      const responseData = simulateHealthChatReply(textToSend, metrics);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseData.text,
        timestamp: new Date(),
        suggestions: responseData.suggestions
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, aiMsg],
            updatedAt: new Date()
          };
        }
        return s;
      }));
      setIsTyping(false);
    }, 1200);
  };

  const createNewSession = () => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Aarogya Consultation',
      category: 'general',
      updatedAt: new Date(),
      messages: [
        {
          id: `welcome-${Date.now()}`,
          sender: 'ai',
          text: 'Hello! I am your clinical conversational assistant. Ask me anything about your symptoms, physical performance, or dietary habits.',
          timestamp: new Date(),
          suggestions: ['Should I take pain relievers?', 'How to naturally boost immunity?', 'Book General Physician']
        }
      ]
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length === 1) return; // Keep at least one
    const remaining = sessions.filter(s => s.id !== id);
    setSessions(remaining);
    if (activeSessionId === id) {
      setActiveSessionId(remaining[0].id);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === 'Go to AI Diet Planner') {
      setTab('diet_plan');
    } else if (suggestion.includes('Book') || suggestion.includes('Schedule')) {
      setTab('appointments');
    } else if (suggestion.includes('Symptom Checker')) {
      setTab('symptom_checker');
    } else {
      handleSendMessage(suggestion);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[76vh] animate-fadeIn">
      {/* Sessions Sidebar - Col 1 */}
      <div className="hidden md:flex flex-col bg-white border border-slate-100 rounded-3xl p-4 shadow-sm h-full">
        <button onClick={createNewSession} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 px-4 rounded-2xl text-sm transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 mb-4">
          <Plus className="w-4 h-4" /> New Consultation
        </button>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">Previous Consultations</span>
          {sessions.map(s => (
            <div key={s.id} onClick={() => setActiveSessionId(s.id)} className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${s.id === activeSessionId ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'hover:bg-slate-50 text-slate-600'}`}>
              <div className="flex items-center gap-2 min-w-0">
                <MessageSquare className={`w-4 h-4 flex-shrink-0 ${s.id === activeSessionId ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="text-sm truncate pr-2">{s.title}</span>
              </div>
              {sessions.length > 1 && (
                <button onClick={(e) => deleteSession(s.id, e)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Interface - Col 2-4 */}
      <div className="md:col-span-3 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col h-full overflow-hidden">
        {/* Chat Header */}
        <div className="relative p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl -mr-12 -mt-12" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="relative">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm text-white rounded-2xl border border-white/20">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-300 border-2 border-emerald-600 rounded-full animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
                August AI <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white uppercase tracking-wide">Triage</span>
              </h2>
              <p className="text-xs text-emerald-50/90">Clinical-grade symptom analysis · 24/7 companion</p>
              <p className="text-[10px] text-emerald-100/80 font-semibold mt-0.5 flex items-center gap-1">
                <Globe className="w-3 h-3" /> Bhashini-IndicNER · 11 Indian languages
              </p>
            </div>
          </div>
          <div className="relative z-10 hidden sm:flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/20">
            <ShieldAlert className="w-3.5 h-3.5" /> Not for emergencies
          </div>
        </div>

        {/* Chat Bubbles */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeSession.messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`p-2.5 rounded-2xl w-fit h-fit ${msg.sender === 'user' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className="space-y-2">
                <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none whitespace-pre-line'}`}>
                  {msg.text}
                </div>
                {/* Suggestions / Prompt Chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.suggestions.map((suggestion, idx) => (
                      <button key={idx} onClick={() => handleSuggestionClick(suggestion)} className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 text-slate-600 font-semibold text-xs px-3 py-1.5 rounded-full shadow-sm hover:shadow transition-all">
                        {suggestion} <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 w-fit h-fit">
                <Bot className="w-4 h-4 animate-bounce" />
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

        {/* Chat Input */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }} className="flex gap-3">
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Describe symptoms in English, Hindi, Tamil or any Indian language..." className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" disabled={isTyping} />
            <button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-emerald-600/20 transition-transform hover:scale-105 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:hover:scale-100" disabled={isTyping || !inputText.trim()}>
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold justify-center mt-3">
            <HelpCircle className="w-3 h-3" /> Tip: Try sending "I have a headache" or "What is my healthy BMI?" to see Aarogya AI integrate with your dashboard!
          </div>
        </div>
      </div>
    </div>
  );
};
