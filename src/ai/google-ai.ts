import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error('GOOGLE_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Try different model names based on what's available
const MODEL_NAMES = [
  'models/gemini-1.5-flash',
  'models/gemini-1.5-pro',
  'models/gemini-pro',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.5-pro-latest', 
  'gemini-1.5-pro',
  'gemini-pro',
  'gemini-1.5-flash-8b-latest',
  'gemini-2.0-flash-exp'
];

async function getWorkingModel(withSchema: boolean = false) {
  for (const modelName of MODEL_NAMES) {
    try {
      const config: any = { model: modelName };
      if (withSchema) {
        config.generationConfig = {
          responseMimeType: 'application/json'
        };
      }
      const model = genAI.getGenerativeModel(config);
      // Test if model works
      await model.generateContent('test');
      return modelName;
    } catch (error) {
      continue;
    }
  }
  throw new Error('No working Gemini model found. Please check your API key.');
}

export async function generateText(prompt: string, systemInstruction?: string): Promise<string> {
  const modelName = await getWorkingModel();
  const model = genAI.getGenerativeModel({ 
    model: modelName,
    systemInstruction: systemInstruction
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

export async function generateStructuredOutput<T>(
  prompt: string, 
  schema: any,
  systemInstruction?: string
): Promise<T> {
  const modelName = await getWorkingModel(true);
  const model = genAI.getGenerativeModel({ 
    model: modelName,
    systemInstruction: systemInstruction,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: schema
    }
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  return JSON.parse(text) as T;
}
