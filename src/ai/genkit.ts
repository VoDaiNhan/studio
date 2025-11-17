import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-pro',
  // OPTIMIZATION: Configure for faster responses
  promptConfig: {
    temperature: 0.3, // Lower temperature for more consistent, faster responses
    maxOutputTokens: 1000, // Limit output length for faster generation
    topK: 20,
    topP: 0.8,
  },
});
