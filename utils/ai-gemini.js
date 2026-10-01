
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Call Gemini API for dream interpretation
export async function getDreamInterpretation(dreamText) {

  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Server misconfigured: GEMINI_API_KEY is missing');
  }

  const candidateModels = [
    process.env.GEMINI_MODEL,
    'gemini-3.5-flash',
    'gemini-3.8-flash',
    'gemini-2.5-flash'
  ].filter(Boolean);

  const models = [...new Set(candidateModels)];
  let lastError = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: `Dream: ${dreamText}`,
        config: {
          systemInstruction:
            'You are a thoughtful dream interpreter. Be insightful but gentle, and consider common dream symbolism. Keep your interpretation to 2-3 paragraphs.'
        }
      });

      return response.text.trim();
    } catch (error) {
      console.warn(`Gemini model ${model} failed, trying fallback:`, error.message);
      lastError = error;
    }
  }

  console.error('All Gemini model candidates failed:', lastError);
  throw new Error(`API error: ${lastError?.message || 'Failed to generate interpretation'}`);
}

