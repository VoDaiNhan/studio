import OpenAI from 'openai';
import * as googleAI from './google-ai';

const openaiKey = process.env.OPENAI_API_KEY;
const googleKey = process.env.GOOGLE_API_KEY;

let openai: OpenAI | null = null;

if (openaiKey) {
  openai = new OpenAI({
    apiKey: openaiKey,
  });
}

export async function generateText(prompt: string, systemInstruction?: string): Promise<string> {
  // Try Google AI first
  if (googleKey) {
    try {
      return await googleAI.generateText(prompt, systemInstruction);
    } catch (error) {
      console.error('Google AI error, falling back to OpenAI:', error);
    }
  }

  // Fallback to OpenAI
  if (openai) {
    try {
      const messages: any[] = [];
      
      if (systemInstruction) {
        messages.push({
          role: 'system',
          content: systemInstruction
        });
      }
      
      messages.push({
        role: 'user',
        content: prompt
      });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('OpenAI error:', error);
      throw error;
    }
  }

  throw new Error('No API key available for OpenAI or Google AI');
}

export async function generateStructuredOutput<T>(
  prompt: string,
  schema: any,
  systemInstruction?: string
): Promise<T> {
  // Try Google AI first
  if (googleKey) {
    try {
      return await googleAI.generateStructuredOutput<T>(prompt, schema, systemInstruction);
    } catch (error) {
      console.error('Google AI error, falling back to OpenAI:', error);
    }
  }

  // Fallback to OpenAI
  if (openai) {
    try {
      const messages: any[] = [];
      
      const systemContent = systemInstruction 
        ? `${systemInstruction}\n\nYou must respond with valid JSON only. Format: ${JSON.stringify(schema)}`
        : `You must respond with valid JSON only. Format: ${JSON.stringify(schema)}`;
      
      messages.push({
        role: 'system',
        content: systemContent
      });
      
      messages.push({
        role: 'user',
        content: prompt
      });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        response_format: { type: 'json_object' }
      });

      const text = completion.choices[0].message.content || '{}';
      return JSON.parse(text) as T;
    } catch (error) {
      console.error('OpenAI error:', error);
      throw error;
    }
  }

  throw new Error('No API key available for OpenAI or Google AI');
}
