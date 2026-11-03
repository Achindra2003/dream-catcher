import OpenAI from 'openai';

// Groq exposes an OpenAI-compatible API, so the openai SDK is reused with a custom baseURL.
let client = null;
function getClient() {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1'
    });
  }
  return client;
}

const SYSTEM_PROMPT =
  'You are a thoughtful dream interpreter. Be insightful but gentle, and consider common dream symbolism. Keep your interpretation to 2-3 paragraphs.';

// Call Groq API for dream interpretation (tries each candidate model in order)
export async function getDreamInterpretation(dreamText) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('Server misconfigured: GROQ_API_KEY is missing');
  }

  const models = [...new Set([
    process.env.GROQ_MODEL,
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant'
  ].filter(Boolean))];

  let lastError = null;
  for (const model of models) {
    try {
      const completion = await getClient().chat.completions.create({
        model,
        max_tokens: 512,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Dream: ${dreamText}` }
        ]
      });
      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.warn(`Groq model ${model} failed, trying fallback:`, error.message);
      lastError = error;
    }
  }

  console.error('All Groq model candidates failed:', lastError);
  throw new Error(`API error: ${lastError?.message || 'Failed to generate interpretation'}`);
}
