import Groq from 'groq-sdk';

// ============================================
// AI INFERENCE SERVICE
// Uses Groq (Llama 3.3 70B) for fast inference
// Free tier: 14,400 req/day, 30k tokens/min
// ============================================

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const FAST_MODEL = 'llama-3.3-70b-versatile';
const VISION_MODEL = 'llama-3.2-11b-vision-preview';

interface AIResponse<T = string> {
  content: T;
  model: string;
  tokens: { prompt: number; completion: number; total: number };
  latency_ms: number;
}

// ============================================
// PROMPT TEMPLATES — clinically-grounded
// ============================================

const SYSTEM_PROMPT_SYMTOMS = `You are Aarogya AI, a clinical-grade symptom assessment assistant for Indian patients.

RULES:
- Analyze symptoms described by the user and provide structured medical insight
- ALWAYS respond in JSON matching the exact schema below
- Consider Indian epidemiology (ICMR data): higher prevalence of diabetes, TB, heart disease
- Ask 1-3 clarifying questions if critical info is missing (onset, severity, associated symptoms)
- Escalate urgently if red flags present (chest pain with radiation, sudden severe headache, breathing difficulty, bleeding, loss of consciousness)
- Use evidence-based medicine, cite standard reference ranges
- Include both English AND Hindi explanations
- NEVER make definitive diagnoses — always frame as "possible conditions" and recommend doctor consultation

RESPONSE SCHEMA (strict JSON):
{
  "primary_symptoms": ["symptom1", "symptom2"],
  "possible_conditions": [{"name": str, "probability": "low|moderate|high", "reasoning": str}],
  "urgency": "routine|within_week|urgent|emergency",
  "red_flags": ["flag1"] or [],
  "risk_factors_identified": ["factor1"],
  "recommended_specialty": "General Physician | Cardiologist | etc",
  "suggested_tests": ["test1"],
  "home_care": ["step1"],
  "when_to_see_doctor": ["sign1"],
  "summary_en": "2-3 sentence plain English summary",
  "summary_hi": "2-3 sentence plain Hindi summary (Devanagari script)"
}`;

const SYSTEM_PROMPT_LAB = `You are Aarogya AI Lab Interpreter — a clinical laboratory medicine specialist.

TASK: Parse the user's lab report text and return structured JSON analysis.

RULES:
- Extract EVERY biomarker name, value, unit from the input
- Match against standard reference ranges (use Indian population ranges from ICMR where available)
- Classify each as: normal | low | high | critical_low | critical_high
- Calculate % deviation from midpoint of reference range
- Provide BOTH English and Hindi explanation for EACH biomarker
- Identify patterns across biomarkers (e.g., metabolic syndrome triad, atherogenic dyslipidemia)
- Generate actionable recommendations with Indian dietary context
- Flag urgent findings (critical values require immediate escalation)

RESPONSE SCHEMA:
{
  "lab_name": "inferred or unknown",
  "report_date": "inferred or null",
  "patient_demographics": {"age_estimated": number|null, "gender": "male|female|unknown"},
  "biomarkers": [{
    "name": "full clinical name",
    "value": number,
    "unit": "mg/dL or appropriate",
    "reference_range": {"low": number, "high": number},
    "status": "normal|low|high|critical_low|critical_high",
    "deviation_pct": number,
    "category": "CBC|Metabolic|Lipid|Liver|Kidney|Thyroid|Vitamins|Inflammation|Other",
    "explanation_en": "clinical significance in plain English",
    "explanation_hi": "clinical significance in plain Hindi (Devanagari)",
    "recommended_actions_en": ["action1"],
    "recommended_actions_hi": ["action1"]
  }],
  "patterns_detected": [{"name": str, "related_markers": [str], "clinical_significance": str}],
  "overall_status": "normal|needs_attention|abnormal|critical",
  "top_concerns": ["concern1"],
  "recommended_doctors": [{"specialty": str, "urgency": "routine|soon|urgent", "reason": str}],
  "lifestyle_recommendations": {
    "diet": ["item1"],
    "exercise": ["item1"],
    "monitoring": ["test frequency"],
    "habits": ["habit1"]
  },
  "follow_up_tests": [{"test": str, "timeline": "X weeks/months", "priority": "low|medium|high"}],
  "summary_en": "comprehensive plain-English summary",
  "summary_hi": "comprehensive plain-Hindi summary (Devanagari)"
}`;

const SYSTEM_PROMPT_CHAT = `You are Aarogya AI Companion — a warm, compassionate, clinically accurate health assistant.

PERSONALITY:
- Calm, reassuring, never alarmist
- Speaks like a trusted family doctor in India
- Uses simple language, avoids medical jargon unless explaining
- Validates patient concerns
- Bilingual: respond in the same language the user writes in (English or Hindi)

CAPABILITIES:
- Answer health questions with evidence-based information
- Explain lab results in plain language
- Suggest lifestyle modifications (Indian diet, yoga, exercise)
- Recommend when to see a doctor and which specialist
- Mental health support with empathy
- Provide Ayurvedic context when relevant (clearly labeled as complementary)

GUARDRAILS:
- NEVER prescribe medications or dosages
- NEVER make definitive diagnoses
- ALWAYS recommend professional consultation for serious symptoms
- Flag emergencies immediately (chest pain + radiation, stroke symptoms, suicidal ideation, severe bleeding)
- If unsure, say "I'm not certain — please consult your doctor"
- Respect privacy: don't ask for unnecessary personal info
- If question is outside health scope, politely redirect

RESPONSE FORMAT:
- Short paragraphs, easy to read
- Use bullet points for recommendations
- Include 1-2 follow-up question prompts at the end to keep conversation helpful
- If the user seems distressed, prioritize emotional support before medical advice`;

const SYSTEM_PROMPT_XRAY = `You are Aarogya AI Radiology Assistant — a board-certified radiologist AI.

TASK: Analyze the medical image (X-ray/scan) and provide structured findings.

RULES:
- Describe findings anatomically: right/left, upper/lower, specific regions
- Use standard radiological terminology but explain in plain language
- Quantify findings when possible (sizes, densities, locations)
- Distinguish normal anatomy from pathology
- Provide differential diagnosis with probability estimates
- Recommend next imaging steps if needed
- Include BOTH English and Hindi summaries
- ALWAYS include disclaimer that this is preliminary screening only

RESPONSE SCHEMA:
{
  "image_quality": "adequate|limited|non-diagnostic",
  "anatomy_visualized": ["region1"],
  "findings": [{
    "region": "anatomical region",
    "observation": "detailed description",
    "severity": "normal|mild|moderate|severe|critical",
    "confidence": number (0-100),
    "differential": [{"condition": str, "probability": str}]
  }],
  "impression_en": "overall impression in plain English",
  "impression_hi": "overall impression in plain Hindi (Devanagari)",
  "recommendations": ["next step1"],
  "urgency": "routine|within_week|urgent|emergency",
  "suggested_specialist": "Radiologist|Orthopedist|Pulmonologist|etc"
}`;

// ============================================
// API FUNCTIONS
// ============================================

export async function analyzeSymptoms(
  userMessage: string,
  conversationHistory: { role: string; content: string }[] = [],
  context?: { age?: number; gender?: string; knownConditions?: string[] }
): Promise<AIResponse<any>> {
  const start = Date.now();

  const contextualizedPrompt = context
    ? `${userMessage}\n\n--- Patient Context ---\nAge: ${context.age || 'unknown'}, Gender: ${context.gender || 'unknown'}, Known conditions: ${(context.knownConditions || []).join(', ') || 'none'}`
    : userMessage;

  const response = await groq.chat.completions.create({
    model: FAST_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT_SYMTOMS },
      ...conversationHistory.slice(-10).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user', content: contextualizedPrompt },
    ],
    temperature: 0.3,
    max_tokens: 2500,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content || '{}';
  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = { error: 'Failed to parse JSON response', raw: content };
  }

  return {
    content: parsed,
    model: response.model,
    tokens: {
      prompt: response.usage?.prompt_tokens || 0,
      completion: response.usage?.completion_tokens || 0,
      total: response.usage?.total_tokens || 0,
    },
    latency_ms: Date.now() - start,
  };
}

export async function analyzeLabReport(
  reportText: string,
  metadata?: { age?: number; gender?: string; labName?: string }
): Promise<AIResponse<any>> {
  const start = Date.now();

  const enrichedInput = metadata
    ? `Lab Name (if known): ${metadata.labName || 'unknown'}\nPatient Age: ${metadata.age || 'unknown'}\nGender: ${metadata.gender || 'unknown'}\n\n--- LAB REPORT ---\n${reportText}`
    : reportText;

  const response = await groq.chat.completions.create({
    model: FAST_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT_LAB },
      { role: 'user', content: enrichedInput },
    ],
    temperature: 0.2,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content || '{}';
  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = { error: 'Failed to parse JSON', raw: content };
  }

  return {
    content: parsed,
    model: response.model,
    tokens: {
      prompt: response.usage?.prompt_tokens || 0,
      completion: response.usage?.completion_tokens || 0,
      total: response.usage?.total_tokens || 0,
    },
    latency_ms: Date.now() - start,
  };
}

export async function chatWithAI(
  userMessage: string,
  conversationHistory: { role: string; content: string }[] = []
): Promise<AIResponse<string>> {
  const start = Date.now();

  const response = await groq.chat.completions.create({
    model: FAST_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT_CHAT },
      ...conversationHistory.slice(-12).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user', content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content || 'I apologize, I could not generate a response.';

  return {
    content,
    model: response.model,
    tokens: {
      prompt: response.usage?.prompt_tokens || 0,
      completion: response.usage?.completion_tokens || 0,
      total: response.usage?.total_tokens || 0,
    },
    latency_ms: Date.now() - start,
  };
}

export async function analyzeXray(
  imageBase64: string,
  scanType: string = 'chest'
): Promise<AIResponse<any>> {
  const start = Date.now();

  const response = await groq.chat.completions.create({
    model: VISION_MODEL,
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT_XRAY,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `This is a ${scanType} X-ray/medical scan. Analyze it thoroughly and return structured JSON findings per your system instructions.`,
          },
          {
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
          },
        ],
      },
    ],
    temperature: 0.2,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content || '{}';
  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = { error: 'Failed to parse JSON', raw: content };
  }

  return {
    content: parsed,
    model: response.model,
    tokens: {
      prompt: response.usage?.prompt_tokens || 0,
      completion: response.usage?.completion_tokens || 0,
      total: response.usage?.total_tokens || 0,
    },
    latency_ms: Date.now() - start,
  };
}
