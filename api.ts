// ============================================
// AAROGYA AI — DIRECT API CLIENT
// Calls Supabase REST API and Google Gemini API directly.
// Works immediately in browser without backend server.
// ============================================

import { CONFIG } from '../config';

const SUPABASE_URL = CONFIG.SUPABASE_URL;
const SUPABASE_KEY = CONFIG.SUPABASE_KEY;
const GEMINI_API_KEY = CONFIG.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// ============================================
// PROMPT TEMPLATES (Frontend version)
// ============================================

const PROMPTS = {
  SYMPTOM: `You are Aarogya AI, a clinical symptom assessment assistant for Indian patients. Analyze symptoms and provide structured JSON medical insight. Consider Indian epidemiology. NEVER diagnose definitively. Include both English and Hindi explanations.
RESPONSE JSON SCHEMA: {"primary_symptoms":["str"],"possible_conditions":[{"name":"str","probability":"low|moderate|high","reasoning":"str"}],"urgency":"routine|within_week|urgent|emergency","red_flags":["str"],"recommended_specialty":"str","suggested_tests":["str"],"home_care":["str"],"when_to_see_doctor":["str"],"summary_en":"str","summary_hi":"str"}`,
  LAB: `You are Aarogya AI Lab Interpreter. Parse the lab report text and return structured JSON. Match against Indian reference ranges. Provide English and Hindi explanations.
RESPONSE JSON SCHEMA: {"biomarkers":[{"name":"str","value":number,"unit":"str","reference_range":{"low":number,"high":number},"status":"normal|low|high|critical","category":"str","explanation_en":"str","explanation_hi":"str","recommended_actions_en":["str"],"recommended_actions_hi":["str"]}],"patterns_detected":[{"name":"str","related_markers":["str"],"clinical_significance":"str"}],"overall_status":"normal|needs_attention|abnormal|critical","top_concerns":["str"],"recommended_doctors":[{"specialty":"str","urgency":"routine|soon|urgent","reason":"str"}],"lifestyle_recommendations":{"diet":["str"],"exercise":["str"],"monitoring":["str"]},"summary_en":"str","summary_hi":"str"}`,
  CHAT: `You are Aarogya AI Companion — a warm, compassionate, clinically accurate health assistant for Indian patients. Speak like a trusted family doctor. Simple language, bilingual if needed. NEVER prescribe medications. ALWAYS recommend professional consultation for serious symptoms. Respond in plain text, not JSON.`
};

class AarogyaAPI {
  // ============================================
  // SUPABASE REST API HELPER
  // ============================================
  private async supabaseFetch<T>(table: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE', body?: any, query?: Record<string, string>): Promise<T> {
    const params = new URLSearchParams(query || {}).toString();
    const url = `${SUPABASE_URL}/rest/v1/${table}${params ? '?' + params : ''}`;
    
    const res = await fetch(url, {
      method,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': method === 'POST' ? 'return=representation' : 'return=representation',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Supabase ${method} ${table}: ${res.status} ${err}`);
    }
    if (method === 'DELETE') return {} as T;
    const data = await res.json();
    return Array.isArray(data) && data.length === 1 && !Array.isArray(body) ? data[0] : data;
  }

  // ============================================
  // GEMINI AI HELPER
  // ============================================
  private async geminiFetch(systemPrompt: string, userMessage: string, history: { role: string; content: string }[] = [], jsonMode: boolean = true): Promise<any> {
    const contents = history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }));
    contents.push({ role: 'user', parts: [{ text: userMessage }] });

    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: jsonMode ? 0.2 : 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
          ...(jsonMode ? { responseMimeType: "application/json" } : {}),
        },
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error(data.error?.message || 'Gemini API request failed');
    }

    let text = data.candidates[0].content.parts[0].text;
    // Clean markdown code blocks if present
    text = text.replace(/```json\n?|\n?```/g, '').trim();

    if (jsonMode) {
      try {
        return JSON.parse(text);
      } catch {
        return { raw_response: text, parse_error: true };
      }
    }
    return text;
  }

  // ============================================
  // AI ENDPOINTS
  // ============================================
  async analyzeSymptoms(message: string, conversationHistory: any[] = [], context?: any) {
    const enrichedMsg = context 
      ? `${message}\n\nContext: Age=${context.age||'?'}, Gender=${context.gender||'?'}, Conditions=${(context.knownConditions||[]).join(',')||'none'}`
      : message;
    const data = await this.geminiFetch(PROMPTS.SYMPTOM, enrichedMsg, conversationHistory, true);
    return { success: true, data, meta: { model: 'gemini-2.0-flash', latency_ms: 0 } };
  }

  async analyzeLabReport(text: string, metadata?: any) {
    const enrichedMsg = metadata 
      ? `Lab: ${metadata.labName||'?'} | Age: ${metadata.age||'?'} | Gender: ${metadata.gender||'?'}\n\n${text}`
      : text;
    const data = await this.geminiFetch(PROMPTS.LAB, enrichedMsg, [], true);
    return { success: true, data, meta: { model: 'gemini-2.0-flash', latency_ms: 0 } };
  }

  async chat(message: string, conversationHistory: any[] = []) {
    const reply = await this.geminiFetch(PROMPTS.CHAT, message, conversationHistory, false);
    return { success: true, data: { reply }, meta: { model: 'gemini-2.0-flash', latency_ms: 0 } };
  }

  async analyzeXray(_imageBase64: string, scanType: string = 'chest') {
    // Note: Gemini vision via REST requires multipart or specific formatting. 
    // For simplicity in this direct client, we return a mock structure or text-only analysis.
    // A full implementation would use the Gemini multimodal endpoint.
    return { 
      success: true, 
      data: { 
        findings: [{ region: scanType, observation: "AI vision analysis requires backend proxy for base64 images in this preview mode.", severity: "normal", confidence: 0 }],
        impression_en: "Image received. Full vision analysis requires server-side processing.",
        impression_hi: "छवि प्राप्त हुई। पूर्ण दृष्टि विश्लेषण के लिए सर्वर-साइड प्रसंस्करण की आवश्यकता है।",
        recommendations: ["Consult a radiologist for detailed analysis."],
        urgency: "routine"
      },
      meta: { model: 'gemini-2.0-flash-vision', latency_ms: 0 }
    };
  }

  // ============================================
  // HEALTH DATA ENDPOINTS (Supabase)
  // ============================================
  async getMetrics(days: number = 30) {
    // In a real app with auth, we'd filter by user_id. For preview, we fetch recent.
    const cutoff = new Date(Date.now() - days * 86400000).toISOString();
    const data = await this.supabaseFetch<any[]>('health_metrics', 'GET', undefined, { 
      select: '*', 
      order: 'recorded_at.desc', 
      limit: '200',
      recorded_at: `gte.${cutoff}` 
    });
    return { success: true, data, count: data?.length || 0 };
  }

  async saveMetric(data: Record<string, any>) {
    const result = await this.supabaseFetch<any>('health_metrics', 'POST', {
      ...data,
      recorded_at: data.recorded_at || new Date().toISOString(),
      source: 'api',
    });
    return { success: true, data: result };
  }

  async getAppointments() {
    const data = await this.supabaseFetch<any[]>('appointments', 'GET', undefined, { 
      select: '*', 
      order: 'appointment_date.desc', 
      limit: '100' 
    });
    return { success: true, data };
  }

  async bookAppointment(data: Record<string, any>) {
    const result = await this.supabaseFetch<any>('appointments', 'POST', {
      ...data,
      status: 'scheduled',
      payment_status: 'pending',
    });
    return { success: true, data: result };
  }

  async updateAppointment(id: string, data: Record<string, any>) {
    const result = await this.supabaseFetch<any>('appointments', 'PATCH', {
      ...data,
      updated_at: new Date().toISOString(),
    }, { id: `eq.${id}` });
    return { success: true, data: result };
  }

  // ============================================
  // AUTH / PROFILE ENDPOINTS
  // ============================================
  async getProfile() {
    // For preview without real auth, return mock profile or fetch if possible
    try {
      const data = await this.supabaseFetch<any>('profiles', 'GET', undefined, { limit: '1' });
      return { success: true, data: { user: { id: 'preview-user', email: 'guest@aarogya.ai' }, profile: Array.isArray(data) ? data[0] : data, health_score: 72 } };
    } catch {
      return { success: true, data: { user: { id: 'preview-user', email: 'guest@aarogya.ai' }, profile: null, health_score: 72 } };
    }
  }

  async updateProfile(data: Record<string, any>) {
    // Without a real user ID from auth, we can't easily update. 
    // In preview mode, this might fail silently or succeed if RLS allows anon writes.
    try {
      const result = await this.supabaseFetch<any>('profiles', 'POST', { ...data, id: 'preview-user' }); // Upsert attempt
      return { success: true, data: result };
    } catch (e) {
      return { success: false, error: (e as Error).message };
    }
  }
}

export const api = new AarogyaAPI();
export class APIError extends Error {
  constructor(message: string, public status: number = 500) { super(message); this.name = 'APIError'; }
}
